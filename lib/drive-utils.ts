/**
 * Converts a Google Drive URL to a direct download link
 * Supports:
 * - Google Drive files: /file/d/{id}/...
 * - Google Docs: /document/d/{id}/...
 * - Google Sheets: /spreadsheets/d/{id}/...
 * - Google Slides: /presentation/d/{id}/...
 * - Generic: open?id={id}
 * All are converted to: https://drive.google.com/uc?export=download&id={id}
 * @param driveUrl - The Google Drive URL to convert
 * @returns The direct download URL or null if conversion fails
 */
export function toDirectDownloadLink(driveUrl: string | null | undefined): string | null {
  if (!driveUrl || typeof driveUrl !== "string") return null;

  let fileId: string | null = null;

  // case 1: /document/d/{id}/... (Google Docs)
  // Matches: https://docs.google.com/document/d/{id}/edit?...
  const docMatch = driveUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch) {
    fileId = docMatch[1];
  }

  // case 2: /spreadsheets/d/{id}/... (Google Sheets)
  // Matches: https://docs.google.com/spreadsheets/d/{id}/edit?...
  if (!fileId) {
    const sheetMatch = driveUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetMatch) {
      fileId = sheetMatch[1];
    }
  }

  // case 3: /presentation/d/{id}/... (Google Slides)
  // Matches: https://docs.google.com/presentation/d/{id}/edit?...
  if (!fileId) {
    const slideMatch = driveUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slideMatch) {
      fileId = slideMatch[1];
    }
  }

  // case 4: /file/d/{id}/... (Google Drive files)
  // Matches: https://drive.google.com/file/d/{id}/view?...
  if (!fileId) {
    const fileMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }
  }

  // case 5: open?id={id} (generic pattern)
  // Matches: https://drive.google.com/open?id={id}
  if (!fileId) {
    const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }
  }

  if (!fileId) return null;

  // Convert all to standard Google Drive download format
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Checks if a URL is a Google Drive URL
 * Supports drive.google.com, docs.google.com URLs
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

/**
 * Triggers a download for the given URL.
 * Converts Google Drive URLs to direct download links first.
 * Uses a hidden anchor element with download attribute to force browser download.
 */
export function triggerDownload(url: string): void {
  const downloadUrl = toDirectDownloadLink(url) || url;
  
  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", ""); // This hints to the browser to download
  link.setAttribute("target", "_blank");
  link.rel = "noopener noreferrer";
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

