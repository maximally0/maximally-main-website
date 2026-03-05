import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConfirmProvider } from '@/components/ui/confirm-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ModerationGuard from '@/components/ModerationGuard';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { LoadingBar } from '@/components/LoadingBar';

import Index from './pages/Index';
import SeniorCouncil from './pages/SeniorCouncil';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Contact from './pages/Contact';
import BecomeASupporter from './pages/BecomeASupporter';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Profile from './pages/Profile';
import RequireAuth from '@/components/RequireAuth';
import MyProfileRedirect from './pages/MyProfileRedirect';
import ThankYou from './pages/ThankYou';
import Blog from './pages/Blog';
import CommunityRedirect from '@/components/CommunityRedirect';
import Events from './pages/Events';
import BlogRouter from './pages/BlogRouter';
import NewsletterUnsubscribe from './components/NewsletterUnsubscribe';
import NotFound from '@/pages/NotFound';

import MFHOP from './pages/MFHOP';
import HostHackathon from './pages/HostHackathon';
import Explore from './pages/Explore';
import CreateHackathon from './pages/CreateHackathon';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EditHackathon from './pages/EditHackathon';
import PublicHackathon from './pages/PublicHackathon';
import OrganizerProfile from './pages/OrganizerProfile';
import HackathonRegistrations from './pages/HackathonRegistrations';
import HackathonSubmit from './pages/HackathonSubmit';
import UnifiedHackathonDashboard from './pages/UnifiedHackathonDashboard';
import OrganizerInvite from './pages/OrganizerInvite';
import JoinTeam from './pages/JoinTeam';

import JudgeProfile from './pages/JudgeProfile';
import OrganizerApplicationForm from './pages/OrganizerApplicationForm';
import JudgeDashboard from './pages/JudgeDashboard';
import JudgeInbox from './pages/JudgeInbox';
import OrganizerInbox from './pages/OrganizerInbox';
import JudgeHackathons from './pages/JudgeHackathons';
import JudgeSubmissions from './pages/JudgeSubmissions';
import JudgeScoring from './pages/JudgeScoring';
import ProjectDetail from './pages/ProjectDetail';
import SubmissionDetail from './pages/SubmissionDetail';
import ParticipantDashboard from './pages/ParticipantDashboard';
import TestEmailValidation from './pages/TestEmailValidation';
import CertificateVerification from './pages/CertificateVerification';
import PlatformAnalytics from './pages/PlatformAnalytics';

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const hideNavbar = false;
  
  return (
    <>
      <LoadingBar isLoading={loading} />
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/senior-council" element={<SeniorCouncil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/test-email" element={<TestEmailValidation />} />
        <Route path="/certificates/verify/:certificate_id" element={<CertificateVerification />} />
        <Route path="/profile" element={<MyProfileRedirect />} />
        <Route path="/profile/:username" element={<Profile />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />

        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/become-a-supporter" element={<BecomeASupporter />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/community" element={<CommunityRedirect />} />

        <Route path="/organizer/apply" element={<OrganizerApplicationForm />} />
        <Route path="/judge-dashboard" element={<JudgeDashboard />} />
        <Route path="/judge-inbox" element={<JudgeInbox />} />
        <Route path="/organizer-inbox" element={<OrganizerInbox />} />
        <Route path="/judge/hackathons" element={<JudgeHackathons />} />
        <Route path="/judge/hackathons/:hackathonId/submissions" element={<JudgeSubmissions />} />
        <Route path="/judge/:token" element={<JudgeScoring />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/project/:source/:projectId" element={<ProjectDetail />} />
        <Route path="/submissions/:slug" element={<SubmissionDetail />} />
        <Route path="/my-hackathons" element={<ParticipantDashboard />} />
        
        <Route path="/analytics" element={<PlatformAnalytics />} />
        
        <Route path="/mfhop" element={<MFHOP />} />
        <Route path="/host-hackathon" element={<HostHackathon />} />
        <Route path="/create-hackathon" element={<CreateHackathon />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/hackathons/:id" element={<UnifiedHackathonDashboard />} />
        <Route path="/organizer/hackathons/:hackathonId/manage" element={<UnifiedHackathonDashboard />} />
        <Route path="/organizer/invite/:token" element={<OrganizerInvite />} />
        <Route path="/organizer/:username" element={<OrganizerProfile />} />
        <Route path="/hackathon/:slug" element={<PublicHackathon />} />
        <Route path="/hackathon/:slug/submit" element={<HackathonSubmit />} />
        <Route path="/team/join/:token" element={<JoinTeam />} />

        <Route path="/events" element={<Events />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/blog/:slug" element={<BlogRouter />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  useEffect(() => {
    document.title = 'Maximally - The World\'s Most Serious Builder Ecosystem';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        "Where extraordinary operators, builders, and innovators converge. Curated hackathons, the Senior Council, and programs for serious builders."
      );
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute(
        'content',
        'hackathon, builder ecosystem, hackathons, innovation, Senior Council, operators, builders, startups'
      );

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', 'index, follow');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <ConfirmProvider>
              <Router>
                <ModerationGuard>
                  <AppContent />
                </ModerationGuard>
              </Router>
            </ConfirmProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
