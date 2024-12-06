// components/PageTransition.js
'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

// @ts-ignore
export default function PageTransition({ children }) {
  useEffect(() => {
    // Animation for when the component is mounted
    gsap.fromTo(
      '.page-content',
      { opacity: 0, y: 50 }, // Initial state
      { opacity: 1, y: 0, duration: 1 } // Final state
    );

    // Cleanup animation for unmount
    return () => {
      gsap.to('.page-content', { opacity: 0, y: 50, duration: 1 });
    };
  }, []);

  return <div className="page-content">{children}</div>;
}
