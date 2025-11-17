import { useEffect, useState } from 'react';
import { MessageCircle, Send, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface FeedbackForm {
  id: string;
  form_title: string;
  form_description?: string;
  form_type: 'pre-event' | 'mid-event' | 'post-event' | 'mentor' | 'judge' | 'sponsor';
  questions: Array<{
    id: string;
    question: string;
    type: 'text' | 'textarea' | 'rating' | 'multiple_choice';
    options?: string[];
    required?: boolean;
  }>;
  is_anonymous: boolean;
}

interface HackathonFeedbackProps {
  hackathonId: number;
}

export default function HackathonFeedback({ hackathonId }: HackathonFeedbackProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchForms();
  }, [hackathonId]);

  const fetchForms = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/feedback-forms`);
      const data = await response.json();
      if (data.success) {
        setForms(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching feedback forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedForm) return;

    // Validate required fields
    const requiredQuestions = selectedForm.questions.filter(q => q.required);
    const missingRequired = requiredQuestions.some(q => !responses[q.id]);
    
    if (missingRequired) {
      toast({
        title: 'Required fields missing',
        description: 'Please answer all required questions',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const headers = user ? await getAuthHeaders() : {};
      const response = await fetch(`/api/hackathons/feedback-forms/${selectedForm.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          responses,
          is_anonymous: selectedForm.is_anonymous,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Feedback submitted! Thank you!' });
        setSelectedForm(null);
        setResponses({});
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error submitting feedback',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={responses[question.id] || ''}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
            placeholder="Your answer..."
          />
        );

      case 'textarea':
        return (
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none resize-none"
            rows={4}
            placeholder="Your answer..."
          />
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setResponses({ ...responses, [question.id]: rating })}
                className={`p-2 transition-colors ${
                  responses[question.id] >= rating
                    ? 'text-yellow-400'
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                <Star className="h-8 w-8" fill={responses[question.id] >= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <label
                key={index}
                className="flex items-center gap-3 pixel-card bg-gray-800 border-2 border-gray-600 p-3 cursor-pointer hover:border-cyan-400 transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
                  className="w-4 h-4"
                />
                <span className="font-jetbrains text-white">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-gray-400">LOADING...</div>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
          <span className="font-press-start text-sm">NO FEEDBACK FORMS AVAILABLE</span>
        </div>
      </div>
    );
  }

  // Show form selection
  if (!selectedForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6 text-cyan-400" />
          <h3 className="font-press-start text-xl text-cyan-400">FEEDBACK FORMS</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {forms.map((form) => (
            <button
              key={form.id}
              onClick={() => setSelectedForm(form)}
              className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 hover:border-cyan-400 transition-all text-left"
            >
              <div className="minecraft-block bg-cyan-400 text-black px-3 py-1 inline-block mb-3">
                <span className="font-press-start text-xs">{form.form_type.toUpperCase()}</span>
              </div>
              <h4 className="font-press-start text-base text-white mb-2">{form.form_title}</h4>
              {form.form_description && (
                <p className="text-sm text-gray-400 font-jetbrains">{form.form_description}</p>
              )}
              <div className="mt-4 text-xs text-gray-500 font-jetbrains">
                {form.questions.length} questions • {form.is_anonymous ? 'Anonymous' : 'Named'}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Show selected form
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="minecraft-block bg-cyan-400 text-black px-3 py-1 inline-block mb-3">
            <span className="font-press-start text-xs">{selectedForm.form_type.toUpperCase()}</span>
          </div>
          <h3 className="font-press-start text-xl text-white mb-2">{selectedForm.form_title}</h3>
          {selectedForm.form_description && (
            <p className="text-gray-400 font-jetbrains">{selectedForm.form_description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setSelectedForm(null);
            setResponses({});
          }}
          className="minecraft-block bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          <span className="font-press-start text-xs">BACK</span>
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {selectedForm.questions.map((question, index) => (
          <div key={question.id} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6">
            <label className="block mb-4">
              <span className="font-jetbrains text-white text-base">
                {index + 1}. {question.question}
                {question.required && <span className="text-red-400 ml-1">*</span>}
              </span>
            </label>
            {renderQuestion(question)}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        {selectedForm.is_anonymous && (
          <p className="text-sm text-gray-400 font-jetbrains self-center">
            🔒 This feedback is anonymous
          </p>
        )}
        <button
          onClick={handleSubmitFeedback}
          disabled={submitting}
          className="minecraft-block bg-green-600 text-white px-8 py-3 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          <span className="font-press-start text-sm">
            {submitting ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
          </span>
        </button>
      </div>
    </div>
  );
}
