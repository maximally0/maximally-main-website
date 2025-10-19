import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';

export default function AdminPanel() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-press-start text-xl">Admin Panel</h1>
          <Button variant="outline" className="border-gray-700 text-white" onClick={() => navigate('/dashboard')}>My Dashboard</Button>
        </div>
        <Card className="p-6 bg-black border-maximally-red/30">
          <div>Welcome, Admin. This area is protected.</div>
        </Card>
      </div>
    </div>
  );
}
