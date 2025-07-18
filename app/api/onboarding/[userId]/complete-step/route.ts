import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();

    // Handle both step completion and profile update payloads
    let stepNumber: number;
    let stepData: any;

    if (body.stepNumber !== undefined && body.stepData !== undefined) {
      // This is a step completion payload
      stepNumber = Number(body.stepNumber);
      stepData = body.stepData;
    } else {
      // This is a profile update payload - treat it as step 1 (Personal Information)
      stepNumber = 1;
      stepData = body; // Use the entire body as step data
    }

    // Validate stepNumber is a valid number
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 7) {
      return NextResponse.json(
        {
          success: false,
          message: "stepNumber must be a number between 1 and 7",
          error: {
            code: "VALIDATION_ERROR",
            details: [
              "stepNumber must be a number conforming to the specified constraints",
            ],
          },
        },
        { status: 400 }
      );
    }

    // Validate userId
    if (!userId || userId.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
          error: {
            code: "VALIDATION_ERROR",
            details: ["userId is required"],
          },
        },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Validate the user exists
    // 2. Update the onboarding progress in your database
    // 3. Mark the specific step as completed with the provided data
    // 4. Update the overall onboarding status

    // For now, we'll return a mock response that matches your expected format
    const mockResponse = {
      id: "507f1f77bcf86cd799439013",
      userId: userId,
      userType: "student",
      currentStep: stepNumber + 1, // Move to next step
      totalSteps: 7,
      completedSteps: [stepNumber], // Add the completed step
      skippedSteps: [],
      status: "in_progress",
      progressPercentage: Math.round((stepNumber / 7) * 100),
      startedAt: new Date().toISOString(),
      completedAt: null,
      lastActivityAt: new Date().toISOString(),
      assignedRepresentative: "507f1f77bcf86cd799439014",
      stepData: {
        [stepNumber]: {
          completedAt: new Date().toISOString(),
          data: stepData,
        },
      },
    };

    return NextResponse.json(
      {
        success: true,
        message: "Step completed successfully",
        data: mockResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing onboarding step:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
