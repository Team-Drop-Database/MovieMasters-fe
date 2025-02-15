"use client";

import React from "react";

export interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  enabled?: boolean;
  children?: React.ReactNode;
}

export function Button({ text, onClick, className = "", enabled = true, children }: ButtonProps) {
  return (
    <p
      onClick={() => {if (enabled) {onClick();}}}
      className={`${className} ${enabled ? "hover:cursor-pointer" : "hover:cursor-default"} flex items-center justify-center shadow-md rounded px-3 py-1 bg-accent_blue
        hover:bg-accent_blue_active hover:duration-300 duration-300 font-[family-name:var(--font-alatsi)]`}>
      {children}
      {text}
    </p>
  );
}
