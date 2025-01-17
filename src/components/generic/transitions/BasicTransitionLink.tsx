import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TransitionLink from "./TransitionLink";
import { usePathname } from "next/navigation";

/**
 * Uses the TransitionLink component to construct a standard 
 * transition link that can be used between pages. If you want
 * a custom TransitionLink, you can use this component as an 
 * example of how to make one using the TransitionLink component.
 * 
 * @param param0 nested (button-like) elements
 * @returns JSX for a basic/standard transition link
 */
export default function BasicTransitionLink({children, href}: 
    {   children: React.ReactNode; 
        href: string
    }) {

    // Retrieve the path of the current page
    const currentPath = usePathname();

    /**
     * Contains the animation for the standard transition 
     * that this TransitionLink will have.
     * 
     * @param timeOut a sleep/wait utility function
     * @param router the router of this app
     */
    const handleMainTransition = async (
        timeOut: (ms: number) => Promise<void>, 
            router: AppRouterInstance): Promise<void> => {

        // If the current path matches the path where the
        // user wants to navigate to, cancel the transition 
        // (since we're already on that page)
        if(currentPath == href)
            return;

        // Length of the Transition
        const TRANSITION_LENGTH = 150;
    
        // How much time nextjs should be given to load the other 
        // element. This should be fast enough to look smooth, but 
        // not slower than how fast nextjs typically loads it.
        const NEXTJS_LOAD_TIME = 20;
    
        // Grab the main element; the transition will focus on modifying this part
        const main = document.querySelector("main .main-container");
    
        // Initial movement; moves the object right, with a delay \
        // to give it time
        main?.classList.add("transition-all", "ease-in-out");
        main?.classList.add("translate-x-full");
        await timeOut(TRANSITION_LENGTH);
    
        // Instantly move the object far off to the left and change the
        // href so that the other object is loaded
        main?.classList.add("duration-0");
        main?.classList.remove("transition-all", "ease-in-out");
        main?.classList.remove("translate-x-full");
        main?.classList.add("-translate-x-full")
    
        // Important; prevents flickering; do not remove
        await timeOut(NEXTJS_LOAD_TIME)
        router.push(href);
    
        // Add back the transition elements
        main?.classList.remove("duration-0");
        main?.classList.add("transition-all", "ease-in-out");
        await timeOut(TRANSITION_LENGTH);
    
        // Remove the far-left translate effect; forcing the element 
        // to move back to the center
        main?.classList.remove("-translate-x-full")
        await timeOut(TRANSITION_LENGTH);
    
        // Remove leftover transition elements to prepare 
        // for the next transition
        main?.classList.remove("transition-all", "ease-in-out");
      }

      // Return a TransitionLink with the added transition handler
      return <TransitionLink href={href} transitionHandler={handleMainTransition}>{children}</TransitionLink>
}