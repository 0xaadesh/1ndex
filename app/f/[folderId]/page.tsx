import { getFolderWithContents } from "@/lib/files";
import { FileBrowser } from "@/components/files/file-browser";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  let data;
  try {
    data = await getFolderWithContents(folderId);
  } catch (error: any) {
    // Handle database connection or table errors
    if (error?.code === 'P2021' || error?.code === '42P01' || error?.code === 'P1001') {
      notFound();
    }
    throw error;
  }

  if (!data) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col">
      <FileBrowser
        folders={data.folders}
        files={data.files}
        path={data.path}
        currentFolderId={folderId}
        basePath=""
        isAdmin={false}
      />
    </div>
  );
}

