import { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Send, 
  Users, 
  Trophy, 
  Gavel,
  GraduationCap,
  CheckCircle,
  Loader2,
  FileText,
  Mail
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
}

export default function CertificateGenerator({ hackathonId, hackathonName }: CertificateGeneratorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CertificateType>('participant');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

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
          mappedRecipients = (data.data || [])
            .filter((s: any) => s.prize_won)
            .map((s: any) => ({
              id: s.id.toString(),
              name: s.team_name || s.project_name,
              email: s.submitter_email || '',
              type: 'winner' as CertificateType,
              position: s.prize_won,
              selected: false
            }));
        } else if (activeTab === 'judge') {
          mappedRecipients = (data.data || []).map((j: any) => ({
            id: j.id.toString(),
            name: j.judge_name || j.full_name,
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
        
        setRecipients(mappedRecipients);
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast({
        title: "Error",
        description: "Failed to load recipients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setRecipients(prev => 
      prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
    );
  };

  const selectAll = () => {
    const allSelected = recipients.every(r => r.selected);
    setRecipients(prev => prev.map(r => ({ ...r, selected: !allSelected })));
  };

  const selectedCount = recipients.filter(r => r.selected).length;

  const generateCertificates = async (sendEmail: boolean = false) => {
    const selected = recipients.filter(r => r.selected);
    if (selected.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one recipient",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGenerationProgress({ current: 0, total: selected.length });

    try {
      const headers = await getAuthHeaders();
      
      // Generate certificates via API
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/certificates/generate`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipients: selected.map(r => ({
            name: r.name,
            email: r.email,
            type: r.type,
            position: r.position
          })),
          hackathon_name: hackathonName,
          send_email: sendEmail
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Certificates Generated!",
          description: sendEmail 
            ? `${data.generated} certificates generated and emails sent`
            : `${data.generated} certificates generated successfully`,
        });
        
        // Clear selection
        setRecipients(prev => prev.map(r => ({ ...r, selected: false })));
      } else {
        throw new Error(data.message || 'Failed to generate certificates');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate certificates",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setGenerationProgress({ current: 0, total: 0 });
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
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CertificateType)}
              className={`px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r from-${tab.color}-600/40 to-${tab.color}-500/30 border border-${tab.color}-500/50 text-${tab.color}-200`
                  : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/30 p-4">
        <p className="font-jetbrains text-sm text-amber-200">
          {activeTab === 'participant' && 'Generate participation certificates for confirmed/checked-in participants.'}
          {activeTab === 'winner' && 'Generate winner certificates for projects that won prizes.'}
          {activeTab === 'judge' && 'Generate appreciation certificates for judges who evaluated submissions.'}
          {activeTab === 'mentor' && 'Generate appreciation certificates for mentors who guided participants.'}
        </p>
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
            {/* Select All */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
              <button
                onClick={selectAll}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <CheckCircle className={`h-5 w-5 ${recipients.every(r => r.selected) ? 'text-green-400' : ''}`} />
                <span className="font-jetbrains text-sm">
                  {recipients.every(r => r.selected) ? 'Deselect All' : 'Select All'}
                </span>
              </button>
              <span className="font-jetbrains text-sm text-gray-500">
                {selectedCount} of {recipients.length} selected
              </span>
            </div>

            {/* Recipients */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  onClick={() => toggleSelection(recipient.id)}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                    recipient.selected
                      ? 'bg-purple-500/10 border border-purple-500/50'
                      : 'bg-black/30 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle className={`h-5 w-5 ${recipient.selected ? 'text-green-400' : 'text-gray-600'}`} />
                    <div>
                      <p className="font-press-start text-sm text-white">{recipient.name}</p>
                      <p className="font-jetbrains text-xs text-gray-400">{recipient.email}</p>
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
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => generateCertificates(false)}
            disabled={generating || selectedCount === 0}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2 border border-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            GENERATE ({selectedCount})
          </button>
          
          <button
            onClick={() => generateCertificates(true)}
            disabled={generating || selectedCount === 0}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2 border border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            GENERATE_&_EMAIL ({selectedCount})
          </button>
        </div>
      )}

      {/* Generation Progress */}
      {generating && generationProgress.total > 0 && (
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
            <span className="font-press-start text-sm text-purple-300">
              GENERATING_CERTIFICATES...
            </span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
            />
          </div>
          <p className="font-jetbrains text-xs text-gray-400 mt-2">
            {generationProgress.current} of {generationProgress.total} completed
          </p>
        </div>
      )}
    </div>
  );
}
