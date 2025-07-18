import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;

  // Redirect to the backend Google OAuth endpoint
  return NextResponse.redirect(googleAuthUrl);
}
