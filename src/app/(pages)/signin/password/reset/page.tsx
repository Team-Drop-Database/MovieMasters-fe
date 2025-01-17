"use client";

import { useSearchParams } from 'next/navigation'
import {Button} from "@/components/generic/Button";

export default function Page() {
    const searchParams = useSearchParams()

    const passwordResetToken = searchParams.get('token')

    return (
        <div className="flex justify-center mb-[540px]">
            <div className="w-full max-w-sm p-6 rounded-lg mt-6">
                <h1 className="text-4xl font-bold text-center mb-2">Reset password</h1>
                <p className="font-inter text-sm pb-5">Please enter a new password for your account</p>
                <form className="flex flex-col gap-3">
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
                        required
                        className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text"
                    />
                    <Button
                        text="Reset Password"
                    />
                </form>
            </div>
        </div>)
}