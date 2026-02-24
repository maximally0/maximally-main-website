import { CalendarDays, Clock, Share2, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.04)_0%,transparent_50%)]" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-orange-500/3 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <article className="relative z-10 max-w-4xl mx-auto px-4 py-12 pt-24">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 font-space text-orange-400 hover:text-orange-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Title */}
        <h1 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-orange-400 via-orange-400 to-blue-400 bg-clip-text text-transparent mb-8 leading-relaxed">
          {title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/30 px-4 py-2">
            <CalendarDays className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-space text-gray-300">{date}</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-gray-700/20 border border-blue-500/40 px-4 py-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-space text-gray-300">{readTime}</span>
          </div>
          <button
            onClick={sharePost}
            className="ml-auto bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white px-4 py-2 font-space font-bold text-xs border border-orange-500/40 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            SHARE
          </button>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-800 p-6 md:p-10">
          <div className="prose prose-lg prose-invert max-w-none font-space
            [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-6
            [&_h1]:font-space font-bold [&_h1]:text-xl [&_h1]:text-white [&_h1]:mt-10 [&_h1]:mb-6
            [&_h2]:font-space font-bold [&_h2]:text-lg [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-6
            [&_h3]:font-space font-bold [&_h3]:text-sm [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-4
            [&_h4]:font-space font-bold [&_h4]:text-xs [&_h4]:text-gray-300 [&_h4]:mt-6 [&_h4]:mb-3
            [&_strong]:text-white [&_strong]:font-bold
            [&_em]:text-orange-400
            [&_a]:text-orange-400 [&_a]:hover:text-orange-400 [&_a]:transition-colors [&_a]:underline [&_a]:underline-offset-4
            [&_code]:bg-gray-900/50 [&_code]:text-orange-400 [&_code]:px-2 [&_code]:py-1 [&_code]:text-sm
            [&_pre]:bg-gray-900 [&_pre]:border [&_pre]:border-gray-800 [&_pre]:p-4
            [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-gray-900/40 [&_blockquote]:text-gray-300 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:my-6
            [&_ul]:space-y-2 [&_ul]:my-6
            [&_ul_li]:text-gray-300 [&_ul_li]:pl-2
            [&_ol]:space-y-2 [&_ol]:my-6
            [&_ol_li]:text-gray-300 [&_ol_li]:pl-2
            [&_li::marker]:text-orange-400">
            {content}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8">
            <Sparkles className="h-10 w-10 text-orange-400 mx-auto mb-4" />
            <h3 className="font-space font-bold text-sm bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
              ENJOYED THIS ARTICLE?
            </h3>
            <p className="font-space text-gray-300 mb-6">
              Explore more insights and join the Maximally community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/blog" 
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white px-6 py-3 font-space font-bold text-xs border border-orange-500/40 transition-all hover:scale-[1.02]"
              >
                MORE ARTICLES
              </Link>
              <Link 
                to="/events" 
                className="bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/30 hover:border-orange-500 text-gray-300 hover:text-white px-6 py-3 font-space font-bold text-xs transition-all"
              >
                VIEW EVENTS
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
