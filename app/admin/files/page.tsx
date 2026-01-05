import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFolderWithContents } from "@/lib/files";
import { AdminFileBrowser } from "@/components/files/admin-file-browser";
import { AdminLayout } from "@/components/admin/admin-layout";

export const dynamic = 'force-dynamic';

export default async function AdminFilesPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  let data;
  try {
    data = await getFolderWithContents(null);
  } catch (error: any) {
    // Handle database connection or table errors
    if (error?.code === 'P2021' || error?.code === '42P01' || error?.code === 'P1001') {
      return (
        <AdminLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Database not initialized</p>
              <p className="text-sm text-muted-foreground">Please run database migrations</p>
            </div>
          </div>
        </AdminLayout>
      );
    }
    throw error;
  }

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

