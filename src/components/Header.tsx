"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo_nobg.png"
import BasicTransitionLink from "./generic/transitions/BasicTransitionLink";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Header() {
  const { isLoggedIn, userDetails } = useAuthContext();

  return (
    <header className="p-5 w-full flex items-center bg-primary shadow-lg font-[family-name:var(--font-alatsi)]">
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
        <SearchBar className="basis-[30%] mx-auto" />
        {isLoggedIn ? (
        <div className="flex gap-5 items-center basis-[30%] justify-end pr-5">
          <BasicTransitionLink href={"/mywatchlist"}>
            <div className="py-2 px-3 bg-blue-800 rounded-md text-xl">My Watchlist</div>
          </BasicTransitionLink>
          <ProfileButton username={userDetails?.username} />
        </div>
      ) : (
        <div className="flex gap-5 basis-[30%] border border-red-500 justify-end pr-5">
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
    <input
      value={searchInput}
      placeholder="Search for a movie"
      type="text"
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirmSearch(/*searchInput*/);
      }}
      onChange={(e) => setSearchInput(e.target.value)}
      className={`${props.className} outline-none placeholder-black py-2 px-4 h-fit rounded-md text-black bg-light_grey hover:bg-light_grey_active duration-300 hover:duration-300 font-[family-name:var(--font-jura)]`}
    />
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