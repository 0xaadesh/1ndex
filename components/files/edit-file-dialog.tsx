"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateFile } from "@/app/actions/files";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { isGoogleDriveUrl } from "@/lib/drive-utils";
import type { File } from "@/lib/files";

const fileSchema = z.object({
  name: z.string().min(1, "File name is required").max(255),
  downloadUrl: z.string().url("Valid URL is required"),
});

interface EditFileDialogProps {
  file: File | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFileDialog({ file, open, onOpenChange }: EditFileDialogProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      name: "",
      downloadUrl: "",
    },
  });

  useEffect(() => {
    if (file) {
      form.reset({
        name: file.name,
        downloadUrl: file.downloadUrl,
      });
    }
  }, [file, form]);

  const onSubmit = (data: z.infer<typeof fileSchema>) => {
    if (!file) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", file.id);
      formData.append("name", data.name);
      formData.append("downloadUrl", data.downloadUrl);

      try {
        await updateFile(formData);
        form.reset();
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update file:", error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
          <DialogDescription>
            Update the file name and download URL.
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
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

