"use client";

import { useSearchParams } from 'next/navigation'
import {FormEvent, useState} from "react";
import {resetPassword} from "@/services/UserService";

export default function Page() {
    const searchParams = useSearchParams();
    const passwordResetToken = searchParams.get('passwordResetToken');

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not mach!");
            return;
        }

        try {
            setSuccessMessage(null);
            setErrorMessage(null);
            const response = await resetPassword(passwordResetToken!, password);
            setSuccessMessage(response!);
        }
        catch (error) {
            setErrorMessage((error as Error).message);
            setSuccessMessage(null);
        }
    }

    return (
        <div className="flex justify-center mb-[540px]">
            <div className="w-full max-w-sm p-6 rounded-lg mt-6">
                <h1 className="text-4xl font-bold text-center mb-2">Reset password</h1>
                <p className="font-inter text-sm pb-5">Please enter a new password for your account</p>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="confirm password"
                        minLength={8}
                        required
                        className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text"
                    />
                    <div>
                        {successMessage && <p className="text-base text-green-600">{successMessage}</p>}
                        {errorMessage && <p className="text-base text-red-600">{errorMessage}</p>}
                    </div>
                    <button
                        className='hover:cursor-pointer flex items-center justify-center shadow-md rounded px-3 py-1 bg-accent_blue
                        hover:bg-accent_blue_active hover:duration-300 duration-300 font-[family-name:var(--font-alatsi)]`'
                    >
                        <p className="text-md">Reset Password</p>
                    </button>
                </form>
            </div>
        </div>)
}