import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// GET /api/products - Get all products (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Implement actual database query to fetch all products for admin
    // This should fetch products with additional admin fields like createdBy, etc.

    return NextResponse.json(
      {
        success: false,
        message:
          "Admin products endpoint not implemented yet. Use /api/products/public for public access.",
      },
      { status: 501 }
    );
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // TODO: Implement actual database insertion
    // Validate required fields based on the real data structure
    const requiredFields = [
      "productType",
      "productCategoryId",
      "productCategoryTitle",
      "productSubCategoryId",
      "productSubcategoryName",
      "service",
      "deliveryMode",
      "sessionType",
      "programLength",
      "mode",
      "durationInMinutes",
      "minutesPerSession",
      "price",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    console.log("Creating product with data:", body);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: {
        product: {
          _id: Date.now().toString(),
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
