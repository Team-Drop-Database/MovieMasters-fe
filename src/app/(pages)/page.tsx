"use client"
import React from "react";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";

export default function Home() {
  const loggedIn = false

  return (
    <main className="flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      { loggedIn ? <LoggedIn /> : <LoggedOut /> }
    </main>
  );
}

