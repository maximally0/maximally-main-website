import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface EmailProgressTrackerProps {
  batchId: string;
  onComplete?: () => void;
}

interface BatchProgress {
  batchId: string;
  total: number;
  sent: number;
  failed: number;
  pending: number;
  startedAt: number;
  completedAt: number | null;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export default function EmailProgressTracker({ batchId, onComplete }: EmailProgressTrackerProps) {
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchProgress = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`/api/organizer/email-queue/batch/${batchId}`, { headers });
        const data = await response.json();

        if (data.success && data.progress) {
          setProgress(data.progress);

          // If completed, stop polling and call onComplete
          if (data.progress.status === 'completed' || data.progress.status === 'failed') {
            clearInterval(interval);
            onComplete?.();
          }
        } else {
          setError(data.message || 'Failed to fetch progress');
          clearInterval(interval);
        }
      } catch (err: any) {
        console.error('Error fetching batch progress:', err);
        setError(err.message);
        clearInterval(interval);
      }
    };

    // Initial fetch
    fetchProgress();

    // Poll every 2 seconds
    interval = setInterval(fetchProgress, 2000);

    return () => clearInterval(interval);
  }, [batchId, onComplete]);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/30 to-red-900/10 border border-red-500/30 p-4 rounded">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-400" />
          <span className="font-jetbrains text-sm text-red-300">Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 p-4 rounded">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
          <span className="font-jetbrains text-sm text-purple-300">Loading progress...</span>
        </div>
      </div>
    );
  }

  const percentage = progress.total > 0 ? Math.round(((progress.sent + progress.failed) / progress.total) * 100) : 0;
  const isComplete = progress.status === 'completed' || progress.status === 'failed';

  return (
    <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/30 p-6 rounded space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isComplete ? (
            progress.status === 'completed' ? (
              <CheckCircle className="h-6 w-6 text-green-400" />
            ) : (
              <XCircle className="h-6 w-6 text-red-400" />
            )
          ) : (
            <Mail className="h-6 w-6 text-cyan-400 animate-pulse" />
          )}
          <h3 className="font-press-start text-sm text-cyan-300">
            {isComplete ? 'EMAIL_BATCH_COMPLETE' : 'SENDING_EMAILS...'}
          </h3>
        </div>
        <span className="font-jetbrains text-xs text-gray-400">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-black/50 border border-gray-700 rounded overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-500 ${
            isComplete
              ? progress.status === 'completed'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                : 'bg-gradient-to-r from-red-600 to-orange-600'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
        {!isComplete && (
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{ width: '30%', animation: 'shimmer 2s infinite' }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="font-press-start text-lg text-white">{progress.total}</div>
          <div className="font-jetbrains text-xs text-gray-400 mt-1">TOTAL</div>
        </div>
        <div className="text-center">
          <div className="font-press-start text-lg text-green-400">{progress.sent}</div>
          <div className="font-jetbrains text-xs text-gray-400 mt-1">SENT</div>
        </div>
        <div className="text-center">
          <div className="font-press-start text-lg text-cyan-400">{progress.pending}</div>
          <div className="font-jetbrains text-xs text-gray-400 mt-1">PENDING</div>
        </div>
        <div className="text-center">
          <div className="font-press-start text-lg text-red-400">{progress.failed}</div>
          <div className="font-jetbrains text-xs text-gray-400 mt-1">FAILED</div>
        </div>
      </div>

      {/* Status Message */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
        {isComplete ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="font-jetbrains text-xs text-green-300">
              {progress.status === 'completed'
                ? `All emails sent successfully! (${progress.sent}/${progress.total})`
                : `Batch completed with ${progress.failed} failures`}
            </span>
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 text-cyan-400" />
            <span className="font-jetbrains text-xs text-cyan-300">
              Sending at ~2 emails/second (rate limited for deliverability)
            </span>
          </>
        )}
      </div>

      {/* Estimated Time */}
      {!isComplete && progress.pending > 0 && (
        <div className="text-center">
          <span className="font-jetbrains text-xs text-gray-400">
            Est. time remaining: ~{Math.ceil(progress.pending * 0.6 / 60)} min
          </span>
        </div>
      )}
    </div>
  );
}
