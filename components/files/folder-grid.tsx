"use client";

import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Folder as FolderType } from "@/lib/files";

interface FolderGridProps {
  folders: FolderType[];
  basePath?: string;
  onFolderClick?: (folder: FolderType) => void;
}

export function FolderGrid({ folders, basePath = "", onFolderClick }: FolderGridProps) {
  const router = useRouter();

  const handleClick = (folder: FolderType) => {
    if (onFolderClick) {
      onFolderClick(folder);
    } else {
      const path = basePath ? `${basePath}/f/${folder.id}` : `/f/${folder.id}`;
      router.push(path);
    }
  };

  if (folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Folder className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">No folders</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {folders.map((folder) => (
        <Card
          key={folder.id}
          onClick={() => handleClick(folder)}
          className={cn(
            "flex flex-col items-center justify-center p-6 cursor-pointer",
            "hover:bg-accent transition-colors",
            "group"
          )}
        >
          <div className="mb-3">
            <Folder className="h-12 w-12 text-blue-500 group-hover:text-blue-600 transition-colors" />
          </div>
          <p
            className="text-sm font-medium text-center truncate w-full"
            title={folder.name}
          >
            {folder.name}
          </p>
        </Card>
      ))}
    </div>
  );
}

