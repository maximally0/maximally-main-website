import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Trophy, Edit, Github, Linkedin, Twitter, Globe, Mail, Loader2, Download, ExternalLink, Award, Eye, Shield, Star, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Achievement, SelectHackathon } from '@shared/schema';
import { supabase, getProfileByUsername, getCurrentUserWithProfile, updateProfileMe, signOut } from '@/lib/supabaseClient';
import UsernameSettings from '@/components/UsernameSettings';
import PasswordSettings from '@/components/PasswordSettings';
import ExportDataButton from '@/components/ExportDataButton';

interface Certificate {
  id: string;
  certificate_id: string;
  participant_name: string;
  participant_email?: string;
  hackathon_name: string;
  type: string;
  position?: string;
  pdf_url?: string;
  jpg_url?: string;
  status: string;
  created_at: string;
  maximally_username: string;
}

interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'judging' | 'winning';
}

interface HackathonDetails {
  id: number;
  title: string;
  subtitle?: string;
  start_date: string;
  end_date: string;
  location?: string;
  cover_image?: string;
  slug: string;
}

interface UserCertificatesData {
  certificates: Certificate[];
  hackathons: HackathonDetails[];
  achievements: UserAchievement[];
}

interface HackathonWithDetails {
  id: number;
  userId: string;
  hackathonId: string;
  status: 'registered' | 'participated' | 'completed';
  placement: string | null;
  projectName: string | null;
  projectDescription: string | null;
  registeredAt: Date;
  hackathon: SelectHackathon;
}

type ProfileUI = {
  username: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  skills: string[];
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
  avatarUrl: string | null;
};

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const verificationUrl = `/certificates/verify/${certificate.certificate_id}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-800 hover:border-maximally-red transition-all duration-300 hover:shadow-lg hover:shadow-maximally-red/20">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-press-start text-sm text-maximally-red mb-2">
                {certificate.hackathon_name}
              </h3>
              <p className="text-gray-300 font-jetbrains">
                {certificate.type === 'judge' ? 'Judge Certificate' : 
                 certificate.position ? `${certificate.position} Certificate` : 'Participation Certificate'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {certificate.status === 'active' ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Revoked
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Issued: {formatDate(certificate.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award className="w-4 h-4" />
              <span>Certificate ID: {certificate.certificate_id}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-button bg-maximally-red text-white text-xs px-3 py-2 flex items-center gap-2 hover:bg-maximally-red/90 transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>VERIFY</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            {certificate.pdf_url && (
              <a
                href={certificate.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button bg-maximally-blue text-white text-xs px-3 py-2 flex items-center gap-2 hover:bg-maximally-blue/90 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            
            {certificate.jpg_url && (
              <a
                href={certificate.jpg_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button bg-maximally-yellow text-maximally-black text-xs px-3 py-2 flex items-center gap-2 hover:bg-maximally-yellow/90 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>VIEW</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function HackathonDetailsCard({ hackathon }: { hackathon: HackathonDetails }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-800 hover:border-maximally-red transition-all duration-300 hover:shadow-lg hover:shadow-maximally-red/20">
      <div className="flex gap-4">
        {hackathon.cover_image && (
          <img
            src={hackathon.cover_image}
            alt={hackathon.title}
            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-700"
          />
        )}
        <div className="flex-1">
          <h3 className="font-press-start text-sm text-maximally-red mb-2">{hackathon.title}</h3>
          {hackathon.subtitle && (
            <p className="text-gray-300 font-jetbrains text-sm mb-3 line-clamp-2">
              {hackathon.subtitle}
            </p>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}</span>
            </div>
            {hackathon.location && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{hackathon.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function AchievementCard({ achievement }: { achievement: UserAchievement }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-800 hover:border-maximally-yellow transition-all duration-300 hover:shadow-lg hover:shadow-maximally-yellow/20">
      <div className="flex items-center gap-4">
        <div className="text-4xl flex-shrink-0">
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-press-start text-sm text-maximally-yellow mb-2">
            {achievement.title}
          </h3>
          <p className="text-gray-300 font-jetbrains text-sm mb-2">
            {achievement.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>Earned: {formatDate(achievement.earnedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function HackathonCard({ userHackathon }: { userHackathon: HackathonWithDetails }) {
  const { hackathon, placement, projectName } = userHackathon;
  return (
    <Card className="p-6 bg-white dark:bg-black border-gray-200 dark:border-red-900/30 hover:border-red-500 dark:hover:border-red-500 transition-colors">
      <div className="flex gap-4">
        {hackathon.imageUrl && (
          <img
            src={hackathon.imageUrl}
            alt={hackathon.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white mb-2">{hackathon.name}</h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(hackathon.startDate, 'MMM dd, yyyy')} - {format(hackathon.endDate, 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {hackathon.location}
            </div>
            {placement && (
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-red-500">{placement}</span>
              </div>
            )}
            {projectName && (
              <div className="mt-2">
                <span className="text-gray-500 dark:text-gray-500">Project:</span>{' '}
                <span className="text-black dark:text-white">{projectName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function EditProfileDialog({ profile, onSave }: { profile: ProfileUI; onSave: (profile: Partial<ProfileUI>) => void }) {
  const [formData, setFormData] = useState<Partial<ProfileUI>>({ ...profile });
  const [open, setOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleSave = async () => {
    try {
      if (avatarFile) {
        const { uploadAvatar } = await import('@/lib/supabaseClient');
        const url = await uploadAvatar(avatarFile);
        formData.avatarUrl = url;
      }
      onSave(formData);
      setOpen(false);
      setAvatarFile(null);
    } catch (e) {
      console.error('Failed to upload avatar', e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="pixel-button bg-maximally-red hover:bg-maximally-red/90 text-white font-press-start text-xs px-4 py-3 transition-colors duration-300 flex items-center gap-2">
          <Edit className="w-3 h-3" />
          EDIT_PROFILE
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-black border-4 border-maximally-red max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-maximally-red/30 pb-4 mb-6">
          <DialogTitle className="text-maximally-red font-press-start text-lg flex items-center gap-2">
            <Edit className="w-5 h-5" />
            EDIT_PROFILE
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Personal Info Section */}
          <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-red/30 p-4">
            <h3 className="font-press-start text-sm text-maximally-red mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-maximally-red"></span>
              PERSONAL_INFO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-maximally-yellow font-press-start text-xs mb-2 block">FULL_NAME</Label>
                <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-red" placeholder="Enter your full name" />
              </div>
              <div>
                <Label htmlFor="location" className="text-maximally-blue font-press-start text-xs mb-2 block">LOCATION</Label>
                <Input id="location" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-blue" placeholder="Your location" />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="bio" className="text-maximally-green font-press-start text-xs mb-2 block">BIO</Label>
              <Textarea id="bio" value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-green" rows={3} placeholder="Tell us about yourself..." />
            </div>
            <div className="mt-4">
              <Label htmlFor="email" className="text-maximally-yellow font-press-start text-xs mb-2 block">EMAIL</Label>
              <Input id="email" type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-yellow" placeholder="your@email.com" />
            </div>
          </div>

          {/* Avatar Section */}
          <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-yellow/30 p-4">
            <h3 className="font-press-start text-sm text-maximally-yellow mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-maximally-yellow"></span>
              AVATAR_CONFIG
            </h3>
            <div>
              <Label htmlFor="avatar" className="text-maximally-yellow font-press-start text-xs mb-2 block">UPLOAD_AVATAR</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-yellow" />
              {profile.avatarUrl && (
                <div className="mt-3">
                  <Button type="button" onClick={async () => {
                    const { clearAvatar } = await import('@/lib/supabaseClient');
                    await clearAvatar();
                    setFormData({ ...formData, avatarUrl: null });
                  }} className="pixel-button bg-gray-800 hover:bg-maximally-red text-white font-press-start text-xs px-3 py-2 transition-colors">REMOVE_AVATAR</Button>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-blue/30 p-4">
            <h3 className="font-press-start text-sm text-maximally-blue mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-maximally-blue"></span>
              SOCIAL_LINKS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Github className="w-3 h-3" /> GITHUB
                </Label>
                <Input id="github" value={formData.github || ''} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-blue" placeholder="username" />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Linkedin className="w-3 h-3" /> LINKEDIN
                </Label>
                <Input id="linkedin" value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-blue" placeholder="username" />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Twitter className="w-3 h-3" /> TWITTER
                </Label>
                <Input id="twitter" value={formData.twitter || ''} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-blue" placeholder="username" />
              </div>
              <div>
                <Label htmlFor="website" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Globe className="w-3 h-3" /> WEBSITE
                </Label>
                <Input id="website" value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-blue" placeholder="https://yoursite.com" />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-green/30 p-4">
            <h3 className="font-press-start text-sm text-maximally-green mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-maximally-green"></span>
              SKILLS_CONFIG
            </h3>
            <div>
              <Label htmlFor="skills" className="text-maximally-green font-press-start text-xs mb-2 block">SKILLS (COMMA_SEPARATED)</Label>
              <Input 
                id="skills" 
                value={(formData.skills || []).join(', ')} 
                onChange={(e) => {
                  const value = e.target.value;
                  const skills = value.split(',').map(s => s.trim());
                  setFormData({ ...formData, skills });
                }} 
                className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-green" 
                placeholder="React, TypeScript, Python, Machine Learning, etc." 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-maximally-red/30">
            <Button onClick={() => setOpen(false)} className="bg-gray-800 hover:bg-gray-700 text-white font-press-start text-xs px-6 py-3 transition-colors border-2 border-gray-700 hover:border-gray-600">
              CANCEL
            </Button>
            <Button onClick={handleSave} className="bg-maximally-red hover:bg-maximally-red/90 text-white font-press-start text-xs px-6 py-3 transition-colors border-2 border-maximally-red">
              SAVE_CHANGES
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (!confirm('This will permanently delete your account. Continue?')) return;
    setLoading(true);
    try {
      const { deleteAccountRequest, signOut } = await import('@/lib/supabaseClient');
      await deleteAccountRequest();
      await signOut();
      window.location.href = '/';
    } catch (e: any) {
      alert(e?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };
  return <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white" disabled={loading}>{loading ? 'Deleting...' : 'Delete Account'}</Button>;
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const queryClient = useQueryClient();

  const { data: currentCtx } = useQuery({ queryKey: ['auth:me'], queryFn: getCurrentUserWithProfile });
  const { data: dbProfile, isLoading: profileLoading } = useQuery({ queryKey: ['profile', username], queryFn: () => getProfileByUsername(username!), enabled: !!username });
  
  // Fetch user certificates, hackathons, and achievements
  const { data: userCertificatesData, isLoading: certificatesLoading } = useQuery({
    queryKey: ['user-certificates', username],
    queryFn: async (): Promise<UserCertificatesData> => {
      const response = await fetch(`/api/user/${username}/certificates`);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch user certificates');
      }
      return result.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (profileLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>;
  if (!dbProfile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <Button asChild className="bg-red-500 hover:bg-red-600 text-white"><a href="/">Go Home</a></Button>
      </div>
    </div>
  );

  const userProfile: ProfileUI = {
    username: dbProfile.username ?? '',
    name: dbProfile.full_name ?? null,
    bio: dbProfile.bio ?? null,
    location: dbProfile.location ?? null,
    email: dbProfile.email ?? null,
    skills: dbProfile.skills ?? [],
    github: dbProfile.github_username ?? null,
    linkedin: dbProfile.linkedin_username ?? null,
    twitter: dbProfile.twitter_username ?? null,
    website: dbProfile.website_url ?? null,
    avatarUrl: dbProfile.avatar_url ?? null,
  };

  const isOwner = currentCtx?.user?.id === dbProfile.id;

  const handleSaveProfile = async (updatedProfile: Partial<ProfileUI>) => {
    // Map UI field names to database field names
    const dbFields = {
      full_name: updatedProfile.name,
      bio: updatedProfile.bio,
      location: updatedProfile.location,
      skills: updatedProfile.skills?.filter(skill => skill.trim() !== ''),
      github_username: updatedProfile.github,
      linkedin_username: updatedProfile.linkedin,
      twitter_username: updatedProfile.twitter,
      website_url: updatedProfile.website,
      avatar_url: updatedProfile.avatarUrl ?? null
    };
    
  // Saving profile (debug logging removed)
    await updateProfileMe(dbFields);
    await queryClient.invalidateQueries({ queryKey: ['profile', username] });
  };

  // Fetch hackathons & achievements here (same query logic as your current code)
  // For brevity, the query hooks and rendering of HackathonCards and achievements remain identical
  // with type-safe mapping and loaders.

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="fixed inset-0 bg-black" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Floating Pixels */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }}
        />
      ))}
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-br from-black via-red-950/10 to-black border-b-2 border-maximally-red/30 pt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="minecraft-block bg-maximally-red/20 border-4 border-maximally-red p-2 animate-[glow_2s_ease-in-out_infinite] hover:scale-105 transition-transform duration-300">
                {/* Corner decorations */}
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-maximally-yellow animate-pulse" />
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-maximally-yellow animate-pulse delay-200" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-maximally-yellow animate-pulse delay-400" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-maximally-yellow animate-pulse delay-600" />
                
                <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-maximally-yellow">
                  <AvatarImage src={userProfile.avatarUrl || ''} alt={userProfile.name || userProfile.username} />
                  <AvatarFallback className="bg-maximally-red text-white text-2xl lg:text-4xl font-press-start">
                    {(userProfile.name || userProfile.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              {/* Name and Status */}
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
                  <h1 className="font-press-start text-2xl lg:text-3xl text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:drop-shadow-[5px_5px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                    {userProfile.name || userProfile.username}
                  </h1>
                  {dbProfile.role === 'admin' && (
                    <div className="minecraft-block bg-maximally-yellow text-maximally-black px-3 py-2 text-xs font-press-start inline-flex items-center gap-2">
                      <Shield className="w-4 h-4 animate-pulse" />
                      <span>ADMIN</span>
                    </div>
                  )}
                </div>
                <p className="text-maximally-yellow font-press-start text-sm mb-4">@{userProfile.username}</p>
              </div>

              {/* Bio */}
              {userProfile.bio && (
                <div className="bg-gray-900/50 border-2 border-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-300 font-jetbrains text-sm leading-relaxed">
                    {userProfile.bio}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {isOwner && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <EditProfileDialog profile={userProfile} onSave={handleSaveProfile} />
                  <button
                    onClick={async () => { await signOut(); window.location.href = '/'; }}
                    className="pixel-button bg-maximally-yellow text-maximally-black hover:bg-maximally-yellow/90 font-press-start text-xs px-4 py-3 transition-colors duration-300"
                  >
                    LOGOUT
                  </button>
                </div>
              )}

              {/* Additional Info */}
              <div className="space-y-4">
                {userProfile.location && (
                  <div className="flex items-center gap-3">
                    <div className="minecraft-block bg-maximally-blue/20 border border-maximally-blue p-2">
                      <MapPin className="h-4 w-4 text-maximally-blue" />
                    </div>
                    <div>
                      <p className="font-press-start text-xs text-maximally-blue mb-1">LOCATION</p>
                      <p className="font-jetbrains text-sm text-gray-300">{userProfile.location}</p>
                    </div>
                  </div>
                )}
                {userProfile.email && (
                  <div className="flex items-center gap-3">
                    <div className="minecraft-block bg-maximally-yellow/20 border border-maximally-yellow p-2">
                      <Mail className="h-4 w-4 text-maximally-yellow" />
                    </div>
                    <div>
                      <p className="font-press-start text-xs text-maximally-yellow mb-1">EMAIL</p>
                      <p className="font-jetbrains text-sm text-gray-300 truncate">{userProfile.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(userProfile.github || userProfile.linkedin || userProfile.twitter || userProfile.website) && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {userProfile.github && (
                    <a
                      href={`https://github.com/${userProfile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pixel-button bg-gray-800 hover:bg-maximally-red text-white font-press-start text-xs px-2 py-1 flex items-center gap-1 transition-all duration-300 hover:scale-105"
                    >
                      <Github className="w-3 h-3" />
                      <span className="hidden sm:inline">GITHUB</span>
                    </a>
                  )}
                  {userProfile.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${userProfile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pixel-button bg-gray-800 hover:bg-maximally-blue text-white font-press-start text-xs px-2 py-1 flex items-center gap-1 transition-all duration-300 hover:scale-105"
                    >
                      <Linkedin className="w-3 h-3" />
                      <span className="hidden sm:inline">LINKEDIN</span>
                    </a>
                  )}
                  {userProfile.twitter && (
                    <a
                      href={`https://twitter.com/${userProfile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pixel-button bg-gray-800 hover:bg-maximally-yellow text-white hover:text-maximally-black font-press-start text-xs px-2 py-1 flex items-center gap-1 transition-all duration-300 hover:scale-105"
                    >
                      <Twitter className="w-3 h-3" />
                      <span className="hidden sm:inline">TWITTER</span>
                    </a>
                  )}
                  {userProfile.website && (
                    <a
                      href={userProfile.website.startsWith('http') ? userProfile.website : `https://${userProfile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pixel-button bg-gray-800 hover:bg-maximally-green text-white font-press-start text-xs px-2 py-1 flex items-center gap-1 transition-all duration-300 hover:scale-105"
                    >
                      <Globe className="w-3 h-3" />
                      <span className="hidden sm:inline">WEBSITE</span>
                    </a>
                  )}
                </div>
              )}

              {/* Skills */}
              {userProfile.skills && userProfile.skills.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4">
                    <h3 className="font-press-start text-xs text-maximally-red mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-maximally-red animate-pulse"></span>
                      SKILLS
                    </h3>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-800/50 border border-maximally-red/30 text-gray-300 px-3 py-1 text-xs font-jetbrains rounded-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs Section */}
      <section className="pt-24 pb-12 relative z-10 container mx-auto px-6">
        <Tabs defaultValue="overview" className="w-full">
          {/* Tabs Navigation */}
          <div className="mb-8">
            <TabsList className={`grid w-full ${isOwner ? 'grid-cols-5' : 'grid-cols-4'} bg-gray-900/50 border-4 border-maximally-red p-2 rounded-lg gap-2`}>
              <TabsTrigger 
                value="overview" 
                className="pixel-button bg-transparent hover:bg-maximally-red/20 text-gray-400 data-[state=active]:bg-maximally-red data-[state=active]:text-white font-press-start text-xs py-3 transition-all duration-300"
              >
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger 
                value="certificates" 
                className="pixel-button bg-transparent hover:bg-maximally-yellow/20 text-gray-400 data-[state=active]:bg-maximally-yellow data-[state=active]:text-maximally-black font-press-start text-xs py-3 transition-all duration-300"
              >
                CERTIFICATES
              </TabsTrigger>
              <TabsTrigger 
                value="hackathons" 
                className="pixel-button bg-transparent hover:bg-maximally-blue/20 text-gray-400 data-[state=active]:bg-maximally-blue data-[state=active]:text-white font-press-start text-xs py-3 transition-all duration-300"
              >
                HACKATHONS
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="pixel-button bg-transparent hover:bg-maximally-green/20 text-gray-400 data-[state=active]:bg-maximally-green data-[state=active]:text-white font-press-start text-xs py-3 transition-all duration-300"
              >
                ACHIEVEMENTS
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger 
                  value="settings" 
                  className="pixel-button bg-transparent hover:bg-purple-600/20 text-gray-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-press-start text-xs py-3 transition-all duration-300"
                >
                  SETTINGS
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Dashboard */}
            <div className="bg-gray-900/50 border-2 border-maximally-red/50 rounded-lg p-6">
              <h3 className="font-press-start text-sm text-maximally-red mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                STATS_OVERVIEW
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-maximally-red/10 border-2 border-maximally-red/30 rounded-lg p-4 text-center hover:border-maximally-red transition-colors">
                  <Award className="w-12 h-12 text-maximally-red mx-auto mb-3" />
                  <div className="font-press-start text-2xl text-maximally-red mb-1">
                    {certificatesLoading ? '...' : (userCertificatesData?.certificates?.length || 0)}
                  </div>
                  <div className="font-press-start text-xs text-maximally-red/80">CERTIFICATES</div>
                  <div className="font-jetbrains text-xs text-gray-400 mt-1">Total earned</div>
                </div>
                
                <div className="bg-maximally-blue/10 border-2 border-maximally-blue/30 rounded-lg p-4 text-center hover:border-maximally-blue transition-colors">
                  <Trophy className="w-12 h-12 text-maximally-blue mx-auto mb-3" />
                  <div className="font-press-start text-2xl text-maximally-blue mb-1">
                    {certificatesLoading ? '...' : (userCertificatesData?.hackathons?.length || 0)}
                  </div>
                  <div className="font-press-start text-xs text-maximally-blue/80">HACKATHONS</div>
                  <div className="font-jetbrains text-xs text-gray-400 mt-1">Participated</div>
                </div>
                
                <div className="bg-maximally-yellow/10 border-2 border-maximally-yellow/30 rounded-lg p-4 text-center hover:border-maximally-yellow transition-colors">
                  <Star className="w-12 h-12 text-maximally-yellow mx-auto mb-3" />
                  <div className="font-press-start text-2xl text-maximally-yellow mb-1">
                    {certificatesLoading ? '...' : (userCertificatesData?.achievements?.length || 0)}
                  </div>
                  <div className="font-press-start text-xs text-maximally-yellow/80">ACHIEVEMENTS</div>
                  <div className="font-jetbrains text-xs text-gray-400 mt-1">Unlocked</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {!certificatesLoading && userCertificatesData?.certificates && userCertificatesData.certificates.length > 0 && (
              <div className="bg-gray-900/50 border-2 border-maximally-blue/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-press-start text-sm text-maximally-blue flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    RECENT_CERTIFICATES
                  </h3>
                  {userCertificatesData.certificates.length > 3 && (
                    <button 
                      onClick={() => document.querySelector('[value="certificates"]')?.click()}
                      className="pixel-button bg-maximally-blue hover:bg-maximally-blue/90 text-white font-press-start text-xs px-3 py-2 transition-colors"
                    >
                      VIEW_ALL
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {userCertificatesData.certificates.slice(0, 3).map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            {certificatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-maximally-red" />
              </div>
            ) : userCertificatesData?.certificates && userCertificatesData.certificates.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-press-start text-lg text-maximally-red">
                    CERTIFICATES ({userCertificatesData.certificates.length})
                  </h3>
                </div>
                <div className="grid gap-6">
                  {userCertificatesData.certificates.map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="font-press-start text-sm text-gray-400 mb-2">NO CERTIFICATES YET</h3>
                <p className="text-gray-500 font-jetbrains">This user hasn't earned any certificates yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-6">
            {certificatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-maximally-red" />
              </div>
            ) : userCertificatesData?.hackathons && userCertificatesData.hackathons.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-press-start text-lg text-maximally-red">
                    HACKATHONS ({userCertificatesData.hackathons.length})
                  </h3>
                </div>
                <div className="grid gap-6">
                  {userCertificatesData.hackathons.map((hackathon) => (
                    <HackathonDetailsCard key={hackathon.id} hackathon={hackathon} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="font-press-start text-sm text-gray-400 mb-2">NO HACKATHONS YET</h3>
                <p className="text-gray-500 font-jetbrains">This user hasn't participated in any hackathons yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {certificatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-maximally-red" />
              </div>
            ) : userCertificatesData?.achievements && userCertificatesData.achievements.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-press-start text-lg text-maximally-yellow">
                    ACHIEVEMENTS ({userCertificatesData.achievements.length})
                  </h3>
                </div>
                <div className="grid gap-4">
                  {userCertificatesData.achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="font-press-start text-sm text-gray-400 mb-2">NO ACHIEVEMENTS YET</h3>
                <p className="text-gray-500 font-jetbrains">This user hasn't earned any achievements yet.</p>
              </div>
            )}
          </TabsContent>

          {isOwner && (
            <TabsContent value="settings" className="space-y-6">
              {/* Player Settings Menu */}
              <div className="minecraft-block bg-gray-900/90 border-4 border-purple-500/50 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-press-start text-sm text-purple-400 mb-6 flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 animate-pulse"></div>
                    USER_SETTINGS
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Username Section */}
                    <div className="minecraft-block bg-black/30 border-2 border-gray-700 p-4">
                      <h4 className="font-press-start text-xs text-maximally-yellow mb-3 flex items-center gap-2">
                        <Edit className="w-3 h-3" />
                        USERNAME_CONFIG
                      </h4>
                      <UsernameSettings />
                    </div>
                    
                    {/* Password Section */}
                    <div className="minecraft-block bg-black/30 border-2 border-gray-700 p-4">
                      <h4 className="font-press-start text-xs text-maximally-blue mb-3 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        SECURITY_SETTINGS
                      </h4>
                      <PasswordSettings />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Management */}
              <div className="minecraft-block bg-gray-900/90 border-4 border-maximally-green/50 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-maximally-green/5 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-press-start text-sm text-maximally-green mb-6 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    ACCOUNT_MANAGEMENT
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="minecraft-block bg-black/30 border-2 border-gray-700 p-4">
                      <h4 className="font-press-start text-xs text-maximally-yellow mb-3 flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        PROFILE_VISIBILITY
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-jetbrains text-gray-300 text-sm mb-1">Your profile is currently public</p>
                          <p className="font-jetbrains text-gray-500 text-xs">Visible to all users on the platform</p>
                        </div>
                        <div className="minecraft-block bg-green-500/20 border border-green-500/50 px-3 py-1">
                          <span className="font-press-start text-xs text-green-400">PUBLIC</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="minecraft-block bg-black/30 border-2 border-gray-700 p-4">
                      <h4 className="font-press-start text-xs text-maximally-blue mb-3 flex items-center gap-2">
                        <Download className="w-3 h-3" />
                        DATA_EXPORT
                      </h4>
                      <p className="font-jetbrains text-gray-300 text-sm mb-4">Download a complete backup of your Maximally data</p>
                      <ExportDataButton />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="minecraft-block bg-red-900/30 border-4 border-maximally-red p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-maximally-red/10 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-press-start text-sm text-maximally-red mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    DANGER_ZONE
                  </h3>
                  <div className="minecraft-block bg-black/50 border-2 border-maximally-red/50 p-4">
                    <h4 className="font-press-start text-xs text-red-300 mb-3">ACCOUNT_DELETION</h4>
                    <p className="font-jetbrains text-gray-400 text-sm mb-4">
                      ⚠️ WARNING: This action cannot be undone. All your data, certificates, and achievements will be permanently deleted.
                    </p>
                    <DeleteAccountButton />
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </section>
    </div>
  );
}
