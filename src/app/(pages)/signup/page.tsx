"use client";

import {FormEvent, useRef, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/generic/Button";
import {loginUser} from "@/services/AuthService";
import {useRouter} from "next/navigation";
import {useAuthContext} from "@/contexts/AuthContext";
import {registerUser} from "@/services/UserService";

export default function Page() {
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

      const response = await registerUser(user);

      setFormErrors({email: "", password: "", username: ""});
      setSuccessMessage(response!);
      await loginUser(user.username, user.password);
      await login();
      router.push("/");

    } catch (error) {
      const errorMessage = (error as Error).message;

      if (errorMessage.startsWith("Email")) {
        console.error(errorMessage);
        setFormErrors({email: errorMessage, username: "", password: ""});
      }
      else if (errorMessage.startsWith("Username")) {
        console.error(errorMessage);
        setFormErrors({email: "", username: errorMessage, password: ""});
      }
      else {
        console.error(errorMessage);
        setFormErrors({email: "", username: "", password: ""});
        setErrorMessage((error as Error).message);
      }
    }
  }

  return (
    <div className="flex justify-center mb-[480px]">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6">
        <h1 className="text-4xl font-bold text-center mb-6">Sign up!</h1>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2" ref={formRef}>
            {/* <label className="font-bold" htmlFor="email">Email</label> */}
            <input
                id="email"
                type="email"
                name="email"
                placeholder="email@example.com"
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text"
            />
            {formErrors.email !== "" && <p className="text-base text-red-600">{formErrors.email}</p>}
            {/* <label className="font-bold" htmlFor="username">Username</label> */}
            <input
                id="username"
                name="username"
                placeholder="username"
                minLength={5}
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text"
            />
            {formErrors.username !== "" && <p className="text-base text-red-600">{formErrors.username}</p>}
            {/* <label className="font-bold" htmlFor="password">Password</label> */}
            <input
                id="password"
                type="password"
                name="password"
                placeholder="password"
                minLength={8}
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text"
            />
            {/* <label className="font-bold" htmlFor="confirmPassword">Confirm Password</label> */}
            <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="confirm password"
                required
                className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text"
            />
            <div className="h-1">
              {formErrors.password !== "" && <p className="text-base text-red-600">{formErrors.password}</p>}
              {errorMessage && <p className="text-base text-red-600">{errorMessage}</p>}
              {successMessage && <p className="text-base text-green-600">{successMessage}</p>}
            </div>
            <div className="text-center mb-1">
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
