import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import type { User, Achievement, SelectHackathon } from '@shared/schema';

interface HackathonWithDetails {
  id: number;
  userId: number;
  hackathonId: string;
  status: 'registered' | 'participated' | 'completed';
  placement: string | null;
  projectName: string | null;
  projectDescription: string | null;
  registeredAt: Date;
  hackathon: SelectHackathon;
}

function HackathonCard({ userHackathon }: { userHackathon: HackathonWithDetails }) {
  const { hackathon, placement, projectName } = userHackathon;
  
  return (
    <Card 
      className="p-6 bg-white dark:bg-black border-gray-200 dark:border-red-900/30 hover:border-red-500 dark:hover:border-red-500 transition-colors"
      data-testid={`hackathon-card-${userHackathon.id}`}
    >
      <div className="flex gap-4">
        {hackathon.imageUrl && (
          <img 
            src={hackathon.imageUrl} 
            alt={hackathon.name}
            className="w-24 h-24 object-cover rounded-lg"
            data-testid={`hackathon-image-${userHackathon.id}`}
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white mb-2" data-testid={`hackathon-name-${userHackathon.id}`}>
            {hackathon.name}
          </h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2" data-testid={`hackathon-date-${userHackathon.id}`}>
              <Calendar className="w-4 h-4" />
              {format(hackathon.startDate, 'MMM dd, yyyy')} - {format(hackathon.endDate, 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-2" data-testid={`hackathon-location-${userHackathon.id}`}>
              <MapPin className="w-4 h-4" />
              {hackathon.location}
            </div>
            {placement && (
              <div className="flex items-center gap-2" data-testid={`hackathon-placement-${userHackathon.id}`}>
                <Trophy className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-red-500">{placement}</span>
              </div>
            )}
            {projectName && (
              <div className="mt-2">
                <span className="text-gray-500 dark:text-gray-500">Project:</span>{' '}
                <span className="text-black dark:text-white" data-testid={`hackathon-project-${userHackathon.id}`}>
                  {projectName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function EditProfileDialog({ profile, onSave }: { profile: User; onSave: (profile: Partial<User>) => void }) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: profile.name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    email: profile.email || '',
    skills: profile.skills || [],
    github: profile.github || '',
    linkedin: profile.linkedin || '',
    twitter: profile.twitter || '',
    website: profile.website || '',
  });
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          data-testid="button-edit-profile"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white dark:bg-black border-gray-200 dark:border-red-900/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className="text-black dark:text-white">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
              data-testid="input-name"
            />
          </div>
          <div>
            <Label htmlFor="bio" className="text-black dark:text-white">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
              rows={3}
              data-testid="input-bio"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-black dark:text-white">Location</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
              data-testid="input-location"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
              data-testid="input-email"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github" className="text-black dark:text-white">GitHub Username</Label>
              <Input
                id="github"
                value={formData.github || ''}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
                data-testid="input-github"
              />
            </div>
            <div>
              <Label htmlFor="linkedin" className="text-black dark:text-white">LinkedIn Username</Label>
              <Input
                id="linkedin"
                value={formData.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
                data-testid="input-linkedin"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="twitter" className="text-black dark:text-white">Twitter Username</Label>
              <Input
                id="twitter"
                value={formData.twitter || ''}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
                data-testid="input-twitter"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-black dark:text-white">Website</Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
                data-testid="input-website"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="skills" className="text-black dark:text-white">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={(formData.skills || []).join(', ')}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
              placeholder="React, TypeScript, Python, etc."
              data-testid="input-skills"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white"
              data-testid="button-save"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Profile() {
  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery<User>({
    queryKey: ['/api/profile'],
  });

  // Fetch user hackathons
  const { data: userHackathons = [], isLoading: hackathonsLoading } = useQuery<HackathonWithDetails[]>({
    queryKey: ['/api/profile/hackathons'],
  });

  // Fetch user achievements
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/profile/achievements'],
  });

  const handleSaveProfile = (updatedProfile: Partial<User>) => {
    // TODO: Implement mutation to update profile via API
    console.log('Profile update:', updatedProfile);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Please log in to view your profile</h2>
          <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  const upcomingHackathons = userHackathons.filter(h => h.status === 'registered');
  const previousHackathons = userHackathons.filter(h => h.status === 'completed' || h.status === 'participated');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 mb-8 bg-white dark:bg-black border-gray-200 dark:border-red-900/30">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-2 border-red-500" data-testid="avatar-user">
              <AvatarImage src={userProfile.avatarUrl || undefined} alt={userProfile.name || userProfile.username} />
              <AvatarFallback className="bg-red-500 text-white text-2xl">
                {(userProfile.name || userProfile.username).split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" data-testid="text-username">
                {userProfile.name || userProfile.username}
              </h1>
              {userProfile.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-3" data-testid="text-bio">{userProfile.bio}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {userProfile.location && (
                  <div className="flex items-center gap-1" data-testid="text-location">
                    <MapPin className="w-4 h-4" />
                    {userProfile.location}
                  </div>
                )}
                {userProfile.email && (
                  <div className="flex items-center gap-1" data-testid="text-email">
                    <Mail className="w-4 h-4" />
                    {userProfile.email}
                  </div>
                )}
              </div>
              {userProfile.skills && userProfile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {userProfile.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-red-500/10 text-red-500 border-red-500/20"
                      data-testid={`badge-skill-${index}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                {userProfile.github && (
                  <a 
                    href={`https://github.com/${userProfile.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                    data-testid="link-github"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {userProfile.linkedin && (
                  <a 
                    href={`https://linkedin.com/in/${userProfile.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                    data-testid="link-linkedin"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {userProfile.twitter && (
                  <a 
                    href={`https://twitter.com/${userProfile.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                    data-testid="link-twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {userProfile.website && (
                  <a 
                    href={userProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                    data-testid="link-website"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            
            <EditProfileDialog profile={userProfile} onSave={handleSaveProfile} />
          </div>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white" data-testid="heading-achievements">Achievements</h2>
          {achievementsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-red-500" />
            </div>
          ) : achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className="p-4 bg-white dark:bg-black border-gray-200 dark:border-red-900/30 hover:border-red-500 dark:hover:border-red-500 transition-colors"
                  data-testid={`achievement-card-${achievement.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl" data-testid={`achievement-icon-${achievement.id}`}>{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black dark:text-white mb-1" data-testid={`achievement-title-${achievement.id}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" data-testid={`achievement-description-${achievement.id}`}>
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500" data-testid={`achievement-date-${achievement.id}`}>
                        {format(new Date(achievement.earnedAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-white dark:bg-black border-gray-200 dark:border-red-900/30">
              <p className="text-gray-500 dark:text-gray-500">No achievements yet. Participate in hackathons to earn badges!</p>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white" data-testid="heading-hackathons">My Hackathons</h2>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 dark:bg-gray-900">
              <TabsTrigger 
                value="upcoming" 
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                data-testid="tab-upcoming"
              >
                Upcoming ({upcomingHackathons.length})
              </TabsTrigger>
              <TabsTrigger 
                value="previous" 
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                data-testid="tab-previous"
              >
                Previous ({previousHackathons.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {hackathonsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              ) : upcomingHackathons.length > 0 ? (
                upcomingHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} userHackathon={hackathon} />
                ))
              ) : (
                <Card className="p-8 text-center bg-white dark:bg-black border-gray-200 dark:border-red-900/30">
                  <p className="text-gray-500 dark:text-gray-500" data-testid="text-no-upcoming">
                    No upcoming hackathons registered yet
                  </p>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="previous" className="mt-6 space-y-4">
              {hackathonsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              ) : previousHackathons.length > 0 ? (
                previousHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} userHackathon={hackathon} />
                ))
              ) : (
                <Card className="p-8 text-center bg-white dark:bg-black border-gray-200 dark:border-red-900/30">
                  <p className="text-gray-500 dark:text-gray-500" data-testid="text-no-previous">
                    No previous hackathons yet
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
