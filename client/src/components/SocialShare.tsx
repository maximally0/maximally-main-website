import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  variant?: 'button' | 'menu';
}

export default function SocialShare({ title, description, url, hashtags = [], variant = 'button' }: Props) {
  const { toast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareText = description || title;
  const hashtagString = hashtags.join(',');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtagString}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared!",
          description: "Thanks for sharing!",
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleSocialClick = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  if (variant === 'button') {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          SHARE
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute top-full mt-2 right-0 z-50 pixel-card bg-black border-2 border-maximally-yellow p-4 min-w-[200px]">
              <div className="space-y-2">
                <button
                  onClick={() => handleSocialClick('twitter')}
                  className="w-full pixel-button bg-[#1DA1F2] text-white px-4 py-2 font-press-start text-xs hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  TWITTER
                </button>
                <button
                  onClick={() => handleSocialClick('facebook')}
                  className="w-full pixel-button bg-[#4267B2] text-white px-4 py-2 font-press-start text-xs hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  FACEBOOK
                </button>
                <button
                  onClick={() => handleSocialClick('linkedin')}
                  className="w-full pixel-button bg-[#0077B5] text-white px-4 py-2 font-press-start text-xs hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LINKEDIN
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full pixel-button bg-gray-800 text-white px-4 py-2 font-press-start text-xs hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                  {copied ? 'COPIED!' : 'COPY_LINK'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Menu variant - just the social buttons
  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleSocialClick('twitter')}
        className="pixel-button bg-[#1DA1F2] text-white p-2 hover:opacity-80 transition-opacity"
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleSocialClick('facebook')}
        className="pixel-button bg-[#4267B2] text-white p-2 hover:opacity-80 transition-opacity"
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleSocialClick('linkedin')}
        className="pixel-button bg-[#0077B5] text-white p-2 hover:opacity-80 transition-opacity"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </button>
      <button
        onClick={handleCopyLink}
        className="pixel-button bg-gray-800 text-white p-2 hover:bg-gray-700 transition-colors"
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
