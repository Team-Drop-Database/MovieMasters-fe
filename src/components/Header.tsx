"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/moviemaster1.png"
import { Button } from "./generic/Button";
import { navigateToWatchlist } from "@/utils/navigation/HomeNavigation";
import {useAuthContext} from "@/contexts/authContext";
import TransitionLink from "./generic/transitions/TransitionLink"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function Header() {
  const { isLoggedIn, userDetails } = useAuthContext();

  return (
    <header className="p-5 w-full flex items-center bg-primary shadow-lg font-[family-name:var(--font-alatsi)]">
      <div className="flex grow items-center gap-[15rem]">
        <TransitionLink href={"/"}>
          <Image 
            src={logo}
            width={69}
            height={69}
            alt="logo"
            className="rounded-md shadow-md cursor-pointer"
            onClick={console.log}
          />
        </TransitionLink>
        <SearchBar className="w-1/2" />
      </div>
      {isLoggedIn ? (
        <div className="flex gap-5 items-center">
          <Button text="My Watchlist" onClick={navigateToWatchlist} />
          <ProfileButton username={userDetails?.username} />
        </div>
      ) : (
        <div className="flex gap-5">
          <TransitionLink href={"/signup"}><div className="py-2 px-3 bg-blue-800 rounded-md text-xl">Sign up</div></TransitionLink>
          <TransitionLink href={"/signin"}><div className="py-2 px-3 bg-blue-800 rounded-md text-xl">Log in</div></TransitionLink>
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
        if (e.key === "Enter") onConfirmSearch(searchInput);
      }}
      onChange={(e) => setSearchInput(e.target.value)}
      className={`${props.className} outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey hover:bg-light_grey_active duration-300 hover:duration-300 font-[family-name:var(--font-jura)]`}
    />
  );
}

function onConfirmSearch(input: string) {
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