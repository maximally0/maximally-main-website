import { useState, useEffect } from 'react';
import { Megaphone, AlertCircle, Info, Bell, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';

interface Announcement {
  id: number;
  title: string;
  content: string;
  announcement_type: 'general' | 'important' | 'reminder' | 'update';
  target_audience: string;
  created_at: string;
  published_at: string;
  updated_at?: string;
}

interface UserStatus {
  registration_status: string;
  registration_type: string;
  allowed_audiences: string[];
}

interface Props {
  hackathonId: number;
}

export default function ParticipantAnnouncements({ hackathonId }: Props) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && hackathonId) {
      fetchParticipantAnnouncements();
    } else if (!user && hackathonId) {
      fetchPublicAnnouncements();
    }
  }, [user, hackathonId]);

  const fetchPublicAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/hackathons/${hackathonId}/announcements`);
      const data = await response.json();

      if (data.success) {
        setAnnouncements(data.data);
        setUserStatus(null);
      } else {
        setError('Failed to load announcements');
      }
    } catch (error) {
      console.error('Error fetching public announcements:', error);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipantAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/participant-announcements`, { headers });
      const data = await response.json();

      if (data.success) {
        setAnnouncements(data.data);
        setUserStatus(data.user_status);
      } else if (response.status === 403) {
        // User is not registered for this hackathon, fall back to public announcements
        const publicResponse = await fetch(`/api/hackathons/${hackathonId}/announcements`);
        const publicData = await publicResponse.json();
        
        if (publicData.success) {
          setAnnouncements(publicData.data);
          setUserStatus(null);
        } else {
          setError('Failed to load announcements');
        }
      } else {
        setError(data.message || 'Failed to load announcements');
      }
    } catch (error) {
      console.error('Error fetching participant announcements:', error);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertCircle className="h-5 w-5" />;
      case 'reminder':
        return <Bell className="h-5 w-5" />;
      case 'update':
        return <Info className="h-5 w-5" />;
      default:
        return <Megaphone className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'border-red-500/50 bg-gradient-to-br from-red-500/15 to-rose-500/10';
      case 'reminder':
        return 'border-orange-500/50 bg-gradient-to-br from-orange-500/15 to-amber-500/10';
      case 'update':
        return 'border-blue-500/50 bg-gradient-to-br from-blue-500/15 to-cyan-500/10';
      default:
        return 'border-purple-500/50 bg-gradient-to-br from-purple-500/15 to-pink-500/10';
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'text-red-400';
      case 'reminder':
        return 'text-orange-400';
      case 'update':
        return 'text-blue-400';
      default:
        return 'text-purple-400';
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'public':
        return 'Public';
      case 'all':
        return 'All Participants';
      case 'confirmed':
        return 'Confirmed Participants';
      case 'waitlist':
        return 'Waitlist';
      case 'teams':
        return 'Teams';
      case 'individuals':
        return 'Individuals';
      default:
        return audience;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="font-press-start text-sm text-gray-400">LOGIN_REQUIRED</p>
        <p className="font-jetbrains text-xs text-gray-500 mt-2">You must be logged in to view announcements</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-gray-400">LOADING_ANNOUNCEMENTS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-red-400">ERROR</div>
        <p className="font-jetbrains text-xs text-gray-500 mt-2">{error}</p>
        <p className="font-jetbrains text-xs text-gray-400 mt-2">
          Showing public announcements only
        </p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8">
        <Megaphone className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="font-press-start text-sm text-gray-400">NO_ANNOUNCEMENTS</p>
        <p className="font-jetbrains text-xs text-gray-500 mt-2">No announcements for your registration status</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 border border-purple-500/40">
          <Megaphone className="h-5 w-5 text-purple-400" />
        </div>
        <h2 className="font-press-start text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ANNOUNCEMENTS</h2>
      </div>

      {/* User Status Info */}
      {userStatus && (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/40 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="font-press-start text-xs text-blue-400">YOUR_STATUS</span>
          </div>
          <div className="font-jetbrains text-sm text-gray-300">
            <span className="text-white">Registration:</span> {userStatus.registration_status.toUpperCase()} • 
            <span className="text-white"> Type:</span> {userStatus.registration_type.toUpperCase()}
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`border p-6 transition-all duration-300 ${getTypeColor(announcement.announcement_type)}`}
          >
            <div className="flex items-start gap-4">
              <div className={`${getTypeTextColor(announcement.announcement_type)} mt-1`}>
                {getIcon(announcement.announcement_type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="font-press-start text-lg text-white">
                    {announcement.title}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-press-start uppercase border ${
                    announcement.announcement_type === 'important' 
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : announcement.announcement_type === 'reminder'
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : announcement.announcement_type === 'update'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                  }`}>
                    {announcement.announcement_type}
                  </span>
                  <span className="px-2 py-1 text-xs font-jetbrains bg-gray-800/50 text-gray-300 border border-gray-700">
                    {getAudienceLabel(announcement.target_audience)}
                  </span>
                </div>
                <p className="text-gray-300 font-jetbrains leading-relaxed whitespace-pre-wrap mb-3">
                  {announcement.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-jetbrains">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(announcement.published_at || announcement.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                      <span className="text-amber-400"> (edited)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}