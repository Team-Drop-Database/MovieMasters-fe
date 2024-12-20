"use client";

import {FormEvent, useRef, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/generic/Button";
import {loginUser} from "@/services/AuthService";
import {useRouter} from "next/navigation";
import {useAuthContext} from "@/contexts/AuthContext";

export default function Page() {
  const STATUS_CREATED = 201;

  const formRef = useRef<HTMLFormElement | null>(null);

  const [formErrors, setFormErrors] = useState({
    email: "",
    username: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { login } = useAuthContext();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setFormErrors({email: "", username: "", password: "Passwords do not match!"});
      return;
    }

    const user = {email, username, password};

    try {
      setErrorMessage(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/users`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(user),
      });

      if (response.status === STATUS_CREATED) {
        setFormErrors({email: "", password: "", username: ""});
        setSuccessMessage("Your account has been created");
        await loginUser(user.username, user.password);
        await login();
        router.push("/");
        return;
      }

      const userErrorMessage = await response.text();

      if (userErrorMessage.startsWith("Email")) {
        console.error(userErrorMessage);
        setFormErrors({email: userErrorMessage, username: "", password: ""});
        return;
      }

      if (userErrorMessage.startsWith("Username")) {
        console.error(userErrorMessage);
        setFormErrors({email: "", username: userErrorMessage, password: ""});
        return;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message);
    }
  }

  return (
    <div className="flex justify-center mb-[480px]">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6">
        <h1 className="text-4xl font-bold text-center mb-6">Sign up!</h1>
        <div className="bg-background_primary w-auto p-5 rounded shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2" ref={formRef}>
            <label className="font-bold" htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Email"
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
            />
            {formErrors.email !== "" && <p className="font-[family-name:var(--font-jura)] text-base text-red-600">{formErrors.email}</p>}
            <label className="font-bold" htmlFor="username">Username</label>
            <input
                id="username"
                name="username"
                placeholder="Enter Username"
                minLength={5}
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
            />
            {formErrors.username !== "" && <p className="font-[family-name:var(--font-jura)] text-base text-red-600">{formErrors.username}</p>}
            <label className="font-bold" htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                name="password"
                placeholder="Create Password"
                minLength={8}
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
            />
            <label className="font-bold" htmlFor="confirmPassword">Confirm Password</label>
            <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)]"
            />
            {formErrors.password !== "" && <p className="font-[family-name:var(--font-jura)] text-base text-red-600">{formErrors.password}</p>}
            {errorMessage && <p className="font-[family-name:var(--font-jura)] text-base text-red-600">{errorMessage}</p>}
            {successMessage && <p className="font-[family-name:var(--font-jura)] text-base text-green-600">{successMessage}</p>}
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
        </div>
      </div>
    </div>
  );
}
