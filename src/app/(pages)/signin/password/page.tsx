"use client";

import {FormEvent, useState} from "react";
import {requestForPasswordReset} from "@/services/UserService";
import Image from "next/image";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        try {
            setIsLoading(true);
            setSuccessMessage(null);
            setErrorMessage(null);
            const response = await requestForPasswordReset(email);
            setSuccessMessage(response!);
            setIsLoading(false);
        }
        catch (error) {
            setErrorMessage((error as Error).message);
            setSuccessMessage(null);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center mb-[540px]">
            <div className="w-full max-w-sm p-6 rounded-lg mt-6">
                <h1 className="text-4xl font-bold text-center mb-2">Forgot password</h1>
                <p className="font-inter text-sm pb-5">
                    Please enter the email that you use for signing in
                </p>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="email@example.com"
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
                        {isLoading ? <Image src={"/spin-icon-1.svg"} className="animate-spin" alt={""} width={30}
                                            height={30}></Image> : <p className='text-md'>Request Password Reset</p>}
                    </button>
                </form>
            </div>
        </div>)
}