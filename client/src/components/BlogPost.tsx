
import { CalendarDays, Clock, Share2 } from 'lucide-react';
import { Button } from './ui/button';

interface BlogPostProps {
  title: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
}

const BlogPost = ({ title, date, readTime, content }: BlogPostProps) => {
  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Pixel Grid Background */}
      <div className="fixed inset-0 bg-black" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Floating Pixels */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }}
        />
      ))}
      
      <article className="relative z-10 max-w-4xl mx-auto px-4 py-12 pt-24">
        <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-maximally-red mb-6 leading-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          {title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 text-gray-300 font-jetbrains">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-maximally-yellow" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-maximally-blue" />
            <span className="text-sm">{readTime}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={sharePost}
            className="ml-auto pixel-button bg-maximally-green hover:bg-maximally-green/90 text-white font-press-start text-xs px-3 py-2"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="prose prose-lg prose-invert max-w-none font-jetbrains text-gray-300 [&>*]:text-gray-300 [&_h1]:text-maximally-red [&_h2]:text-maximally-yellow [&_h3]:text-maximally-blue [&_h4]:text-maximally-green [&_strong]:text-white [&_em]:text-maximally-yellow [&_a]:text-maximally-blue [&_a:hover]:text-maximally-red [&_code]:bg-gray-800 [&_code]:text-maximally-green [&_pre]:bg-gray-900 [&_pre]:border [&_pre]:border-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-maximally-red [&_blockquote]:bg-gray-900/50 [&_blockquote]:text-gray-300 [&_ul]:text-gray-300 [&_ol]:text-gray-300 [&_li]:text-gray-300">
          {content}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
