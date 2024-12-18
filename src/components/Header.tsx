"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo_nobg.png"
import BasicTransitionLink from "./generic/transitions/BasicTransitionLink";
import { useAuthContext } from "@/contexts/AuthContext";
import searchIcon from "@/assets/images/search_icon_black.svg"

export default function Header() {
  const { isLoggedIn, userDetails } = useAuthContext();

  return (
    <header className=" px-5 py-3 w-full flex items-center bg-background_primary shadow-md font-[family-name:var(--font-alatsi)] sticky top-0 z-50">
      <div className="flex grow items-center">
        <div className="basis-[30%]">
          <BasicTransitionLink href={"/"}>
            <div className="flex items-center gap-2 group">
              <Image 
                  src={logo}
                  width={69}
                  height={69}
                  alt="logo"
                  className="rounded-md cursor-pointer"
                  onClick={console.log}
                />
                <h1 className="font-opensans font-bold pt-2 text-3xl"><span className="text-blue-600 group-hover:text-indigo-600 transition-all duration-300">Movie</span> Master</h1>
            </div>
          </BasicTransitionLink>
        </div>
        <SearchBar className="" />
        {isLoggedIn ? (
        <div className="flex gap-5 items-center basis-[30%] justify-end">
          <BasicTransitionLink href={"/mywatchlist"}>
            <div className="py-2 px-3 bg-blue-800 rounded-md text-xl">My Watchlist</div>
          </BasicTransitionLink>
          <ProfileButton username={userDetails?.username} />
        </div>
      ) : (
        <div className="flex gap-5 basis-[30%] justify-end">
          <BasicTransitionLink href={"/signup"}>
          <div className="py-2 px-3 bg-blue-800 rounded-md text-xl hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Sign up</div>
          </BasicTransitionLink>
          <BasicTransitionLink href={"/signin"}>
          <div className="py-2 px-3 bg-blue-800 rounded-md text-xl  hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Log in</div>
          </BasicTransitionLink>
        </div>
      )}
      </div>
    </header>
  );
}

type SearchBarProps = {
  className: string;
};

function SearchBar(props: SearchBarProps) {
  const [searchInput, setSearchInput] = React.useState("");

  return (
    <div className="basis-[40%] mx-auto relative">
      <input
      value={searchInput}
      placeholder="Search for a movie"
      type="text"
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirmSearch(/*searchInput*/);
      }}
      onChange={(e) => setSearchInput(e.target.value)}
      className={`${props.className}  w-full outline-none placeholder-black font-md py-3 px-4 h-fit rounded-3xl text-black bg-gray-500 hover:bg-gray-400 ring-1 ring-slate-500 focus:ring-2 focus:shadow-md focus:bg-gray-200 duration-300 hover:duration-300 font-inter`}
    />
    <Image src={searchIcon} alt={"search_icon.svg"} width={35} height={35} className="absolute top-2 right-3 origin-center cursor-pointer"></Image>
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

function ProfileButton({ username }: ProfileButtonProps) {
  return (
    <div className="flex items-center gap-5 rounded-lg p-2 hover:cursor-pointer hover:bg-background_secondary duration-300 hover:duration-300">
      <p className="details">{username || "Username"}</p>
      <Image
        src={logo}
        width={55}
        height={55}
        alt="Profile"
        className="rounded-full shadow-md"
      />
    </div>
  );
}