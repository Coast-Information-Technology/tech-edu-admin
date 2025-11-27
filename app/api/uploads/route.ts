// app/api/uploads/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Sanitize folder name so it can't escape /uploads
function sanitizeFolder(raw: string | null): string {
  if (!raw) return "";
  // allow a-z, 0-9, -, _, and / (for nested subfolders)
  let safe = raw.replace(/[^a-zA-Z0-9/_-]/g, "");
  // trim leading/trailing slashes
  safe = safe.replace(/^\/+|\/+$/g, "");
  return safe;
}

// Sanitize relative file path (e.g. "course-materials/file.pdf")
function sanitizeRelativePath(raw: string | null): string | null {
  if (!raw) return null;
  let safe = raw.replace(/\\/g, "/");
  if (safe.includes("..")) return null;
  safe = safe.replace(/^\/+/, "");
  return safe;
}

/**
 * POST /api/uploads?folder=course-materials
 * Uploads file into /public/uploads/[folder?]
 */
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = sanitizeFolder(searchParams.get("folder"));
    const targetDir = folder ? path.join(uploadDir, folder) : uploadDir;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;

    ensureDir(targetDir);

    const filePath = path.join(targetDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const relativePath = folder
      ? `/uploads/${folder}/${fileName}`
      : `/uploads/${fileName}`;

    // ✅ Just return the relative path; Next will serve this from your app domain
    const publicUrl = relativePath;

    return NextResponse.json(
      {
        fileName,
        filePath: relativePath, // includes folder if any
        fileUrl: publicUrl,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);

    // 🔍 TEMP: surface the real error so you can see it in Network tab
    return NextResponse.json(
      {
        error:
          err?.message ||
          err?.toString() ||
          "Failed to upload file (unknown server error)",
      },
      { status: 500 }
    );
  }
}


/**
 * GET /api/uploads
 * GET /api/uploads?file=course-materials/123-file.pdf
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = sanitizeRelativePath(searchParams.get("file"));
    const folder = sanitizeFolder(searchParams.get("folder"));
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

    ensureDir(uploadDir);

    if (fileParam) {
      const filePath = path.join(uploadDir, fileParam);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }

      const stats = fs.statSync(filePath);
      const relativePath = `/uploads/${fileParam}`;
      const publicUrl = baseUrl ? `${baseUrl}${relativePath}` : relativePath;

      return NextResponse.json({
        fileName: path.basename(fileParam),
        filePath: relativePath,
        fileUrl: publicUrl,
        size: stats.size,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
      });
    }

    // List files - optionally inside a folder
    const targetDir = folder ? path.join(uploadDir, folder) : uploadDir;
    ensureDir(targetDir);

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => {
        const rel = folder ? `${folder}/${e.name}` : e.name;
        const fullPath = path.join(uploadDir, rel);
        const stats = fs.statSync(fullPath);
        const relativePath = `/uploads/${rel}`;
        const publicUrl = baseUrl
          ? `${baseUrl}${relativePath}`
          : relativePath;

        return {
          fileName: e.name,
          filePath: relativePath,
          fileUrl: publicUrl,
          size: stats.size,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        };
      });

    return NextResponse.json({ files });
  } catch (err) {
    console.error("List/read error:", err);
    return NextResponse.json(
      { error: "Failed to list or read uploads" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/uploads?file=course-materials/123-file.pdf
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rel = sanitizeRelativePath(searchParams.get("file"));
    if (!rel) {
      return NextResponse.json(
        { error: "Missing or invalid file parameter" },
        { status: 400 }
      );
    }

    const filePath = path.join(uploadDir, rel);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}