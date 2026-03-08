import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownItem {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  isActive: boolean;
}

export function NavDropdown({ label, items, isActive }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`relative font-space text-sm font-medium px-4 py-2 transition-colors duration-200 group ${
          isActive ? "text-orange-400" : "text-gray-300 hover:text-white"
        }`}
      >
        {label}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-200 ${
            isActive || open ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
          >
            <div className="w-72 bg-[#0a0a0a] border border-gray-800 rounded-lg shadow-2xl shadow-black/60 overflow-hidden">
              <div className="p-1.5">
                {items.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3.5 py-3 rounded-md hover:bg-white/5 transition-colors duration-150 group"
                      onClick={() => setOpen(false)}
                    >
                      <span className="font-space text-sm font-medium text-white group-hover:text-orange-400 transition-colors duration-150 block">
                        {item.title}
                      </span>
                      <span className="font-space text-xs text-gray-500 leading-relaxed block mt-0.5">
                        {item.description}
                      </span>
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3.5 py-3 rounded-md hover:bg-white/5 transition-colors duration-150 group"
                      onClick={() => setOpen(false)}
                    >
                      <span className="font-space text-sm font-medium text-white group-hover:text-orange-400 transition-colors duration-150 block">
                        {item.title}
                      </span>
                      <span className="font-space text-xs text-gray-500 leading-relaxed block mt-0.5">
                        {item.description}
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
