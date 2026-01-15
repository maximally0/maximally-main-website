import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Trophy, Edit, Github, Linkedin, Twitter, Globe, Mail, Download, ExternalLink, Award, Shield, Star, AlertCircle, FolderOpen, Code, Eye } from 'lucide-react';
import PixelLoader from '@/components/PixelLoader';
import { format } from 'date-fns';
import type { Achievement, SelectHackathon } from '@shared/schema';
import { supabase, getProfileByUsername, getCurrentUserWithProfile, updateProfileMe, signOut } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import UsernameSettings from '@/components/UsernameSettings';
import PasswordSettings from '@/components/PasswordSettings';
import ExportDataButton from '@/components/ExportDataButton';
import ReportUserDialog from '@/components/ReportUserDialog';
import { useToast } from '@/hooks/use-toast';
import { Flag } from 'lucide-react';

interface Certificate {
  id: string;
  certificate_id: string;
  participant_name: string;
  participant_email: string;
  hackathon_name: string;
  type: string;
  position?: string;
  pdf_url?: string;
  jpg_url?: string;
  status: string;
  created_at: string;
  maximally_username?: string;
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
  hackathon_logo?: string;
  slug: string;
}

interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'judging' | 'winning';
}

interface UserCertificatesData {
  certificates: Certificate[];
  hackathons: HackathonDetails[];
  achievements: UserAchievement[];
}

interface UserProject {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  demo_url?: string;
  github_url?: string;
  category?: string;
  status: string;
  source: 'gallery' | 'hackathon';
  hackathon_name?: string;
  created_at: string;
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
    <Card className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 sm:mb-2 break-words">
                {certificate.hackathon_name}
              </h3>
              <p className="text-gray-300 font-jetbrains text-[10px] sm:text-xs md:text-sm">
                {certificate.type === 'judge' ? 'Judge Certificate' : 
                 certificate.position ? `${certificate.position} Certificate` : 'Participation Certificate'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {certificate.status === 'active' ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[8px] sm:text-xs">
                  <Shield className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[8px] sm:text-xs">
                  Revoked
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-400">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-purple-400" />
              <span className="truncate">Issued: {formatDate(certificate.created_at)}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-400">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-pink-400" />
              <span className="truncate">ID: {certificate.certificate_id}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 hover:bg-purple-500/30 transition-colors"
            >
              <Shield className="w-2 h-2 sm:w-3 sm:h-3" />
              <span>VERIFY</span>
              <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
            </a>
            
            {certificate.pdf_url && (
              <a
                href={certificate.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 hover:bg-pink-500/30 transition-colors"
              >
                <Download className="w-2 h-2 sm:w-3 sm:h-3" />
                <span>PDF</span>
                <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
              </a>
            )}
            
            {certificate.jpg_url && (
              <a
                href={certificate.jpg_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 hover:bg-purple-500/30 transition-colors"
              >
                <Eye className="w-2 h-2 sm:w-3 sm:h-3" />
                <span>VIEW</span>
                <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
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
    <Card className="p-6 bg-gradient-to-br from-pink-900/20 to-purple-900/30 border border-purple-500/30 hover:border-pink-400/60 transition-all duration-300">
      <div className="flex gap-4">
        {hackathon.hackathon_logo && (
          <img
            src={hackathon.hackathon_logo}
            alt={hackathon.title}
            className="w-20 h-20 object-cover border border-pink-500/30"
          />
        )}
        <div className="flex-1">
          <h3 className="font-press-start text-sm bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">{hackathon.title}</h3>
          {hackathon.subtitle && (
            <p className="text-gray-300 font-jetbrains text-sm mb-3 line-clamp-2">
              {hackathon.subtitle}
            </p>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}</span>
            </div>
            {hackathon.location && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-pink-400" />
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
    <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="text-4xl flex-shrink-0">
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-press-start text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {achievement.title}
          </h3>
          <p className="text-gray-300 font-jetbrains text-sm mb-2">
            {achievement.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3 text-pink-400" />
            <span>Earned: {formatDate(achievement.earnedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProjectCard({ project }: { project: UserProject }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Extract numeric ID and source from project.id (e.g., "gallery_3" -> id: "3", source: "gallery")
  const [source, numericId] = project.id.split('_');
  const projectUrl = `/project/${source}/${numericId}`;

  return (
    <Link to={projectUrl} className="block">
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 hover:border-pink-400/60 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
        <div className="flex gap-4">
          {project.logo_url && (
            <img
              src={project.logo_url}
              alt={project.name}
              className="w-16 h-16 object-cover border border-pink-500/30 flex-shrink-0"
            />
          )}
          {!project.logo_url && (
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
              <Code className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-press-start text-xs sm:text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent break-words">
                {project.name}
              </h3>
              <Badge className={`text-[8px] sm:text-xs flex-shrink-0 ${
                project.source === 'hackathon' 
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' 
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}>
                {project.source === 'hackathon' ? 'HACKATHON' : 'GALLERY'}
              </Badge>
            </div>
            {project.description && (
              <p className="text-gray-300 font-jetbrains text-xs sm:text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
            )}
            {project.hackathon_name && (
              <p className="text-pink-400 font-jetbrains text-xs mb-2">
                📍 {project.hackathon_name}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.category && (
                <span className="bg-gray-800/50 border border-pink-500/30 text-gray-300 px-2 py-0.5 text-[10px] font-jetbrains">
                  {project.category}
                </span>
              )}
              <span className="text-gray-500 text-[10px] font-jetbrains flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(project.created_at)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] px-2 py-1 flex items-center gap-1 hover:bg-pink-500/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-3 h-3" />
                  DEMO
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] px-2 py-1 flex items-center gap-1 hover:bg-purple-500/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-3 h-3" />
                  CODE
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
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
        <button className="bg-purple-500/20 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-press-start text-[10px] sm:text-xs px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 transition-all duration-300 flex items-center gap-1 sm:gap-2">
          <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="hidden sm:inline">EDIT PROFILE</span>
          <span className="sm:hidden">EDIT</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-gray-900 border border-purple-500/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-purple-500/30 pb-4 mb-6">
          <DialogTitle className="text-purple-400 font-press-start text-lg flex items-center gap-2">
            <Edit className="w-5 h-5" />
            EDIT PROFILE
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Personal Info Section */}
          <div className="bg-black/30 border border-purple-500/30 p-4">
            <h3 className="font-press-start text-sm text-purple-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400"></span>
              PERSONAL INFO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-pink-300 font-press-start text-xs mb-2 block">FULL NAME</Label>
                <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-black/50 border border-purple-500/30 text-white font-jetbrains focus:border-purple-400" placeholder="Enter your full name" />
              </div>
              <div>
                <Label htmlFor="location" className="text-cyan-300 font-press-start text-xs mb-2 block">LOCATION</Label>
                <Input id="location" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-black/50 border border-cyan-500/30 text-white font-jetbrains focus:border-cyan-400" placeholder="Your location" />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="bio" className="text-green-300 font-press-start text-xs mb-2 block">BIO</Label>
              <Textarea id="bio" value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="bg-black/50 border border-green-500/30 text-white font-jetbrains focus:border-green-400" rows={3} placeholder="Tell us about yourself..." />
            </div>
            <div className="mt-4">
              <Label htmlFor="email" className="text-amber-300 font-press-start text-xs mb-2 block">EMAIL</Label>
              <Input id="email" type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-black/50 border border-amber-500/30 text-white font-jetbrains focus:border-amber-400" placeholder="your@email.com" />
            </div>
          </div>

          {/* Avatar Section */}
          <div className="bg-black/30 border border-amber-500/30 p-4">
            <h3 className="font-press-start text-sm text-amber-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400"></span>
              AVATAR CONFIG
            </h3>
            <div>
              <Label htmlFor="avatar" className="text-amber-300 font-press-start text-xs mb-2 block">UPLOAD AVATAR</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="bg-black/50 border border-amber-500/30 text-white font-jetbrains focus:border-amber-400" />
              {profile.avatarUrl && (
                <div className="mt-3">
                  <Button type="button" onClick={async () => {
                    const { clearAvatar } = await import('@/lib/supabaseClient');
                    await clearAvatar();
                    setFormData({ ...formData, avatarUrl: null });
                  }} className="bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-300 font-press-start text-xs px-3 py-2 transition-colors">REMOVE AVATAR</Button>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="bg-black/30 border border-cyan-500/30 p-4">
            <h3 className="font-press-start text-sm text-cyan-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400"></span>
              SOCIAL LINKS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Github className="w-3 h-3" /> GITHUB
                </Label>
                <Input id="github" value={formData.github || ''} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="bg-black/50 border border-cyan-500/30 text-white font-jetbrains focus:border-cyan-400" placeholder="username" />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Linkedin className="w-3 h-3" /> LINKEDIN
                </Label>
                <Input id="linkedin" value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="bg-black/50 border border-cyan-500/30 text-white font-jetbrains focus:border-cyan-400" placeholder="username" />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Twitter className="w-3 h-3" /> TWITTER
                </Label>
                <Input id="twitter" value={formData.twitter || ''} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className="bg-black/50 border border-cyan-500/30 text-white font-jetbrains focus:border-cyan-400" placeholder="username" />
              </div>
              <div>
                <Label htmlFor="website" className="text-gray-300 font-press-start text-xs mb-2 block flex items-center gap-2">
                  <Globe className="w-3 h-3" /> WEBSITE
                </Label>
                <Input id="website" value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="bg-black/50 border border-cyan-500/30 text-white font-jetbrains focus:border-cyan-400" placeholder="https://yoursite.com" />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-black/30 border border-green-500/30 p-4">
            <h3 className="font-press-start text-sm text-green-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400"></span>
              SKILLS CONFIG
            </h3>
            <div>
              <Label htmlFor="skills" className="text-green-300 font-press-start text-xs mb-2 block">SKILLS (COMMA SEPARATED)</Label>
              <Input 
                id="skills" 
                value={(formData.skills || []).join(', ')} 
                onChange={(e) => {
                  const value = e.target.value;
                  const skills = value.split(',').map(s => s.trim());
                  setFormData({ ...formData, skills });
                }} 
                className="bg-black/50 border border-green-500/30 text-white font-jetbrains focus:border-green-400" 
                placeholder="React, TypeScript, Python, Machine Learning, etc." 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-purple-500/30">
            <Button onClick={() => setOpen(false)} className="bg-gray-800 hover:bg-gray-700 text-white font-press-start text-xs px-6 py-3 transition-colors border border-gray-700 hover:border-gray-600">
              CANCEL
            </Button>
            <Button onClick={handleSave} className="bg-purple-500/20 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-press-start text-xs px-6 py-3 transition-all">
              SAVE CHANGES
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { toast } = useToast();
  
  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: "Confirmation Required",
        description: 'You must type "DELETE" exactly to confirm account deletion.',
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { deleteAccountRequest } = await import('@/lib/supabaseClient');
      const result = await deleteAccountRequest();
      
      toast({
        title: "Account Deleted",
        description: result.message || 'Your account has been permanently deleted.',
      });
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (e: any) {
      toast({
        title: "Deletion Failed",
        description: e?.message || 'Failed to delete account. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setConfirmText('');
    }
  };
  
  return (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white font-press-start text-xs px-4 py-3 border-2 border-red-500 hover:border-red-400 transition-colors"
        >
          DELETE_ACCOUNT
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-4 border-red-600">
        <DialogHeader>
          <DialogTitle className="text-red-500 font-press-start text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            CONFIRM ACCOUNT DELETION
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-red-900/20 border-2 border-red-500/50 p-4 rounded">
            <p className="text-red-400 font-jetbrains text-sm mb-3">
              ⚠️ This action cannot be undone. This will permanently delete:
            </p>
            <ul className="text-gray-300 font-jetbrains text-sm space-y-1 ml-4">
              <li>• Your profile information</li>
              <li>• Your certificates and achievements</li>
              <li>• Your avatar and files</li>
              <li>• All associated data</li>
            </ul>
          </div>
          
          <div>
            <Label htmlFor="confirm" className="text-gray-300 font-press-start text-xs mb-2 block">
              Type "DELETE" to confirm:
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-red-500"
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleDelete}
              disabled={loading || confirmText !== 'DELETE'}
              className="bg-red-600 hover:bg-red-700 text-white font-press-start text-xs flex-1"
            >
              {loading ? 'DELETING...' : 'CONFIRM DELETE'}
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                setConfirmText('');
              }}
              variant="outline"
              className="font-press-start text-xs"
              disabled={loading}
            >
              CANCEL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const queryClient = useQueryClient();
  const { user: authUser, profile: authProfile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const { data: currentCtx } = useQuery({ queryKey: ['auth:me'], queryFn: getCurrentUserWithProfile });
  const { data: dbProfile, isLoading: profileLoading, error: profileError } = useQuery({ 
    queryKey: ['profile', username], 
    queryFn: async () => {
      
      const result = await getProfileByUsername(username!);
      
      return result;
    }, 
    enabled: !!username,
    retry: false,
    staleTime: 0 // Disable caching for debugging
  });
  
  
  
  // Fetch user certificates, hackathons, and achievements
  const { data: userCertificatesData, isLoading: certificatesLoading } = useQuery({
    queryKey: ['user-certificates', username],
    queryFn: async (): Promise<UserCertificatesData> => {
      if (!supabase || !username) {
        throw new Error('Database connection not available');
      }

      // Get certificates for the user
      const { data: certificates, error: certError } = await supabase
        .from('certificates')
        .select('*')
        .eq('maximally_username', username)
        .order('created_at', { ascending: false });

      if (certError) {
        console.error('Error fetching certificates:', certError);
        throw new Error('Failed to fetch certificates');
      }

      const typedCertificates = (certificates || []) as Certificate[];

      // Get hackathons from certificates (old system)
      const hackathonNames = Array.from(new Set(typedCertificates.map(cert => cert.hackathon_name)));
      
      // Get hackathon details from the old hackathons table
      const hackathonDetails: HackathonDetails[] = [];
      if (hackathonNames.length > 0) {
        for (const hackathonName of hackathonNames) {
          const { data: hackathon } = await supabase
            .from('hackathons')
            .select('*')
            .eq('title', hackathonName)
            .single();
          
          if (hackathon) {
            hackathonDetails.push(hackathon as any);
          }
        }
      }

      // ALSO get hackathons from registrations (new system)
      // First get the user ID from the username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (profileData && (profileData as any).id) {
        const { data: registrations } = await supabase
          .from('hackathon_registrations')
          .select(`
            hackathon_id,
            organizer_hackathons (
              id,
              hackathon_name,
              slug,
              start_date,
              end_date,
              hackathon_logo
            )
          `)
          .eq('user_id', (profileData as any).id);

        if (registrations) {
          for (const reg of registrations) {
            if ((reg as any).organizer_hackathons) {
              const h = (reg as any).organizer_hackathons as any;
              hackathonDetails.push({
                id: h.id,
                title: h.hackathon_name,
                start_date: h.start_date,
                end_date: h.end_date,
                slug: h.slug,
                hackathon_logo: h.hackathon_logo
              });
            }
          }
        }
      }

      // Process achievements based on certificates
      const achievements: UserAchievement[] = [];
      if (typedCertificates) {
        for (const cert of typedCertificates) {
          // Add judging achievements
          if (cert.type === 'judge') {
            achievements.push({
              id: `judge_${cert.id}`,
              title: `Judge - ${cert.hackathon_name}`,
              description: `Successfully judged ${cert.hackathon_name}`,
              icon: '⚖️',
              earnedAt: cert.created_at,
              type: 'judging'
            });
          }
          
          // Add winning achievements (if position is specified and not just "Participant")
          if (cert.position && cert.position.toLowerCase() !== 'participant' && cert.type !== 'judge') {
            achievements.push({
              id: `winner_${cert.id}`,
              title: `${cert.position} - ${cert.hackathon_name}`,
              description: `Achieved ${cert.position} position in ${cert.hackathon_name}`,
              icon: cert.position.toLowerCase().includes('1st') || cert.position.toLowerCase().includes('first') || cert.position.toLowerCase().includes('winner') ? '🏆' : 
                    cert.position.toLowerCase().includes('2nd') || cert.position.toLowerCase().includes('second') ? '🥈' :
                    cert.position.toLowerCase().includes('3rd') || cert.position.toLowerCase().includes('third') ? '🥉' : '🏅',
              earnedAt: cert.created_at,
              type: 'winning'
            });
          }
        }
      }

      return {
        certificates: typedCertificates,
        hackathons: hackathonDetails,
        achievements: achievements
      };
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch judge information if user is a judge
  const { data: judgeData } = useQuery({
    queryKey: ['judge-info', username],
    queryFn: async () => {
      if (!username || dbProfile?.role !== 'judge') return null;
      
      try {
        const response = await fetch(`/api/judges/${username}`);
        if (!response.ok) return null;
        
        return response.json();
      } catch {
        return null;
      }
    },
    enabled: !!username && dbProfile?.role === 'judge'
  });

  // Fetch user projects (gallery projects + hackathon submissions)
  const { data: userProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['user-projects', username],
    queryFn: async (): Promise<UserProject[]> => {
      if (!supabase || !username) {
        throw new Error('Database connection not available');
      }

      const projects: UserProject[] = [];

      // Get user ID from username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profileData || !(profileData as any).id) return projects;

      const userId = (profileData as any).id;

      // Fetch gallery projects
      const { data: galleryProjects } = await supabase
        .from('gallery_projects')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['approved', 'featured', 'pending'])
        .order('created_at', { ascending: false });

      if (galleryProjects) {
        for (const gp of galleryProjects as any[]) {
          projects.push({
            id: `gallery_${gp.id}`,
            name: gp.name,
            description: gp.description,
            logo_url: gp.logo_url,
            demo_url: gp.demo_url,
            github_url: gp.github_url,
            category: gp.category,
            status: gp.status,
            source: 'gallery',
            created_at: gp.created_at
          });
        }
      }

      // Fetch hackathon submissions
      const { data: hackathonSubmissions } = await supabase
        .from('hackathon_submissions')
        .select(`
          *,
          organizer_hackathons (
            hackathon_name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (hackathonSubmissions) {
        for (const hs of hackathonSubmissions as any[]) {
          // Skip if already in gallery (to avoid duplicates)
          const isInGallery = (galleryProjects as any[])?.some(gp => gp.hackathon_submission_id === hs.id);
          if (isInGallery) continue;

          projects.push({
            id: `hackathon_${hs.id}`,
            name: hs.project_name,
            description: hs.project_description,
            logo_url: hs.project_logo,
            demo_url: hs.demo_url,
            github_url: hs.github_url,
            status: hs.status,
            source: 'hackathon',
            hackathon_name: (hs as any).organizer_hackathons?.hackathon_name,
            created_at: hs.created_at
          });
        }
      }

      return projects;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });

  if (profileLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><PixelLoader size="lg" /></div>;
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

  // Check ownership using multiple sources for reliability
  // 1. Try from query data (getCurrentUserWithProfile)
  // 2. Fallback to AuthContext user (faster, already loaded)
  // 3. Fallback to AuthContext profile username match
  const isOwner = currentCtx?.user?.id === dbProfile.id || 
                  authUser?.id === dbProfile.id || 
                  (authProfile?.username && authProfile.username === dbProfile.username);

  const handleSaveProfile = async (updatedProfile: Partial<ProfileUI>) => {
    try {
      
      
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
      
      
      
      const result = await updateProfileMe(dbFields);
      
      
      // Invalidate queries to refetch data
      await queryClient.invalidateQueries({ queryKey: ['profile', username] });
      await queryClient.invalidateQueries({ queryKey: ['auth:me'] });
      
      // Refresh the profile in AuthContext
      
      await refreshProfile();
      
      // Show success feedback
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      
      toast({
        title: "Update Failed",
        description: error.message || 'Failed to update profile. Please try again.',
        variant: "destructive",
      });
    }
  };

  // Fetch hackathons & achievements here (same query logic as your current code)
  // For brevity, the query hooks and rendering of HackathonCards and achievements remain identical
  // with type-safe mapping and loaders.

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
      
      <div className="fixed top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="fixed top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-br from-black via-purple-950/20 to-black border-b border-pink-500/30 pt-16 sm:pt-20 lg:pt-24">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8 lg:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-pink-500/50 p-2 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-pink-500/20">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 border-2 sm:border-3 lg:border-4 border-pink-400/60">
                  <AvatarImage src={userProfile.avatarUrl || ''} alt={userProfile.name || userProfile.username} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm sm:text-lg md:text-2xl lg:text-4xl font-press-start">
                    {(userProfile.name || userProfile.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6">
              {/* Name and Status */}
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <h1 className="font-press-start text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent transition-all duration-300 break-words leading-tight">
                    {userProfile.name || userProfile.username}
                  </h1>
                  {dbProfile.role === 'admin' && (
                    <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-2 text-xs font-press-start inline-flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>ADMIN</span>
                    </div>
                  )}
                  {(dbProfile.role as string) === 'organizer' && (
                    <div className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 px-3 py-2 text-xs font-press-start inline-flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>ORGANIZER</span>
                    </div>
                  )}
                </div>
                <p className="text-pink-400 font-press-start text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 break-all">@{userProfile.username}</p>
              </div>

              {/* Bio */}
              {userProfile.bio && (
                <div className="bg-gray-900/50 border border-gray-700/50 sm:border-2 rounded-lg p-2 sm:p-3 md:p-4">
                  <p className="text-gray-300 font-jetbrains text-[11px] sm:text-xs md:text-sm leading-relaxed break-words">
                    {userProfile.bio}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {isOwner && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-3">
                  <EditProfileDialog profile={userProfile} onSave={handleSaveProfile} />
                  {(dbProfile.role as string) === 'organizer' && (
                    <a
                      href={`/organizer/${userProfile.username}`}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-press-start text-[10px] sm:text-xs px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 transition-all duration-300 flex items-center gap-2 border border-purple-400/50"
                    >
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                      VIEW_ORGANIZER_PROFILE
                    </a>
                  )}
                  <button
                    onClick={async () => {
                      try {
                        
                        await signOut();
                        
                        // Force a hard refresh to clear all state
                        window.location.href = '/';
                      } catch (error: any) {
                        
                        toast({
                          title: "Logout Failed",
                          description: "Failed to logout. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="bg-gray-800 hover:bg-pink-600/30 text-pink-300 hover:text-white font-press-start text-[10px] sm:text-xs px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 transition-all duration-300 border border-pink-500/40 hover:border-pink-400"
                  >
                    LOGOUT
                  </button>
                </div>
              )}

              {/* Report Button for non-owners */}
              {!isOwner && authUser && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  <ReportUserDialog 
                    reportedUserId={dbProfile.id} 
                    reportedUsername={userProfile.username}
                    trigger={
                      <button className="bg-gray-800 hover:bg-red-600/50 text-gray-400 hover:text-white font-press-start text-[10px] sm:text-xs px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 transition-all duration-300 flex items-center gap-2 border border-gray-700 hover:border-red-500/50">
                        <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>REPORT</span>
                      </button>
                    }
                  />
                </div>
              )}

              {/* Additional Info */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {userProfile.location && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-purple-500/20 border border-purple-500/50 p-1 sm:p-1.5 md:p-2 flex-shrink-0">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-press-start text-[8px] sm:text-[10px] md:text-xs text-purple-400 mb-0.5 sm:mb-1">LOCATION</p>
                      <p className="font-jetbrains text-[10px] sm:text-xs md:text-sm text-gray-300 truncate">{userProfile.location}</p>
                    </div>
                  </div>
                )}
                {userProfile.email && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-pink-500/20 border border-pink-500/50 p-1 sm:p-1.5 md:p-2 flex-shrink-0">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-pink-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-press-start text-[8px] sm:text-[10px] md:text-xs text-pink-400 mb-0.5 sm:mb-1">EMAIL</p>
                      <p className="font-jetbrains text-[10px] sm:text-xs md:text-sm text-gray-300 truncate">{userProfile.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(userProfile.github || userProfile.linkedin || userProfile.twitter || userProfile.website) && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-1 sm:gap-1.5 md:gap-2">
                  {userProfile.github && (
                    <a
                      href={`https://github.com/${userProfile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-purple-600/50 text-gray-300 hover:text-white font-press-start text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-1 flex items-center gap-0.5 sm:gap-1 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-purple-500/50"
                    >
                      <Github className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">GITHUB</span>
                    </a>
                  )}
                  {userProfile.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${userProfile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-pink-600/50 text-gray-300 hover:text-white font-press-start text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-1 flex items-center gap-0.5 sm:gap-1 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-pink-500/50"
                    >
                      <Linkedin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">LINKEDIN</span>
                    </a>
                  )}
                  {userProfile.twitter && (
                    <a
                      href={`https://twitter.com/${userProfile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-purple-600/50 text-gray-300 hover:text-white font-press-start text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-1 flex items-center gap-0.5 sm:gap-1 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-purple-500/50"
                    >
                      <Twitter className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">TWITTER</span>
                    </a>
                  )}
                  {userProfile.website && (
                    <a
                      href={userProfile.website.startsWith('http') ? userProfile.website : `https://${userProfile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-pink-600/50 text-gray-300 hover:text-white font-press-start text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-1 flex items-center gap-0.5 sm:gap-1 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-pink-500/50"
                    >
                      <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">WEBSITE</span>
                    </a>
                  )}
                </div>
              )}

              {/* Skills */}
              {userProfile.skills && userProfile.skills.length > 0 && (
                <div className="mt-3 sm:mt-4 md:mt-6">
                  <div className="mb-2 sm:mb-3 md:mb-4">
                    <h3 className="font-press-start text-[8px] sm:text-[10px] md:text-xs text-pink-400 mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-pink-400 animate-pulse"></span>
                      SKILLS
                    </h3>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-1 sm:gap-1.5 md:gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-900/30 border border-pink-500/30 text-gray-300 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] md:text-xs font-jetbrains break-words hover:border-pink-400/50 transition-colors"
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
      <section className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 relative z-10 container mx-auto px-3 sm:px-4 lg:px-6">
        <Tabs defaultValue="overview" className="w-full">
          {/* Tabs Navigation */}
          <div className="mb-6 sm:mb-8">
            <TabsList className={`flex w-full ${isOwner ? 'flex-wrap lg:flex-nowrap' : ''} bg-transparent p-0 gap-0`}>
              <TabsTrigger 
                value="overview" 
                className="relative bg-transparent text-gray-500 hover:text-pink-400 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent font-press-start text-[10px] sm:text-xs px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500"
              >
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger 
                value="certificates" 
                className="relative bg-transparent text-gray-500 hover:text-pink-400 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent font-press-start text-[10px] sm:text-xs px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500"
              >
                CERTIFICATES
              </TabsTrigger>
              <TabsTrigger 
                value="hackathons" 
                className="relative bg-transparent text-gray-500 hover:text-pink-400 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent font-press-start text-[10px] sm:text-xs px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500"
              >
                HACKATHONS
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="relative bg-transparent text-gray-500 hover:text-pink-400 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent font-press-start text-[10px] sm:text-xs px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500"
              >
                ACHIEVEMENTS
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="relative bg-transparent text-gray-500 hover:text-pink-400 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent font-press-start text-[10px] sm:text-xs px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500"
              >
                PROJECTS
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger 
                  value="settings" 
                  className="relative bg-transparent text-gray-500 hover:text-pink-400 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent font-press-start text-[10px] sm:text-xs px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500"
                >
                  SETTINGS
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Dashboard */}
            <div className="bg-black/60 border border-pink-500/40 p-6">
              <h3 className="font-press-start text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-pink-400" />
                STATS_OVERVIEW
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-6 text-center hover:border-pink-400 hover:scale-105 transition-all duration-300 group">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-pink-500/30">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-press-start text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {certificatesLoading ? '...' : (userCertificatesData?.certificates?.length || 0)}
                  </div>
                  <div className="font-press-start text-xs text-pink-400 mb-1">CERTIFICATES</div>
                  <div className="font-jetbrains text-xs text-gray-400">Total earned</div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/20 border border-pink-500/40 p-6 text-center hover:border-purple-400 hover:scale-105 transition-all duration-300 group">
                  <div className="bg-gradient-to-br from-pink-600 to-purple-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/30">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-press-start text-3xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {certificatesLoading ? '...' : (userCertificatesData?.hackathons?.length || 0)}
                  </div>
                  <div className="font-press-start text-xs text-purple-400 mb-1">HACKATHONS</div>
                  <div className="font-jetbrains text-xs text-gray-400">Participated</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-6 text-center hover:border-pink-400 hover:scale-105 transition-all duration-300 group">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-pink-500/30">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-press-start text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {certificatesLoading ? '...' : (userCertificatesData?.achievements?.length || 0)}
                  </div>
                  <div className="font-press-start text-xs text-pink-400 mb-1">ACHIEVEMENTS</div>
                  <div className="font-jetbrains text-xs text-gray-400">Unlocked</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {!certificatesLoading && userCertificatesData?.certificates && userCertificatesData.certificates.length > 0 && (
              <div className="bg-black/60 border border-pink-500/40 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-press-start text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-400" />
                    RECENT_CERTIFICATES
                  </h3>
                  {userCertificatesData.certificates.length > 3 && (
                    <button 
                      onClick={() => (document.querySelector('[value="certificates"]') as HTMLElement)?.click()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-xs px-3 py-2 transition-all border border-pink-400/50"
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
                <PixelLoader size="md" />
              </div>
            ) : userCertificatesData?.certificates && userCertificatesData.certificates.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-press-start text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
              <div className="text-center py-12 bg-black/40 border border-pink-500/30 p-8">
                <Award className="w-16 h-16 text-pink-500/50 mx-auto mb-4" />
                <h3 className="font-press-start text-sm text-gray-400 mb-2">NO CERTIFICATES YET</h3>
                <p className="text-gray-500 font-jetbrains">This user hasn't earned any certificates yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-6">
            {certificatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <PixelLoader size="md" />
              </div>
            ) : userCertificatesData?.hackathons && userCertificatesData.hackathons.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-press-start text-lg bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
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
              <div className="text-center py-12 bg-black/40 border border-purple-500/30 p-8">
                <Trophy className="w-16 h-16 text-purple-500/50 mx-auto mb-4" />
                <h3 className="font-press-start text-sm text-gray-400 mb-2">NO HACKATHONS YET</h3>
                <p className="text-gray-500 font-jetbrains">This user hasn't participated in any hackathons yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {certificatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <PixelLoader size="md" />
              </div>
            ) : userCertificatesData?.achievements && userCertificatesData.achievements.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-press-start text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
              <div className="text-center py-12 bg-black/40 border border-pink-500/30 p-8">
                <Star className="w-16 h-16 text-pink-500/50 mx-auto mb-4" />
                <h3 className="font-press-start text-sm text-gray-400 mb-2">NO ACHIEVEMENTS YET</h3>
                <p className="text-gray-500 font-jetbrains">This user hasn't earned any achievements yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <PixelLoader size="md" />
              </div>
            ) : userProjects && userProjects.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-press-start text-lg bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    PROJECTS ({userProjects.length})
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {userProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-black/40 border border-purple-500/30 p-8">
                <FolderOpen className="w-16 h-16 text-purple-500/50 mx-auto mb-4" />
                <h3 className="font-press-start text-sm text-gray-400 mb-2">NO PROJECTS YET</h3>
                <p className="text-gray-500 font-jetbrains">This user hasn't submitted any projects yet.</p>
              </div>
            )}
          </TabsContent>

          {isOwner && (
            <TabsContent value="settings" className="space-y-6">
              {/* Player Settings Menu */}
              <div className="bg-black/60 border border-pink-500/40 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
                <div className="relative z-10">
                  <h3 className="font-press-start text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
                    USER_SETTINGS
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Username Section */}
                    <div className="bg-black/40 border border-purple-500/30 p-4">
                      <h4 className="font-press-start text-xs text-purple-400 mb-3 flex items-center gap-2">
                        <Edit className="w-3 h-3" />
                        USERNAME_CONFIG
                      </h4>
                      <UsernameSettings />
                    </div>
                    
                    {/* Password Section */}
                    <div className="bg-black/40 border border-pink-500/30 p-4">
                      <h4 className="font-press-start text-xs text-pink-400 mb-3 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        SECURITY_SETTINGS
                      </h4>
                      <PasswordSettings />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Management */}
              <div className="bg-black/60 border border-purple-500/40 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
                <div className="relative z-10">
                  <h3 className="font-press-start text-sm bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-pink-400" />
                    ACCOUNT_MANAGEMENT
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-black/40 border border-purple-500/30 p-4">
                      <h4 className="font-press-start text-xs text-purple-400 mb-3 flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        PROFILE_VISIBILITY
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-jetbrains text-gray-300 text-sm mb-1">Your profile is currently public</p>
                          <p className="font-jetbrains text-gray-500 text-xs">Visible to all users on the platform</p>
                        </div>
                        <div className="bg-green-500/20 border border-green-500/50 px-3 py-1">
                          <span className="font-press-start text-xs text-green-400">PUBLIC</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 border border-pink-500/30 p-4">
                      <h4 className="font-press-start text-xs text-pink-400 mb-3 flex items-center gap-2">
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
              <div className="bg-red-900/20 border border-red-500/50 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-press-start text-sm text-red-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    DANGER_ZONE
                  </h3>
                  <div className="bg-black/50 border border-red-500/40 p-4">
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
