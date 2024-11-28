"use client"
import React, {useEffect} from "react";
import LoggedOut from "./LoggedOut";
import Cookies from "js-cookie";
import LoggedIn from "./LoggedIn";

export default function Home() {
  const [loggedIn, setLoggedIn] = React.useState(false)

  useEffect(() => {
    const token = Cookies.get("jwt");
    setLoggedIn(!!token);
  }, []);

  function handleLogout() {
    Cookies.remove("jwt");
    setLoggedIn(false);
  }

  return (
    <main className="flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      { loggedIn ? <LoggedIn /> : <LoggedOut /> }
    </main>
  );
}

