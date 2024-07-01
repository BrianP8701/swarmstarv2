"use client";
import { ReactNode } from "react";

interface NeonButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  textSize?: string;
  paddingX?: string;
  paddingY?: string;
}

export default function NeonButton({ onClick, children, className = "", style = {}, textSize = "md", paddingX = "8", paddingY = "2" }: NeonButtonProps) {
  return (
    <button
      className={`no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-${textSize} font-semibold leading-6 text-black dark:text-white inline-block ${className}`}
      onClick={onClick}
      style={style}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className={`relative flex space-x-2 items-center z-10 rounded-full bg-white dark:bg-zinc-950 py-${paddingY} px-${paddingX} ring-1 ring-white/10 dark:ring-black/10`}>
        <span>
          {children}
        </span>
        <svg
          fill="none"
          height="16"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
}
