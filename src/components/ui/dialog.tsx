"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, actions, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className={cn(
        "rounded-xl border border-neutral-200 bg-white shadow-xl p-0 w-full max-w-lg",
        "backdrop:bg-black/40",
        "open:flex open:flex-col",
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-4 flex-1">{children}</div>
      {actions && (
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-neutral-100">
          {actions}
        </div>
      )}
    </dialog>
  );
}
