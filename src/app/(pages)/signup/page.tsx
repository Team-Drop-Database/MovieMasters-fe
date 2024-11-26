"use client";

import {FormEvent, useRef, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/generic/Button";

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    // Check if passwords match
    if (password !== repeatPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const payload = {email, username, password};

    try {
      setErrorMessage(null);
      const response = await fetch("http://localhost:8080/api/v1/users", {
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setSuccessMessage("User created successfully!");
      console.log("Response:", result);
    } catch (error) {
      console.error("Network error:", error);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setErrorMessage("An unkown error occured: " + (error as Error).message);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6">
        <h1 className="text-4xl font-bold text-center mb-6">Sign up!</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2" ref={formRef}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
          />
          <input
            name="username"
            placeholder="Username"
            minLength={5}
            required
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength={8}
            required
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Confirm password"
            required
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
          />

          <div className="text-center mt-4 mb-1">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="underline hover:cursor-pointer hover:no-underline"
              >
                Sign in here!
              </Link>
            </p>
          </div>

          <Button
            text="Create Account"
            onClick={() => formRef.current?.requestSubmit()}
          />
        </form>
        {errorMessage && (<p className="text-red-600 font-medium mt-4 text-center">{errorMessage}</p>)}
        {successMessage && (<p className="text-green-600 font-medium mt-4 text-center">{successMessage}</p>)}
      </div>
    </div>
  );
}