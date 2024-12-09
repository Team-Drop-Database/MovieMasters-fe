"use client";
import React from "react";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import {useAuthContext} from "@/contexts/AuthContext";

export default function Home() {
  const { isLoggedIn, userDetails } = useAuthContext();

  return (
    <main className="flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      {isLoggedIn && userDetails !== null ? (
        <LoggedIn userDetails={userDetails} />
      ) : (
        <LoggedOut/>
      )}
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
