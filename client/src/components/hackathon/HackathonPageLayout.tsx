/**
 * HackathonPageLayout — Two-column layout matching the spec mockup
 * Left (2/3): All content single scroll — About, Tracks, Prizes, Rubric, Judges, Mentors, FAQ
 * Right (1/3, sticky): Registration panel, Event Timeline, Submission Checklist, Organizer, Share
 */
import { Calendar, Clock, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import SpotsProgressBar from './SpotsProgressBar';
import SubmissionChecklist from './SubmissionChecklist';
import EventTimeline from './EventTimeline';
import ShareUtilities from './ShareUtilities';
import OrganizerCard from './OrganizerCard';
import Breadcrumb from './Breadcrumb';
import JudgingRubric from './JudgingRubric';
import WinnersPodium from './WinnersPodium';
import HackathonRegistration from '@/components/HackathonRegistration';
import HackathonTracks from '@/components/HackathonTracks';

interface Props {
  hackathon: any;
  status: any;
  startDate: Date;
  endDate: Date;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  judgeProfiles: any[];
  winners: any[];
  fetchHackathon: () => void;
  onViewWinners: () => void;
}

export default function HackathonPageLayout({
  hackathon, status, startDate, endDate,
  primaryColor, secondaryColor, accentColor,
  judgeProfiles, winners, fetchHackathon, onViewWinners
}: Props) {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000*60*60*24));
  const faqs = (() => { try { return hackathon.faqs ? (typeof hackathon.faqs === 'string' ? JSON.parse(hackathon.faqs) : hackathon.faqs) : []; } catch { return []; } })();
  const prizes = (() => { try { return hackathon.prize_breakdown ? JSON.parse(hackathon.prize_breakdown) : []; } catch { return []; } })();

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-20 pt-20 pb-16">
      <Breadcrumb items={[{ label: 'Maximally', href: '/' }, { label: 'Events', href: '/events' }, { label: hackathon.hackathon_name }]} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-4">
        {/* ═══ LEFT COLUMN ═══ */}
        <div className="min-w-0 space-y-10">
          {/* Badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 font-space text-xs font-bold border rounded-full ${status.borderColor} ${status.bgColor} ${status.color}`}>{status.label}</span>
              <span className="px-3 py-1 font-space text-xs border border-gray-700 text-gray-300 rounded-full capitalize">{hackathon.format}</span>
              {hackathon.total_prize_pool && <span className="px-3 py-1 font-space text-xs border border-green-700 text-green-400 bg-green-900/20 rounded-full">{hackathon.total_prize_pool}</span>}
            </div>
            <h1 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-3 leading-tight">{hackathon.hackathon_name}</h1>
            {hackathon.tagline && <p className="font-space text-base text-gray-400 mb-5 max-w-2xl">{hackathon.tagline}</p>}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 font-space">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{startDate.toLocaleDateString('en-US',{month:'short',day:'numeric'})}–{endDate.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{days} days</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />Teams of 1–{hackathon.team_size_max||4}</span>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[{v: hackathon.registrations_count||0, l:'Registered'},{v:'—',l:'Teams formed'},{v:'—',l:'Countries'},{v:judgeProfiles.length,l:'Judges'}].map((s,i)=>(
              <div key={i} className="border border-gray-800 bg-gray-900/40 p-4 text-center">
                <p className="font-space text-xl font-bold text-white">{s.v}</p>
                <p className="font-space text-[10px] text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Winners */}
          {hackathon.winners_announced && winners.length > 0 && <WinnersPodium winners={winners} />}

          {/* About */}
          {hackathon.description && (
            <div>
              <h2 className="font-space font-bold text-xl text-white mb-4">About this event</h2>
              <p className="font-space text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{hackathon.description}</p>
            </div>
          )}

          {/* Tracks */}
          {hackathon.tracks && (
            <div>
              <h2 className="font-space font-bold text-xl text-white mb-4">Tracks</h2>
              <HackathonTracks tracks={hackathon.tracks} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} />
            </div>
          )}

          {/* Prizes */}
          {(hackathon.total_prize_pool || prizes.length > 0) && (
            <div>
              <h2 className="font-space font-bold text-xl text-white mb-4">Prizes</h2>
              <div className="space-y-2">
                {prizes.map((p: any, i: number) => (
                  <div key={i} className={`flex items-center gap-4 px-5 py-4 border ${i < 3 ? 'border-gray-700 bg-gray-900/60' : 'border-dashed border-gray-800 bg-gray-900/30'}`}>
                    <span className="font-space text-lg font-bold text-white w-10">{i < 3 ? `${i+1}${['st','nd','rd'][i]}` : '☆'}</span>
                    <div className="flex-1">
                      <p className="font-space text-sm text-white font-medium">{p.position || p.name}</p>
                      {p.perks && <p className="font-space text-xs text-gray-500 mt-0.5">{p.perks}</p>}
                    </div>
                    <span className="font-space text-base font-bold text-white">{p.prize || p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Judging Rubric */}
          <JudgingRubric hackathonId={hackathon.id} />

          {/* Judges */}
          {judgeProfiles.length > 0 && (
            <div>
              <h2 className="font-space font-bold text-xl text-white mb-4">Judges</h2>
              <div className="border border-gray-800 bg-gray-900/40 divide-y divide-gray-800">
                {judgeProfiles.map((j: any) => (
                  <div key={j.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-space font-bold text-sm shrink-0">
                      {j.profile_photo ? <img src={j.profile_photo} alt="" className="w-full h-full object-cover" /> : (j.name||'J').substring(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-sm text-white font-medium">{j.name}</p>
                      <p className="font-space text-xs text-gray-500">{j.title}</p>
                    </div>
                    {j.link && <a href={j.link} target="_blank" rel="noopener noreferrer" className="font-space text-xs text-gray-500 hover:text-orange-400 shrink-0"><ExternalLink className="w-3.5 h-3.5" /></a>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available mentors (placeholder — would be fetched per-event) */}
          <div>
            <h2 className="font-space font-bold text-xl text-white mb-4">Available mentors</h2>
            <div className="border border-gray-800 bg-gray-900/40 p-5 text-center">
              <p className="font-space text-sm text-gray-500">Mentors will be assigned closer to the event.</p>
              <Link to="/mentors" className="font-space text-xs text-orange-400 hover:text-orange-300 mt-2 inline-block">Browse all mentors →</Link>
            </div>
          </div>

          {/* FAQ */}
          {faqs.length > 0 && (
            <div>
              <h2 className="font-space font-bold text-xl text-white mb-4">FAQ</h2>
              <div className="border border-gray-800 bg-gray-900/40 divide-y divide-gray-800">
                {faqs.map((faq: any, i: number) => (
                  <div key={i} className="px-5 py-4">
                    <h4 className="font-space text-sm text-white font-medium mb-2">{faq.question}</h4>
                    <p className="font-space text-xs text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sponsors */}
          {hackathon.sponsors && hackathon.sponsors.length > 0 && (
            <div>
              <h2 className="font-space font-bold text-xl text-white mb-4">Sponsors</h2>
              <div className="flex flex-wrap gap-3">
                {(Array.isArray(hackathon.sponsors) ? hackathon.sponsors : []).map((s: string, i: number) => (
                  <span key={i} className="px-4 py-2 border border-gray-700 bg-gray-900/40 font-space text-sm text-gray-300">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT COLUMN (Sticky) ═══ */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {/* Registration Panel */}
            <div className="border border-gray-800 bg-gray-900/60 p-5">
              <p className="font-space text-lg font-bold text-white mb-1">{hackathon.registration_fee ? `₹${hackathon.registration_fee}` : 'Free'}</p>
              <p className="font-space text-xs text-gray-500 mb-4">{hackathon.registration_fee ? 'Entry fee' : 'No entry fee. Open to all builders.'}</p>
              <HackathonRegistration
                hackathonId={hackathon.id} hackathonName={hackathon.hackathon_name} hackathonSlug={hackathon.slug}
                teamSizeMin={hackathon.team_size_min||1} teamSizeMax={hackathon.team_size_max||4}
                registrationOpensAt={hackathon.registration_opens_at} registrationClosesAt={hackathon.registration_closes_at}
                registrationControl={hackathon.registration_control} buildingControl={hackathon.building_control}
                status={hackathon.status} hackathon_status={hackathon.hackathon_status}
                end_date={hackathon.end_date} winnersAnnounced={hackathon.winners_announced}
                winnersAnnouncedAt={hackathon.winners_announced_at}
                onRegistrationChange={fetchHackathon} onViewWinners={onViewWinners}
                primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor}
              />
              {hackathon.max_participants && (
                <div className="mt-4">
                  <SpotsProgressBar registered={hackathon.registrations_count||0} maxParticipants={hackathon.max_participants} />
                </div>
              )}
              {(hackathon.registration_deadline || hackathon.end_date) && new Date(hackathon.end_date) > new Date() && (
                <div className="mt-4">
                  <CountdownTimer targetDate={hackathon.registration_deadline || hackathon.end_date} label="Registration closes in" />
                </div>
              )}
            </div>

            {/* Event Timeline */}
            <EventTimeline phases={[
              { label: 'Applications open', date: hackathon.start_date, note: 'Complete' },
              ...(hackathon.registration_deadline ? [{ label: 'Registration closes', date: hackathon.registration_deadline }] : []),
              { label: 'Hacking begins', date: hackathon.start_date },
              { label: 'Submissions due', date: hackathon.end_date },
            ]} />

            {/* Submission Checklist */}
            <SubmissionChecklist />

            {/* Organizer */}
            <OrganizerCard name={hackathon.hackathon_name.split(' ')[0] || 'Organizer'} eventsCount={1} description="Community organizer on Maximally" />

            {/* Share */}
            <div className="border border-gray-800 bg-gray-900/40 p-4">
              <h4 className="font-space font-bold text-sm text-white mb-3">Share this event</h4>
              <ShareUtilities hackathonName={hackathon.hackathon_name} startDate={hackathon.start_date} endDate={hackathon.end_date} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
