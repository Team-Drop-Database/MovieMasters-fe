'use client';

import {useRef, FormEvent, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/generic/Button";
import { useRouter } from "next/navigation";
import {loginUser} from "@/services/AuthService";
import {useAuthContext} from "@/contexts/AuthContext";

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter();
  const { login } = useAuthContext();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    console.log('inside');
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      await loginUser(username, password);
      await login();
      router.push("/");
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'An unexpected error has occurred. Please try again.';
      setErrorMessage(errorMessage);
    }
  }

  return (
    <div className="flex justify-center mb-[540px]">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6">
        <h1 className="text-4xl font-bold text-center mb-6">Sign in!</h1>
        <div className="">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2" ref={formRef}>
            <input
                id="username"
                name="username"
                placeholder="Enter your username"
                minLength={5}
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                                   hover:bg-light_grey_active hover:duration-300 hover:cursor-text"
                required
            />
            <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                minLength={8}
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black
                                   bg-light_grey hover:bg-light_grey_active hover:duration-300
                                   hover:cursor-text"
                required
            />
            <div className="h-3">
              {errorMessage && <p className="text-base text-red-600">{errorMessage}</p>}
            </div>
            <div className="text-center mb-1">
              <p className="text-sm">
                No account yet?{" "}
                <Link
                    href="/signup"
                    className="underline hover:cursor-pointer hover:no-underline"
                >
                  Register here!
                </Link>
              </p>
              <p className="text-sm gap2">Forgot your password?{" "}
                <Link href="signin/password" className="underline hover:cursor-pointer hover:no-underline">
                  Request a new one!
                </Link>
              </p>
            </div>

            <Button
                text="Login"
                onClick={() => formRef.current?.requestSubmit()}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
