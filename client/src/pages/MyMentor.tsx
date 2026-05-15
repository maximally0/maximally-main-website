import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { Users, Mail, MapPin, ExternalLink, Clock, BookOpen, CheckCircle, Loader2 } from 'lucide-react';

interface MentorInfo {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  status: string;
  booking_url: string | null;
}

interface SessionInfo {
  id: string;
  status: string;
  problem_description: string;
  started_at: string | null;
  created_at: string;
}

export default function MyMentor() {
  const { user } = useAuth();
  const [mentor, setMentor] = useState<MentorInfo | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchMyMentor();
  }, [user]);

  const fetchMyMentor = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch('/api/mentorship/my-mentor', { headers });
      const data = await res.json();
      if (data.success) {
        setMentor(data.mentor);
        setSession(data.session);
      } else {
        setError(data.message || 'Failed to load mentor info');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="font-space text-gray-400 mb-4">Please log in to view your mentor.</p>
          <Link to="/login" className="bg-orange-500 text-black px-6 py-3 font-space font-bold text-sm">LOGIN</Link>
        </div>
      </div>
    );
  }

  if (!mentor || !session) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center py-16 border border-gray-800 bg-gray-900/30">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h1 className="font-space font-bold text-2xl text-white mb-3">No Active Mentor</h1>
            <p className="font-space text-gray-400 mb-6">
              You don't have an active mentorship session yet.
            </p>
            <Link
              to="/mentors"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 font-space font-bold text-sm inline-flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              FIND A MENTOR
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = session.status === 'active' ? 'text-green-400 border-green-500/50 bg-green-500/10'
    : 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-space font-bold text-3xl text-orange-400 mb-2">MY MENTOR</h1>
          <p className="font-space text-gray-400 text-sm">Your assigned mentor's contact details</p>
        </div>

        {/* Session Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 border font-space font-bold text-xs mb-6 ${statusColor}`}>
          <CheckCircle className="h-3.5 w-3.5" />
          SESSION {session.status.toUpperCase()}
        </div>

        {/* Mentor Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 p-6 mb-6">
          <div className="flex items-start gap-5 mb-6">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt={mentor.name || 'Mentor'}
                className="w-20 h-20 rounded-full object-cover border-2 border-orange-500/50 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="font-space font-bold text-2xl text-white">
                  {(mentor.name || 'M')[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-space font-bold text-xl text-white mb-1">{mentor.name || 'Mentor'}</h2>
              {mentor.username && (
                <p className="font-space text-sm text-orange-400 mb-2">@{mentor.username}</p>
              )}
              {mentor.location && (
                <div className="flex items-center gap-1.5 text-gray-400 text-sm font-space">
                  <MapPin className="h-3.5 w-3.5" />
                  {mentor.location}
                </div>
              )}
            </div>
          </div>

          {mentor.bio && (
            <p className="font-space text-sm text-gray-300 leading-relaxed mb-6 border-t border-gray-800 pt-4">
              {mentor.bio}
            </p>
          )}

          {/* Contact Details */}
          <div className="space-y-3 border-t border-gray-800 pt-4">
            <h3 className="font-space font-bold text-xs text-orange-400 uppercase tracking-wider mb-3">CONTACT DETAILS</h3>

            {mentor.email && (
              <div className="flex items-center gap-3 p-3 bg-black/50 border border-gray-800">
                <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="font-space text-xs text-gray-500 mb-0.5">Email</p>
                  <a
                    href={`mailto:${mentor.email}`}
                    className="font-space text-sm text-white hover:text-orange-400 transition-colors"
                  >
                    {mentor.email}
                  </a>
                </div>
              </div>
            )}

            {mentor.booking_url && (
              <div className="flex items-center gap-3 p-3 bg-black/50 border border-gray-800">
                <ExternalLink className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="font-space text-xs text-gray-500 mb-0.5">Booking Link</p>
                  <a
                    href={mentor.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-space text-sm text-white hover:text-orange-400 transition-colors"
                  >
                    Schedule a session
                  </a>
                </div>
              </div>
            )}

            {mentor.username && (
              <div className="flex items-center gap-3 p-3 bg-black/50 border border-gray-800">
                <Users className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="font-space text-xs text-gray-500 mb-0.5">Profile</p>
                  <Link
                    to={`/mentors/${mentor.id}`}
                    className="font-space text-sm text-white hover:text-orange-400 transition-colors"
                  >
                    View full profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {mentor.skills.length > 0 && (
            <div className="border-t border-gray-800 pt-4 mt-4">
              <h3 className="font-space font-bold text-xs text-orange-400 uppercase tracking-wider mb-3">EXPERTISE</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-300 font-space text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Info */}
        <div className="bg-gray-900/50 border border-gray-800 p-4">
          <h3 className="font-space font-bold text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5" />
            YOUR REQUEST
          </h3>
          <p className="font-space text-sm text-gray-300 leading-relaxed mb-3">{session.problem_description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-space">
            <Clock className="h-3.5 w-3.5" />
            Requested {new Date(session.created_at).toLocaleDateString()}
            {session.started_at && ` · Started ${new Date(session.started_at).toLocaleDateString()}`}
          </div>
        </div>
      </div>
    </div>
  );
}
