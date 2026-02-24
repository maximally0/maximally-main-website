import { useState, useEffect } from "react";

const sections = [
  { id: "section-1", label: "Hero" },
  { id: "section-2", label: "Hackathons" },
  { id: "section-3", label: "Senior Council" },
  { id: "section-4", label: "Explore" },
  { id: "section-5", label: "For Companies" },
];

export function DotNavigation() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.findIndex((s) => s.id === entry.target.id);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index].id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3"
      aria-label="Page sections"
    >
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-orange-500/20" />

      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(index)}
          className={`relative z-10 rounded-full transition-all duration-300 ease-out ${
            activeSection === index
              ? "w-3 h-3 bg-orange-500 shadow-lg shadow-orange-500/30"
              : "w-2 h-2 bg-gray-600 hover:bg-gray-400"
          }`}
          aria-label={section.label}
          aria-current={activeSection === index ? "true" : undefined}
        />
      ))}
    </nav>
  );
}

export default DotNavigation;
