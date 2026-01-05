import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getFolderWithContents } from "@/lib/files";
import { AdminFileBrowser } from "@/components/files/admin-file-browser";
import { AdminLayout } from "@/components/admin/admin-layout";

export const dynamic = 'force-dynamic';

interface AdminFolderPageProps {
  params: Promise<{ folderId: string }>;
}

export default async function AdminFolderPage({ params }: AdminFolderPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const { folderId } = await params;
  const data = await getFolderWithContents(folderId);

  if (!data) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <AdminFileBrowser
          folders={data.folders}
          files={data.files}
          path={data.path}
          currentFolderId={folderId}
          basePath="/admin"
        />
      </div>
    </AdminLayout>
  );
}

