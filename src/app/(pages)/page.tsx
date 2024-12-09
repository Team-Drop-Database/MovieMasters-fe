"use client";

import React from "react";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import {useAuthContext} from "@/contexts/AuthContext";

export default function Home() {
  const { isLoggedIn, userDetails, logout } = useAuthContext();

  return (
    <main className="flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      {isLoggedIn ? (
        <LoggedIn
          onLogout={() => { logout(); }}
          userDetails={userDetails}
        />
      ) : (
        <LoggedOut/>
      )}
    </main>
  );
}