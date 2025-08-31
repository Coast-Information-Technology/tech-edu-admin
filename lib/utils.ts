import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Encodes a redirect URL for use in query parameters
 * @param url - The URL to encode (e.g., "/dashboard/student")
 * @returns Encoded URL safe for query parameters
 */
export function encodeRedirectUrl(url: string): string {
  return encodeURIComponent(url);
}

/**
 * Decodes a redirect URL from query parameters
 * @param encodedUrl - The encoded URL from query parameters
 * @returns Decoded URL
 */
export function decodeRedirectUrl(encodedUrl: string): string {
  return decodeURIComponent(encodedUrl);
}

/**
 * Safely gets and decodes a redirect URL from search params
 * @param searchParams - URLSearchParams object
 * @param fallback - Fallback URL if redirect is not found or invalid
 * @returns Decoded redirect URL or fallback
 */
export function getRedirectUrl(
  searchParams: URLSearchParams,
  fallback: string = "/"
): string {
  const redirect = searchParams.get("redirect");
  if (!redirect) return fallback;

  try {
    const decoded = decodeRedirectUrl(redirect);
    // Validate that it's a relative path starting with /
    if (decoded.startsWith("/")) {
      return decoded;
    }
    return fallback;
  } catch (error) {
    console.error("Failed to decode redirect URL:", error);
    return fallback;
  }
}

/**
 * Converts Cloudinary console URLs to direct file URLs
 * @param consoleUrl - Cloudinary console URL
 * @returns Direct file URL or original URL if conversion fails
 */
export function convertCloudinaryConsoleUrl(consoleUrl: string): string {
  try {
    // Handle different Cloudinary console URL patterns
    if (consoleUrl.includes("console.cloudinary.com/app/")) {
      // Pattern: console.cloudinary.com/app/c-xxx/assets/media_library/homepage/asset/xxx/manage/summary
      const assetMatch = consoleUrl.match(/asset\/([a-f0-9]+)/);
      if (assetMatch) {
        const assetId = assetMatch[1];
        // Extract cloud name from the URL
        const cloudMatch = consoleUrl.match(/app\/(c-[a-f0-9]+)/);
        const cloudName = cloudMatch ? cloudMatch[1] : "drjdziur7"; // fallback to your cloud name

        // Convert to direct Cloudinary URL - we'll need to get the actual filename from Cloudinary API
        // For now, return a placeholder that the extractCloudinaryFileInfo function can handle
        return `https://res.cloudinary.com/${cloudName}/image/upload/${assetId}`;
      }
    }

    // If no conversion possible, return original URL
    return consoleUrl;
  } catch (error) {
    console.warn("Failed to convert Cloudinary console URL:", error);
    return consoleUrl;
  }
}

/**
 * Checks if a Cloudinary URL is accessible and returns appropriate status
 * @param url - The URL to check
 * @returns Promise with accessibility status
 */
export async function checkCloudinaryUrlAccess(url: string): Promise<{
  accessible: boolean;
  error?: string;
  status?: number;
}> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return {
      accessible: response.ok,
      status: response.status,
      error: response.ok
        ? undefined
        : `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Generates a more accessible Cloudinary URL by removing version parameters
 * @param url - Original Cloudinary URL
 * @returns Modified URL that might be more accessible
 */
export function generateAlternativeCloudinaryUrl(url: string): string {
  try {
    if (url.includes("res.cloudinary.com")) {
      // Remove version parameter (v1756634345) to try accessing without version
      const urlWithoutVersion = url.replace(/\/v\d+\//, "/");
      return urlWithoutVersion;
    }
    return url;
  } catch (error) {
    return url;
  }
}

/**
 * Extracts file information from Cloudinary console URLs for display purposes
 * @param consoleUrl - Cloudinary console URL or direct URL
 * @returns Object with file information or null if extraction fails
 */
export function extractCloudinaryFileInfo(
  consoleUrl: string
): { fileName: string; fileType: string } | null {
  try {
    // Handle Cloudinary console URLs
    if (consoleUrl.includes("console.cloudinary.com/app/")) {
      // Extract asset ID
      const assetMatch = consoleUrl.match(/asset\/([a-f0-9]+)/);
      if (assetMatch) {
        const assetId = assetMatch[1];
        // For now, return a generic name - in a real implementation,
        // you might want to fetch this from Cloudinary API
        return {
          fileName: `File ${assetId.substring(0, 8)}...`,
          fileType: "Cloudinary Asset",
        };
      }
    }

    // Handle direct Cloudinary URLs
    if (consoleUrl.includes("res.cloudinary.com")) {
      // Extract filename from URL path
      const urlParts = consoleUrl.split("/");
      const lastPart = urlParts[urlParts.length - 1];

      // Check if it's a versioned URL (v1756634345/filename.pdf)
      if (lastPart && lastPart.includes(".")) {
        // This is already a filename
        return {
          fileName: lastPart,
          fileType: getFileTypeFromExtension(lastPart),
        };
      } else if (urlParts.length > 1) {
        // Look for the part before the last (filename part)
        const filenamePart = urlParts[urlParts.length - 2];
        if (filenamePart && filenamePart.includes(".")) {
          return {
            fileName: filenamePart,
            fileType: getFileTypeFromExtension(filenamePart),
          };
        }
      }

      // Fallback: extract from the end of the URL
      const filenameMatch = consoleUrl.match(/\/([^\/]+\.[^\/]+)$/);
      if (filenameMatch) {
        return {
          fileName: filenameMatch[1],
          fileType: getFileTypeFromExtension(filenameMatch[1]),
        };
      }
    }

    return null;
  } catch (error) {
    console.warn("Failed to extract Cloudinary file info:", error);
    return null;
  }
}

/**
 * Helper function to determine file type from extension
 * @param filename - The filename with extension
 * @returns File type string
 */
function getFileTypeFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();

  const fileTypes: { [key: string]: string } = {
    pdf: "PDF Document",
    doc: "Word Document",
    docx: "Word Document",
    txt: "Text File",
    jpg: "Image",
    jpeg: "Image",
    png: "Image",
    gif: "Image",
    webp: "Image",
    mp4: "Video",
    avi: "Video",
    mov: "Video",
    zip: "Archive",
    rar: "Archive",
    xlsx: "Excel Spreadsheet",
    xls: "Excel Spreadsheet",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
  };

  return fileTypes[extension || ""] || "File";
}

/**
 * Cleans attachment URLs by removing @ symbols and ensuring proper protocol
 * @param url - The URL to clean (e.g., "@https://example.com" or "example.com")
 * @returns Cleaned URL with proper protocol
 */
export function cleanAttachmentUrl(url: string): string {
  if (!url) return url;

  // Remove @ symbol if present at the beginning
  let cleanUrl = url.startsWith("@") ? url.substring(1) : url;

  // Handle Cloudinary console URLs - convert to direct file URLs
  if (cleanUrl.includes("console.cloudinary.com/app/")) {
    cleanUrl = convertCloudinaryConsoleUrl(cleanUrl);
  }

  // Ensure the URL has a proper protocol
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  return cleanUrl;
}
