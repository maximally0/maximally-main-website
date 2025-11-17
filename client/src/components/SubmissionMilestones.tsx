import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  id: string;
  milestone_title: string;
  milestone_description?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

interface SubmissionMilestonesProps {
  submissionId: number;
  canEdit?: boolean;
}

export default function SubmissionMilestones({ submissionId, canEdit = false }: SubmissionMilestonesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    milestone_title: '',
    milestone_description: '',
  });

  useEffect(() => {
    if (user) {
      fetchMilestones();
    }
  }, [submissionId, user]);

  const fetchMilestones = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/submissions/${submissionId}/milestones`, { headers });
      const data = await response.json();
      if (data.success) {
        setMilestones(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.milestone_title.trim()) {
      toast({
        title: 'Title required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/submissions/${submissionId}/milestones`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newMilestone),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Milestone added!' });
        setNewMilestone({ milestone_title: '', milestone_description: '' });
        setShowAddForm(false);
        fetchMilestones();
      }
    } catch (error: any) {
      toast({
        title: 'Error adding milestone',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleMilestone = async (milestoneId: string, completed: boolean) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/submissions/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ completed: !completed }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMilestones();
      }
    } catch (error) {
      console.error('Error toggling milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/submissions/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers,
      });
      fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-gray-400">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-press-start text-lg text-cyan-400">PROJECT MILESTONES</h3>
          {canEdit && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="font-press-start text-xs">ADD</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {milestones.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-jetbrains">
              <span className="text-gray-400">Progress</span>
              <span className="text-cyan-400">
                {completedCount} / {milestones.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-800 h-4 pixel-card">
              <div
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Milestone Form */}
      {showAddForm && canEdit && (
        <div className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6">
          <h4 className="font-press-start text-sm text-cyan-400 mb-4">NEW MILESTONE</h4>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Milestone title"
              value={newMilestone.milestone_title}
              onChange={(e) => setNewMilestone({ ...newMilestone, milestone_title: e.target.value })}
              className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
            />
            <textarea
              placeholder="Description (optional)"
              value={newMilestone.milestone_description}
              onChange={(e) => setNewMilestone({ ...newMilestone, milestone_description: e.target.value })}
              className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddMilestone}
                className="minecraft-block bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors flex-1"
              >
                <span className="font-press-start text-xs">CREATE</span>
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="minecraft-block bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <span className="font-press-start text-xs">CANCEL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.length === 0 ? (
          <div className="text-center py-12">
            <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
              <span className="font-press-start text-sm">NO MILESTONES YET</span>
            </div>
            {canEdit && (
              <p className="text-gray-500 font-jetbrains text-sm mt-4">
                Click "ADD" to create your first milestone
              </p>
            )}
          </div>
        ) : (
          milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`pixel-card border-2 p-4 transition-all ${
                milestone.completed
                  ? 'bg-green-900/20 border-green-600'
                  : 'bg-gray-900 border-gray-700 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => canEdit && handleToggleMilestone(milestone.id, milestone.completed)}
                  disabled={!canEdit}
                  className={`flex-shrink-0 mt-1 ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {milestone.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-500" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <h4 className={`font-jetbrains text-base mb-1 ${
                    milestone.completed ? 'text-gray-400 line-through' : 'text-white'
                  }`}>
                    {milestone.milestone_title}
                  </h4>
                  {milestone.milestone_description && (
                    <p className="text-sm text-gray-400 font-jetbrains">
                      {milestone.milestone_description}
                    </p>
                  )}
                  {milestone.completed && milestone.completed_at && (
                    <p className="text-xs text-green-400 font-jetbrains mt-2">
                      ✓ Completed {new Date(milestone.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                {canEdit && (
                  <button
                    onClick={() => handleDeleteMilestone(milestone.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
