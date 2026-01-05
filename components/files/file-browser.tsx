"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileBreadcrumbs } from "./breadcrumbs";
import { FolderGrid } from "./folder-grid";
import { FileTable } from "./file-table";
import { ViewToggle } from "./view-toggle";
import { Separator } from "@/components/ui/separator";
import { triggerDownload } from "@/lib/drive-utils";
import type { Folder, File as FileType, FolderPath } from "@/lib/files";

interface FileBrowserProps {
  folders: Folder[];
  files: FileType[];
  path: FolderPath[];
  currentFolderId?: string | null;
  basePath?: string;
  isAdmin?: boolean;
}

export function FileBrowser({
  folders,
  files,
  path,
  currentFolderId,
  basePath = "",
  isAdmin = false,
}: FileBrowserProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("file-view-mode") as "grid" | "list";
      return saved && (saved === "grid" || saved === "list") ? saved : "grid";
    }
    return "grid";
  });

  const handleFolderClick = (folder: Folder) => {
    startTransition(() => {
      const folderPath = isAdmin
        ? `${basePath}/files/f/${folder.id}`
        : `/f/${folder.id}`;
      router.push(folderPath);
    });
  };

  const showFolders = folders.length > 0;
  const showFiles = files.length > 0;
  const isEmpty = !showFolders && !showFiles;

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header with Breadcrumbs and View Toggle */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <FileBreadcrumbs
              path={path}
              basePath={basePath}
              isAdmin={isAdmin}
            />
            <ViewToggle
              value={viewMode}
              onValueChange={(value) => {
                setViewMode(value);
                localStorage.setItem("file-view-mode", value);
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground">This folder is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Folders Section */}
              {showFolders && (
                <div>
                  <h3 className="text-sm font-medium mb-4">Folders</h3>
                  {viewMode === "grid" ? (
                    <FolderGrid
                      folders={folders}
                      basePath={basePath}
                      onFolderClick={handleFolderClick}
                    />
                  ) : (
                    <div className="space-y-2">
                      {folders.map((folder) => (
                        <div
                          key={folder.id}
                          onClick={() => handleFolderClick(folder)}
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                        >
                          <div className="text-blue-500">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">{folder.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Files Section */}
              {showFiles && (
                <div>
                  {showFolders && <Separator className="my-6" />}
                  <h3 className="text-sm font-medium mb-4">Files</h3>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                          onClick={() => triggerDownload(file.downloadUrl)}
                        >
                          <div className="mb-3">
                            <svg
                              className="h-12 w-12 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <p
                            className="text-sm font-medium text-center truncate w-full"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <FileTable files={files} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

