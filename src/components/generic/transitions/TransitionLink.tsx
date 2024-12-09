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

    // // TODO: Het hele animatie ding hieronder kun je beter in een 
    // // callback stoppen die je meegeeft als argument aan
    // // TransitionLink. Op die manier kunnen we verschillende animaties hebben
    // // voor het navigeren naar verschillende paginas.

    // const TRANSITION_LENGTH = 150;

    // // How much time nextjs should be given to load the other 
    // // element. This should be fast enough to look smooth, but 
    // // not slower than how fast nextjs typically loads it.
    // const NEXTJS_LOAD_TIME = 20;

    // const main = document.querySelector("main");

    // // Initial movement; moves the object right, with a delay \
    // // to give it time
    // main?.classList.add("transition-all", "ease-in-out");
    // main?.classList.add("translate-x-full");
    // await sleep(TRANSITION_LENGTH);

    // // Instantly move the object far off to the left and change the
    // // href so that the other object is loaded
    // main?.classList.add("duration-0");
    // main?.classList.remove("transition-all", "ease-in-out");
    // main?.classList.remove("translate-x-full");
    // main?.classList.add("-translate-x-full")

    // // Important; prevents flickering; do not remove
    // await sleep(NEXTJS_LOAD_TIME)
    // router.push(href);

    // // Add back the transition elements
    // main?.classList.remove("duration-0");
    // main?.classList.add("transition-all", "ease-in-out");
    // await sleep(TRANSITION_LENGTH);

    // // Remove the far-left translate effect; forcing the element 
    // // to move back to the center
    // main?.classList.remove("-translate-x-full")
    // await sleep(TRANSITION_LENGTH);

    // // Remove leftover transition elements to prepare 
    // // for the next transition
    // main?.classList.remove("transition-all", "ease-in-out");
  };

  return (
    <Link {...props} href={href} onClick={executeTransition}>
      {children}
    </Link>
  );
};