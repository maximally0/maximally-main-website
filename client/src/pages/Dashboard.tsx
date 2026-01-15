import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';
import { Settings, User, Mail, Shield, ArrowLeft } from 'lucide-react';
import PixelLoader from '@/components/PixelLoader';
import RecommendedHackathons from '@/components/RecommendedHackathons';
import RecommendedProjects from '@/components/RecommendedProjects';
import RecommendedTools from '@/components/RecommendedTools';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<'user' | 'admin' | 'organizer'>('user');

  useEffect(() => {
    (async () => {
      const ctx = await getCurrentUserWithProfile();
      if (!ctx) {
        navigate('/login');
        return;
      }
      setEmail(ctx.user.email || ctx.profile.email || '');
      setRole(ctx.profile.role);
      setName(ctx.user.email?.split('@')[0] || 'User');
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <PixelLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />

      <div className="relative z-10 pt-20 sm:pt-28 px-4 sm:px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/"
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 font-jetbrains text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="font-press-start text-xl sm:text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <Button 
              asChild 
              className="bg-purple-500/20 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-press-start text-xs transition-all"
            >
              <Link to="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </Button>
          </div>

          <Card className="p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30">
            <h2 className="font-press-start text-sm text-purple-300 mb-6">PROFILE INFO</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-black/30 border border-purple-500/20">
                <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <span className="text-gray-500 font-jetbrains text-xs block">Name</span>
                  <span className="text-white font-jetbrains">{name}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-black/30 border border-pink-500/20">
                <div className="w-10 h-10 bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <span className="text-gray-500 font-jetbrains text-xs block">Email</span>
                  <span className="text-white font-jetbrains">{email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-black/30 border border-cyan-500/20">
                <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <span className="text-gray-500 font-jetbrains text-xs block">Role</span>
                  <span className="text-white font-jetbrains capitalize">{role}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommended Hackathons */}
          <div className="mt-8">
            <RecommendedHackathons limit={5} />
          </div>

          {/* Recommended Projects */}
          <div className="mt-8">
            <RecommendedProjects limit={4} />
          </div>

          {/* Recommended Tools */}
          <div className="mt-8">
            <RecommendedTools limit={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
