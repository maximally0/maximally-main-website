import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase, getCurrentUserWithProfile } from '@/lib/supabaseClient';

export default function DashboardSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    (async () => {
      const ctx = await getCurrentUserWithProfile();
      if (!ctx) {
        navigate('/login');
        return;
      }
      setUserId(ctx.user.id);
      setEmail(ctx.user.email || ctx.profile.email || '');
      setRole(ctx.profile.role);
      setLoading(false);
    })();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      // Update auth user's email (may trigger confirmation depending on Supabase settings)
      const { error: authErr } = await supabase.auth.updateUser({ email });
      if (authErr) throw authErr;

      // Persist in profiles table as well
      const { error: dbErr } = await supabase
        .from('profiles')
        .update({ email })
        .eq('id', userId);
      if (dbErr) throw dbErr;

      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-press-start text-xl">Settings</h1>
          <Button variant="outline" className="border-gray-700 text-white" onClick={() => navigate('/dashboard')}>Back</Button>
        </div>

        <Card className="p-6 bg-black border-maximally-red/30">
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="text-red-400" role="alert">{error}</div>}
            {success && <div className="text-green-400" role="status">{success}</div>}

            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/50 border-gray-700 text-white" required />
            </div>

            <div>
              <Label className="text-gray-300">Role</Label>
              <div className="text-gray-400 text-sm">{role === 'admin' ? 'admin' : 'user'} (not editable)</div>
            </div>

            <Button type="submit" className="bg-maximally-red hover:bg-maximally-red/90 text-white" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
