"use client"
import { Button } from "@/components/generic/Button";
import { navigateToLogin, navigateToSignup } from "@/utils/navigation/HomeNavigation";

export default function Home() {
  return (
    <main className="p-[4rem] flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      <div className="flex flex-col">
        <h1>Welcome to Movie Master</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id sem varius ligula imperdiet euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec posuere pharetra neque, aliquam pretium sem vestibulum eget. Nunc vel nibh vel lorem aliquam varius</p>
      </div>
      <div className="flex gap-5">
        <Button text="Sign up" onClick={navigateToSignup} />
        <Button text="Log in" onClick={navigateToLogin} />
      </div>
    </main>
  );
}
