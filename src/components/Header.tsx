"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/studio_gibby.jpeg";
import { Button } from "./generic/Button";
import { navigateToLogin, navigateToSignup, navigateToWatchlist } from "@/utils/navigation/HomeNavigation";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { isLoggedIn, userDetails } = useAuth();

  return (
    <header className="p-5 w-full flex items-center bg-primary shadow-lg font-[family-name:var(--font-alatsi)]">
      <div className="flex grow items-center gap-[15rem]">
        <Image
          src={logo}
          width={69}
          height={69}
          alt="logo"
          className="rounded-md shadow-md"
        />
        <SearchBar className="w-1/2" />
      </div>
      {isLoggedIn ? (
        <div className="flex gap-5 items-center">
          <Button text="My Watchlist" onClick={navigateToWatchlist} />
          <ProfileButton username={userDetails?.username} />
        </div>
      ) : (
        <div className="flex gap-5">
          <Button text="Register" onClick={navigateToSignup} />
          <Button text="Log in" onClick={navigateToLogin} />
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
  console.log(`Search for ${input}`);
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