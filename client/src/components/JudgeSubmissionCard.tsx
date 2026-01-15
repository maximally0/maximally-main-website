/**
 * Judge Submission Card Component
 * 
 * Displays a hackathon submission with project info and scoring interface.
 * Used by judges to view and score submissions via tokenized access.
 * 
 * Requirements: 9.3, 9.4
 */

import { useState } from 'react';
import { 
  ExternalLink, 
  Github, 
  Video, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import JudgeScoreForm from '@/components/JudgeScoreForm';

interface SubmissionScore {
  submission_id: number;
  score: number;
  notes?: string;
  scored_at: string;
}

interface Submission {
  id: number;
  project_name: string;
  project_description?: string;
  demo_url?: string;
  repo_url?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
  score: SubmissionScore | null;
}

interface JudgeSubmissionCardProps {
  submission: Submission;
  index: number;
  onScoreSubmit: (submissionId: number, score: number, notes?: string) => Promise<boolean>;
}

export default function JudgeSubmissionCard({ 
  submission, 
  index, 
  onScoreSubmit 
}: JudgeSubmissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(!submission.score);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreSubmit = async (score: number, notes?: string) => {
    setIsSubmitting(true);
    try {
      const success = await onScoreSubmit(submission.id, score, notes);
      if (success) {
        setIsExpanded(false);
      }
      return success;
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasScore = submission.score !== null;

  return (
    <div 
      className={`bg-gradient-to-br from-gray-900/80 to-gray-800/50 border rounded-lg overflow-hidden transition-all ${
        hasScore 
          ? 'border-green-500/30 hover:border-green-500/50' 
          : 'border-purple-500/30 hover:border-purple-500/50'
      }`}
    >
      {/* Header - Always visible */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Index Badge */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            hasScore 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-purple-500/20 text-purple-400'
          }`}>
            {hasScore ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <span className="font-press-start text-xs">{index}</span>
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-press-start text-sm text-white truncate">
              {submission.project_name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              {hasScore && (
                <span className="font-jetbrains text-xs text-green-400">
                  Score: {submission.score!.score}/10
                </span>
              )}
              {!hasScore && (
                <span className="font-jetbrains text-xs text-amber-400">
                  Not scored
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand/Collapse */}
        <div className="flex items-center gap-2 ml-4">
          {/* Quick Links */}
          <div className="hidden sm:flex items-center gap-2">
            {submission.demo_url && (
              <a
                href={submission.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
                title="View Demo"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {submission.repo_url && (
              <a
                href={submission.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30 transition-colors"
                title="View Repository"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {submission.video_url && (
              <a
                href={submission.video_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                title="Watch Video"
              >
                <Video className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Expand Icon */}
          <div className="p-2 text-gray-400">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700/50 p-4 space-y-4">
          {/* Project Description */}
          {submission.project_description && (
            <div>
              <h4 className="font-press-start text-xs text-gray-400 mb-2">DESCRIPTION</h4>
              <p className="font-jetbrains text-sm text-gray-300 whitespace-pre-wrap">
                {submission.project_description}
              </p>
            </div>
          )}

          {/* Links - Mobile view */}
          <div className="sm:hidden">
            <h4 className="font-press-start text-xs text-gray-400 mb-2">LINKS</h4>
            <div className="flex flex-wrap gap-2">
              {submission.demo_url && (
                <a
                  href={submission.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded text-sm font-jetbrains hover:bg-cyan-500/30 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Demo
                </a>
              )}
              {submission.repo_url && (
                <a
                  href={submission.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-500/20 text-gray-400 rounded text-sm font-jetbrains hover:bg-gray-500/30 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  Repository
                </a>
              )}
              {submission.video_url && (
                <a
                  href={submission.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded text-sm font-jetbrains hover:bg-red-500/30 transition-colors"
                >
                  <Video className="h-4 w-4" />
                  Video
                </a>
              )}
            </div>
          </div>

          {/* Scoring Form */}
          <div className="pt-2">
            <h4 className="font-press-start text-xs text-gray-400 mb-3">
              {hasScore ? 'UPDATE SCORE' : 'SUBMIT SCORE'}
            </h4>
            <JudgeScoreForm
              initialScore={submission.score?.score}
              initialNotes={submission.score?.notes}
              onSubmit={handleScoreSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
