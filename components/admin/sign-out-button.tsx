"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

export function SignOutButton({
  variant = "ghost",
  size = "default",
  showLabel = true,
  className,
}: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      className={className || (showLabel ? "w-full justify-start" : "")}
    >
      <LogOut className={showLabel ? "mr-2 h-4 w-4" : "h-5 w-5"} />
      {showLabel && "Sign Out"}
    </Button>
  );
}

