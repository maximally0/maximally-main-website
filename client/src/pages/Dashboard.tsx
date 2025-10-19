import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

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
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-press-start text-xl">Dashboard</h1>
          <Button asChild className="bg-maximally-red hover:bg-maximally-red/90 text-white">
            <Link to="/dashboard/settings">Settings</Link>
          </Button>
        </div>

        <Card className="p-6 bg-black border-maximally-red/30">
          <div className="space-y-2">
            <div><span className="text-gray-400">Name:</span> <span className="text-white">{name}</span></div>
            <div><span className="text-gray-400">Email:</span> <span className="text-white">{email}</span></div>
            <div><span className="text-gray-400">Role:</span> <span className="text-white capitalize">{role}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
