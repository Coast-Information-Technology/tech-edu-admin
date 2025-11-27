// lib/uploads.ts

// Resolve API base (Coolify Nest API)
function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/$/, "");
  }
  return "";
}

/**
 * Upload a file to the backend via /api/assets/upload
 *
 * Backend response (example):
 * {
 *   "url": "https://api.techedudns.co.uk/uploads/images/uuid.jpg",
 *   "path": "/uploads/images/uuid.jpg",
 *   "originalName": "string",
 *   "mimetype": "string",
 *   "size": 0
 * }
 *
 * `folder` is optional – you can still pass hints like "course-materials"
 * and let the backend decide how to store it.
 */
export async function uploadToBackend(
  file: File,
  folder?: string
): Promise<string> {
  const base = getApiBase();
  const formData = new FormData();
  formData.append("file", file);

  if (folder) {
    // optional hint for backend – safe even if backend ignores it
    formData.append("folder", folder);
  }

  const res = await fetch(`${base}/api/assets/upload`, {
    method: "POST",
    body: formData,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore parse error, handle by status
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      `Upload failed with status ${res.status}`;
    throw new Error(msg);
  }

  // New API returns `url` and `path`; keep old keys for backward safety
  const url =
    data?.url ||
    data?.path || // "/uploads/images/uuid.jpg"
    data?.fileUrl ||
    data?.filePath;

  if (!url) {
    throw new Error("Upload succeeded but no URL was returned from server");
  }

  return url as string;
}

/**
 * Extract `{ type, filename }` from an asset URL or path.
 *
 * Example:
 *   "https://.../uploads/images/uuid.jpg"
 *   "/uploads/images/uuid.jpg"
 *
 * -> { type: "images", filename: "uuid.jpg" }
 *
 * For files:
 *   "/uploads/files/abc.pdf" -> { type: "files", filename: "abc.pdf" }
 */
function getAssetDeleteParams(
  fileUrl: string
): { type: "images" | "files"; filename: string } | null {
  try {
    const base = getApiBase() || undefined;
    const u = new URL(fileUrl, base); // supports absolute and relative URLs
    const pathname = u.pathname; // e.g. /uploads/images/uuid.jpg

    const parts = pathname.split("/").filter(Boolean); // ["uploads", "images", "uuid.jpg"]
    if (parts.length < 3) return null;
    if (parts[0] !== "uploads") return null;

    const type = parts[1];
    if (type !== "images" && type !== "files") return null;

    // Join the rest in case backend ever uses nested paths under /uploads/{type}/...
    const filename = parts.slice(2).join("/"); // "uuid.jpg" or "subdir/uuid.jpg"

    if (!filename) return null;

    return { type: type as "images" | "files", filename };
  } catch {
    return null;
  }
}

/**
 * Delete a file from the backend using /api/assets/{type}/{filename}
 *
 * `type` must be "images" or "files".
 * We infer both `type` and `filename` from the URL/path.
 */
export async function deleteToBackend(fileUrl: string): Promise<void> {
  const base = getApiBase();
  const params = getAssetDeleteParams(fileUrl);

  if (!params) {
    // nothing to delete or URL not in /uploads/{type}/... format
    return;
  }

  const { type, filename } = params;

  const res = await fetch(
    `${base}/api/assets/${encodeURIComponent(type)}/${encodeURIComponent(
      filename
    )}`,
    {
      method: "DELETE",
    }
  );

  // Backend returns 200 + { ok: true } on success
  if (!res.ok) {
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // ignore parse error
    }

    const msg =
      data?.error ||
      data?.message ||
      `Delete failed with status ${res.status}`;
    throw new Error(msg);
  }
}

/**
 * Backwards-compatible alias for old name.
 * You can gradually replace imports with `deleteToBackend` everywhere.
 */
export async function deleteBackendFile(fileUrl: string): Promise<void> {
  return deleteToBackend(fileUrl);
}
