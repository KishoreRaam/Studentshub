import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 *
 * Automatically scrolls to the top of the page whenever the route changes.
 * This ensures users always start at the top when navigating to a new page.
 *
 * Usage: Place this component inside your Router, before your Routes.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated
    });
  }, [pathname]); // Trigger whenever the route path changes

  // This component doesn't render anything
  return null;
}
