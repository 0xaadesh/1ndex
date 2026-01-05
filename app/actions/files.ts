"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toDirectDownloadLink } from "@/lib/drive-utils";
import { z } from "zod";

// Validation schemas
const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(255),
  parentId: z.string().nullable().optional(),
});

const createFileSchema = z.object({
  name: z.string().min(1, "File name is required").max(255),
  downloadUrl: z.string().url("Valid URL is required"),
  folderId: z.string().nullable().optional(),
});

const updateFolderSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Folder name is required").max(255),
});

const updateFileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "File name is required").max(255),
  downloadUrl: z.string().url("Valid URL is required"),
});

// Helper to check admin auth
async function requireAuth() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createFolder(formData: FormData) {
  await requireAuth();

  const data = createFolderSchema.parse({
    name: formData.get("name"),
    parentId: formData.get("parentId") || null,
  });

  const folder = await prisma.folder.create({
    data: {
      name: data.name,
      parentId: data.parentId,
    },
  });

  // Revalidate all file browser pages
  revalidatePath("/");
  revalidatePath("/f");
  revalidatePath("/admin/files");
  revalidatePath("/admin/files/f");

  return { success: true, folder };
}

export async function createFile(formData: FormData) {
  await requireAuth();

  const data = createFileSchema.parse({
    name: formData.get("name"),
    downloadUrl: formData.get("downloadUrl"),
    folderId: formData.get("folderId") || null,
  });

  // Convert Google Drive URL to direct download link if needed
  const downloadUrl = toDirectDownloadLink(data.downloadUrl) || data.downloadUrl;

  const file = await prisma.file.create({
    data: {
      name: data.name,
      downloadUrl: downloadUrl,
      folderId: data.folderId,
    },
  });

  // Revalidate all file browser pages
  revalidatePath("/");
  revalidatePath("/f");
  revalidatePath("/admin/files");
  revalidatePath("/admin/files/f");

  return { success: true, file };
}

export async function updateFolder(formData: FormData) {
  await requireAuth();

  const data = updateFolderSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  const folder = await prisma.folder.update({
    where: { id: data.id },
    data: { name: data.name },
  });

  // Revalidate all file browser pages
  revalidatePath("/");
  revalidatePath("/f");
  revalidatePath("/admin/files");
  revalidatePath("/admin/files/f");

  return { success: true, folder };
}

export async function updateFile(formData: FormData) {
  await requireAuth();

  const data = updateFileSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
    downloadUrl: formData.get("downloadUrl"),
  });

  // Convert Google Drive URL to direct download link if needed
  const downloadUrl = toDirectDownloadLink(data.downloadUrl) || data.downloadUrl;

  const file = await prisma.file.update({
    where: { id: data.id },
    data: {
      name: data.name,
      downloadUrl: downloadUrl,
    },
  });

  // Revalidate all file browser pages
  revalidatePath("/");
  revalidatePath("/f");
  revalidatePath("/admin/files");
  revalidatePath("/admin/files/f");

  return { success: true, file };
}

export async function deleteFolder(id: string) {
  await requireAuth();

  // Prisma will cascade delete children and files
  await prisma.folder.delete({
    where: { id },
  });

  // Revalidate all file browser pages
  revalidatePath("/");
  revalidatePath("/f");
  revalidatePath("/admin/files");
  revalidatePath("/admin/files/f");

  return { success: true };
}

export async function deleteFile(id: string) {
  await requireAuth();

  await prisma.file.delete({
    where: { id },
  });

  // Revalidate all file browser pages
  revalidatePath("/");
  revalidatePath("/f");
  revalidatePath("/admin/files");
  revalidatePath("/admin/files/f");

  return { success: true };
}

