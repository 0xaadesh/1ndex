"use client";

import { useRouter } from "next/navigation";
import { Folder, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Folder as FolderType } from "@/lib/files";

interface AdminFolderGridProps {
  folders: FolderType[];
  basePath?: string;
  onFolderClick?: (folder: FolderType) => void;
  onEdit?: (folder: FolderType) => void;
  onDelete?: (folder: FolderType) => void;
}

export function AdminFolderGrid({
  folders,
  basePath = "",
  onFolderClick,
  onEdit,
  onDelete,
}: AdminFolderGridProps) {
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
        <ContextMenu key={folder.id}>
          <ContextMenuTrigger asChild>
            <Card
              className={cn(
                "flex flex-col items-center justify-center p-6 cursor-pointer relative group",
                "hover:bg-accent transition-colors"
              )}
            >
              <div
                onClick={() => handleClick(folder)}
                className="flex flex-col items-center w-full"
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
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(folder)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete?.(folder)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleClick(folder)}>
              Open
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onEdit?.(folder)}>
              <Pencil className="h-4 w-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => onDelete?.(folder)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
}

