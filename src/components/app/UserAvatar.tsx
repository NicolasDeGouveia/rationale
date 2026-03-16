import { Avatar } from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ name, image, size = "md" }: UserAvatarProps) {
  return <Avatar name={name} image={image} size={size} />;
}
