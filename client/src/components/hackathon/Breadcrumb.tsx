import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 py-3 px-4 sm:px-0 overflow-x-auto">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 shrink-0">
          {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
          {item.href ? (
            <Link to={item.href} className="font-space text-xs text-gray-500 hover:text-orange-400 transition-colors">{item.label}</Link>
          ) : (
            <span className="font-space text-xs text-gray-400">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
