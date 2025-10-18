import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check for the dashboard's specific scrolling element
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      // If it exists, scroll it to the top
      mainContent.scrollTo(0, 0);
    } else {
      // Otherwise, scroll the whole window (for public pages)
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;