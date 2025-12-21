import { CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  link: string;
  coverImage?: string;
  authorName?: string;
}

const BlogCard = ({
  title,
  excerpt,
  date,
  readTime,
  category,
  link,
  coverImage,
  authorName
}: BlogCardProps) => {
  return (
    <Link to={link} className="block group">
      <article className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4 sm:p-5 md:p-6 lg:p-8 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Cover Image */}
        {coverImage && (
          <div className="mb-4">
            <div className="relative w-full overflow-hidden border border-purple-500/20" style={{ aspectRatio: '16/9' }}>
              <img
                src={coverImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width="400"
                height="225"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
          <span className="text-xs sm:text-sm font-press-start text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3 py-2 inline-block w-fit">
            {category}
          </span>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm font-jetbrains">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 flex-shrink-0 text-pink-400" />
              <span>{date}</span>
            </div>
            <span>{readTime}</span>
            {authorName && (
              <span>By {authorName}</span>
            )}
          </div>
        </div>

        <h2 className="font-press-start text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-white group-hover:text-purple-300 transition-colors leading-tight break-words">
          {title}
        </h2>

        <p className="font-jetbrains text-sm sm:text-base md:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
          {excerpt}
        </p>

        <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 font-press-start text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]">
          <span>Read More</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
