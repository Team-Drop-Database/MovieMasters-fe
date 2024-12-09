"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

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
export default function TransitionLink({ children, href, ...props }: 
    { children: React.ReactNode; href: string }) {
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    // TODO: Het hele animatie ding hieronder kun je beter in een 
    // callback stoppen die je meegeeft als argument aan
    // TransitionLink. Op die manier kunnen we verschillende animaties hebben
    // voor het navigeren naar verschillende paginas.

    const TRANSITION_LENGTH = 150;

    // How much time nextjs should be given to load the other 
    // element. This should be fast enough to look smooth, but 
    // not slower than how fast nextjs typically loads it.
    const NEXTJS_LOAD_TIME = 20;

    const main = document.querySelector("main");
    main?.classList.add("transition-all", "ease-in-out");

    main?.classList.add("translate-x-full");

    await sleep(TRANSITION_LENGTH);
    main?.classList.add("duration-0");
    main?.classList.remove("transition-all", "ease-in-out");
    main?.classList.remove("translate-x-full");
    main?.classList.add("-translate-x-full")
    await sleep(NEXTJS_LOAD_TIME)
    router.push(href);

    main?.classList.remove("duration-0");
    main?.classList.add("transition-all", "ease-in-out");

    await sleep(TRANSITION_LENGTH);
    main?.classList.remove("-translate-x-full")
    await sleep(TRANSITION_LENGTH);

    main?.classList.remove("transition-all", "ease-in-out");
  };

  return (
    <Link {...props} href={href} onClick={handleTransition}>
      {children}
    </Link>
  );
};