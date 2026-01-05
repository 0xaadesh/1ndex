import { getFolderWithContents } from "@/lib/files";
import { FileBrowser } from "@/components/files/file-browser";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let data;
  try {
    data = await getFolderWithContents(null);
  } catch (error: any) {
    // Handle database connection or table errors
    if (error?.code === 'P2021' || error?.code === '42P01' || error?.code === 'P1001') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Database not initialized</p>
            <p className="text-sm text-muted-foreground">Please run database migrations</p>
          </div>
        </div>
      );
    }
    throw error;
  }

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
