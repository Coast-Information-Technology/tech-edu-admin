// /api/local/files
// This API endpoint is used to list the files in the public/uploads folder
// It is used to display the files in the file manager
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const uploadPath = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadPath)) {
    return NextResponse.json({ files: [] });
  }

  const files = fs.readdirSync(uploadPath);

  return NextResponse.json({
    files: files.map((f) => ({
      name: f,
      url: `/uploads/${f}`,
    })),
  });
}
