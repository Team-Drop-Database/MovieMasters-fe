"use client";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import logo from "@/assets/images/logo_nobg.png"
import BasicTransitionLink from "./generic/transitions/BasicTransitionLink";
import { useAuthContext } from "@/contexts/AuthContext";
import searchIcon from "@/assets/images/search_icon_black.svg"
import neutral from "@/assets/images/no-profile-pic.jpg"
import hamburgerIcon from "@/assets/images/hamburger.svg"
import {redirect, usePathname} from "next/navigation"

export default function Header() {
  const {isLoggedIn, userDetails, logout} = useAuthContext();

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
    <header ref={headerRef}
            className={`z-50 transition-transform ${isSticky ? 'sticky -top-10 translate-y-10' : 'translate-y-0'}`}>
      <div
        className="sm:min-h-[86px] sm:px-7 px-4 max-sm:px-2 py-2 w-full flex items-center bg-background_primary md:shadow-md font-[family-name:var(--font-alatsi)]">
        <div className="flex grow items-center">
          <div className="basis-[30%]">
            <BasicTransitionLink href={"/"}>
              <div className="flex items-center md:gap-2 group">
                <Image
                  src={logo}
                  width={55}
                  height={55}
                  alt="logo"
                  className="rounded-md cursor-pointer sm:scale-125 sm:mr-2"
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
                <div
                  className="max-sm:hidden md:text-md lg:text-lg py-2 px-3 bg-blue-800 rounded-md hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">My
                  Watchlist
                </div>
              </BasicTransitionLink>
              <ProfileButton username={userDetails?.username} profileUrl={userDetails?.profileUrl} logout={logout}
                             handleDropdownMenu={handleIsDropdownMenuShown}/>
            </div>
          ) : (
            <div className="flex sm:gap-5 basis-[30%] justify-end">
              <BasicTransitionLink href={"/signup"}>
                <div
                  className="max-sm:hidden sm:text-xl py-2 px-3 bg-blue-800 rounded-md hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Sign
                  up
                </div>
              </BasicTransitionLink>
              <BasicTransitionLink href={"/signin"}>
                <div
                  className="max-sm:hidden sm:text-xl py-2 px-3 bg-blue-800 rounded-md hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Log
                  in
                </div>
              </BasicTransitionLink>
              <button className="sm:hidden" ref={dropdownMenuButtonRef}
                      onClick={handleIsDropdownMenuShown}>
                <Image src={hamburgerIcon} alt="hamburger icon" width={40} height={40}></Image>
              </button>
            </div>
          )}
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
          <BasicTransitionLink href={"/profile"}>
            <p className="font-[family-name:var(--font-alatsi)] p-3">Profile</p>
          </BasicTransitionLink>
          <BasicTransitionLink href={"/mywatchlist"}>
            <p className="font-[family-name:var(--font-alatsi)] p-3">Watchlist</p>
          </BasicTransitionLink>
          <hr className="w-2/3 mx-2"/>
          <p className="font-[family-name:var(--font-alatsi)] p-3 cursor-pointer" onClick={props.logout}>Log
            out</p>
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
    <div className="grow mx-auto relative">
      <div className="flex items-center">
        <input
          value={searchInput}
          placeholder="Search for a movie"
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirmSearch(searchInput);
          }}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`${props.className} w-full sm:text-[1rem] text-sm outline-none placeholder-black py-[0.6rem] px-4 h-fit rounded-3xl text-black bg-gray-500 hover:bg-gray-400 ring-1 ring-slate-500 focus:ring-2 focus:shadow-md focus:bg-gray-200 duration-300 hover:duration-300 font-inter`}
        />
        <Image src={searchIcon}
               alt={"search_icon.svg"}
               width={25}
               height={25}
               className="absolute right-2 cursor-pointer sm:scale-[140%] sm:mr-2"
               onClick={() => onConfirmSearch(searchInput)}></Image>
      </div>
    </div>
  );
}

function onConfirmSearch(input: string) {
  redirect(`/search?title=${input}`);
}

type ProfileButtonProps = {
  username?: string;
  profileUrl?: string;
  logout: () => void;
  handleDropdownMenu: () => void;
};

function ProfileButton({username, profileUrl, logout}: ProfileButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-button-dropdown")) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative profile-button-dropdown">
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-5 rounded-lg p-2 hover:cursor-pointer hover:bg-background_secondary duration-300 hover:duration-300"
      >
        <p className="details">{username || "Username"}</p>
        <div className="relative w-[55px] h-[55px]">
          <Image
            src={profileUrl || neutral}
            alt="Profile"
            fill
            sizes="55px"
            className="rounded-full object-cover shadow-md"
          />
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-background_secondary rounded-lg shadow-lg z-50">
          <BasicTransitionLink href="/profile">
            <div className="p-2 hover:bg-background_primary cursor-pointer rounded-t-lg">
              My Profile
            </div>
          </BasicTransitionLink>
          <BasicTransitionLink href="/friends">
            <div className="p-2 hover:bg-background_primary cursor-pointer rounded-b-lg">
              Friends
            </div>
          </BasicTransitionLink>
          <div
            className="text-red-600 p-2 hover:bg-background_primary cursor-pointer rounded-b-lg"
            onClick={() => {
              logout();
              closeDropdown();
            }}
          >Logout
          </div>
        </div>
      )}
    </div>
  );
}