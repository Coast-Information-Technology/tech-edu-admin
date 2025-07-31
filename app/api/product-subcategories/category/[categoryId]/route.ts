import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// GET /api/product-subcategories/category/{categoryId} - Get subcategories by category ID
export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const categoryId = params.categoryId;

    // TODO: Implement actual subcategory fetching logic based on category ID
    // For now, return mock data
    const subcategories = [
      {
        _id: "subcat1",
        name: "Essay Writing",
        description: "Academic essay writing services",
        categoryId: categoryId,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        _id: "subcat2",
        name: "Research Papers",
        description: "Research paper writing services",
        categoryId: categoryId,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        _id: "subcat3",
        name: "Dissertation",
        description: "Dissertation writing services",
        categoryId: categoryId,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ];

    return NextResponse.json({
      success: true,
      data: subcategories,
      message: "Subcategories retrieved successfully",
    });
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}
