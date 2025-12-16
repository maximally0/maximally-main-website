import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, Github, ExternalLink, Video, Star, MessageSquare, 
  Award, Search, Filter, ArrowLeft, CheckCircle, Clock, Users 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

interface JudgingCriterion {
  id: string;
  criterion_name: string;
  criterion_description: string;
  max_score: number;
  weight: number;
  display_order: number;
}

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
  team?: { team_name: string };
  user: { username: string; full_name: string; avatar_url?: string };
  submitted_at: string;
  my_ratings: any[];
  my_average_score?: number;
  has_rated: boolean;
}

export default function JudgeHackathonInterface() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [hackathon, setHackathon] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [criteria, setCriteria] = useState<JudgingCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'rated' | 'unrated'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState<Record<string, { score: string; notes: string }>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [hackathonId, user]);

  const fetchData = async () => {
    try {
      const headers = await getAuthHeaders();
      
      // Fetch hackathon details
      const hackathonRes = await fetch(`/api/hackathons/by-id/${hackathonId}`, { headers });
      const hackathonData = await hackathonRes.json();
      if (hackathonData.success) {
        setHackathon(hackathonData.data);
      }

      // Fetch submissions
      const submissionsRes = await fetch(`/api/judge/hackathons/${hackathonId}/submissions`, { headers });
      const submissionsData = await submissionsRes.json();
      if (submissionsData.success) {
        setSubmissions(submissionsData.data);
      }

      // Fetch judging criteria
      const criteriaRes = await fetch(`/api/hackathons/${hackathonId}/judging-criteria`, { headers });
      const criteriaData = await criteriaRes.json();
      if (criteriaData.success) {
        setCriteria(criteriaData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load judging interface",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRateSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    // Initialize ratings from existing data
    const initialRatings: Record<string, { score: string; notes: string }> = {};
    criteria.forEach(criterion => {
      const existingRating = submission.my_ratings.find((r: any) => r.criterion_id === criterion.id);
      initialRatings[criterion.id] = {
        score: existingRating?.score?.toString() || '',
        notes: existingRating?.notes || ''
      };
    });
    setRatings(initialRatings);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedSubmission) return;

    // Validate all scores are filled
    const allScoresFilled = criteria.every(criterion => {
      const score = parseFloat(ratings[criterion.id]?.score || '0');
      return !isNaN(score) && score >= 0 && score <= criterion.max_score;
    });

    if (!allScoresFilled) {
      toast({
        title: "Incomplete Rating",
        description: "Please provide scores for all criteria",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const headers = await getAuthHeaders();
      const ratingsArray = criteria.map(criterion => ({
        criterion_id: criterion.id,
        score: parseFloat(ratings[criterion.id].score),
        notes: ratings[criterion.id].notes || null
      }));

      const response = await fetch(`/api/judge/submissions/${selectedSubmission.id}/rate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ratings: ratingsArray })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Rating Submitted!",
          description: "Your evaluation has been saved successfully",
        });
        setShowRatingModal(false);
        fetchData(); // Refresh data
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'rated' && submission.has_rated) ||
                         (filterStatus === 'unrated' && !submission.has_rated);
    
    return matchesSearch && matchesFilter;
  });

  const ratedCount = submissions.filter(s => s.has_rated).length;
  const totalCount = submissions.length;
  const progress = totalCount > 0 ? Math.round((ratedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Judge ${hackathon?.hackathon_name || 'Hackathon'} | Maximally`}
        description="Judge hackathon submissions and provide feedback"
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <Link 
              to="/judge-dashboard" 
              className="text-maximally-yellow hover:text-maximally-red font-press-start text-sm mb-4 inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK_TO_DASHBOARD
            </Link>

            <div className="mb-8">
              <h1 className="font-press-start text-3xl text-maximally-red mb-2">
                {hackathon?.hackathon_name || 'HACKATHON'}
              </h1>
              <p className="font-jetbrains text-gray-400">
                Judge submissions and provide detailed feedback
              </p>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="pixel-card bg-gray-900 border-2 border-cyan-400 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-cyan-400" />
                  <span className="font-press-start text-xs text-gray-400">SUBMISSIONS</span>
                </div>
                <div className="font-press-start text-2xl text-white">{totalCount}</div>
              </div>

              <div className="pixel-card bg-gray-900 border-2 border-green-400 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="font-press-start text-xs text-gray-400">RATED</span>
                </div>
                <div className="font-press-start text-2xl text-white">{ratedCount}</div>
              </div>

              <div className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-maximally-yellow" />
                  <span className="font-press-start text-xs text-gray-400">PENDING</span>
                </div>
                <div className="font-press-start text-2xl text-white">{totalCount - ratedCount}</div>
              </div>

              <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-maximally-red" />
                  <span className="font-press-start text-xs text-gray-400">PROGRESS</span>
                </div>
                <div className="font-press-start text-2xl text-white">{progress}%</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white pl-12 pr-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                />
              </div>

              <div className="flex gap-2">
                {['all', 'rated', 'unrated'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterStatus(filter as any)}
                    className={`pixel-button px-4 py-3 font-press-start text-xs ${
                      filterStatus === filter
                        ? 'bg-maximally-yellow text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
                <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="font-press-start text-gray-400">
                  {searchTerm || filterStatus !== 'all' ? 'NO_MATCHING_SUBMISSIONS' : 'NO_SUBMISSIONS_YET'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSubmissions.map((submission) => (
                  <div 
                    key={submission.id} 
                    className={`pixel-card bg-gray-900 border-2 p-6 transition-colors ${
                      submission.has_rated 
                        ? 'border-green-600 hover:border-green-400' 
                        : 'border-gray-800 hover:border-maximally-yellow'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Project Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-press-start text-xl text-white">
                                {submission.project_name}
                              </h3>
                              {submission.has_rated && (
                                <span className="inline-flex items-center gap-1 bg-green-600/20 border border-green-600 px-2 py-1">
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                  <span className="font-press-start text-xs text-green-400">RATED</span>
                                </span>
                              )}
                            </div>
                            {submission.tagline && (
                              <p className="text-sm text-gray-400 font-jetbrains italic mb-2">
                                "{submission.tagline}"
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-400 font-jetbrains">
                              {submission.team ? (
                                <>
                                  <Users className="h-4 w-4" />
                                  <span>Team: {submission.team.team_name}</span>
                                </>
                              ) : (
                                <>
                                  <span>By: {submission.user.full_name || submission.user.username}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {submission.my_average_score !== null && submission.my_average_score !== undefined && (
                            <div className="text-right">
                              <div className="text-3xl font-bold text-maximally-yellow font-press-start">
                                {submission.my_average_score.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-400 font-press-start">YOUR_SCORE</div>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-300 font-jetbrains mb-4 leading-relaxed">
                          {submission.description}
                        </p>

                        {submission.technologies_used && submission.technologies_used.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {submission.technologies_used.map((tech, i) => (
                              <span 
                                key={i} 
                                className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 text-gray-400 font-jetbrains"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-wrap gap-2">
                          {submission.github_repo && (
                            <a 
                              href={submission.github_repo} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="pixel-button bg-gray-800 text-white px-4 py-2 font-press-start text-xs hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Github className="h-4 w-4" />
                              CODE
                            </a>
                          )}
                          {submission.demo_url && (
                            <a 
                              href={submission.demo_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              DEMO
                            </a>
                          )}
                          {submission.video_url && (
                            <a 
                              href={submission.video_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="pixel-button bg-red-600 text-white px-4 py-2 font-press-start text-xs hover:bg-red-700 flex items-center gap-2"
                            >
                              <Video className="h-4 w-4" />
                              VIDEO
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Rate Button */}
                      <div className="lg:w-48 flex flex-col gap-2">
                        <button
                          onClick={() => handleRateSubmission(submission)}
                          className={`pixel-button px-6 py-3 font-press-start text-sm flex items-center justify-center gap-2 ${
                            submission.has_rated
                              ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                              : 'bg-maximally-red text-white hover:bg-maximally-yellow hover:text-black'
                          }`}
                        >
                          <Star className="h-4 w-4" />
                          {submission.has_rated ? 'EDIT_RATING' : 'RATE_NOW'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="pixel-card bg-black border-4 border-maximally-red max-w-4xl w-full my-8">
            <div className="p-6 border-b-2 border-maximally-red">
              <h2 className="font-press-start text-xl text-maximally-red mb-2">RATE_PROJECT</h2>
              <p className="font-jetbrains text-gray-400 text-sm">{selectedSubmission.project_name}</p>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="pixel-card bg-gray-900 border border-gray-700 p-4">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-press-start text-sm text-cyan-400">
                        {criterion.criterion_name}
                      </label>
                      <span className="font-jetbrains text-xs text-gray-500">
                        Max: {criterion.max_score} pts (Weight: {criterion.weight}x)
                      </span>
                    </div>
                    {criterion.criterion_description && (
                      <p className="font-jetbrains text-xs text-gray-400 mb-2">
                        {criterion.criterion_description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-jetbrains text-xs text-gray-400 mb-1 block">
                        Score (0-{criterion.max_score}) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={criterion.max_score}
                        step="0.5"
                        value={ratings[criterion.id]?.score || ''}
                        onChange={(e) => setRatings({
                          ...ratings,
                          [criterion.id]: { ...ratings[criterion.id], score: e.target.value }
                        })}
                        className="w-full bg-gray-800 border-2 border-gray-600 text-white px-3 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
                        placeholder="8.5"
                      />
                    </div>

                    <div>
                      <label className="font-jetbrains text-xs text-gray-400 mb-1 block">
                        Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={ratings[criterion.id]?.notes || ''}
                        onChange={(e) => setRatings({
                          ...ratings,
                          [criterion.id]: { ...ratings[criterion.id], notes: e.target.value }
                        })}
                        className="w-full bg-gray-800 border-2 border-gray-600 text-white px-3 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
                        placeholder="Great implementation..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="p-6 border-t-2 border-gray-800 flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                disabled={submitting}
                className="flex-1 pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-600 disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submitting}
                className="flex-1 pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black disabled:opacity-50"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT_RATING'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
