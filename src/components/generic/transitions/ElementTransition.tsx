'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function ElementTransition({ children, startYState }: 
  {children: React.ReactNode, startYState: number}) {
  useEffect(() => {

    gsap.fromTo(
      '.page-content',
      { opacity: 0, y: startYState }, // start state
      { opacity: 1, y: 0, duration: 1 } // end state
    );

    // Cleanup animation
    return () => {
      gsap.to('.page-content', { opacity: 0, y: 50, duration: 1 });
    };
  }, []);

  return <div className="page-content -z-10">{children}</div>;
}
