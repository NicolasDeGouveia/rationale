import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "draft"
  | "decided"
  | "reopened"
  | "archived"
  | "overdue"
  | "due-soon"
  | "missing"
  | "success"
  | "warning"
  | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700",
  draft: "bg-neutral-100 text-neutral-600",
  decided: "bg-blue-50 text-blue-700",
  reopened: "bg-amber-50 text-amber-700",
  archived: "bg-neutral-100 text-neutral-500",
  overdue: "bg-red-50 text-red-700",
  "due-soon": "bg-amber-50 text-amber-700",
  missing: "bg-neutral-100 text-neutral-500",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
