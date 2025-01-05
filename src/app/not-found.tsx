"use client";

import BasicTransitionLink from "@/components/generic/transitions/BasicTransitionLink";

export default function NotFound() {
    return (
        <div>
            <h1 className="text-center text-9xl font-[family-name:var(--font-alatsi)">404</h1>
            <p className="text-center font-[family-name:var(--font-alatsi)">The page that you are looking for does not exist</p>
            <br/>
            <div className="flex justify-center items-center">
                <BasicTransitionLink href={"/"}>
                    <div className="py-2 px-3 bg-blue-800 rounded-md font-[family-name:var(--font-alatsi)] text-xl hover:scale-110 transition-all hover:bg-indigo-700 hover:opacity-100 hover:ring-1">Go To Home</div>
                </BasicTransitionLink>
            </div>
        </div>
    )
}