import { useState, useEffect } from "react";

interface Section {
  id: string;
  label: string;
}

interface MobileSectionNavProps {
  sections: Section[];
}

const MobileSectionNav = ({ sections }: MobileSectionNavProps) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show dots after scrolling past hero (300px)
      setIsVisible(window.scrollY > 300);
    };

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <nav 
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 md:hidden flex flex-col gap-2"
      aria-label="Page sections"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${label}`}
          aria-current={activeSection === id ? "true" : undefined}
        >
          {/* Label tooltip */}
          <span className="absolute right-5 px-2 py-1 text-xs font-medium bg-background/90 backdrop-blur-sm border border-border rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
          </span>
          {/* Dot */}
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSection === id
                ? "bg-primary scale-125"
                : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
          />
        </button>
      ))}
    </nav>
  );
};

export default MobileSectionNav;
