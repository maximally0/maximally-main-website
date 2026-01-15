import { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Users, 
  Trophy, 
  Gavel,
  GraduationCap,
  CheckCircle,
  Loader2,
  FileText,
  Mail,
  AlertTriangle,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface CertificateGeneratorProps {
  hackathonId: number;
  hackathonName: string;
}

type CertificateType = 'participant' | 'winner' | 'judge' | 'mentor';

interface Recipient {
  id: string;
  name: string;
  email: string;
  type: CertificateType;
  position?: string;
  selected: boolean;
  hasCertificate?: boolean;
  certificate?: { certificate_id: string; status: string } | null;
}

interface ConfirmDialogState {
  isOpen: boolean;
  existingCount: number;
  sendEmail: boolean;
}

export default function CertificateGenerator({ hackathonId, hackathonName }: CertificateGeneratorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CertificateType>('participant');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    existingCount: 0,
    sendEmail: false
  });

  useEffect(() => {
    fetchRecipients();
  }, [hackathonId, activeTab]);

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      let endpoint = '';
      
      switch (activeTab) {
        case 'participant':
          endpoint = `/api/organizer/hackathons/${hackathonId}/registrations`;
          break;
        case 'winner':
          endpoint = `/api/organizer/hackathons/${hackathonId}/submissions?winners_only=true`;
          break;
        case 'judge':
          endpoint = `/api/organizer/hackathons/${hackathonId}/judges`;
          break;
        case 'mentor':
          endpoint = `/api/organizer/hackathons/${hackathonId}/mentors`;
          break;
      }

      const response = await fetch(endpoint, { headers });
      const data = await response.json();

      if (data.success) {
        let mappedRecipients: Recipient[] = [];
        
        if (activeTab === 'participant') {
          mappedRecipients = (data.data || [])
            .filter((r: any) => r.status === 'confirmed' || r.status === 'checked_in')
            .map((r: any) => ({
              id: r.id.toString(),
              name: r.full_name,
              email: r.email,
              type: 'participant' as CertificateType,
              selected: false
            }));
        } else if (activeTab === 'winner') {
          const winnerRecipients: Recipient[] = [];
          for (const s of (data.data || []).filter((s: any) => s.prize_won)) {
            if (s.team_id) {
              try {
                const teamResponse = await fetch(`/api/teams/${s.team_id}/members`, { headers });
                const teamData = await teamResponse.json();
                if (teamData.success && teamData.data?.length > 0) {
                  for (const member of teamData.data) {
                    winnerRecipients.push({
                      id: `${s.id}-${member.user_id}`,
                      name: member.full_name || member.username,
                      email: member.email,
                      type: 'winner' as CertificateType,
                      position: s.prize_won,
                      selected: false
                    });
                  }
                  continue;
                }
              } catch (err) {
                console.error('Error fetching team members:', err);
              }
            }
            winnerRecipients.push({
              id: s.id.toString(),
              name: s.user_name || s.team_name || s.project_name,
              email: s.submitter_email || '',
              type: 'winner' as CertificateType,
              position: s.prize_won,
              selected: false
            });
          }
          mappedRecipients = winnerRecipients;
        } else if (activeTab === 'judge') {
          mappedRecipients = (data.data || []).map((j: any) => ({
            id: j.id.toString(),
            name: j.name || j.judge_name || j.full_name || 'Unknown Judge',
            email: j.email,
            type: 'judge' as CertificateType,
            selected: false
          }));
        } else if (activeTab === 'mentor') {
          mappedRecipients = (data.data || []).map((m: any) => ({
            id: m.id.toString(),
            name: m.mentor_name || m.full_name,
            email: m.email,
            type: 'mentor' as CertificateType,
            selected: false
          }));
        }
        
        await checkCertificateStatus(mappedRecipients);
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast({ title: "Error", description: "Failed to load recipients", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const checkCertificateStatus = async (recipientsList: Recipient[]) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/certificates/status`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientsList.map(r => ({ name: r.name, email: r.email, type: r.type })),
          hackathon_name: hackathonName
        })
      });
      const data = await response.json();
      
      if (data.success) {
        const statusMap = new Map(data.recipients.map((r: any) => [r.email + r.type, r]));
        const updatedRecipients = recipientsList.map(r => {
          const status = statusMap.get(r.email + r.type) as any;
          return { ...r, hasCertificate: status?.hasCertificate || false, certificate: status?.certificate || null };
        });
        setRecipients(updatedRecipients);
      } else {
        setRecipients(recipientsList);
      }
    } catch (error) {
      setRecipients(recipientsList);
    }
  };

  const toggleSelection = (id: string) => {
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const selectAll = () => {
    const allSelected = recipients.every(r => r.selected);
    setRecipients(prev => prev.map(r => ({ ...r, selected: !allSelected })));
  };

  const selectWithCertificates = () => {
    setRecipients(prev => prev.map(r => ({ ...r, selected: r.hasCertificate && !!r.email })));
  };

  const selectWithoutCertificates = () => {
    setRecipients(prev => prev.map(r => ({ ...r, selected: !r.hasCertificate && !!r.email })));
  };

  const selectedCount = recipients.filter(r => r.selected).length;
  const withCertCount = recipients.filter(r => r.hasCertificate).length;
  const withoutCertCount = recipients.filter(r => !r.hasCertificate).length;

  // Send emails for certificates (server handles rate limiting via queue)
  const sendCertificateEmails = async (certificates: { certificateId: string; email: string }[]) => {
    setSendingEmails(true);
    const headers = await getAuthHeaders();
    let success = 0;
    let failed = 0;

    // Send all requests - server queue handles rate limiting
    const results = await Promise.allSettled(
      certificates.map(cert =>
        fetch(`/api/organizer/certificates/${cert.certificateId}/send-email`, {
          method: 'POST',
          headers
        }).then(res => res.json())
      )
    );

    results.forEach((result, i) => {
      if (result.status === 'fulfilled' && result.value.success) {
        success++;
      } else {
        failed++;
        console.error(`Failed to queue email for ${certificates[i].email}`);
      }
    });

    setSendingEmails(false);
    
    toast({
      title: "Emails Queued!",
      description: `${success} emails queued for sending${failed > 0 ? `, ${failed} failed` : ''}. Server will send them at a safe rate.`,
      variant: failed > 0 && success === 0 ? "destructive" : "default"
    });
  };

  const emailExistingCertificates = async () => {
    const selected = recipients.filter(r => r.selected && r.hasCertificate && r.certificate?.certificate_id && r.email);
    if (selected.length === 0) {
      toast({ title: "No certificates to email", description: "Select recipients with existing certificates", variant: "destructive" });
      return;
    }

    await sendCertificateEmails(selected.map(r => ({
      certificateId: r.certificate!.certificate_id,
      email: r.email
    })));
  };

  const checkExistingAndConfirm = async (sendEmail: boolean) => {
    const selected = recipients.filter(r => r.selected);
    if (selected.length === 0) {
      toast({ title: "No recipients selected", description: "Please select at least one recipient", variant: "destructive" });
      return;
    }

    setChecking(true);
    try {
      const headers = await getAuthHeaders();
      const checkResponse = await fetch(`/api/organizer/hackathons/${hackathonId}/certificates/check-existing`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selected.map(r => ({ name: r.name, email: r.email, type: r.type })),
          hackathon_name: hackathonName
        })
      });
      const checkData = await checkResponse.json();

      if (checkData.existingCount > 0) {
        setConfirmDialog({ isOpen: true, existingCount: checkData.existingCount, sendEmail });
      } else {
        await generateCertificates(sendEmail);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to check existing certificates", variant: "destructive" });
    } finally {
      setChecking(false);
    }
  };

  const generateCertificates = async (sendEmail: boolean = false) => {
    const selected = recipients.filter(r => r.selected);
    if (selected.length === 0) return;

    setGenerating(true);
    setConfirmDialog({ isOpen: false, existingCount: 0, sendEmail: false });

    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/certificates/generate`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selected.map(r => ({ name: r.name, email: r.email, type: r.type, position: r.position })),
          hackathon_name: hackathonName,
          send_email: sendEmail // Server will queue emails if true
        })
      });

      const data = await response.json();

      if (data.success) {
        const replacedMsg = data.replaced > 0 ? ` (${data.replaced} replaced)` : '';
        toast({
          title: "Certificates Generated!",
          description: sendEmail 
            ? `${data.generated} certificates generated${replacedMsg}. Emails queued for sending.`
            : `${data.generated} certificates generated${replacedMsg}`,
        });
        
        await fetchRecipients();
        setRecipients(prev => prev.map(r => ({ ...r, selected: false })));
      } else {
        throw new Error(data.message || 'Failed to generate certificates');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate certificates", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const tabs = [
    { id: 'participant', label: 'PARTICIPANTS', icon: Users, color: 'purple' },
    { id: 'winner', label: 'WINNERS', icon: Trophy, color: 'amber' },
    { id: 'judge', label: 'JUDGES', icon: Gavel, color: 'green' },
    { id: 'mentor', label: 'MENTORS', icon: GraduationCap, color: 'cyan' },
  ];

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-amber-500/50 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 border border-amber-500/40">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-press-start text-lg text-amber-400">CONFIRM_REGENERATION</h3>
            </div>
            <p className="font-jetbrains text-gray-300 mb-6">
              <span className="text-amber-400 font-bold">{confirmDialog.existingCount}</span> certificate(s) already exist. 
              Regenerating will <span className="text-red-400">replace</span> them with new ones.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDialog({ isOpen: false, existingCount: 0, sendEmail: false })}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 font-press-start text-xs transition-all border border-gray-600">
                CANCEL
              </button>
              <button onClick={() => generateCertificates(confirmDialog.sendEmail)}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-3 font-press-start text-xs transition-all border border-amber-500/50">
                REGENERATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-amber-400" />
          <h2 className="font-press-start text-xl bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            CERTIFICATES
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as CertificateType)}
              className={`px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r from-${tab.color}-600/40 to-${tab.color}-500/30 border border-${tab.color}-500/50 text-${tab.color}-200`
                  : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}>
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Info Box with Stats */}
      <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/30 p-4">
        <p className="font-jetbrains text-sm text-amber-200 mb-3">
          {activeTab === 'participant' && 'Generate participation certificates for confirmed/checked-in participants.'}
          {activeTab === 'winner' && 'Generate winner certificates for all team members of winning projects.'}
          {activeTab === 'judge' && 'Generate appreciation certificates for judges who evaluated submissions.'}
          {activeTab === 'mentor' && 'Generate appreciation certificates for mentors who guided participants.'}
        </p>
        {recipients.length > 0 && (
          <div className="flex flex-wrap gap-4 text-xs font-jetbrains">
            <span className="text-green-400">✓ With certificates: {withCertCount}</span>
            <span className="text-red-400">✗ Without certificates: {withoutCertCount}</span>
          </div>
        )}
      </div>

      {/* Recipients List */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
          </div>
        ) : recipients.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="font-press-start text-gray-400">NO_RECIPIENTS_FOUND</p>
            <p className="font-jetbrains text-sm text-gray-500 mt-2">
              {activeTab === 'participant' && 'No confirmed participants yet'}
              {activeTab === 'winner' && 'No winners assigned yet'}
              {activeTab === 'judge' && 'No judges assigned yet'}
              {activeTab === 'mentor' && 'No mentors assigned yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Selection Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-700">
              <div className="flex flex-wrap gap-2">
                <button onClick={selectAll} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <CheckCircle className={`h-4 w-4 ${recipients.every(r => r.selected) ? 'text-green-400' : ''}`} />
                  <span className="font-jetbrains">{recipients.every(r => r.selected) ? 'Deselect All' : 'Select All'}</span>
                </button>
                <span className="text-gray-600">|</span>
                <button onClick={selectWithCertificates} className="text-green-400 hover:text-green-300 transition-colors text-sm font-jetbrains">
                  Select with certs ({withCertCount})
                </button>
                <button onClick={selectWithoutCertificates} className="text-red-400 hover:text-red-300 transition-colors text-sm font-jetbrains">
                  Select without certs ({withoutCertCount})
                </button>
              </div>
              <span className="font-jetbrains text-sm text-gray-500">{selectedCount} selected</span>
            </div>

            {/* Recipients */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipients.map((recipient) => (
                <div key={recipient.id} onClick={() => toggleSelection(recipient.id)}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                    recipient.selected ? 'bg-purple-500/10 border border-purple-500/50' : 'bg-black/30 border border-gray-700 hover:border-gray-600'
                  }`}>
                  <div className="flex items-center gap-4">
                    <CheckCircle className={`h-5 w-5 ${recipient.selected ? 'text-green-400' : 'text-gray-600'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-press-start text-sm text-white">{recipient.name}</p>
                        {recipient.hasCertificate ? (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-jetbrains border border-green-500/30">HAS CERT</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-jetbrains border border-red-500/30">NO CERT</span>
                        )}
                      </div>
                      <p className="font-jetbrains text-xs text-gray-400">
                        {recipient.email || <span className="text-red-400">No email</span>}
                      </p>
                    </div>
                  </div>
                  {recipient.position && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 font-press-start text-xs border border-amber-500/50">
                      {recipient.position}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {recipients.length > 0 && (
        <div className="space-y-4">
          {/* Generate Buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => checkExistingAndConfirm(false)}
              disabled={generating || checking || sendingEmails || selectedCount === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2 border border-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
              {generating || checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              GENERATE ({selectedCount})
            </button>
            
            <button onClick={() => checkExistingAndConfirm(true)}
              disabled={generating || checking || sendingEmails || selectedCount === 0}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2 border border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
              {generating || checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              GENERATE_&_EMAIL ({selectedCount})
            </button>
          </div>

          {/* Email Existing Certificates Button */}
          {withCertCount > 0 && (
            <div className="pt-4 border-t border-gray-700">
              <p className="font-jetbrains text-sm text-gray-400 mb-3">
                Already have certificates? Send emails to recipients with existing certificates:
              </p>
              <button onClick={emailExistingCertificates}
                disabled={generating || checking || sendingEmails || recipients.filter(r => r.selected && r.hasCertificate).length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2 border border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
                {sendingEmails ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                EMAIL_EXISTING ({recipients.filter(r => r.selected && r.hasCertificate).length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      {(generating || sendingEmails) && (
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
            <span className="font-press-start text-sm text-purple-300">
              {generating ? 'GENERATING_CERTIFICATES...' : 'QUEUEING_EMAILS...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
