import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// GET /api/product-categories/type/{productType} - Get categories by product type
export async function GET(
  request: NextRequest,
  { params }: { params: { productType: string } }
) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const productType = params.productType;

    // TODO: Implement actual category fetching logic based on product type
    // For now, return mock data
    const categories = [
      {
        _id: "cat1",
        name: "Academic Writing",
        description: "Academic writing services",
        productType: productType,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        _id: "cat2",
        name: "Research Assistance",
        description: "Research and analysis services",
        productType: productType,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        _id: "cat3",
        name: "Tutoring",
        description: "One-on-one tutoring services",
        productType: productType,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ];

    return NextResponse.json({
      success: true,
      data: categories,
      message: "Categories retrieved successfully",
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
