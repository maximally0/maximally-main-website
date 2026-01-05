import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Github, ExternalLink, Video, Star, MessageSquare, Award, Filter, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface Submission {
  id: number;
  project_name: string;
  tagline?: string;
  description: string;
  track?: string;
  github_repo?: string;
  demo_url?: string;
  video_url?: string;
  technologies_used?: string[];
  score?: number;
  criteria_scores?: string;
  feedback?: string;
  team?: { team_name: string };
  user_name: string;
  submitted_at: string;
  prize_won?: string;
}

interface Track {
  id: string;
  track_name: string;
  track_description?: string;
}

export default function JudgeSubmissions() {
  const { hackathonId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'unscored' | 'scored'>('unscored');
  const [hackathon, setHackathon] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [scoreData, setScoreData] = useState({
    innovation: 50,
    technical: 50,
    design: 50,
    presentation: 50,
    impact: 50,
    feedback: ''
  });

  useEffect(() => {
    fetchSubmissions();
    fetchHackathon();
    fetchTracks();
  }, [hackathonId]);

  const fetchHackathon = async () => {
    try {
      const response = await fetch(`/api/hackathons/id/${hackathonId}`);
      const data = await response.json();
      if (data.success) {
        setHackathon(data.data);
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
    }
  };

  const fetchTracks = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/tracks`);
      const data = await response.json();
      if (data.success) {
        setTracks(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  // Check if judging is open
  const isJudgingOpen = () => {
    if (!hackathon) return false;
    
    const now = new Date();
    const judgingControl = hackathon.judging_control || 'auto';
    
    // Force open
    if (judgingControl === 'open') return true;
    // Force closed
    if (judgingControl === 'closed') return false;
    
    // Auto - check timeline
    const judgingStarts = hackathon.judging_starts_at ? new Date(hackathon.judging_starts_at) : null;
    const judgingEnds = hackathon.judging_ends_at ? new Date(hackathon.judging_ends_at) : null;
    
    if (judgingStarts && now < judgingStarts) return false;
    if (judgingEnds && now > judgingEnds) return false;
    
    return true;
  };

  const fetchSubmissions = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge/hackathons/${hackathonId}/submissions`, { headers });
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScore = (submission: Submission) => {
    setSelectedSubmission(submission);
    // Parse existing scores if available (stored as JSON in score field or separate fields)
    const existingScores = submission.criteria_scores ? JSON.parse(submission.criteria_scores as string) : null;
    setScoreData({
      innovation: existingScores?.innovation ?? 50,
      technical: existingScores?.technical ?? 50,
      design: existingScores?.design ?? 50,
      presentation: existingScores?.presentation ?? 50,
      impact: existingScores?.impact ?? 50,
      feedback: submission.feedback || ''
    });
    setShowScoreModal(true);
  };

  // Calculate overall score from criteria
  const calculateOverallScore = () => {
    const { innovation, technical, design, presentation, impact } = scoreData;
    return ((innovation + technical + design + presentation + impact) / 5).toFixed(1);
  };

  const handleSubmitScore = async () => {
    if (!selectedSubmission) return;

    const overallScore = parseFloat(calculateOverallScore());
    const criteriaScores = {
      innovation: scoreData.innovation,
      technical: scoreData.technical,
      design: scoreData.design,
      presentation: scoreData.presentation,
      impact: scoreData.impact
    };

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge/submissions/${selectedSubmission.id}/score`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          score: overallScore,
          criteria_scores: JSON.stringify(criteriaScores),
          feedback: scoreData.feedback
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Score Submitted!",
          description: `Overall score: ${overallScore}/100`,
        });
        setShowScoreModal(false);
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.15)_0%,transparent_50%)]" />
        
        <div className="relative z-10 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto animate-pulse space-y-8">
              <div className="h-4 w-24 bg-red-900/50 rounded mb-4"></div>
              <div className="h-10 w-80 bg-red-900/50 rounded mb-8"></div>

              {/* Tabs skeleton */}
              <div className="flex gap-2 mb-6">
                <div className="h-12 w-40 bg-red-900/50 rounded"></div>
                <div className="h-12 w-40 bg-red-900/50 rounded"></div>
              </div>

              {/* Submissions skeleton */}
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-red-500/40 p-6">
                    <div className="flex gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="h-6 w-64 bg-red-900/50 rounded"></div>
                        <div className="h-4 w-full bg-red-900/50 rounded"></div>
                        <div className="h-4 w-5/6 bg-red-900/50 rounded"></div>
                        <div className="flex gap-2">
                          <div className="h-8 w-20 bg-red-900/50 rounded"></div>
                          <div className="h-8 w-20 bg-red-900/50 rounded"></div>
                        </div>
                      </div>
                      <div className="w-48">
                        <div className="h-12 w-full bg-red-900/50 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const unscoredSubmissions = submissions.filter(s => !s.score);
  const scoredSubmissions = submissions.filter(s => s.score);

  // Filter submissions by track
  const filteredUnscoredSubmissions = selectedTrack === 'all' 
    ? unscoredSubmissions 
    : selectedTrack === 'no-track' 
      ? unscoredSubmissions.filter(s => !s.track)
      : unscoredSubmissions.filter(s => s.track === selectedTrack);

  const filteredScoredSubmissions = selectedTrack === 'all' 
    ? scoredSubmissions 
    : selectedTrack === 'no-track' 
      ? scoredSubmissions.filter(s => !s.track)
      : scoredSubmissions.filter(s => s.track === selectedTrack);

  // Get unique tracks from submissions
  const submissionTracks = Array.from(new Set(submissions.filter(s => s.track).map(s => s.track!)));

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-black" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.15)_0%,transparent_50%)]" />
      
      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Link to="/judge-dashboard" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-4 py-2 font-press-start text-xs mb-6 inline-flex items-center gap-2 border border-red-500/50 transition-all">
              ← BACK
            </Link>

            <h1 className="font-press-start text-3xl bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-8">JUDGE SUBMISSIONS</h1>

            {/* Judging Period Status */}
            {hackathon && !isJudgingOpen() && (
              <div className="bg-yellow-900/20 border border-yellow-500/50 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-400" />
                  <div>
                    <p className="font-press-start text-sm text-yellow-400">JUDGING NOT OPEN</p>
                    <p className="font-jetbrains text-gray-400 text-sm mt-1">
                      {hackathon.judging_control === 'closed' 
                        ? 'Judging has been closed by the organizer.'
                        : hackathon.judging_starts_at && new Date(hackathon.judging_starts_at) > new Date()
                          ? `Judging starts on ${new Date(hackathon.judging_starts_at).toLocaleDateString()}`
                          : 'Judging period has ended.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTab('unscored')}
                className={`px-6 py-3 font-press-start text-sm transition-all ${
                  activeTab === 'unscored'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border border-red-500/50'
                    : 'bg-gray-900 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/50'
                }`}
              >
                UNSCORED ({filteredUnscoredSubmissions.length})
              </button>
              <button
                onClick={() => setActiveTab('scored')}
                className={`px-6 py-3 font-press-start text-sm transition-all ${
                  activeTab === 'scored'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border border-red-500/50'
                    : 'bg-gray-900 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/50'
                }`}
              >
                SCORED ({filteredScoredSubmissions.length})
              </button>
            </div>

            {/* Track Filter */}
            {(tracks.length > 0 || submissionTracks.length > 0) && (
              <div className="bg-gradient-to-br from-red-900/20 to-orange-900/10 border border-red-500/30 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-red-400" />
                    <span className="font-press-start text-xs text-red-400">FILTER BY TRACK:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedTrack('all')}
                      className={`px-4 py-2 font-press-start text-xs transition-all ${
                        selectedTrack === 'all'
                          ? 'bg-red-600 text-white border border-red-400'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-500/50 hover:text-red-300'
                      }`}
                    >
                      ALL ({submissions.length})
                    </button>
                    {(tracks.length > 0 ? tracks : submissionTracks.map(t => ({ track_name: t }))).map((track: any) => {
                      const trackName = track.track_name || track;
                      const count = submissions.filter(s => s.track === trackName).length;
                      return (
                        <button
                          key={trackName}
                          onClick={() => setSelectedTrack(trackName)}
                          className={`px-4 py-2 font-press-start text-xs transition-all ${
                            selectedTrack === trackName
                              ? 'bg-cyan-600 text-white border border-cyan-400'
                              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-cyan-500/50 hover:text-cyan-300'
                          }`}
                        >
                          {trackName.toUpperCase()} ({count})
                        </button>
                      );
                    })}
                    {submissions.some(s => !s.track) && (
                      <button
                        onClick={() => setSelectedTrack('no-track')}
                        className={`px-4 py-2 font-press-start text-xs transition-all ${
                          selectedTrack === 'no-track'
                            ? 'bg-gray-600 text-white border border-gray-400'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500/50 hover:text-gray-300'
                        }`}
                      >
                        NO TRACK ({submissions.filter(s => !s.track).length})
                      </button>
                    )}
                  </div>
                  {selectedTrack !== 'all' && (
                    <button
                      onClick={() => setSelectedTrack('all')}
                      className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Unscored Tab */}
            {activeTab === 'unscored' && (
              <>
                {filteredUnscoredSubmissions.length === 0 ? (
                  <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-red-500/40 p-12 text-center">
                    <Trophy className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="font-press-start text-gray-400">
                      {selectedTrack !== 'all' ? 'NO SUBMISSIONS IN THIS TRACK' : 'ALL SUBMISSIONS SCORED!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredUnscoredSubmissions.map((submission) => (
                      <div key={submission.id} className="bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-red-500/40 p-6 hover:border-orange-400 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Project Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-press-start text-xl text-white">{submission.project_name}</h3>
                                  {submission.track && (
                                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-jetbrains">
                                      {submission.track}
                                    </span>
                                  )}
                                </div>
                                {submission.tagline && (
                                  <p className="text-sm text-gray-400 font-jetbrains italic mb-2">"{submission.tagline}"</p>
                                )}
                                {submission.team ? (
                                  <p className="text-sm text-cyan-400 font-jetbrains">Team: {submission.team.team_name}</p>
                                ) : (
                                  <p className="text-sm text-gray-400 font-jetbrains">By: {submission.user_name}</p>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-300 font-jetbrains mb-4 leading-relaxed">{submission.description}</p>

                            {submission.technologies_used && submission.technologies_used.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {submission.technologies_used.map((tech, i) => (
                                  <span key={i} className="text-xs bg-cyan-500/20 border border-cyan-500/50 px-2 py-1 text-cyan-300 font-jetbrains">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Links */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {submission.github_repo && (
                                <a href={submission.github_repo} target="_blank" rel="noopener noreferrer"
                                   className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 font-press-start text-xs flex items-center gap-2 border border-gray-700 transition-all">
                                  <Github className="h-4 w-4" />
                                  CODE
                                </a>
                              )}
                              {submission.demo_url && (
                                <a href={submission.demo_url} target="_blank" rel="noopener noreferrer"
                                   className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-4 py-2 font-press-start text-xs flex items-center gap-2 border border-red-500/50 transition-all">
                                  <ExternalLink className="h-4 w-4" />
                                  DEMO
                                </a>
                              )}
                              {submission.video_url && (
                                <a href={submission.video_url} target="_blank" rel="noopener noreferrer"
                                   className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 font-press-start text-xs flex items-center gap-2 border border-cyan-500/50 transition-all">
                                  <Video className="h-4 w-4" />
                                  VIDEO
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Score Button */}
                          <div className="lg:w-48 flex flex-col gap-2">
                            <button
                              onClick={() => handleScore(submission)}
                              disabled={!isJudgingOpen()}
                              className={`px-6 py-3 font-press-start text-sm transition-all flex items-center justify-center gap-2 ${
                                isJudgingOpen()
                                  ? 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white border border-red-500/50'
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                              }`}
                            >
                              <Star className="h-4 w-4" />
                              SCORE
                            </button>
                            {!isJudgingOpen() && (
                              <p className="text-xs text-gray-500 font-jetbrains text-center">Judging not open</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Scored Tab */}
            {activeTab === 'scored' && (
              <>
                {scoredSubmissions.length === 0 ? (
                  <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-red-500/40 p-12 text-center">
                    <Trophy className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="font-press-start text-gray-400">NO SCORED SUBMISSIONS YET</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {scoredSubmissions.map((submission) => (
                      <div key={submission.id} className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/40 p-6 hover:border-cyan-400 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Project Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-press-start text-xl text-white">{submission.project_name}</h3>
                                  {submission.track && (
                                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-jetbrains">
                                      {submission.track}
                                    </span>
                                  )}
                                </div>
                                {submission.tagline && (
                                  <p className="text-sm text-gray-400 font-jetbrains italic mb-2">"{submission.tagline}"</p>
                                )}
                                {submission.team ? (
                                  <p className="text-sm text-cyan-400 font-jetbrains">Team: {submission.team.team_name}</p>
                                ) : (
                                  <p className="text-sm text-gray-400 font-jetbrains">By: {submission.user_name}</p>
                                )}
                              </div>
                              {submission.score && (
                                <div className="text-right">
                                  <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-press-start">{submission.score}</div>
                                  <div className="text-xs text-gray-400 font-press-start">SCORE</div>
                                </div>
                              )}
                            </div>

                            <p className="text-gray-300 font-jetbrains mb-4 leading-relaxed">{submission.description}</p>

                            {submission.technologies_used && submission.technologies_used.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {submission.technologies_used.map((tech, i) => (
                                  <span key={i} className="text-xs bg-cyan-500/20 border border-cyan-500/50 px-2 py-1 text-cyan-300 font-jetbrains">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Links */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {submission.github_repo && (
                                <a href={submission.github_repo} target="_blank" rel="noopener noreferrer"
                                   className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 font-press-start text-xs flex items-center gap-2 border border-gray-700 transition-all">
                                  <Github className="h-4 w-4" />
                                  CODE
                                </a>
                              )}
                              {submission.demo_url && (
                                <a href={submission.demo_url} target="_blank" rel="noopener noreferrer"
                                   className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-4 py-2 font-press-start text-xs flex items-center gap-2 border border-red-500/50 transition-all">
                                  <ExternalLink className="h-4 w-4" />
                                  DEMO
                                </a>
                              )}
                              {submission.video_url && (
                                <a href={submission.video_url} target="_blank" rel="noopener noreferrer"
                                   className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 font-press-start text-xs flex items-center gap-2 border border-cyan-500/50 transition-all">
                                  <Video className="h-4 w-4" />
                                  VIDEO
                                </a>
                              )}
                            </div>

                            {submission.feedback && (
                              <div className="bg-black/50 border border-cyan-500/40 p-4 mb-4">
                                <p className="font-press-start text-xs text-cyan-400 mb-2">YOUR FEEDBACK:</p>
                                <p className="text-sm text-gray-300 font-jetbrains">{submission.feedback}</p>
                              </div>
                            )}

                            {submission.prize_won && (
                              <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 px-4 py-2">
                                <Trophy className="h-4 w-4 text-yellow-400" />
                                <span className="font-press-start text-sm text-yellow-400">{submission.prize_won}</span>
                              </div>
                            )}
                          </div>

                          {/* Score Button */}
                          <div className="lg:w-48 flex flex-col gap-2">
                            <button
                              onClick={() => handleScore(submission)}
                              disabled={!isJudgingOpen()}
                              className={`px-6 py-3 font-press-start text-sm transition-all flex items-center justify-center gap-2 ${
                                isJudgingOpen()
                                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500/50'
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                              }`}
                            >
                              <Star className="h-4 w-4" />
                              EDIT SCORE
                            </button>
                            {!isJudgingOpen() && (
                              <p className="text-xs text-gray-500 font-jetbrains text-center">Judging not open</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Score Modal */}
      {showScoreModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-black border-2 border-red-500/50 max-w-2xl w-full my-8">
              <div className="p-6 border-b border-red-500/40 bg-gradient-to-r from-red-900/30 to-orange-900/20">
                <h2 className="font-press-start text-xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">SCORE PROJECT</h2>
                <p className="font-jetbrains text-gray-400 text-sm mt-2">{selectedSubmission.project_name}</p>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Overall Score Display */}
                <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-red-500/40 p-4 text-center">
                  <p className="font-press-start text-xs text-gray-400 mb-1">OVERALL SCORE</p>
                  <p className="font-press-start text-3xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{calculateOverallScore()}</p>
                  <p className="font-jetbrains text-xs text-gray-500 mt-1">Average of all criteria</p>
                </div>

                {/* Scoring Criteria */}
                <div className="space-y-4">
                  <p className="font-press-start text-sm text-white">SCORING CRITERIA</p>
                  
                  {/* Innovation */}
                  <div className="bg-red-900/20 border border-red-500/30 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jetbrains text-sm text-gray-300">Innovation</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.innovation}
                        onChange={(e) => setScoreData({ ...scoreData, innovation: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 bg-black border border-red-500/50 text-white px-2 py-1 text-center font-jetbrains text-sm focus:border-orange-400 outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scoreData.innovation}
                      onChange={(e) => setScoreData({ ...scoreData, innovation: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  {/* Technical */}
                  <div className="bg-red-900/20 border border-red-500/30 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jetbrains text-sm text-gray-300">Technical Excellence</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.technical}
                        onChange={(e) => setScoreData({ ...scoreData, technical: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 bg-black border border-red-500/50 text-white px-2 py-1 text-center font-jetbrains text-sm focus:border-orange-400 outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scoreData.technical}
                      onChange={(e) => setScoreData({ ...scoreData, technical: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  {/* Design */}
                  <div className="bg-red-900/20 border border-red-500/30 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jetbrains text-sm text-gray-300">Design & UX</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.design}
                        onChange={(e) => setScoreData({ ...scoreData, design: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 bg-black border border-red-500/50 text-white px-2 py-1 text-center font-jetbrains text-sm focus:border-orange-400 outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scoreData.design}
                      onChange={(e) => setScoreData({ ...scoreData, design: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  {/* Presentation */}
                  <div className="bg-red-900/20 border border-red-500/30 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jetbrains text-sm text-gray-300">Presentation</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.presentation}
                        onChange={(e) => setScoreData({ ...scoreData, presentation: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 bg-black border border-red-500/50 text-white px-2 py-1 text-center font-jetbrains text-sm focus:border-orange-400 outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scoreData.presentation}
                      onChange={(e) => setScoreData({ ...scoreData, presentation: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  {/* Impact */}
                  <div className="bg-red-900/20 border border-red-500/30 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jetbrains text-sm text-gray-300">Impact & Usefulness</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.impact}
                        onChange={(e) => setScoreData({ ...scoreData, impact: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 bg-black border border-red-500/50 text-white px-2 py-1 text-center font-jetbrains text-sm focus:border-orange-400 outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scoreData.impact}
                      onChange={(e) => setScoreData({ ...scoreData, impact: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Feedback (Optional)</label>
                  <textarea
                    value={scoreData.feedback}
                    onChange={(e) => setScoreData({ ...scoreData, feedback: e.target.value })}
                    rows={3}
                    className="w-full bg-black border border-red-500/50 text-white px-4 py-3 font-jetbrains focus:border-orange-400 outline-none resize-none"
                    placeholder="Great project! The implementation is solid..."
                  />
                </div>
              </div>

              {/* Buttons - Fixed at bottom */}
              <div className="p-6 border-t border-red-500/40 flex gap-3">
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 font-press-start text-sm border border-gray-700 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSubmitScore}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-3 font-press-start text-sm border border-red-500/50 transition-all"
                >
                  SUBMIT SCORE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
