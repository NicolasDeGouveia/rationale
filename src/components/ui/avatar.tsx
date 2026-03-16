import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = { sm: "h-6 w-6 text-xs", md: "h-8 w-8 text-sm", lg: "h-10 w-10 text-base" };

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, image, size = "md", className }: AvatarProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name ?? "User"}
        className={cn("rounded-full object-cover bg-neutral-100", sizeClasses[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-neutral-200 text-neutral-600 font-medium flex items-center justify-center shrink-0",
        sizeClasses[size],
        className
      )}
      aria-label={name ?? "User"}
    >
      {getInitials(name)}
    </div>
  );
}
