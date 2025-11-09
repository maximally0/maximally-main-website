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
    <Link to={link} className="block">
      <article className="pixel-border bg-[#1a1a1a] p-4 sm:p-5 md:p-6 lg:p-8 shadow-md hover:shadow-xl md:hover:shadow-2xl hover:transform hover:scale-[1.01] md:hover:scale-[1.02] hover:-translate-y-0.5 md:hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Cover Image */}
        {coverImage && (
          <div className="mb-4">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <img
                src={coverImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg pixel-border"
                loading="lazy"
                width="400"
                height="225"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
          <span className="text-xs sm:text-sm font-press-start text-maximally-blue bg-maximally-blue/10 px-3 py-2 rounded inline-block w-fit">
            {category}
          </span>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-maximally-blue text-xs sm:text-sm font-jetbrains">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 flex-shrink-0" />
              <span>{date}</span>
            </div>
            <span>{readTime}</span>
            {authorName && (
              <span>By {authorName}</span>
            )}
          </div>
        </div>

        <h2 className="font-press-start text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-white leading-tight break-words">
          {title}
        </h2>

        <p className="font-jetbrains text-sm sm:text-base md:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">
          {excerpt}
        </p>

        <div className="flex items-center gap-2 text-maximally-blue font-press-start text-xs sm:text-sm group min-h-[44px] sm:min-h-[36px]">
          <span>Read More</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
