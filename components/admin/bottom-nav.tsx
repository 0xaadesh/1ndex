"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Folder } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SignOutButton } from "./sign-out-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect, useTransition } from "react";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Files",
    icon: Folder,
    href: "/admin/files",
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin/files") {
      return pathname === href || pathname.startsWith("/admin/files/");
    }
    return pathname === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Button
              key={item.href}
              variant={active ? "secondary" : "ghost"}
              size="icon"
              onClick={() => handleNavigation(item.href)}
              disabled={isPending}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2",
                active && "bg-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.title}</span>
            </Button>
          );
        })}
        <div className="flex flex-col items-center gap-1">
          {mounted && <ThemeToggle />}
          <span className="text-xs">Theme</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SignOutButton
            variant="ghost"
            size="icon"
            showLabel={false}
            className="h-auto py-2"
          />
          <span className="text-xs">Sign Out</span>
        </div>
      </div>
    </nav>
  );
}

