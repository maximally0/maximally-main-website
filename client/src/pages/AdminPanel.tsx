import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Clock, User, Mail, MapPin, Building, Calendar, ExternalLink, ArrowUp } from 'lucide-react';

interface JudgeApplication {
  id: number;
  username: string;
  full_name: string;
  headline: string;
  short_bio: string;
  judge_location: string;
  role_title: string;
  company: string;
  primary_expertise: string[];
  secondary_expertise: string[];
  total_events_judged: number;
  total_teams_evaluated: number;
  total_mentorship_hours: number;
  years_of_experience: number;
  linkedin: string;
  github?: string;
  twitter?: string;
  website?: string;
  languages_spoken: string[];
  mentorship_statement: string;
  availability_status: string;
  email: string;
  phone?: string;
  compensation_preference?: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  judge_application_events?: Array<{
    id: number;
    event_name: string;
    event_role: string;
    event_date: string;
    event_link?: string;
    verified: boolean;
  }>;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<JudgeApplication | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const ctx = await getCurrentUserWithProfile();
      if (!ctx) {
        navigate('/login');
        return;
      }
      if (ctx.profile.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
    })();
  }, [navigate]);

  // Fetch judge applications
  const { data: applications = [], isLoading } = useQuery<JudgeApplication[]>({
    queryKey: ['/api/admin/judge-applications'],
    queryFn: () => fetch('/api/admin/judge-applications').then(res => res.json()),
  });

  const handleApprove = async (applicationId: number, tier: string = 'starter') => {
    try {
      setActionLoading(`approve-${applicationId}`);
      const response = await fetch(`/api/admin/judge-applications/${applicationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });

      if (!response.ok) {
        throw new Error('Failed to approve application');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/admin/judge-applications'] });
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: number, reason: string) => {
    try {
      setActionLoading(`reject-${applicationId}`);
      const response = await fetch(`/api/admin/judge-applications/${applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject application');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/admin/judge-applications'] });
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <User className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-press-start text-xl text-cyan-400">Admin Panel</h1>
          <Button variant="outline" className="border-gray-700 text-white" onClick={() => navigate('/dashboard')}>
            My Dashboard
          </Button>
        </div>

        {/* Judge Applications Section */}
        <Card className="p-6 bg-gray-900 border-cyan-400/30 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-press-start text-lg text-maximally-yellow">Judge Applications</h2>
            <Badge variant="outline" className="border-cyan-400 text-cyan-400">
              {applications.filter(app => app.status === 'pending').length} Pending
            </Badge>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="minecraft-block bg-cyan-400 text-black px-4 py-2 inline-block animate-pulse">
                <span className="font-press-start text-xs">LOADING APPLICATIONS...</span>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <div className="minecraft-block bg-gray-700 text-gray-300 px-4 py-2 inline-block">
                <span className="font-press-start text-xs">NO APPLICATIONS FOUND</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="minecraft-block bg-gray-800 border-2 border-gray-600 p-4 hover:border-cyan-400 transition-colors cursor-pointer"
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-press-start text-sm text-white">{application.full_name}</h3>
                        <Badge className={`${getStatusColor(application.status)} text-white`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            <span className="text-xs uppercase">{application.status}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="font-jetbrains text-gray-300 text-sm mb-2">{application.headline}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{application.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{application.judge_location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{application.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(application.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {application.primary_expertise.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="minecraft-block bg-maximally-red/20 border border-maximally-red text-maximally-red px-2 py-0.5 text-xs font-press-start"
                          >
                            {skill}
                          </span>
                        ))}
                        {application.primary_expertise.length > 3 && (
                          <span className="text-xs text-gray-400">+{application.primary_expertise.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">Experience</div>
                      <div className="font-press-start text-xs text-cyan-400">{application.years_of_experience}+ years</div>
                      <div className="text-xs text-gray-400 mt-1">{application.total_events_judged} events judged</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="minecraft-block bg-gray-900 border-2 border-cyan-400 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-press-start text-lg text-cyan-400">Application Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                  className="border-gray-600 text-gray-300"
                >
                  Close
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-press-start text-sm text-maximally-yellow mb-3">PERSONAL INFO</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedApplication.full_name}</div>
                    <div><strong>Username:</strong> {selectedApplication.username}</div>
                    <div><strong>Email:</strong> {selectedApplication.email}</div>
                    <div><strong>Location:</strong> {selectedApplication.judge_location}</div>
                    <div><strong>Phone:</strong> {selectedApplication.phone || 'Not provided'}</div>
                    <div><strong>Languages:</strong> {selectedApplication.languages_spoken.join(', ')}</div>
                  </div>

                  <h4 className="font-press-start text-sm text-maximally-yellow mb-3 mt-6">PROFESSIONAL INFO</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Role:</strong> {selectedApplication.role_title}</div>
                    <div><strong>Company:</strong> {selectedApplication.company}</div>
                    <div><strong>Experience:</strong> {selectedApplication.years_of_experience}+ years</div>
                    <div><strong>Headline:</strong> {selectedApplication.headline}</div>
                  </div>

                  <h4 className="font-press-start text-sm text-maximally-yellow mb-3 mt-6">SOCIAL LINKS</h4>
                  <div className="space-y-2 text-sm">
                    {selectedApplication.linkedin && (
                      <div className="flex items-center gap-2">
                        <strong>LinkedIn:</strong>
                        <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                          View Profile <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {selectedApplication.github && (
                      <div className="flex items-center gap-2">
                        <strong>GitHub:</strong>
                        <a href={selectedApplication.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                          View Profile <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {selectedApplication.website && (
                      <div className="flex items-center gap-2">
                        <strong>Website:</strong>
                        <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-press-start text-sm text-maximally-yellow mb-3">EXPERTISE</h4>
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Primary:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedApplication.primary_expertise.map((skill, i) => (
                        <span key={i} className="minecraft-block bg-maximally-red/20 border border-maximally-red text-maximally-red px-2 py-0.5 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedApplication.secondary_expertise.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Secondary:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedApplication.secondary_expertise.map((skill, i) => (
                          <span key={i} className="minecraft-block bg-blue-600/20 border border-blue-400 text-blue-400 px-2 py-0.5 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <h4 className="font-press-start text-sm text-maximally-yellow mb-3">EXPERIENCE METRICS</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center minecraft-block bg-gray-800 border border-gray-600 p-3">
                      <div className="font-press-start text-lg text-cyan-400">{selectedApplication.total_events_judged}</div>
                      <div className="text-xs text-gray-400">Events Judged</div>
                    </div>
                    <div className="text-center minecraft-block bg-gray-800 border border-gray-600 p-3">
                      <div className="font-press-start text-lg text-cyan-400">{selectedApplication.total_teams_evaluated}</div>
                      <div className="text-xs text-gray-400">Teams Evaluated</div>
                    </div>
                    <div className="text-center minecraft-block bg-gray-800 border border-gray-600 p-3">
                      <div className="font-press-start text-lg text-cyan-400">{selectedApplication.total_mentorship_hours}</div>
                      <div className="text-xs text-gray-400">Mentorship Hours</div>
                    </div>
                    <div className="text-center minecraft-block bg-gray-800 border border-gray-600 p-3">
                      <div className="font-press-start text-lg text-cyan-400">{selectedApplication.years_of_experience}</div>
                      <div className="text-xs text-gray-400">Years Experience</div>
                    </div>
                  </div>

                  {selectedApplication.judge_application_events && selectedApplication.judge_application_events.length > 0 && (
                    <>
                      <h4 className="font-press-start text-sm text-maximally-yellow mb-3 mt-6">JUDGING HISTORY</h4>
                      <div className="space-y-2">
                        {selectedApplication.judge_application_events.map((event, i) => (
                          <div key={i} className="minecraft-block bg-gray-800 border border-gray-600 p-3 text-sm">
                            <div className="font-semibold">{event.event_name}</div>
                            <div className="text-gray-400">{event.event_role} • {event.event_date}</div>
                            {event.event_link && (
                              <a href={event.event_link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-xs flex items-center gap-1 mt-1">
                                View Event <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-press-start text-sm text-maximally-yellow mb-3">BIO & MENTORSHIP STATEMENT</h4>
                <div className="minecraft-block bg-gray-800 border border-gray-600 p-4 mb-4">
                  <div className="text-sm text-gray-300">{selectedApplication.short_bio}</div>
                </div>
                <div className="minecraft-block bg-gray-800 border border-gray-600 p-4">
                  <div className="text-sm text-gray-300 italic">"{selectedApplication.mentorship_statement}"</div>
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-700">
                  <Button
                    onClick={() => handleApprove(selectedApplication.id)}
                    disabled={actionLoading === `approve-${selectedApplication.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {actionLoading === `approve-${selectedApplication.id}` ? 'Approving...' : 'Approve as Starter Judge'}
                  </Button>
                  <Button
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      if (reason) handleReject(selectedApplication.id, reason);
                    }}
                    disabled={actionLoading === `reject-${selectedApplication.id}`}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    {actionLoading === `reject-${selectedApplication.id}` ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
