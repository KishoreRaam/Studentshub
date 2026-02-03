import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Section {
  id: string;
  path: string;
  elementId?: string;
  offset?: number;
}

export function useScrollTracking(sections: Section[]) {
  const [activeSection, setActiveSection] = useState<string>('/');
  const location = useLocation();

  useEffect(() => {
    // If not on homepage, set active section based on current route
    // This ensures Resources page and other pages show as active
    if (location.pathname !== '/') {
      setActiveSection(location.pathname);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header height
      
      let currentSection = '/';
      
      // Check each section from bottom to top
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        
        if (section.elementId) {
          const element = document.getElementById(section.elementId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            
            // If we're past this section, make it active
            if (scrollPosition >= elementTop - 100) {
              currentSection = section.path;
              break;
            }
          }
        } else if (section.offset !== undefined) {
          if (scrollPosition >= section.offset) {
            currentSection = section.path;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, sections]);

  return activeSection;
}
