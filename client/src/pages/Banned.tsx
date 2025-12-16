import { useAuth } from '@/contexts/AuthContext';
import { Ban, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Banned() {
  const { moderationStatus, signOut } = useAuth();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const expiresAt = moderationStatus?.ban_expires_at;
  const isPermanent = !expiresAt;
  const reason = moderationStatus?.ban_reason;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-gray-900 border-red-500 border-2 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
          <Ban className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="font-press-start text-xl text-red-500 mb-4">
          ACCOUNT BANNED
        </h1>
        
        <p className="text-gray-300 mb-6">
          Your account has been banned from Maximally due to violations of our community guidelines.
        </p>

        {reason && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-400 mb-1">Reason:</p>
            <p className="text-white">{reason}</p>
          </div>
        )}

        {!isPermanent && expiresAt && (
          <div className="flex items-center justify-center gap-2 text-yellow-500 mb-6">
            <Clock className="w-5 h-5" />
            <span>Ban expires: {formatDate(expiresAt)}</span>
          </div>
        )}

        {isPermanent && (
          <p className="text-red-400 mb-6">
            This is a permanent ban.
          </p>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            If you believe this was a mistake, please contact support.
          </p>
          
          <a 
            href="mailto:support@maximally.in" 
            className="inline-flex items-center gap-2 text-maximally-blue hover:underline"
          >
            <Mail className="w-4 h-4" />
            support@maximally.in
          </a>

          <div className="pt-4">
            <Button 
              onClick={() => signOut()} 
              variant="outline" 
              className="border-gray-600 text-gray-400 hover:text-white"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
