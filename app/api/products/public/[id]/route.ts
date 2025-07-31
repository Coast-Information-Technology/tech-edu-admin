import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// GET /api/products/public/[id] - Get a single public product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = getTokenFromCookies();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Implement actual database query to fetch public product by ID
    // For now, return mock data
    const product = {
      _id: id,
      name: "Sample Product",
      description: "This is a sample product description",
      productType: "AcademicService",
      productCategoryId: "cat1",
      productSubCategoryId: "subcat1",
      price: 99.99,
      currency: "USD",
      isActive: true,
      features: ["Feature 1", "Feature 2", "Feature 3"],
      requirements: ["Requirement 1", "Requirement 2"],
      deliverables: ["Deliverable 1", "Deliverable 2"],
      duration: "2-3 weeks",
      imageUrl: "https://example.com/image.jpg",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error: any) {
    console.error("Error fetching public product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
