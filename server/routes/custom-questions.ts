// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

// Helper to get user ID from bearer token
async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerCustomQuestionsRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Get custom questions for a hackathon (public - for registration form)
  app.get("/api/hackathons/:hackathonId/custom-questions", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_custom_questions')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching custom questions:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch questions' });
      }

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Error in get custom questions:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get custom questions for organizer (authenticated)
  app.get("/api/organizer/hackathons/:hackathonId/custom-questions", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id')
        .eq('id', hackathonId)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_custom_questions')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching custom questions:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch questions' });
      }

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Error in get organizer custom questions:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Save/update custom questions (replace all)
  app.put("/api/organizer/hackathons/:hackathonId/custom-questions", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;
      const { questions } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id')
        .eq('id', hackathonId)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Delete existing questions
      await supabaseAdmin
        .from('hackathon_custom_questions')
        .delete()
        .eq('hackathon_id', hackathonId);

      // Insert new questions
      if (questions && questions.length > 0) {
        const questionsToInsert = questions.map((q: any, index: number) => ({
          hackathon_id: parseInt(hackathonId),
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options || null,
          is_required: q.is_required || false,
          order_index: index,
        }));

        const { error: insertError } = await supabaseAdmin
          .from('hackathon_custom_questions')
          .insert(questionsToInsert);

        if (insertError) {
          console.error('Error inserting custom questions:', insertError);
          return res.status(500).json({ success: false, message: 'Failed to save questions' });
        }
      }

      return res.json({ success: true, message: 'Questions saved successfully' });
    } catch (error: any) {
      console.error('Error in save custom questions:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Save custom answers during registration
  app.post("/api/hackathons/:hackathonId/registrations/:registrationId/custom-answers", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId, registrationId } = req.params;
      const { answers } = req.body; // { questionId: answer }

      // Verify registration belongs to user
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, user_id')
        .eq('id', registrationId)
        .eq('hackathon_id', hackathonId)
        .single();

      if (!registration || registration.user_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get questions to validate required fields
      const { data: questions } = await supabaseAdmin
        .from('hackathon_custom_questions')
        .select('*')
        .eq('hackathon_id', hackathonId);

      // Validate required questions
      const requiredQuestions = (questions || []).filter((q: any) => q.is_required);
      for (const q of requiredQuestions) {
        const answer = answers[q.id];
        if (answer === undefined || answer === null || answer === '' || 
            (Array.isArray(answer) && answer.length === 0)) {
          return res.status(400).json({ 
            success: false, 
            message: `Please answer: ${q.question_text}` 
          });
        }
      }

      // Delete existing answers for this registration
      await supabaseAdmin
        .from('hackathon_custom_answers')
        .delete()
        .eq('registration_id', registrationId);

      // Insert new answers
      const answersToInsert = Object.entries(answers)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([questionId, value]) => ({
          registration_id: parseInt(registrationId),
          question_id: parseInt(questionId),
          answer_text: typeof value === 'string' ? value : null,
          answer_array: Array.isArray(value) ? value : null,
        }));

      if (answersToInsert.length > 0) {
        const { error: insertError } = await supabaseAdmin
          .from('hackathon_custom_answers')
          .insert(answersToInsert);

        if (insertError) {
          console.error('Error inserting custom answers:', insertError);
          return res.status(500).json({ success: false, message: 'Failed to save answers' });
        }
      }

      return res.json({ success: true, message: 'Answers saved successfully' });
    } catch (error: any) {
      console.error('Error in save custom answers:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get custom answers for a registration (organizer view)
  app.get("/api/organizer/hackathons/:hackathonId/registrations/:registrationId/custom-answers", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId, registrationId } = req.params;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id')
        .eq('id', hackathonId)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_custom_answers')
        .select(`
          *,
          question:hackathon_custom_questions(question_text, question_type)
        `)
        .eq('registration_id', registrationId);

      if (error) {
        console.error('Error fetching custom answers:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch answers' });
      }

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Error in get custom answers:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
