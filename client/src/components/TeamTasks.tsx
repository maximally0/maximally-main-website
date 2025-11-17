import { useEffect, useState } from 'react';
import { Plus, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  task_title: string;
  task_description?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  due_date?: string;
  created_at: string;
}

interface TeamTasksProps {
  teamId: number;
}

export default function TeamTasks({ teamId }: TeamTasksProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    task_title: '',
    task_description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [teamId, user]);

  const fetchTasks = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/${teamId}/tasks`, { headers });
      const data = await response.json();
      if (data.success) {
        setTasks(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.task_title.trim()) {
      toast({
        title: 'Task title required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/${teamId}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Task created!' });
        setNewTask({ task_title: '', task_description: '', priority: 'medium' });
        setShowAddTask(false);
        fetchTasks();
      }
    } catch (error: any) {
      toast({
        title: 'Error creating task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/tasks/${taskId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-400',
      medium: 'text-blue-400',
      high: 'text-yellow-400',
      urgent: 'text-red-400',
    };
    return colors[priority as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-400" />;
      case 'review': return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-press-start text-xl text-cyan-400">TEAM TASKS</h3>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="font-press-start text-xs">ADD TASK</span>
        </button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6">
          <h4 className="font-press-start text-sm text-cyan-400 mb-4">NEW TASK</h4>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.task_title}
              onChange={(e) => setNewTask({ ...newTask, task_title: e.target.value })}
              className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
            />
            <textarea
              placeholder="Description (optional)"
              value={newTask.task_description}
              onChange={(e) => setNewTask({ ...newTask, task_description: e.target.value })}
              className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none resize-none"
              rows={3}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="minecraft-block bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors flex-1"
              >
                <span className="font-press-start text-xs">CREATE</span>
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="minecraft-block bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <span className="font-press-start text-xs">CANCEL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Board */}
      <div className="grid md:grid-cols-4 gap-4">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="space-y-3">
            <div className="minecraft-block bg-gray-800 text-gray-300 px-3 py-2">
              <span className="font-press-start text-xs">
                {status.toUpperCase().replace('-', ' ')} ({statusTasks.length})
              </span>
            </div>
            <div className="space-y-2">
              {statusTasks.map((task) => (
                <div
                  key={task.id}
                  className="pixel-card bg-gray-900 border-2 border-gray-700 p-4 hover:border-cyan-400 transition-colors cursor-pointer"
                  onClick={() => {
                    const statuses: Task['status'][] = ['todo', 'in-progress', 'review', 'done'];
                    const currentIndex = statuses.indexOf(task.status);
                    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                    handleUpdateStatus(task.id, nextStatus);
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {getStatusIcon(task.status)}
                    <h5 className="font-jetbrains text-sm text-white flex-1">
                      {task.task_title}
                    </h5>
                  </div>
                  {task.task_description && (
                    <p className="font-jetbrains text-xs text-gray-400 mb-2">
                      {task.task_description}
                    </p>
                  )}
                  <div className={`font-press-start text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
            <span className="font-press-start text-sm">NO TASKS YET</span>
          </div>
          <p className="text-gray-500 font-jetbrains text-sm mt-4">
            Click "ADD TASK" to create your first task
          </p>
        </div>
      )}
    </div>
  );
}
