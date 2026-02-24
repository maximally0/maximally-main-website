import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setIsSubscribed(true);
      setEmail('');
      toast({
        title: 'Successfully Subscribed!',
        description: 'You\'ll receive our latest updates and hackathon news.',
      });
    } catch (error) {
      toast({
        title: 'Subscription Failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-gray-900/50 border border-gray-800 p-8 sm:p-12 md:p-16">
          <div className="text-center mb-8">
            <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block">
              NEWSLETTER
            </span>
            
            <h2 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Stay in the Ecosystem
            </h2>
            
            <p className="font-space text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Hackathon announcements, builder spotlights, and Senior Council insights — delivered when there's something worth reading. No noise.
            </p>
          </div>

          {isSubscribed ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <Check className="w-7 h-7 text-green-400" />
              </div>
              <p className="font-space text-green-400 text-center text-sm">
                You're all set! Check your inbox for confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 font-space"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-space text-sm font-medium px-6 py-6 sm:py-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          )}

          <p className="font-space text-gray-600 text-xs text-center mt-6">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
