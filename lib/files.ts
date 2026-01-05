import { prisma } from "@/lib/prisma";

export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type File = {
  id: string;
  name: string;
  downloadUrl: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type FolderWithChildren = Folder & {
  children: FolderWithChildren[];
  files: File[];
};

export type FolderPath = {
  id: string;
  name: string;
};

// Get folders in a specific folder (or root if parentId is null)
export async function getFolders(parentId?: string | null) {
  return await prisma.folder.findMany({
    where: {
      parentId: parentId ?? null,
    },
    orderBy: {
      name: "asc",
    },
  });
}

// Get files in a specific folder (or root if folderId is null)
export async function getFiles(folderId?: string | null) {
  return await prisma.file.findMany({
    where: {
      folderId: folderId ?? null,
    },
    orderBy: {
      name: "asc",
    },
  });
}

// Get a single folder by ID
export async function getFolder(id: string) {
  return await prisma.folder.findUnique({
    where: { id },
    include: {
      children: {
        orderBy: { name: "asc" },
      },
      files: {
        orderBy: { name: "asc" },
      },
    },
  });
}

// Get full folder tree for sidebar (recursive)
export async function getFolderTree(parentId?: string | null): Promise<FolderWithChildren[]> {
  const folders = await prisma.folder.findMany({
    where: {
      parentId: parentId ?? null,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      children: {
        orderBy: { name: "asc" },
      },
      files: {
        orderBy: { name: "asc" },
      },
    },
  });

  // Recursively get children and convert to FolderWithChildren[]
  const result: FolderWithChildren[] = await Promise.all(
    folders.map(async (folder) => {
      const children = await getFolderTree(folder.id);
      return {
        ...folder,
        children,
      } as FolderWithChildren;
    })
  );

  return result;
}

// Get breadcrumb path from root to folder
export async function getFolderPath(folderId: string): Promise<FolderPath[]> {
  const path: FolderPath[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder: { id: string; name: string; parentId: string | null } | null =
      await prisma.folder.findUnique({
        where: { id: currentId },
        select: { id: true, name: true, parentId: true },
      });

    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return path;
}

// Get folder by ID with its contents
export async function getFolderWithContents(id?: string | null) {
  if (!id) {
    // Root folder
    return {
      folder: null,
      folders: await getFolders(null),
      files: await getFiles(null),
      path: [],
    };
  }

  const folder = await getFolder(id);
  if (!folder) {
    return null;
  }

  const path = await getFolderPath(id);

  return {
    folder,
    folders: folder.children,
    files: folder.files,
    path,
  };
}

