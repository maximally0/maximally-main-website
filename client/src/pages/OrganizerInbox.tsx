import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Search, X, Calendar, AlertCircle, Inbox as InboxIcon } from 'lucide-react';
import { useOrganizerMessages } from '@/hooks/useOrganizerMessages';
import { useOrganizerUnreadCount } from '@/hooks/useOrganizerUnreadCount';
import { markOrganizerMessageRead } from '@/api/organizerMessages';
import type { MessageWithRead, Priority } from '@/types/organizerMessages';
import SEO from '@/components/SEO';
import PixelLoader from '@/components/PixelLoader';

const OrganizerInbox = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { refetch: refetchUnreadCount } = useOrganizerUnreadCount();
  
  // Filter states
  const [searchSubject, setSearchSubject] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | ''>('');
  const [selectedReadStatus, setSelectedReadStatus] = useState<'' | 'unread' | 'read'>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Modal state
  const [selectedMessage, setSelectedMessage] = useState<MessageWithRead | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Build filters object
  const filters = {
    ...(searchSubject && { subject: searchSubject }),
    ...(selectedPriority && { priority: selectedPriority }),
    ...(selectedReadStatus === 'unread' && { read: false }),
    ...(selectedReadStatus === 'read' && { read: true }),
    ...(dateFrom && { from: dateFrom }),
    ...(dateTo && { to: dateTo })
  };
  
  const { messages, loading, error, refetch, setFilters: updateFilters } = useOrganizerMessages(filters);
  
  // Auth guard - only organizers can access
  useEffect(() => {
    if (!authLoading && user) {
      if (!profile) return;
      if (profile.role !== 'organizer') {
        navigate('/');
      }
    } else if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, profile, authLoading, navigate]);
  
  // Update filters when they change
  useEffect(() => {
    updateFilters(filters);
  }, [searchSubject, selectedPriority, selectedReadStatus, dateFrom, dateTo]);
  
  const handleResetFilters = () => {
    setSearchSubject('');
    setSelectedPriority('');
    setSelectedReadStatus('');
    setDateFrom('');
    setDateTo('');
  };
  
  const handleMessageClick = async (message: MessageWithRead) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    if (!message.recipient.is_read) {
      try {
        await markOrganizerMessageRead(message.id);
        refetch();
        refetchUnreadCount();
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedMessage(null), 200);
  };
  
  const getPriorityBadge = (priority: Priority) => {
    const config = {
      low: { bg: 'bg-green-600', text: 'text-black', label: 'LOW' },
      normal: { bg: 'bg-blue-600', text: 'text-black', label: 'NORMAL' },
      high: { bg: 'bg-orange-600', text: 'text-black', label: 'HIGH' },
      urgent: { bg: 'bg-red-700', text: 'text-amber-300', label: 'URGENT' }
    };
    return config[priority] || config.normal;
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Show loading only during initial auth check
  if (authLoading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <PixelLoader size="lg" />
      </div>
    );
  }
  
  // If not an organizer, redirect will happen via useEffect
  if (profile && profile.role !== 'organizer') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <PixelLoader size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="font-jetbrains text-red-400 mb-6">{error}</p>
          <button onClick={() => refetch()} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 font-press-start text-sm border border-cyan-500/50 transition-all">
            RETRY
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <>
      <SEO title="Organizer Inbox | Maximally" description="View messages from the Maximally admin team" />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        
        <main className="relative z-10 pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-press-start text-3xl md:text-4xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 flex items-center gap-4">
                <InboxIcon className="h-8 w-8 text-pink-400" />
                ORGANIZER INBOX
              </h1>
              <p className="font-jetbrains text-pink-400">Messages from the Maximally Team</p>
            </div>
            
            {/* Filters */}
            <div className="bg-black/60 border border-pink-500/40 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="font-press-start text-xs text-pink-400 mb-2 block">SEARCH SUBJECT</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchSubject}
                      onChange={(e) => setSearchSubject(e.target.value)}
                      placeholder="Type to search..."
                      className="w-full bg-black border border-purple-500/40 text-white font-jetbrains px-4 py-2 pr-10 focus:border-pink-400 focus:outline-none"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                
                <div>
                  <label className="font-press-start text-xs text-pink-400 mb-2 block">PRIORITY</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as Priority | '')}
                    className="w-full bg-black border border-purple-500/40 text-white font-jetbrains px-4 py-2 focus:border-pink-400 focus:outline-none"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="font-press-start text-xs text-pink-400 mb-2 block">STATUS</label>
                  <select
                    value={selectedReadStatus}
                    onChange={(e) => setSelectedReadStatus(e.target.value as '' | 'unread' | 'read')}
                    className="w-full bg-black border border-purple-500/40 text-white font-jetbrains px-4 py-2 focus:border-pink-400 focus:outline-none"
                  >
                    <option value="">All Messages</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="font-press-start text-xs text-cyan-400 mb-2 block">FROM DATE</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 text-white font-jetbrains px-4 py-2 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="font-press-start text-xs text-cyan-400 mb-2 block">TO DATE</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 text-white font-jetbrains px-4 py-2 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleResetFilters}
                    className="bg-gray-800 hover:bg-pink-600/30 text-gray-300 hover:text-white px-6 py-2 font-press-start text-xs w-full border border-gray-700 hover:border-pink-500/50 transition-all"
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>
            
            {/* Messages List */}
            <div className="space-y-4">
              {loading && messages.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-900/30 border border-purple-500/30 p-6 animate-pulse">
                    <div className="h-6 bg-gray-700 w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-700 w-1/2"></div>
                  </div>
                ))
              ) : messages.length === 0 ? (
                <div className="bg-black/60 border border-purple-500/30 p-12 text-center">
                  <Mail className="h-16 w-16 text-pink-500/50 mx-auto mb-4" />
                  <p className="font-press-start text-gray-500 mb-2">NO MESSAGES FOUND</p>
                  <p className="font-jetbrains text-gray-600">Try adjusting your filters</p>
                </div>
              ) : (
                messages.map((message) => {
                  const priorityBadge = getPriorityBadge(message.priority);
                  const isUnread = !message.recipient.is_read;
                  
                  return (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 cursor-pointer transition-all hover:border-pink-400 ${
                        isUnread ? 'border border-pink-500' : 'border border-purple-500/40'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {isUnread && <div className="w-3 h-3 bg-pink-500 flex-shrink-0" />}
                            <h3 className={`font-press-start text-sm md:text-base bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate ${isUnread ? 'font-bold' : ''}`}>
                              {message.subject}
                            </h3>
                            <span className={`${priorityBadge.bg} ${priorityBadge.text} px-3 py-1 font-press-start text-xs flex-shrink-0 border border-white/20`}>
                              {priorityBadge.label}
                            </span>
                          </div>
                          <p className="font-jetbrains text-gray-400 text-sm mb-3 line-clamp-2">{message.content}</p>
                          <div className="flex items-center gap-4 text-xs font-jetbrains text-gray-500">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{message.sent_by_name}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(message.sent_at || message.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
        
        {/* Message Detail Modal */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/90 border-2 border-purple-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{selectedMessage.subject}</h2>
                    <span className={`${getPriorityBadge(selectedMessage.priority).bg} ${getPriorityBadge(selectedMessage.priority).text} px-3 py-1 font-press-start text-xs border border-white/20`}>
                      {getPriorityBadge(selectedMessage.priority).label}
                    </span>
                  </div>
                  <div className="font-jetbrains text-gray-400 text-sm">
                    <p>From: {selectedMessage.sent_by_name} ({selectedMessage.sent_by_email})</p>
                    <p>Date: {formatDate(selectedMessage.sent_at || selectedMessage.created_at)}</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="bg-red-600 hover:bg-red-500 text-white p-2 border border-red-500/50 transition-all" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="bg-black/50 border border-purple-500/30 p-6 mb-4">
                <p className="font-jetbrains text-purple-300 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              
              {selectedMessage.recipient.is_read && selectedMessage.recipient.read_at && (
                <p className="font-jetbrains text-xs text-gray-500 text-center">Read on {formatDate(selectedMessage.recipient.read_at)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrganizerInbox;
