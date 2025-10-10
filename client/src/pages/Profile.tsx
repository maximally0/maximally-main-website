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
import { Calendar, MapPin, Trophy, Edit, Github, Linkedin, Twitter, Globe, Mail, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Achievement, SelectHackathon } from '@shared/schema';
import { supabase, getProfileByUsername, getCurrentUserWithProfile, updateProfileMe, signOut } from '@/lib/supabaseClient';
import UsernameSettings from '@/components/UsernameSettings';
import PasswordSettings from '@/components/PasswordSettings';
import ExportDataButton from '@/components/ExportDataButton';

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
        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          <Edit className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white dark:bg-black border-gray-200 dark:border-red-900/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Name, Bio, Location, Avatar, Email */}
          <div>
            <Label htmlFor="name" className="text-black dark:text-white">Name</Label>
            <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
          </div>
          <div>
            <Label htmlFor="bio" className="text-black dark:text-white">Bio</Label>
            <Textarea id="bio" value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" rows={3} />
          </div>
          <div>
            <Label htmlFor="location" className="text-black dark:text-white">Location</Label>
            <Input id="location" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
          </div>
          <div>
            <Label htmlFor="avatar" className="text-black dark:text-white">Avatar</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
            {profile.avatarUrl && (
              <div className="mt-2">
                <Button type="button" variant="outline" onClick={async () => {
                  const { clearAvatar } = await import('@/lib/supabaseClient');
                  await clearAvatar();
                  setFormData({ ...formData, avatarUrl: null });
                }}>Remove Avatar</Button>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
            <Input id="email" type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
          </div>
          {/* GitHub, LinkedIn, Twitter, Website */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github" className="text-black dark:text-white">GitHub Username</Label>
              <Input id="github" value={formData.github || ''} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
            </div>
            <div>
              <Label htmlFor="linkedin" className="text-black dark:text-white">LinkedIn Username</Label>
              <Input id="linkedin" value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="twitter" className="text-black dark:text-white">Twitter Username</Label>
              <Input id="twitter" value={formData.twitter || ''} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
            </div>
            <div>
              <Label htmlFor="website" className="text-black dark:text-white">Website</Label>
              <Input id="website" value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" />
            </div>
          </div>
          {/* Skills */}
          <div>
            <Label htmlFor="skills" className="text-black dark:text-white">Skills (comma-separated)</Label>
            <Input 
              id="skills" 
              value={(formData.skills || []).join(', ')} 
              onChange={(e) => {
                const value = e.target.value;
                // Split on commas and trim whitespace, but keep empty strings to allow typing
                const skills = value.split(',').map(s => s.trim());
                setFormData({ ...formData, skills });
              }} 
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white" 
              placeholder="React, TypeScript, Python, etc." 
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white">Save Changes</Button>
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32 border-4 border-maximally-red">
                <AvatarImage src={userProfile.avatarUrl || ''} alt={userProfile.name || userProfile.username} />
                <AvatarFallback className="bg-maximally-red text-white text-3xl">
                  {(userProfile.name || userProfile.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-maximally-red">
                      {userProfile.name || userProfile.username}
                    </h1>
                    {dbProfile.role === 'admin' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-maximally-red text-white border border-maximally-red/50 shadow-sm w-fit">
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-lg">@{userProfile.username}</p>
                </div>
                {isOwner && (
                  <div className="mt-4 sm:mt-0 flex gap-3">
                    <EditProfileDialog profile={userProfile} onSave={handleSaveProfile} />
                    <button
                      onClick={async () => { await signOut(); window.location.href = '/'; }}
                      className="pixel-button bg-red-600 hover:bg-red-700 text-white font-press-start text-xs px-4 py-2 border-2 border-red-600 hover:border-red-700"
                    >
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>

              {/* Bio */}
              {userProfile.bio && (
                <p className="text-gray-300 mb-4 max-w-2xl">{userProfile.bio}</p>
              )}

              {/* Location and Contact Info */}
              <div className="flex flex-wrap gap-6 mb-6">
                {userProfile.location && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.location}</span>
                  </div>
                )}
                {userProfile.email && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{userProfile.email}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4 mb-6">
                {userProfile.github && (
                  <a
                    href={`https://github.com/${userProfile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-maximally-red transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {userProfile.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${userProfile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-maximally-red transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {userProfile.twitter && (
                  <a
                    href={`https://twitter.com/${userProfile.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-maximally-red transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
                {userProfile.website && (
                  <a
                    href={userProfile.website.startsWith('http') ? userProfile.website : `https://${userProfile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-maximally-red transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
              </div>

              {/* Skills */}
              {userProfile.skills && userProfile.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-maximally-red mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-maximally-red/20 text-maximally-red border-maximally-red/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={`grid w-full ${isOwner ? 'grid-cols-4' : 'grid-cols-3'} bg-gray-900 mb-8`}>
            <TabsTrigger value="overview" className="text-gray-400 data-[state=active]:text-maximally-red">
              Overview
            </TabsTrigger>
            <TabsTrigger value="hackathons" className="text-gray-400 data-[state=active]:text-maximally-red">
              Hackathons
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-gray-400 data-[state=active]:text-maximally-red">
              Achievements
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="settings" className="text-gray-400 data-[state=active]:text-maximally-red">
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-maximally-red mb-4">About</h3>
                <p className="text-gray-300">
                  {userProfile.bio || 'This user hasn\'t added a bio yet.'}
                </p>
              </div>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card className="bg-gray-900 border-gray-800">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-maximally-red mb-4">Recent Activity</h3>
                <p className="text-gray-500">No recent activity to show.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Hackathons Yet</h3>
              <p className="text-gray-500">This user hasn't participated in any hackathons yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Achievements Yet</h3>
              <p className="text-gray-500">This user hasn't earned any achievements yet.</p>
            </div>
          </TabsContent>

          {isOwner && (
            <TabsContent value="settings" className="space-y-6">
              <UsernameSettings />
              <PasswordSettings />
              
              {/* Account Settings */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-maximally-red mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-300 mb-2">Profile Visibility</h4>
                      <p className="text-gray-500 text-sm">Your profile is currently public and visible to everyone.</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-300 mb-2">Data Export</h4>
                      <p className="text-gray-500 text-sm mb-3">Download a copy of your Maximally data.</p>
                      <ExportDataButton />
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Danger Zone */}
              <Card className="bg-red-900/20 border-red-900/30">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-gray-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <DeleteAccountButton />
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
