/**
 * Judge Scoring Page
 * 
 * Token-based authentication page for judges to score hackathon submissions.
 * Judges access this page via secure links sent via email - no login required.
 * 
 * Requirements: 1.5, 9.2, 9.3, 9.4
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Github,
  Video,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import JudgeSubmissionCard from '@/components/JudgeSubmissionCard';

interface JudgeInfo {
  id: string;
  name: string;
  role_title?: string;
  company?: string;
}

interface HackathonInfo {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
}

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

interface ScoringData {
  hackathon: HackathonInfo;
  judge: JudgeInfo;
  submissions: Submission[];
  stats: {
    total: number;
    scored: number;
  };
}

type AuthStatus = 'loading' | 'authenticated' | 'invalid' | 'expired' | 'error';

export default function JudgeScoring() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [data, setData] = useState<ScoringData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchScoringData();
    } else {
      setAuthStatus('invalid');
      setErrorMessage('No scoring token provided');
      setLoading(false);
    }
  }, [token]);

  const fetchScoringData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/judge/${token}/submissions`);
      const result = await response.json();

      if (!response.ok) {
        // Handle different error types
        if (result.error === 'expired') {
          setAuthStatus('expired');
          setErrorMessage('This scoring link has expired. Please contact the hackathon organizer for a new link.');
        } else if (result.error === 'not_found' || result.error === 'invalid_format') {
          setAuthStatus('invalid');
          setErrorMessage('Invalid scoring link. Please check the link or contact the hackathon organizer.');
        } else {
          setAuthStatus('error');
          setErrorMessage(result.message || 'Failed to load scoring data');
        }
        return;
      }

      if (result.success) {
        setData(result);
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('error');
        setErrorMessage(result.message || 'Failed to load scoring data');
      }
    } catch (error) {
      console.error('Error fetching scoring data:', error);
      setAuthStatus('error');
      setErrorMessage('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSubmit = async (submissionId: number, score: number, notes?: string) => {
    try {
      const response = await fetch(`/api/judge/${token}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_id: submissionId,
          score,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: result.message || 'Failed to submit score',
          variant: 'destructive',
        });
        return false;
      }

      if (result.success) {
        toast({
          title: 'Score Saved',
          description: `Score of ${score}/10 has been saved`,
        });
        
        // Refresh data to update stats
        await fetchScoringData();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error submitting score:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit score. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="font-jetbrains text-gray-400">Verifying your scoring access...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (authStatus !== 'authenticated') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <SEO 
          title="Judge Scoring - Maximally"
          description="Score hackathon submissions"
        />
        <div className="text-center max-w-md mx-auto px-4">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
            authStatus === 'expired' ? 'bg-amber-500/20' : 'bg-red-500/20'
          }`}>
            {authStatus === 'expired' ? (
              <Clock className="h-8 w-8 text-amber-400" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-400" />
            )}
          </div>
          <h1 className="font-press-start text-xl mb-4 text-white">
            {authStatus === 'expired' ? 'Link Expired' : 'Access Denied'}
          </h1>
          <p className="font-jetbrains text-gray-400 mb-6">
            {errorMessage}
          </p>
          <a 
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 font-press-start text-xs hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            GO_HOME
          </a>
        </div>
      </div>
    );
  }

  // Authenticated - show scoring interface
  const { hackathon, judge, submissions, stats } = data!;
  const progressPercent = stats.total > 0 ? Math.round((stats.scored / stats.total) * 100) : 0;

  return (
    <>
      <SEO 
        title={`Judge ${hackathon.title} - Maximally`}
        description={`Score submissions for ${hackathon.title}`}
      />

      <div className="min-h-screen bg-black text-white relative">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-black pointer-events-none" />
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#8B5CF608 1px, transparent 1px), linear-gradient(90deg, #8B5CF608 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        
        {/* Glowing Orbs */}
        <div className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

        {/* Header */}
        <header className="pt-8 pb-6 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Judge Welcome */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-jetbrains">Welcome, Judge</p>
                  <p className="font-press-start text-sm text-white">{judge.name}</p>
                </div>
              </div>

              {/* Hackathon Title */}
              <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {hackathon.title}
              </h1>

              {/* Progress Stats */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-purple-500/30 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-jetbrains text-gray-400 text-sm">Scoring Progress</span>
                  <span className="font-press-start text-xs text-purple-400">
                    {stats.scored}/{stats.total} SCORED
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {stats.scored === stats.total && stats.total > 0 && (
                  <div className="flex items-center gap-2 mt-3 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-jetbrains text-sm">All submissions scored!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Submissions List */}
        <main className="pb-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {submissions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-gray-600" />
                  </div>
                  <h2 className="font-press-start text-lg mb-2 text-gray-400">No Submissions Yet</h2>
                  <p className="font-jetbrains text-gray-500">
                    There are no submissions to score at this time.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {submissions.map((submission, index) => (
                    <JudgeSubmissionCard
                      key={submission.id}
                      submission={submission}
                      index={index + 1}
                      onScoreSubmit={handleScoreSubmit}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
