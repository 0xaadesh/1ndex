"use client";

import { useState, useTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { DashboardSkeleton } from "./dashboard-skeleton";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticPath, setOptimisticPath] = useState(pathname);

  useEffect(() => {
    setOptimisticPath(pathname);
  }, [pathname]);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
        </header>
        {isPending ? (
          <DashboardSkeleton />
        ) : (
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>
        )}
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
}

