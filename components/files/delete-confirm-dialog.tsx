"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteFolder, deleteFile } from "@/app/actions/files";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  type: "folder" | "file";
  id: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmDialog({
  type,
  id,
  name,
  open,
  onOpenChange,
}: DeleteConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        if (type === "folder") {
          await deleteFolder(id);
        } else {
          await deleteFile(id);
        }
        onOpenChange(false);
      } catch (error) {
        console.error(`Failed to delete ${type}:`, error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete {type === "folder" ? "Folder" : "File"}
          </DialogTitle>
          <DialogDescription>
            {type === "folder" ? (
              <>
                Are you sure you want to delete the folder <strong>"{name}"</strong>?
                This will also delete all folders and files inside it. This action
                cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete the file <strong>"{name}"</strong>?
                This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

