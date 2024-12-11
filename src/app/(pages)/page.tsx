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
          // Note: the extra 'as...' is to prevent typescript from complaining. By 
          // default it expects the object to be either valid data or 'undefined'.
          userDetails={userDetails as {username: string, userId: number} | undefined}
        />
      ) : (
        <LoggedOut/>
      )}
    </main>
  );
}