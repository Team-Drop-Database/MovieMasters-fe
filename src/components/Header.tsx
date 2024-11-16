"use client"
import React from "react"
import Image from "next/image"
import logo from "@/assets/images/studio_gibby.jpeg"
import { Button } from "./generic/Button"

export default function Header() {
  return (
    <header className="p-5 w-full flex items-center drop-shadow-m bg-primary font-[family-name:var(--font-alatsi)]">
      <div className="flex grow items-center gap-[15rem]">
        <Image 
          src={logo}
          width={69}
          height={69}
          alt="logo"
          className="rounded-md drop-shadow-m"
        />
        <SearchBar className="w-1/2" />
      </div>
      <div className="flex gap-5">
        <Button text="Register" onClick={() => console.log("Navigate to register")}/>
        <Button text="Log in" onClick={() => console.log("Navigate to Login")}/>
      </div>
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
      onChange={(e) => setSearchInput(e.target.value)}
      className={`${props.className} outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey hover:bg-light_grey_active hover:duration-300 hover:cursor-text font-[family-name:var(--font-jura)]`}
    />
  )
}
