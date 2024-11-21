'use client';

import {useRef, FormEvent, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/generic/Button";

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    //TODO: Replace this with actual login system
    if (username === "test1234" && password === "password123") {
      setErrorMessage(null);
      alert("Login successful!");
    } else {
      setErrorMessage("Incorrect username and/or password. Please try again.");
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6">
        <h1 className="text-4xl font-bold text-center mb-6">Sign in!</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2" ref={formRef}>
          <input
            name="username"
            placeholder="Username"
            minLength={5}
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                                   hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                                   font-[family-name:var(--font-jura)]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength={8}
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black
                                   bg-light_grey hover:bg-light_grey_active hover:duration-300
                                   hover:cursor-text font-[family-name:var(--font-jura)]"
            required
          />

          <div className="text-center mt-4 mb-1">
            <p className="text-sm">
              No account yet?{" "}
              <Link
                href="/signup"
                className="underline hover:cursor-pointer hover:no-underline"
              >
                Register here!
              </Link>
            </p>
          </div>

          <Button
            text="Login"
            onClick={() => formRef.current?.requestSubmit()}
          />
          {errorMessage && <p className="text-red-600 font-medium mt-4 text-center">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
