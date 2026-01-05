"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createFile } from "@/app/actions/files";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { isGoogleDriveUrl } from "@/lib/drive-utils";

const fileSchema = z.object({
  name: z.string().min(1, "File name is required").max(255),
  downloadUrl: z.string().url("Valid URL is required"),
});

interface AddFileDialogProps {
  folderId?: string | null;
  trigger?: React.ReactNode;
}

export function AddFileDialog({ folderId, trigger }: AddFileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      name: "",
      downloadUrl: "",
    },
  });

  const onSubmit = (data: z.infer<typeof fileSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("downloadUrl", data.downloadUrl);
      if (folderId) {
        formData.append("folderId", folderId);
      }

      try {
        await createFile(formData);
        form.reset();
        setOpen(false);
      } catch (error) {
        console.error("Failed to create file:", error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" data-add-file>
            <FilePlus className="h-4 w-4 mr-2" />
            Add File
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add File</DialogTitle>
          <DialogDescription>
            Add a new file with a download link to the current folder.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter file name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="downloadUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Download URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/file.pdf or Google Drive link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {isGoogleDriveUrl(field.value) && (
                    <p className="text-xs text-muted-foreground">
                      Google Drive link detected. Will be converted to direct download link.
                    </p>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add File"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

