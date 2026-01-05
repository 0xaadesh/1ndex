"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Folder, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { FolderWithChildren } from "@/lib/files";

interface SidebarFolderTreeProps {
  folders: FolderWithChildren[];
  currentFolderId?: string | null;
  basePath?: string;
  level?: number;
}

export function SidebarFolderTree({
  folders,
  currentFolderId,
  basePath = "",
  level = 0,
}: SidebarFolderTreeProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleFolderClick = (folderId: string) => {
    const path = basePath ? `${basePath}/f/${folderId}` : `/f/${folderId}`;
    router.push(path);
  };

  if (folders.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-1", level > 0 && "ml-4")}>
      {folders.map((folder) => {
        const hasChildren = folder.children.length > 0;
        const isActive = currentFolderId === folder.id;
        const isOpen = hasChildren && (isActive || isFolderOpen(folder, currentFolderId));

        return (
          <Collapsible key={folder.id} defaultOpen={isOpen} className="group">
            <div className="flex items-center">
              {hasChildren ? (
                <>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
                        isActive && "bg-accent font-medium"
                      )}
                    >
                      <ChevronRight className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </button>
                  </CollapsibleTrigger>
                  <button
                    onClick={() => handleFolderClick(folder.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors flex-1",
                      isActive && "bg-accent font-medium"
                    )}
                  >
                    <Folder className="h-4 w-4" />
                    <span className="truncate">{folder.name}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleFolderClick(folder.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors w-full",
                    isActive && "bg-accent font-medium"
                  )}
                >
                  <Folder className="h-4 w-4" />
                  <span className="truncate">{folder.name}</span>
                </button>
              )}
            </div>
            {hasChildren && (
              <CollapsibleContent>
                <div className="mt-1 pl-4">
                  <SidebarFolderTree
                    folders={folder.children}
                    currentFolderId={currentFolderId}
                    basePath={basePath}
                    level={level + 1}
                  />
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
        );
      })}
    </div>
  );
}

// Helper to check if folder should be open (has active child)
function isFolderOpen(folder: FolderWithChildren, currentFolderId?: string | null): boolean {
  if (!currentFolderId) return false;
  if (folder.id === currentFolderId) return true;
  return folder.children.some((child) => isFolderOpen(child, currentFolderId));
}

