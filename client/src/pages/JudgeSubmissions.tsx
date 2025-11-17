import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Github, ExternalLink, Video, Star, MessageSquare, Award } from 'lucide-react';
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
  feedback?: string;
  prize_won?: string;
  team?: { team_name: string };
  user_name: string;
  submitted_at: string;
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
  const [scoreData, setScoreData] = useState({
    score: '',
    feedback: '',
    prize_won: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, [hackathonId]);

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
    setScoreData({
      score: submission.score?.toString() || '',
      feedback: submission.feedback || '',
      prize_won: submission.prize_won || ''
    });
    setShowScoreModal(true);
  };

  const handleSubmitScore = async () => {
    if (!selectedSubmission) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge/submissions/${selectedSubmission.id}/score`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          score: parseFloat(scoreData.score),
          feedback: scoreData.feedback,
          prize_won: scoreData.prize_won || null
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Score Submitted!",
          description: "Your evaluation has been saved",
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
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto animate-pulse space-y-8">
            <div className="h-4 w-24 bg-gray-800 rounded mb-4"></div>
            <div className="h-10 w-80 bg-gray-800 rounded mb-8"></div>

            {/* Tabs skeleton */}
            <div className="flex gap-2 mb-6">
              <div className="h-12 w-40 bg-gray-800 rounded"></div>
              <div className="h-12 w-40 bg-gray-800 rounded"></div>
            </div>

            {/* Submissions skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="h-6 w-64 bg-gray-800 rounded"></div>
                      <div className="h-4 w-full bg-gray-800 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-800 rounded"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 bg-gray-800 rounded"></div>
                        <div className="h-8 w-20 bg-gray-800 rounded"></div>
                      </div>
                    </div>
                    <div className="w-48">
                      <div className="h-12 w-full bg-gray-800 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const unscoredSubmissions = submissions.filter(s => !s.score);
  const scoredSubmissions = submissions.filter(s => s.score);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/judge-dashboard" className="text-maximally-yellow hover:text-maximally-red font-press-start text-sm mb-4 inline-block">
            ← BACK
          </Link>

          <h1 className="font-press-start text-3xl text-maximally-red mb-8">JUDGE_SUBMISSIONS</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('unscored')}
              className={`pixel-button px-6 py-3 font-press-start text-sm ${
                activeTab === 'unscored'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              UNSCORED ({unscoredSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('scored')}
              className={`pixel-button px-6 py-3 font-press-start text-sm ${
                activeTab === 'scored'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              SCORED ({scoredSubmissions.length})
            </button>
          </div>

          {/* Unscored Tab */}
          {activeTab === 'unscored' && (
            <>
              {unscoredSubmissions.length === 0 ? (
                <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="font-press-start text-gray-400">ALL_SUBMISSIONS_SCORED!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {unscoredSubmissions.map((submission) => (
                    <div key={submission.id} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-colors">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Project Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-press-start text-xl text-white mb-2">{submission.project_name}</h3>
                              {submission.tagline && (
                                <p className="text-sm text-gray-400 font-jetbrains italic mb-2">"{submission.tagline}"</p>
                              )}
                              {submission.team ? (
                                <p className="text-sm text-maximally-yellow font-jetbrains">Team: {submission.team.team_name}</p>
                              ) : (
                                <p className="text-sm text-gray-400 font-jetbrains">By: {submission.user_name}</p>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-300 font-jetbrains mb-4 leading-relaxed">{submission.description}</p>

                          {submission.technologies_used && submission.technologies_used.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {submission.technologies_used.map((tech, i) => (
                                <span key={i} className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 text-gray-400 font-jetbrains">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Links */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {submission.github_repo && (
                              <a href={submission.github_repo} target="_blank" rel="noopener noreferrer"
                                 className="pixel-button bg-gray-800 text-white px-4 py-2 font-press-start text-xs hover:bg-gray-700 flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                CODE
                              </a>
                            )}
                            {submission.demo_url && (
                              <a href={submission.demo_url} target="_blank" rel="noopener noreferrer"
                                 className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                DEMO
                              </a>
                            )}
                            {submission.video_url && (
                              <a href={submission.video_url} target="_blank" rel="noopener noreferrer"
                                 className="pixel-button bg-red-600 text-white px-4 py-2 font-press-start text-xs hover:bg-red-700 flex items-center gap-2">
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
                            className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors flex items-center justify-center gap-2"
                          >
                            <Star className="h-4 w-4" />
                            SCORE
                          </button>
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
                <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="font-press-start text-gray-400">NO_SCORED_SUBMISSIONS_YET</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {scoredSubmissions.map((submission) => (
                <div key={submission.id} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-colors">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-press-start text-xl text-white mb-2">{submission.project_name}</h3>
                          {submission.tagline && (
                            <p className="text-sm text-gray-400 font-jetbrains italic mb-2">"{submission.tagline}"</p>
                          )}
                          {submission.team ? (
                            <p className="text-sm text-maximally-yellow font-jetbrains">Team: {submission.team.team_name}</p>
                          ) : (
                            <p className="text-sm text-gray-400 font-jetbrains">By: {submission.user_name}</p>
                          )}
                        </div>
                        {submission.score && (
                          <div className="text-right">
                            <div className="text-3xl font-bold text-maximally-yellow font-press-start">{submission.score}</div>
                            <div className="text-xs text-gray-400 font-press-start">SCORE</div>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 font-jetbrains mb-4 leading-relaxed">{submission.description}</p>

                      {submission.technologies_used && submission.technologies_used.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {submission.technologies_used.map((tech, i) => (
                            <span key={i} className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 text-gray-400 font-jetbrains">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {submission.github_repo && (
                          <a href={submission.github_repo} target="_blank" rel="noopener noreferrer"
                             className="pixel-button bg-gray-800 text-white px-4 py-2 font-press-start text-xs hover:bg-gray-700 flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            CODE
                          </a>
                        )}
                        {submission.demo_url && (
                          <a href={submission.demo_url} target="_blank" rel="noopener noreferrer"
                             className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            DEMO
                          </a>
                        )}
                        {submission.video_url && (
                          <a href={submission.video_url} target="_blank" rel="noopener noreferrer"
                             className="pixel-button bg-red-600 text-white px-4 py-2 font-press-start text-xs hover:bg-red-700 flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            VIDEO
                          </a>
                        )}
                      </div>

                      {submission.feedback && (
                        <div className="pixel-card bg-black/50 border border-gray-700 p-4 mb-4">
                          <p className="font-press-start text-xs text-maximally-yellow mb-2">YOUR_FEEDBACK:</p>
                          <p className="text-sm text-gray-300 font-jetbrains">{submission.feedback}</p>
                        </div>
                      )}

                      {submission.prize_won && (
                        <div className="inline-flex items-center gap-2 bg-maximally-yellow/20 border border-maximally-yellow px-4 py-2">
                          <Trophy className="h-4 w-4 text-maximally-yellow" />
                          <span className="font-press-start text-sm text-maximally-yellow">{submission.prize_won}</span>
                        </div>
                      )}
                    </div>

                    {/* Score Button */}
                    <div className="lg:w-48 flex flex-col gap-2">
                      <button
                        onClick={() => handleScore(submission)}
                        className="pixel-button bg-cyan-600 text-white px-6 py-3 font-press-start text-sm hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Star className="h-4 w-4" />
                        EDIT_SCORE
                      </button>
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

      {/* Score Modal */}
      {showScoreModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="pixel-card bg-black border-4 border-maximally-red max-w-2xl w-full">
            <div className="p-6 border-b-2 border-maximally-red">
              <h2 className="font-press-start text-xl text-maximally-red">SCORE_PROJECT</h2>
              <p className="font-jetbrains text-gray-400 text-sm mt-2">{selectedSubmission.project_name}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Score */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">
                  Score (0-100) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={scoreData.score}
                  onChange={(e) => setScoreData({ ...scoreData, score: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  placeholder="85.5"
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Feedback</label>
                <textarea
                  value={scoreData.feedback}
                  onChange={(e) => setScoreData({ ...scoreData, feedback: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                  placeholder="Great project! The implementation is solid..."
                />
              </div>

              {/* Prize */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Prize Won (Optional)</label>
                <select
                  value={scoreData.prize_won}
                  onChange={(e) => setScoreData({ ...scoreData, prize_won: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                >
                  <option value="">No Prize</option>
                  <option value="1ST PLACE">1st Place</option>
                  <option value="2ND PLACE">2nd Place</option>
                  <option value="3RD PLACE">3rd Place</option>
                  <option value="BEST DESIGN">Best Design</option>
                  <option value="BEST INNOVATION">Best Innovation</option>
                  <option value="BEST TECHNICAL">Best Technical</option>
                  <option value="PEOPLE'S CHOICE">People's Choice</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="flex-1 pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-600"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSubmitScore}
                  disabled={!scoreData.score}
                  className="flex-1 pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black disabled:opacity-50"
                >
                  SUBMIT_SCORE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
