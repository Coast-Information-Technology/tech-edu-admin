import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// PUT /api/products/[id]/metadata - Update product metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // TODO: Implement actual database update for product metadata
    console.log("Updating product metadata for", id, "with data:", body);

    return NextResponse.json({
      success: true,
      message: "Product metadata updated successfully",
      data: {
        product: {
          _id: id,
          metadata: body,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error("Error updating product metadata:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product metadata" },
      { status: 500 }
    );
  }
} 