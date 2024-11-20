"use client"
import { FormEvent, useState } from "react";

export default function Page() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succesfullMessage, setSuccesfullMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const repeatPassword = formData.get('repeatPassword') as string;

    // Check if passwords match
    if (password != repeatPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Create payload without repeatPassword
    const payload = { email, username, password }

    try {
      setErrorMessage(null);

      const response = await fetch("http://localhost:8080/api/v1/users", {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage)
      }

      const result = await response.json();
      setSuccesfullMessage("User created succesfully!")
      console.log("Response:", result);
    } catch (error) {
      console.error("Network error:", error)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="items-center justify-items-center">
      <div className="p-5 font-[family-name:var(--font-jura)] text-2xl">
        <p>Sign up!</p>
      </div>
      <div className="shadow-lg bg-gray-400 rounded p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {errorMessage && (
            <p className="text-red-500">{errorMessage}</p>
          )}
          {succesfullMessage && (
            <p>{succesfullMessage}</p>
          )}
          <input type="email" name="email" placeholder="E-mail" required
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black
              bg-light_grey hover:bg-light_grey_active hover:duration-300 hover:cursor-text font-[family-name:var(--font-jura)]" />
          <input name="username" placeholder="Username" minLength={5} 
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black
              bg-light_grey hover:bg-light_grey_active hover:duration-300 hover:cursor-text
              font-[family-name:var(--font-jura)]" required/>
          <input type="password" name="password" placeholder="Password" minLength={8} required
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black
              bg-light_grey hover:bg-light_grey_active hover:duration-300
              hover:cursor-text font-[family-name:var(--font-jura)]" />
          <input type="password" name="repeatPassword" placeholder="Confirm password" required
            className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black
              bg-light_grey hover:bg-light_grey_active hover:duration-300 hover:cursor-text
              font-[family-name:var(--font-jura)]" />
          <button type="submit" 
            className="drop-shadow-lg rounded px-3 py-1 bg-accent_blue
              hover:bg-accent_blue_active hover:duration-300 hover:cursor-pointer
              font-[family-name:var(--font-alatsi)]">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}