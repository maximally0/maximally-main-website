import { useEffect, useState } from 'react';
import { MessageCircle, Eye } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface FeedbackResponse {
  id: string;
  form_id: string;
  respondent_id?: string;
  responses: Record<string, any>;
  submitted_at: string;
}

interface FeedbackForm {
  id: string;
  form_title: string;
  form_type: string;
  questions: Array<{
    id: string;
    question: string;
    type: string;
  }>;
  is_anonymous: boolean;
}

interface Props {
  hackathonId: number;
}

export default function OrganizerFeedbackViewer({ hackathonId }: Props) {
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [responses, setResponses] = useState<Record<string, FeedbackResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  useEffect(() => {
    fetchForms();
  }, [hackathonId]);

  const fetchForms = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/feedback-forms`);
      const data = await response.json();
      if (data.success) {
        setForms(data.data || []);
        // Fetch responses for each form
        for (const form of data.data || []) {
          fetchResponses(form.id);
        }
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async (formId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/feedback-forms/${formId}/responses`, { headers });
      const data = await response.json();
      if (data.success) {
        setResponses(prev => ({ ...prev, [formId]: data.data || [] }));
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading feedback...</div>;
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
          <span className="font-press-start text-sm">NO FEEDBACK FORMS YET</span>
        </div>
        <p className="text-gray-500 font-jetbrains text-sm mt-4">
          Create feedback forms to collect participant feedback
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-press-start text-lg text-cyan-400">FEEDBACK RESPONSES</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {forms.map((form) => {
          const formResponses = responses[form.id] || [];
          return (
            <div
              key={form.id}
              className="pixel-card bg-gray-900 border-2 border-gray-700 p-4 hover:border-cyan-400 transition-colors cursor-pointer"
              onClick={() => setSelectedForm(selectedForm === form.id ? null : form.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="minecraft-block bg-cyan-400 text-black px-2 py-1 inline-block mb-2">
                    <span className="font-press-start text-xs">{form.form_type.toUpperCase()}</span>
                  </div>
                  <h4 className="font-press-start text-sm text-white">{form.form_title}</h4>
                </div>
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 font-jetbrains">
                <span>{formResponses.length} responses</span>
                <span>•</span>
                <span>{form.questions.length} questions</span>
                {form.is_anonymous && <span>• Anonymous</span>}
              </div>

              {/* Show responses when selected */}
              {selectedForm === form.id && formResponses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  {formResponses.slice(0, 3).map((response, idx) => (
                    <div key={response.id} className="bg-gray-800 p-3 rounded text-xs">
                      <div className="text-gray-500 mb-2">
                        Response #{idx + 1} • {new Date(response.submitted_at).toLocaleDateString()}
                      </div>
                      {form.questions.slice(0, 2).map((q) => (
                        <div key={q.id} className="mb-2">
                          <div className="text-gray-400">{q.question}</div>
                          <div className="text-white font-jetbrains">
                            {response.responses[q.id] || 'No answer'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {formResponses.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{formResponses.length - 3} more responses
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
