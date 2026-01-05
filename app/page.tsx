import { getFolderWithContents } from "@/lib/files";
import { FileBrowser } from "@/components/files/file-browser";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getFolderWithContents(null);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Error loading files</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 min-h-0">
        <FileBrowser
          folders={data.folders}
          files={data.files}
          path={data.path}
          currentFolderId={null}
          basePath=""
          isAdmin={false}
        />
      </div>
      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        made with ❤️ by Aadesh |{" "}
        <a
          href="https://aadesh.me"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          aadesh.me
        </a>
      </footer>
    </div>
  );
}
