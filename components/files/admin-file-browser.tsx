"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileBreadcrumbs } from "./breadcrumbs";
import { AdminFolderGrid } from "./admin-folder-grid";
import { AdminFileTable } from "./admin-file-table";
import { ViewToggle } from "./view-toggle";
import { AddFolderDialog } from "./add-folder-dialog";
import { AddFileDialog } from "./add-file-dialog";
import { EditFolderDialog } from "./edit-folder-dialog";
import { EditFileDialog } from "./edit-file-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
import { MoreVertical, Pencil, Trash2, Download, FolderPlus, FilePlus } from "lucide-react";
import { triggerDownload } from "@/lib/drive-utils";
import { useTransition } from "react";
import type { Folder, File as FileType, FolderPath } from "@/lib/files";

interface AdminFileBrowserProps {
  folders: Folder[];
  files: FileType[];
  path: FolderPath[];
  currentFolderId?: string | null;
  basePath?: string;
}

export function AdminFileBrowser({
  folders,
  files,
  path,
  currentFolderId,
  basePath = "/admin",
}: AdminFileBrowserProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("file-view-mode") as "grid" | "list";
      return saved && (saved === "grid" || saved === "list") ? saved : "grid";
    }
    return "grid";
  });
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [editingFile, setEditingFile] = useState<FileType | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    type: "folder" | "file";
    id: string;
    name: string;
  } | null>(null);

  const handleFolderClick = (folder: Folder) => {
    startTransition(() => {
      const folderPath = `${basePath}/files/f/${folder.id}`;
      router.push(folderPath);
    });
  };

  const showFolders = folders.length > 0;
  const showFiles = files.length > 0;
  const isEmpty = !showFolders && !showFiles;

  return (
    <div className="flex flex-col h-full">
      {/* Action Bar */}
      <div className="border-b p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AddFolderDialog parentId={currentFolderId} />
          <AddFileDialog folderId={currentFolderId} />
        </div>
        <ViewToggle
          value={viewMode}
          onValueChange={(value) => {
            setViewMode(value);
            localStorage.setItem("file-view-mode", value);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Breadcrumbs */}
          <div className="border-b p-4">
            <FileBreadcrumbs path={path} basePath={basePath} isAdmin={true} />
          </div>

          {/* Content */}
          <ContextMenu>
            <ContextMenuTrigger asChild>
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
                      <AdminFolderGrid
                        folders={folders}
                        basePath={basePath}
                        onFolderClick={handleFolderClick}
                        onEdit={setEditingFolder}
                        onDelete={(folder) =>
                          setDeletingItem({
                            type: "folder",
                            id: folder.id,
                            name: folder.name,
                          })
                        }
                      />
                    ) : (
                      <div className="space-y-2">
                        {folders.map((folder) => (
                          <ContextMenu key={folder.id}>
                            <ContextMenuTrigger asChild>
                              <div className="flex items-center justify-between p-3 rounded-md hover:bg-accent group">
                                <div
                                  onClick={() => handleFolderClick(folder)}
                                  className="flex items-center gap-3 flex-1 cursor-pointer"
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
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingFolder(folder);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingItem({
                                          type: "folder",
                                          id: folder.id,
                                          name: folder.name,
                                        });
                                      }}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem onClick={() => handleFolderClick(folder)}>
                                Open
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem onClick={() => setEditingFolder(folder)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Rename
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                onClick={() =>
                                  setDeletingItem({
                                    type: "folder",
                                    id: folder.id,
                                    name: folder.name,
                                  })
                                }
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
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
                          <ContextMenu key={file.id}>
                            <ContextMenuTrigger asChild>
                              <div
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer relative group"
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
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerDownload(file.downloadUrl);
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFile(file);
                                  }}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingItem({
                                      type: "file",
                                      id: file.id,
                                      name: file.name,
                                    });
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem
                                onClick={() => triggerDownload(file.downloadUrl)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem onClick={() => setEditingFile(file)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                onClick={() =>
                                  setDeletingItem({
                                    type: "file",
                                    id: file.id,
                                    name: file.name,
                                  })
                                }
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))}
                      </div>
                    ) : (
                      <AdminFileTable
                        files={files}
                        onEdit={setEditingFile}
                        onDelete={(file) =>
                          setDeletingItem({
                            type: "file",
                            id: file.id,
                            name: file.name,
                          })
                        }
                      />
                    )}
                  </div>
                )}
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  // Trigger add folder dialog
                  const addFolderBtn = document.querySelector('[data-add-folder]');
                  if (addFolderBtn instanceof HTMLElement) {
                    addFolderBtn.click();
                  }
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  // Trigger add file dialog
                  const addFileBtn = document.querySelector('[data-add-file]');
                  if (addFileBtn instanceof HTMLElement) {
                    addFileBtn.click();
                  }
                }}
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Add File
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </main>
      </div>

      {/* Edit/Delete Dialogs */}
      <EditFolderDialog
        folder={editingFolder}
        open={!!editingFolder}
        onOpenChange={(open) => !open && setEditingFolder(null)}
      />
      <EditFileDialog
        file={editingFile}
        open={!!editingFile}
        onOpenChange={(open) => !open && setEditingFile(null)}
      />
      {deletingItem && (
        <DeleteConfirmDialog
          type={deletingItem.type}
          id={deletingItem.id}
          name={deletingItem.name}
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
        />
      )}
    </div>
  );
}

