// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerFileUploadRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Upload project logo
  app.post("/api/submissions/:submissionId/upload-logo", async (req, res) => {
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

      const { submissionId } = req.params;
      const { fileData, fileName, fileType } = req.body;

      if (!fileData || !fileName) {
        return res.status(400).json({ success: false, message: 'File data and name are required' });
      }

      // Verify user owns this submission
      const { data: submission, error: submissionError } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('user_id')
        .eq('id', submissionId)
        .single();

      if (submissionError || !submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      if (submission.user_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized to upload logo for this submission' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(fileType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed' });
      }

      // Convert base64 to buffer
      const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Check file size (max 5MB)
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
      }

      // Generate unique file path
      const fileExt = fileName.split('.').pop();
      const filePath = `${userId}/submission-${submissionId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('project-logos')
        .upload(filePath, buffer, {
          contentType: fileType,
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Failed to upload file: ' + uploadError.message });
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('project-logos')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update submission with logo URL
      const { error: updateError } = await supabaseAdmin
        .from('hackathon_submissions')
        .update({ project_logo: publicUrl })
        .eq('id', submissionId);

      if (updateError) {
        return res.status(500).json({ success: false, message: 'Failed to update submission: ' + updateError.message });
      }

      return res.json({ 
        success: true, 
        message: 'Logo uploaded successfully',
        url: publicUrl 
      });
    } catch (error: any) {
      console.error('Project logo upload error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to upload logo' });
    }
  });

  // Upload hackathon logo
  app.post("/api/organizer/hackathons/:hackathonId/upload-logo", async (req, res) => {
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
      const { fileData, fileName, fileType } = req.body;

      if (!fileData || !fileName) {
        return res.status(400).json({ success: false, message: 'File data and name are required' });
      }

      // Verify user owns this hackathon or is a co-organizer
      const { data: hackathon, error: hackathonError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathonError || !hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Check if user is owner or co-organizer
      let isAuthorized = hackathon.organizer_id === userId;
      if (!isAuthorized) {
        const { data: coOrg } = await supabaseAdmin
          .from('hackathon_organizers')
          .select('id')
          .eq('hackathon_id', hackathonId)
          .eq('user_id', userId)
          .eq('status', 'accepted')
          .single();
        isAuthorized = !!coOrg;
      }

      if (!isAuthorized) {
        return res.status(403).json({ success: false, message: 'Not authorized to upload logo for this hackathon' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(fileType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed' });
      }

      // Convert base64 to buffer
      const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Check file size (max 5MB)
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
      }

      // Generate unique file path
      const fileExt = fileName.split('.').pop();
      const filePath = `${userId}/hackathon-${hackathonId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('hackathon-logos')
        .upload(filePath, buffer, {
          contentType: fileType,
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Failed to upload file: ' + uploadError.message });
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('hackathon-logos')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update hackathon with logo URL
      const { error: updateError } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({ hackathon_logo: publicUrl })
        .eq('id', hackathonId);

      if (updateError) {
        return res.status(500).json({ success: false, message: 'Failed to update hackathon: ' + updateError.message });
      }

      return res.json({ 
        success: true, 
        message: 'Logo uploaded successfully',
        url: publicUrl 
      });
    } catch (error: any) {
      console.error('Hackathon logo upload error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to upload logo' });
    }
  });

  // Upload hackathon image (cover, banner, or logo)
  app.post("/api/organizer/hackathons/:hackathonId/upload-image", async (req, res) => {
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
      const { fileData, fileName, fileType, imageType } = req.body;

      if (!fileData || !fileName) {
        return res.status(400).json({ success: false, message: 'File data and name are required' });
      }

      if (!imageType || !['logo', 'cover', 'banner'].includes(imageType)) {
        return res.status(400).json({ success: false, message: 'Invalid image type. Must be logo, cover, or banner' });
      }

      // Verify user owns this hackathon or is a co-organizer
      const { data: hackathon, error: hackathonError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathonError || !hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Check if user is owner or co-organizer
      let isAuthorized = hackathon.organizer_id === userId;
      if (!isAuthorized) {
        const { data: coOrg } = await supabaseAdmin
          .from('hackathon_organizers')
          .select('id')
          .eq('hackathon_id', hackathonId)
          .eq('user_id', userId)
          .eq('status', 'accepted')
          .single();
        isAuthorized = !!coOrg;
      }

      if (!isAuthorized) {
        return res.status(403).json({ success: false, message: 'Not authorized to upload images for this hackathon' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(fileType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed' });
      }

      // Convert base64 to buffer
      const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Check file size (max 5MB)
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
      }

      // Generate unique file path
      const fileExt = fileName.split('.').pop();
      const filePath = `${hackathonId}/${imageType}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('hackathon-logos')
        .upload(filePath, buffer, {
          contentType: fileType,
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Failed to upload file: ' + uploadError.message });
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('hackathon-logos')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Map imageType to database column
      const columnMap: Record<string, string> = {
        logo: 'hackathon_logo',
        cover: 'cover_image',
        banner: 'banner_image'
      };
      const column = columnMap[imageType];

      // Update hackathon with image URL
      const { error: updateError } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({ [column]: publicUrl })
        .eq('id', hackathonId);

      if (updateError) {
        return res.status(500).json({ success: false, message: 'Failed to update hackathon: ' + updateError.message });
      }

      return res.json({ 
        success: true, 
        message: `${imageType} uploaded successfully`,
        url: publicUrl 
      });
    } catch (error: any) {
      console.error('Hackathon image upload error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to upload image' });
    }
  });

  // Delete project logo
  app.delete("/api/submissions/:submissionId/logo", async (req, res) => {
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

      const { submissionId } = req.params;

      // Get submission with logo URL
      const { data: submission, error: submissionError } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('user_id, project_logo')
        .eq('id', submissionId)
        .single();

      if (submissionError || !submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      if (submission.user_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      if (!submission.project_logo) {
        return res.status(404).json({ success: false, message: 'No logo to delete' });
      }

      // Extract file path from URL
      const url = new URL(submission.project_logo);
      const pathMatch = url.pathname.match(/\/project-logos\/(.+)$/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        await supabaseAdmin.storage
          .from('project-logos')
          .remove([filePath]);
      }

      // Update submission to remove logo URL
      await supabaseAdmin
        .from('hackathon_submissions')
        .update({ project_logo: null })
        .eq('id', submissionId);

      return res.json({ success: true, message: 'Logo deleted successfully' });
    } catch (error: any) {
      console.error('Delete logo error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to delete logo' });
    }
  });

  // Delete hackathon logo
  app.delete("/api/organizer/hackathons/:hackathonId/logo", async (req, res) => {
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

      // Get hackathon with logo URL
      const { data: hackathon, error: hackathonError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id, hackathon_logo')
        .eq('id', hackathonId)
        .single();

      if (hackathonError || !hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      if (!hackathon.hackathon_logo) {
        return res.status(404).json({ success: false, message: 'No logo to delete' });
      }

      // Extract file path from URL
      const url = new URL(hackathon.hackathon_logo);
      const pathMatch = url.pathname.match(/\/hackathon-logos\/(.+)$/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        await supabaseAdmin.storage
          .from('hackathon-logos')
          .remove([filePath]);
      }

      // Update hackathon to remove logo URL
      await supabaseAdmin
        .from('organizer_hackathons')
        .update({ hackathon_logo: null })
        .eq('id', hackathonId);

      return res.json({ success: true, message: 'Logo deleted successfully' });
    } catch (error: any) {
      console.error('Delete logo error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to delete logo' });
    }
  });
}
