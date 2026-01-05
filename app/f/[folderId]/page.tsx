import { getFolderWithContents } from "@/lib/files";
import { FileBrowser } from "@/components/files/file-browser";
import { notFound } from "next/navigation";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const data = await getFolderWithContents(folderId);

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

