'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

// @ts-ignore
export default function ElementTransition({ children }) {
  useEffect(() => {

    gsap.fromTo(
      '.page-content',
      { opacity: 0, y: 50 }, // start state
      { opacity: 1, y: 0, duration: 1 } // end state
    );

    // Cleanup animation
    return () => {
      gsap.to('.page-content', { opacity: 0, y: 50, duration: 1 });
    };
  }, []);

  return <div className="page-content">{children}</div>;
}
