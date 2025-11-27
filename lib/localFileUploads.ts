

// Local disk upload via /api/uploads
export async function uploadToLocal(file: File, folder?: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
  
    const url = folder
      ? `/api/uploads?folder=${encodeURIComponent(folder)}`
      : "/api/uploads";
  
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error("Failed to upload file");
    }
  
    const data = await res.json();
    return data.fileUrl || data.filePath || "";
  }
  
  export function getRelativePathFromUrl(url: string): string | null {
    try {
      const parsed = new URL(url, window.location.origin);
      const pathname = parsed.pathname; // e.g. /uploads/course-materials/123.pdf
      if (!pathname.startsWith("/uploads/")) return null;
      return pathname.replace(/^\/uploads\//, ""); // -> course-materials/123.pdf
    } catch {
      return null;
    }
  }
  
  export async function deleteLocalFile(fileUrl: string): Promise<void> {
    const rel = getRelativePathFromUrl(fileUrl);
    if (!rel) return;
    await fetch(`/api/uploads?file=${encodeURIComponent(rel)}`, {
      method: "DELETE", // delete the file from the local disk
    });
  }
  