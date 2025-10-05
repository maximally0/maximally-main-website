import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Trophy, Edit, Github, Linkedin, Twitter, Globe, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface UserProfile {
  name: string;
  bio: string;
  location: string;
  skills: string[];
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  avatarUrl?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
}

interface HackathonParticipation {
  id: string;
  name: string;
  status: 'upcoming' | 'completed';
  startDate: Date;
  endDate: Date;
  location: string;
  placement?: string;
  project?: string;
  imageUrl?: string;
}

const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  bio: 'Full-stack developer passionate about AI and building innovative solutions. Love participating in hackathons and learning new technologies.',
  location: 'San Francisco, CA',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'PostgreSQL'],
  email: 'alex.johnson@example.com',
  github: 'alexjohnson',
  linkedin: 'alexjohnson',
  twitter: 'alexjohnson',
  website: 'https://alexjohnson.dev',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};

const mockHackathons: HackathonParticipation[] = [
  {
    id: '1',
    name: 'AI Shipathon 2025',
    status: 'upcoming',
    startDate: new Date('2025-11-15'),
    endDate: new Date('2025-11-17'),
    location: 'Online',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop'
  },
  {
    id: '2',
    name: 'Protocol 404',
    status: 'upcoming',
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-02'),
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'
  },
  {
    id: '3',
    name: 'CodeHypothesis',
    status: 'completed',
    startDate: new Date('2024-09-20'),
    endDate: new Date('2024-09-22'),
    location: 'San Francisco, CA',
    placement: '1st Place',
    project: 'AI-Powered Code Review Tool',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop'
  },
  {
    id: '4',
    name: 'Promptstorm',
    status: 'completed',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-11'),
    location: 'Online',
    placement: 'Top 10',
    project: 'Prompt Optimization Platform',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop'
  },
  {
    id: '5',
    name: 'Steal-a-thon',
    status: 'completed',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2024-05-16'),
    location: 'Boston, MA',
    placement: 'Participant',
    project: 'Open Source Clone Builder',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Win',
    description: 'Won your first hackathon',
    date: '2024-09-22',
    icon: '🏆'
  },
  {
    id: '2',
    title: 'Serial Hacker',
    description: 'Participated in 5+ hackathons',
    date: '2024-08-15',
    icon: '⚡'
  },
  {
    id: '3',
    title: 'AI Innovator',
    description: 'Built 3 AI-powered projects',
    date: '2024-07-20',
    icon: '🤖'
  },
  {
    id: '4',
    title: 'Team Player',
    description: 'Collaborated with 10+ teammates',
    date: '2024-06-10',
    icon: '👥'
  },
  {
    id: '5',
    title: 'Early Bird',
    description: 'Registered for 3 hackathons in advance',
    date: '2024-10-01',
    icon: '🐦'
  },
  {
    id: '6',
    title: 'Code Warrior',
    description: 'Shipped 5 projects in hackathons',
    date: '2024-09-05',
    icon: '⚔️'
  }
];

function HackathonCard({ hackathon }: { hackathon: HackathonParticipation }) {
  return (
    <Card 
      className="p-6 bg-white dark:bg-black border-gray-200 dark:border-red-900/30 hover:border-red-500 dark:hover:border-red-500 transition-colors"
      data-testid={`hackathon-card-${hackathon.id}`}
    >
      <div className="flex gap-4">
        {hackathon.imageUrl && (
          <img 
            src={hackathon.imageUrl} 
            alt={hackathon.name}
            className="w-24 h-24 object-cover rounded-lg"
            data-testid={`hackathon-image-${hackathon.id}`}
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white mb-2" data-testid={`hackathon-name-${hackathon.id}`}>
            {hackathon.name}
          </h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2" data-testid={`hackathon-date-${hackathon.id}`}>
              <Calendar className="w-4 h-4" />
              {format(hackathon.startDate, 'MMM dd, yyyy')} - {format(hackathon.endDate, 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-2" data-testid={`hackathon-location-${hackathon.id}`}>
              <MapPin className="w-4 h-4" />
              {hackathon.location}
            </div>
            {hackathon.placement && (
              <div className="flex items-center gap-2" data-testid={`hackathon-placement-${hackathon.id}`}>
                <Trophy className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-red-500">{hackathon.placement}</span>
              </div>
            )}
            {hackathon.project && (
              <div className="mt-2">
                <span className="text-gray-500 dark:text-gray-500">Project:</span>{' '}
                <span className="text-black dark:text-white" data-testid={`hackathon-project-${hackathon.id}`}>
                  {hackathon.project}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function EditProfileDialog({ profile, onSave }: { profile: UserProfile; onSave: (profile: UserProfile) => void }) {
  const [formData, setFormData] = useState<UserProfile>(profile);
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
      <DialogContent className="max-w-2xl bg-white dark:bg-black border-gray-200 dark:border-red-900/30">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className="text-black dark:text-white">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-black dark:text-white"
              data-testid="input-name"
            />
          </div>
          <div>
            <Label htmlFor="bio" className="text-black dark:text-white">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
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
              value={formData.location}
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
              value={formData.email}
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
              value={formData.skills.join(', ')}
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
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const upcomingHackathons = mockHackathons.filter(h => h.status === 'upcoming');
  const previousHackathons = mockHackathons.filter(h => h.status === 'completed');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 mb-8 bg-white dark:bg-black border-gray-200 dark:border-red-900/30">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-2 border-red-500" data-testid="avatar-user">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              <AvatarFallback className="bg-red-500 text-white text-2xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" data-testid="text-username">{userProfile.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-3" data-testid="text-bio">{userProfile.bio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1" data-testid="text-location">
                  <MapPin className="w-4 h-4" />
                  {userProfile.location}
                </div>
                <div className="flex items-center gap-1" data-testid="text-email">
                  <Mail className="w-4 h-4" />
                  {userProfile.email}
                </div>
              </div>
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
            
            <EditProfileDialog profile={userProfile} onSave={setUserProfile} />
          </div>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white" data-testid="heading-achievements">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAchievements.map((achievement) => (
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
                      {format(new Date(achievement.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
              {upcomingHackathons.length > 0 ? (
                upcomingHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
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
              {previousHackathons.length > 0 ? (
                previousHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
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
