"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setVisible(false);
    }
    if (visible) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible]);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label="More information"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="cursor-help"
      >
        {children}
      </span>
      {visible && (
        <span
          role="tooltip"
          className={cn(
            "absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50",
            "w-64 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-lg",
            "text-xs text-neutral-600 leading-relaxed"
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}

interface InfoIconProps {
  tooltip: string;
  className?: string;
}

export function InfoIcon({ tooltip, className }: InfoIconProps) {
  return (
    <Tooltip content={tooltip} className={className}>
      <svg
        className="w-3.5 h-3.5 text-neutral-300 hover:text-neutral-500 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
      </svg>
    </Tooltip>
  );
}
