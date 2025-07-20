import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const avatar = formData.get("avatar") as File;

    if (!avatar) {
      return NextResponse.json(
        { message: "No avatar file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!avatar.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatar.size > maxSize) {
      return NextResponse.json(
        { message: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert file to base64 for storage (in a real app, you'd upload to cloud storage)
    const bytes = await avatar.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${avatar.type};base64,${base64String}`;

    // In a real application, you would:
    // 1. Decode the JWT token to get the user ID
    // 2. Upload the file to a cloud storage service (AWS S3, Cloudinary, etc.)
    // 3. Get the public URL of the uploaded file
    // 4. Store the URL in your database
    // 5. Return the URL to the client

    // For now, we'll return a mock URL structure
    // In production, you'd extract userId from the JWT token
    const avatarUrl = `/api/avatars/${Date.now()}-${avatar.name}`;

    // You would typically save this URL to your database here
    // await updateUserAvatar(userId, avatarUrl);

    return NextResponse.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl: avatarUrl,
      fileName: avatar.name,
      fileSize: avatar.size,
      fileType: avatar.type,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
