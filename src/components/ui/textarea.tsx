import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCount, maxLength, className, id, value, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900",
            "placeholder:text-neutral-400 resize-y min-h-[80px]",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-neutral-200 focus:ring-neutral-900",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <div className="flex justify-between">
          {error ? (
            <p id={`${textareaId}-error`} className="text-xs text-red-600">{error}</p>
          ) : helperText ? (
            <p className="text-xs text-neutral-500">{helperText}</p>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <p className="text-xs text-neutral-400">{currentLength}/{maxLength}</p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
