import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ExternalLink, 
  Github, 
  Video, 
  Calendar, 
  Users, 
  Trophy,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SubmissionComments from '@/components/SubmissionComments';
import SubmissionMilestones from '@/components/SubmissionMilestones';

interface Submission {
  id: number;
  project_name: string;
  slug: string;
  description: string;
  tagline: string;
  github_repo: string;
  demo_url: string;
  video_url: string;
  cover_image: string;
  project_logo: string;
  technologies_used: string[];
  status: string;
  submitted_at: string;
  score: number;
  prize_won: string;
  hackathon: {
    id: number;
    hackathon_name: string;
    slug: string;
    hackathon_logo: string;
  };
  team: {
    team_name: string;
    team_code: string;
    project_name: string;
  } | null;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export default function SubmissionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmission();
  }, [slug]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/submissions/slug/${slug}`);
      const data = await response.json();

      if (data.success) {
        setSubmission(data.data);
      } else {
        setError(data.message || 'Submission not found');
      }
    } catch (err) {
      setError('Failed to load submission');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !submission) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Upload to API
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/submissions/${submission.id}/upload-logo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileData: base64Data,
            fileName: file.name,
            fileType: file.type
          })
        });

        const data = await response.json();

        if (data.success) {
          // Refresh submission data
          fetchSubmission();
        } else {
          setUploadError(data.message);
        }
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError('Failed to upload logo');
      setUploading(false);
    }
  };

  const getProjectName = () => {
    if (submission?.project_name) return submission.project_name;
    if (submission?.team?.project_name) return submission.team.project_name;
    return 'Untitled Project';
  };

  const getProjectLogo = () => {
    if (submission?.project_logo) return submission.project_logo;
    // Placeholder logo
    return 'https://placehold.co/400x400/6366f1/white?text=' + encodeURIComponent(getProjectName().substring(0, 2).toUpperCase());
  };

  const isOwner = user && submission && user.id === submission.user.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">{error || 'Submission not found'}</p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-primary/5">
        {submission.cover_image && (
          <img 
            src={submission.cover_image} 
            alt="Cover" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  {/* Project Logo */}
                  <div className="relative group">
                    <img 
                      src={getProjectLogo()} 
                      alt={getProjectName()}
                      className="w-24 h-24 rounded-lg object-cover border-2 border-border"
                    />
                    {isOwner && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/svg+xml"
                          onChange={handleLogoUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                        {uploading ? (
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        ) : (
                          <Upload className="h-6 w-6 text-white" />
                        )}
                      </label>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{getProjectName()}</h1>
                        {submission.tagline && (
                          <p className="text-lg text-muted-foreground mb-3">{submission.tagline}</p>
                        )}
                      </div>
                      <Badge variant={submission.status === 'winner' ? 'default' : 'secondary'}>
                        {submission.status}
                      </Badge>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {submission.github_repo && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={submission.github_repo} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {submission.demo_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {submission.video_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={submission.video_url} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Video
                          </a>
                        </Button>
                      )}
                    </div>

                    {uploadError && (
                      <p className="text-sm text-destructive mt-2">{uploadError}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{submission.description}</p>
              </CardContent>
            </Card>

            {/* Technologies */}
            {submission.technologies_used && submission.technologies_used.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {submission.technologies_used.map((tech, index) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionMilestones 
                  submissionId={submission.id} 
                  canEdit={isOwner}
                />
              </CardContent>
            </Card>

            {/* Comments & Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback & Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionComments 
                  submissionId={submission.id}
                  userRole={user?.role}
                />
              </CardContent>
            </Card>

            {/* Prize */}
            {submission.prize_won && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Winner</p>
                      <p className="text-lg">{submission.prize_won}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hackathon Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hackathon</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/hackathons/${submission.hackathon.slug}`}>
                  <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                    {submission.hackathon.hackathon_logo && (
                      <img 
                        src={submission.hackathon.hackathon_logo} 
                        alt={submission.hackathon.hackathon_name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{submission.hackathon.hackathon_name}</p>
                      <p className="text-sm text-muted-foreground">View Hackathon →</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Team Info */}
            {submission.team && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{submission.team.team_name}</p>
                  <p className="text-sm text-muted-foreground">Code: {submission.team.team_code}</p>
                </CardContent>
              </Card>
            )}

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/profile/${submission.user.username}`}>
                  <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                    <Avatar>
                      <AvatarImage src={submission.user.avatar_url} />
                      <AvatarFallback>
                        {submission.user.full_name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{submission.user.full_name}</p>
                      <p className="text-sm text-muted-foreground">@{submission.user.username}</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Submission Date */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted {new Date(submission.submitted_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Score */}
            {submission.score && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Score</p>
                    <p className="text-3xl font-bold text-primary">{submission.score}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
