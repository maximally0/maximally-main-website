import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

export default function NewsletterUnsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('Invalid unsubscribe link');
      return;
    }

    handleUnsubscribe();
  }, [email]);

  const handleUnsubscribe = async () => {
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

      setStatus('success');
      setMessage('You have been successfully unsubscribed from our newsletter.');
    } catch (error) {
      setStatus('error');
      setMessage('Failed to unsubscribe. Please try again or contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-orange-500/10 via-orange-400/10 to-gray-800/50 border border-gray-800 p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-orange-400" />
              <h1 className="font-space font-bold text-xl mb-4 text-orange-400">
                PROCESSING...
              </h1>
              <p className="font-space text-gray-400">
                Unsubscribing you from our newsletter
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h1 className="font-space font-bold text-xl mb-4 text-green-300">
                UNSUBSCRIBED
              </h1>
              <p className="font-space text-gray-300 mb-6">
                {message}
              </p>
              <p className="font-space text-gray-400 text-sm mb-6">
                We're sorry to see you go! You won't receive any more newsletters from us.
              </p>
              <div className="space-y-3">
                <Link to="/">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-500">
                    Back to Home
                  </Button>
                </Link>
                <p className="font-space text-gray-500 text-xs">
                  Changed your mind?{' '}
                  <Link to="/" className="text-orange-400 hover:underline">
                    Resubscribe here
                  </Link>
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h1 className="font-space font-bold text-xl mb-4 text-red-300">
                ERROR
              </h1>
              <p className="font-space text-gray-300 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleUnsubscribe}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-500"
                >
                  Try Again
                </Button>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="font-space text-gray-500 text-sm">
            <Mail className="inline w-4 h-4 mr-1" />
            Need help? Contact us at{' '}
            <a href="mailto:support@maximally.in" className="text-orange-400 hover:underline">
              support@maximally.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
