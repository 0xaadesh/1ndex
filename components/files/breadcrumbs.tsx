"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import type { FolderPath } from "@/lib/files";

interface FileBreadcrumbsProps {
  path: FolderPath[];
  basePath?: string;
  isAdmin?: boolean;
}

export function FileBreadcrumbs({
  path,
  basePath = "",
  isAdmin = false,
}: FileBreadcrumbsProps) {
  const rootPath = isAdmin ? `${basePath}/files` : basePath || "/";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="mr-2">
          <BreadcrumbLink asChild>
            <Link href={rootPath} className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {path.map((folder, index) => {
          const isLast = index === path.length - 1;
          const folderPath = isAdmin
            ? `${basePath}/files/f/${folder.id}`
            : `/f/${folder.id}`;

          return (
            <div key={folder.id} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={folderPath}>{folder.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

