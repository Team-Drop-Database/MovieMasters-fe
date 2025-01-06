"use client";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import logo from "@/assets/images/logo_nobg.png"
import BasicTransitionLink from "./generic/transitions/BasicTransitionLink";
import { useAuthContext } from "@/contexts/AuthContext";
import searchIcon from "@/assets/images/search_icon_black.svg"
import hamburgerIcon from "@/assets/images/hamburger.svg"
import { usePathname } from 'next/navigation'


export default function Header() {
  const { isLoggedIn, userDetails, logout } = useAuthContext();

  const headerRef = useRef<HTMLDivElement | null>(null);
  const dropdownMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  const [isDropdownMenuShown, setIsDropdownMenuShown] = useState(false);

  // Adds the 'sticky' effect to the header/navbar.
  useEffect(() => {
    const navBar = headerRef
      .current as HTMLDivElement;

    // initial offset position of the header
    const sticky = navBar?.offsetTop as number;

    const handleScroll = () => {
      if (window.scrollY >= sticky + navBar?.clientHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Make sure to have the sticky effect apply initially, if necessary
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    // Makes sure to clean up the event listener aftwards
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleIsDropdownMenuShown() {
    setIsDropdownMenuShown(!isDropdownMenuShown);
  }
  
  return (
    <header ref={headerRef}>
      <div className={`px-5 max-sm:px-2 py-2 w-full flex items-center bg-background_primary md:shadow-md font-[family-name:var(--font-alatsi)] z-50 transition-transform ${isSticky ? 'sticky -top-10 translate-y-10' : 'translate-y-0'}`}>
        <div className="flex grow items-center">
          <div className="basis-[30%]">
            <BasicTransitionLink href={"/"}>
              <div className="flex items-center md:gap-2 group">
                <Image
                    src={logo}
                    width={60}
                    height={60}
                    alt="logo"
                    className="rounded-md cursor-pointer"
                />
                <h1 className="max-md:hidden font-opensans font-bold pt-2 text-lg xl:text-3xl"><span
                    className="text-blue-600 group-hover:text-indigo-600 transition-all duration-300">Movie</span> Master
                </h1>
              </div>
            </BasicTransitionLink>
          </div>
          <SearchBar className=""/>
          {isLoggedIn ? (
              <div className="flex items-center basis-[30%] sm:gap-5 sm:pl-3 justify-end">
                <BasicTransitionLink href={"/mywatchlist"}>
                  <div className="max-sm:hidden md:text-md lg:text-lg py-2 px-3 bg-blue-800 rounded-md hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Watchlist</div>
                </BasicTransitionLink>
                <BasicTransitionLink href={"/profile"}>
                  <ProfileButton username={userDetails?.username}/>
                </BasicTransitionLink>
              </div>
          ) : (
              <div className="flex sm:gap-5 basis-[30%] justify-end">
                <BasicTransitionLink href={"/signup"}>
                  <div
                      className="max-sm:hidden md:text-md lg:text-lg py-2 px-3 bg-blue-800 rounded-md hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Sign
                    up
                  </div>
                </BasicTransitionLink>
                <BasicTransitionLink href={"/signin"}>
                  <div
                      className="max-sm:hidden md:text-md lg:text-lg py-2 px-3 bg-blue-800 rounded-md hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Log
                    in
                  </div>
                </BasicTransitionLink>
              </div>
          )}
          <button ref={dropdownMenuButtonRef} onClick={handleIsDropdownMenuShown} className="sm:hidden"><
            Image src={hamburgerIcon} alt="hamburger icon"></Image>
          </button>
        </div>
      </div>
      {isDropdownMenuShown ? <DropdownMenu isLoggedIn={isLoggedIn} logout={logout}/> : ''}
    </header>
  );
}

type DropdownMenuProps = {
  isLoggedIn: boolean,
  logout: () => void
}

function DropdownMenu(props: DropdownMenuProps) {
  const currentPath = usePathname();

  const renderMenuItems = useCallback(() => {
    switch (currentPath) {
      case "/signup": {
        return <BasicTransitionLink href={"/signin"}>
          <p className="font-[family-name:var(--font-alatsi)] p-3">Log in</p>
        </BasicTransitionLink>;
      }
      case "/signin": {
        return <BasicTransitionLink href={"/signup"}>
          <p className="font-[family-name:var(--font-alatsi)] p-3">Sign up</p>
        </BasicTransitionLink>;
      }
      default: {
        return <div><BasicTransitionLink href={"/signup"}>
          <p className="font-[family-name:var(--font-alatsi)] p-3">Sign up</p>
        </BasicTransitionLink>
          <BasicTransitionLink href={"/signin"}>
            <p className="font-[family-name:var(--font-alatsi)] p-3">Log in</p>
          </BasicTransitionLink></div>;
      }
    }
  }, [currentPath]);

    return (
        <div className="w-full bg-background_primary sm:hidden">
          {props.isLoggedIn
              ?
              (<div>
                <BasicTransitionLink href={"/mywatchlist"}>
                  <p className="font-[family-name:var(--font-alatsi)] p-3">Watchlist</p>
                </BasicTransitionLink>
                <hr className="w-2/3 mx-2"/>
                <p className="font-[family-name:var(--font-alatsi)] p-3 cursor-pointer" onClick={props.logout}>Log out</p>
              </div>)
              :
              (<div>{renderMenuItems()}</div>)
          }
        </div>
    );
}

type SearchBarProps = {
  className: string;
};

function SearchBar(props: SearchBarProps) {
  const [searchInput, setSearchInput] = React.useState("");

  return (
      <div className="basis-[40%] max-sm:basis-[80%] mx-auto relative">
        <div className="flex items-center">
          <input
              value={searchInput}
              placeholder="Search for a movie"
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirmSearch(/*searchInput*/);
          }}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`${props.className} w-full outline-none placeholder-black text-lg max-sm:text-xs max-md:text-sm py-2 px-4 h-fit rounded-3xl text-black bg-gray-500 hover:bg-gray-400 ring-1 ring-slate-500 focus:ring-2 focus:shadow-md focus:bg-gray-200 duration-300 hover:duration-300 font-inter`}
      />
        <Image src={searchIcon} alt={"search_icon.svg"} width={25} height={25} className="absolute right-2 cursor-pointer"></Image></div>
    </div>
  );
}

// Note: commented out the 'input' argument to 
// prevent Typescript error
function onConfirmSearch(/*input: string*/) {
  //TODO: Make search functional for the header
}

type ProfileButtonProps = {
  username?: string;
};

// kijk naar image lengte!
function ProfileButton({ username }: ProfileButtonProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-background_secondary duration-300 hover:duration-300">
      <p className="font-[family-name:var(--font-jura)] max-sm:text-sm max-md:text-md max-lg:text-lg">{username || "Username"}</p>
      <Image
        src={logo}
        alt="Profile"
        className="max-sm:hidden w-10 max-md:w-6 max-lg:w-8 rounded-full shadow-md"
      />
    </div>
  );
}