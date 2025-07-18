import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Mock database check - replace with actual database query
    // This is a placeholder implementation
    const mockExistingEmails = [
      "michaelbrainy6424@gmail.com",
      "test@example.com",
      "admin@techedu.com",
    ];

    const exists = mockExistingEmails.includes(email.toLowerCase());

    return NextResponse.json({
      success: true,
      exists,
      message: exists ? "Email already exists" : "Email is available",
    });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
