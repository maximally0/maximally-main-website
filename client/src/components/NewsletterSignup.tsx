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
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      
      {/* Floating Particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 animate-float pointer-events-none"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + Math.sin(i) * 30}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + (i % 3)}s`,
            backgroundColor: ['#a855f7', '#ec4899', '#06b6d4'][i % 3],
            boxShadow: `0 0 8px ${['#a855f7', '#ec4899', '#06b6d4'][i % 3]}30`
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30 p-8 sm:p-10 md:p-12 lg:p-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-4">
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="font-press-start text-[10px] text-purple-300 tracking-wider">
                STAY UPDATED
              </span>
            </div>
            
            <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              JOIN THE NEWSLETTER
            </h2>
            
            <p className="font-jetbrains text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Get the latest hackathon announcements, builder stories, and exclusive opportunities delivered straight to your inbox.
            </p>
          </div>

          {isSubscribed ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <p className="font-jetbrains text-green-400 text-center">
                You're all set! Check your inbox for confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-black/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 font-jetbrains"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-press-start text-xs px-6 py-6 sm:py-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    SUBSCRIBING...
                  </>
                ) : (
                  'SUBSCRIBE'
                )}
              </Button>
            </form>
          )}

          <p className="font-jetbrains text-gray-500 text-xs text-center mt-6">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
