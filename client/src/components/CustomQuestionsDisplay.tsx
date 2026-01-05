import { useState, useEffect } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';

interface CustomQuestion {
  id: number;
  question_text: string;
  question_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio';
  options?: string[];
  is_required: boolean;
  order_index: number;
}

interface CustomQuestionsDisplayProps {
  hackathonId: number;
  answers: Record<number, string | string[] | boolean>;
  onChange: (questionId: number, value: string | string[] | boolean) => void;
  errors?: Record<number, string>;
}

export default function CustomQuestionsDisplay({ 
  hackathonId, 
  answers, 
  onChange,
  errors = {}
}: CustomQuestionsDisplayProps) {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [hackathonId]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/custom-questions`);
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching custom questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const handleMultiSelectChange = (questionId: number, option: string, checked: boolean) => {
    const currentValue = (answers[questionId] as string[]) || [];
    if (checked) {
      onChange(questionId, [...currentValue, option]);
    } else {
      onChange(questionId, currentValue.filter(v => v !== option));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-cyan-400" />
        <h3 className="font-press-start text-sm text-cyan-400">ADDITIONAL QUESTIONS</h3>
      </div>

      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block font-jetbrains text-sm text-gray-300">
            {question.question_text}
            {question.is_required && <span className="text-red-400 ml-1">*</span>}
          </label>

          {/* Text Input */}
          {question.question_type === 'text' && (
            <input
              type="text"
              value={(answers[question.id] as string) || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
              placeholder="Enter your answer..."
            />
          )}

          {/* Textarea */}
          {question.question_type === 'textarea' && (
            <textarea
              value={(answers[question.id] as string) || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              rows={4}
              className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none"
              placeholder="Enter your answer..."
            />
          )}

          {/* Select Dropdown */}
          {question.question_type === 'select' && (
            <select
              value={(answers[question.id] as string) || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
            >
              <option value="">Select an option...</option>
              {(question.options || []).map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          )}

          {/* Multi-Select */}
          {question.question_type === 'multiselect' && (
            <div className="space-y-2">
              {(question.options || []).map((option, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={((answers[question.id] as string[]) || []).includes(option)}
                    onChange={(e) => handleMultiSelectChange(question.id, option, e.target.checked)}
                    className="w-5 h-5 bg-black border-2 border-gray-600 rounded checked:bg-purple-500 checked:border-purple-500"
                  />
                  <span className="font-jetbrains text-sm text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Checkbox (Yes/No) */}
          {question.question_type === 'checkbox' && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(answers[question.id] as boolean) || false}
                onChange={(e) => onChange(question.id, e.target.checked)}
                className="w-5 h-5 bg-black border-2 border-gray-600 rounded checked:bg-purple-500 checked:border-purple-500"
              />
              <span className="font-jetbrains text-sm text-gray-300">Yes</span>
            </label>
          )}

          {/* Radio Buttons */}
          {question.question_type === 'radio' && (
            <div className="space-y-2">
              {(question.options || []).map((option, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={(answers[question.id] as string) === option}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    className="w-5 h-5 bg-black border-2 border-gray-600 rounded-full checked:bg-purple-500 checked:border-purple-500"
                  />
                  <span className="font-jetbrains text-sm text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Error Message */}
          {errors[question.id] && (
            <p className="text-red-400 text-xs font-jetbrains">{errors[question.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Export a function to validate custom question answers
export function validateCustomAnswers(
  questions: CustomQuestion[],
  answers: Record<number, string | string[] | boolean>
): Record<number, string> {
  const errors: Record<number, string> = {};

  questions.forEach(question => {
    if (question.is_required) {
      const answer = answers[question.id];
      
      if (answer === undefined || answer === null || answer === '') {
        errors[question.id] = 'This field is required';
      } else if (Array.isArray(answer) && answer.length === 0) {
        errors[question.id] = 'Please select at least one option';
      }
    }
  });

  return errors;
}
