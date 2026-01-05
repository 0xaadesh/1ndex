import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFolderWithContents } from "@/lib/files";
import { AdminFileBrowser } from "@/components/files/admin-file-browser";
import { AdminLayout } from "@/components/admin/admin-layout";

export default async function AdminFilesPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const data = await getFolderWithContents(null);

  if (!data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Error loading files</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <AdminFileBrowser
          folders={data.folders}
          files={data.files}
          path={data.path}
          currentFolderId={null}
          basePath="/admin"
        />
      </div>
    </AdminLayout>
  );
}

