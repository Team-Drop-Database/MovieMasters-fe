"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/moviemaster1.png"
import BasicTransitionLink from "./generic/transitions/BasicTransitionLink";
import { useAuthContext } from "@/contexts/AuthContext";
import neutral from "@/assets/images/no-profile-pic.jpg"

export default function Header() {
  const { isLoggedIn, userDetails } = useAuthContext();

  return (
    <header className="p-5 w-full flex items-center bg-primary shadow-lg font-[family-name:var(--font-alatsi)]">
      <div className="flex grow items-center gap-[15rem]">
        <BasicTransitionLink href={"/"}>
          <Image
            src={logo}
            width={69}
            height={69}
            alt="logo"
            className="rounded-md shadow-md cursor-pointer"
          />
        </BasicTransitionLink>
        <SearchBar className="w-1/2" />
      </div>
      {isLoggedIn ? (
        <div className="flex gap-5 items-center">
          <BasicTransitionLink href={"/mywatchlist"}>
            <div className="py-2 px-3 bg-blue-800 rounded-md text-xl">My Watchlist</div>
          </BasicTransitionLink>
          <BasicTransitionLink href={"/profile"}>
            <ProfileButton username={userDetails?.username} profileUrl={userDetails?.profileUrl} />
          </BasicTransitionLink>
        </div>
      ) : (
        <div className="flex gap-5">
          <BasicTransitionLink href={"/signup"}>
          <div className="py-2 px-3 bg-blue-800 rounded-md text-xl">Sign up</div>
          </BasicTransitionLink>
          <BasicTransitionLink href={"/signin"}>
          <div className="py-2 px-3 bg-blue-800 rounded-md text-xl">Log in</div>
          </BasicTransitionLink>
        </div>
      )}
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
      placeholder="Search movies"
      type="text"
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirmSearch(/*searchInput*/);
      }}
      onChange={(e) => setSearchInput(e.target.value)}
      className={`${props.className} outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey hover:bg-light_grey_active duration-300 hover:duration-300 font-[family-name:var(--font-jura)]`}
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
  profileUrl?: string;
};

function ProfileButton({ username, profileUrl }: ProfileButtonProps) {
  return (
    <div className="flex items-center gap-5 rounded-lg p-2 hover:cursor-pointer hover:bg-background_secondary duration-300 hover:duration-300">
      <p className="details">{username || "Username"}</p>
      <div className="relative w-[55px] h-[55px]">
        <Image
          src={profileUrl || neutral}
          alt="Profile"
          fill
          className="rounded-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}