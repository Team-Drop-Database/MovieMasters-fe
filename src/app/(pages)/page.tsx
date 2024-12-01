"use client";

import React from "react";
import Cookies from 'js-cookie';
import {useAuth} from "@/hooks/useAuth";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

export default function Home() {
  const {isLoggedIn, userDetails} = useAuth();

  return (
    <main className="flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      {isLoggedIn ? (
        <LoggedIn
          onLogout={() => {
            Cookies.remove("jwt");
          }}
          userDetails={userDetails}
        />
      ) : (
        <LoggedOut/>
      )}
    </main>
  );
}