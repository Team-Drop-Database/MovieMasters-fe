"use client"
import React from "react"
import Image from "next/image"
import logo from "@/assets/images/moviemaster1.png"
import { Button } from "./generic/Button"
import {navigateToHome, navigateToLogin, navigateToSignup, navigateToWatchlist} from "@/utils/navigation/HomeNavigation"

export default function Header() {
  const isLoggedIn = false

  return (
    <header className="p-5 w-full flex items-center bg-primary shadow-lg font-[family-name:var(--font-alatsi)]">
      <div className="flex grow items-center gap-[15rem]">
        <Image 
          src={logo}
          width={69}
          height={69}
          alt="logo"
          className="rounded-md shadow-md cursor-pointer"
          onClick={navigateToHome}
        />
        <SearchBar className="w-1/2" />
      </div>
      { isLoggedIn ?
        <div className="flex gap-5 items-center">
          <Button text="My Watchlist" onClick={navigateToWatchlist} />
          <ProfileButton />
        </div> :
        <div className="flex gap-5">
          <Button text="Sign up" onClick={navigateToSignup}/>
          <Button text="Log in" onClick={navigateToLogin}/>
        </div>
      }
    </header>
  )
}

type SearchBarProps = {
  className: string,
}

function SearchBar(props: SearchBarProps) {
  const [searchInput, setSearchInput] = React.useState("")

  return (
    <input
      value={searchInput}
      placeholder="Search movies"
      type="text"
      onKeyDown={(e) => { if (e.key === "Enter") onConfirmSearch(searchInput) }}
      onChange={(e) => setSearchInput(e.target.value)}
      className={`${props.className} outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey hover:bg-light_grey_active duration-300 hover:duration-300 font-[family-name:var(--font-jura)]`}
    />
  )
}

function onConfirmSearch(input: string) {
  console.log(`Search for ${input}`)
}

function ProfileButton() {
  /* TODO: add dropdown functionality */
  return (
    <div className="flex items-center gap-5 rounded-lg p-2 hover:cursor-pointer hover:bg-background_secondary duration-300 hover:duration-300">
      <p className="details">
        Username  {/* TODO: Username will be injected once known */}
      </p>
      <Image 
        src={logo}
        width={55}
        height={55}
        alt="Profile"
        className="rounded-full shadow-md"
      />
    </div>
  )
}
