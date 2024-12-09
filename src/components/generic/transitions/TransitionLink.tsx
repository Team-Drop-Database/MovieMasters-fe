"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrapper component for a Link that 
 * adds a transition effect.
 * 
 * @param param0 
 * @returns 
 */
export default function TransitionLink({ children, href, transitionHandler, ...props }: 
    { children: React.ReactNode; 
      href: string;
      transitionHandler: (timeOut: (ms: number) => Promise<void>, router: AppRouterInstance) => Promise<void> 
    }) {
  const router = useRouter();

  const executeTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    await transitionHandler(sleep, router);
  };

  return (
    <Link {...props} href={href} onClick={executeTransition}>
      {children}
    </Link>
  );
};