"use client"
import React from "react";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";

export default function Home() {
  const loggedIn = true

  return (
    <main className="flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      { loggedIn ? <LoggedIn /> : <LoggedOut /> }
    </main>
  );
}

export type MovieListResponse = {
  page: number
  results: MovieItemResponse[]
}

export type MovieItemResponse = {
  original_title: string
  poster_path: string
}
