import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface CustomQuestion {
  id?: number;
  question_text: string;
  question_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio';
  options?: string[];
  is_required: boolean;
  order_index: number;
}

interface CustomQuestionsManagerProps {
  hackathonId: number;
}

const QUESTION_TYPES = [
  { value: 'text', label: 'Short Text', description: 'Single line text input' },
  { value: 'textarea', label: 'Long Text', description: 'Multi-line text area' },
  { value: 'select', label: 'Dropdown', description: 'Single selection from options' },
  { value: 'multiselect', label: 'Multi-Select', description: 'Multiple selections allowed' },
  { value: 'checkbox', label: 'Checkbox', description: 'Yes/No toggle' },
  { value: 'radio', label: 'Radio Buttons', description: 'Single selection with visible options' },
];

export default function CustomQuestionsManager({ hackathonId }: CustomQuestionsManagerProps) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [hackathonId]);

  const fetchQuestions = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/custom-questions`, { headers });
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

  const addQuestion = () => {
    const newQuestion: CustomQuestion = {
      question_text: '',
      question_type: 'text',
      options: [],
      is_required: false,
      order_index: questions.length,
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<CustomQuestion>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;
    
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    newQuestions.forEach((q, i) => q.order_index = i);
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    const options = question.options || [];
    updateQuestion(questionIndex, { options: [...options, ''] });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = questions[questionIndex];
    const options = [...(question.options || [])];
    options[optionIndex] = value;
    updateQuestion(questionIndex, { options });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const options = (question.options || []).filter((_, i) => i !== optionIndex);
    updateQuestion(questionIndex, { options });
  };

  const saveQuestions = async () => {
    // Validate questions
    const invalidQuestions = questions.filter(q => !q.question_text.trim());
    if (invalidQuestions.length > 0) {
      toast({
        title: "Validation Error",
        description: "All questions must have text",
        variant: "destructive",
      });
      return;
    }

    // Validate options for select/multiselect/radio
    const needsOptions = questions.filter(
      q => ['select', 'multiselect', 'radio'].includes(q.question_type) && 
           (!q.options || q.options.filter(o => o.trim()).length < 2)
    );
    if (needsOptions.length > 0) {
      toast({
        title: "Validation Error",
        description: "Dropdown, multi-select, and radio questions need at least 2 options",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/custom-questions`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Questions Saved!",
          description: `${questions.length} custom question(s) saved successfully`,
        });
        fetchQuestions();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save questions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-cyan-400" />
          <h2 className="font-press-start text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            CUSTOM QUESTIONS
          </h2>
        </div>
        <button
          onClick={addQuestion}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 font-press-start text-xs transition-all flex items-center gap-2 border border-cyan-500/50"
        >
          <Plus className="h-4 w-4" />
          ADD QUESTION
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-500/30 p-4">
        <p className="font-jetbrains text-sm text-cyan-200">
          Add custom questions to collect additional information during registration. 
          These questions will appear after the standard registration fields.
        </p>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-12 text-center">
          <HelpCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="font-press-start text-gray-400 mb-2">NO CUSTOM QUESTIONS</p>
          <p className="font-jetbrains text-sm text-gray-500">
            Click "Add Question" to create custom registration questions
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 overflow-hidden"
            >
              {/* Question Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-press-start text-sm text-white">
                      {question.question_text || 'New Question'}
                    </p>
                    <p className="font-jetbrains text-xs text-gray-500 mt-1">
                      {QUESTION_TYPES.find(t => t.value === question.question_type)?.label}
                      {question.is_required && <span className="text-red-400 ml-2">• Required</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveQuestion(index, 'up'); }}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveQuestion(index, 'down'); }}
                    disabled={index === questions.length - 1}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeQuestion(index); }}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedQuestion === index && (
                <div className="border-t border-gray-700 p-4 space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block font-press-start text-xs text-gray-400 mb-2">
                      QUESTION TEXT
                    </label>
                    <input
                      type="text"
                      value={question.question_text}
                      onChange={(e) => updateQuestion(index, { question_text: e.target.value })}
                      placeholder="Enter your question..."
                      className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 outline-none"
                    />
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block font-press-start text-xs text-gray-400 mb-2">
                      QUESTION TYPE
                    </label>
                    <select
                      value={question.question_type}
                      onChange={(e) => updateQuestion(index, { 
                        question_type: e.target.value as CustomQuestion['question_type'],
                        options: ['select', 'multiselect', 'radio'].includes(e.target.value) ? (question.options || ['', '']) : []
                      })}
                      className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 outline-none"
                    >
                      {QUESTION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Options (for select/multiselect/radio) */}
                  {['select', 'multiselect', 'radio'].includes(question.question_type) && (
                    <div>
                      <label className="block font-press-start text-xs text-gray-400 mb-2">
                        OPTIONS
                      </label>
                      <div className="space-y-2">
                        {(question.options || []).map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, optIndex, e.target.value)}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 bg-black/50 border border-gray-700 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 outline-none"
                            />
                            <button
                              onClick={() => removeOption(index, optIndex)}
                              className="p-2 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(index)}
                          className="text-cyan-400 hover:text-cyan-300 font-jetbrains text-sm flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Required Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={question.is_required}
                      onChange={(e) => updateQuestion(index, { is_required: e.target.checked })}
                      className="w-5 h-5 bg-black border-2 border-gray-600 rounded checked:bg-cyan-500 checked:border-cyan-500"
                    />
                    <label htmlFor={`required-${index}`} className="font-jetbrains text-sm text-gray-300">
                      This question is required
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      {questions.length > 0 && (
        <button
          onClick={saveQuestions}
          disabled={saving}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-4 font-press-start text-xs transition-all flex items-center justify-center gap-2 border border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? 'SAVING...' : 'SAVE QUESTIONS'}
        </button>
      )}
    </div>
  );
}
