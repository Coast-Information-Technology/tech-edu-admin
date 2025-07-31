import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// GET /api/classrooms - Get all classrooms (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Implement admin check and fetch all classrooms
    // For now, return mock data
    const classrooms = [
      {
        _id: "classroom1",
        name: "Introduction to React",
        description: "Learn the basics of React.js",
        instructorId: "instructor789",
        scheduleAt: "2024-01-15T10:00:00Z",
        endAt: "2024-01-15T11:00:00Z",
        minutesPerSession: 60,
        numberOfExpectedParticipants: 20,
        meetingLink: "https://meet.google.com/abc-defg-hij",
        instructorNotes: "Bring your laptop with Node.js installed",
        status: "active",
        actualDaysAndTime: [
          {
            day: "Monday",
            startTime: "10:00",
            endTime: "11:00",
          },
        ],
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-10T09:00:00Z",
      },
    ];

    return NextResponse.json({
      success: true,
      data: classrooms,
      message: "Classrooms retrieved successfully",
    });
  } catch (error: any) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}

// POST /api/classrooms - Create a new classroom
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
    const {
      name,
      description,
      scheduleAt,
      endAt,
      minutesPerSession,
      numberOfExpectedParticipants,
      meetingLink,
      instructorNotes,
      actualDaysAndTime,
    } = body;

    // Validate required fields
    if (!name || !description || !scheduleAt || !endAt) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Implement actual classroom creation logic
    // For now, return mock response
    const newClassroom = {
      _id: `classroom_${Date.now()}`,
      name,
      description,
      instructorId: "instructor_id", // TODO: Get from token
      scheduleAt,
      endAt,
      minutesPerSession: minutesPerSession || 60,
      numberOfExpectedParticipants: numberOfExpectedParticipants || 1,
      meetingLink: meetingLink || "",
      instructorNotes: instructorNotes || "",
      status: "active",
      actualDaysAndTime: actualDaysAndTime || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newClassroom,
      message: "Classroom created successfully",
    });
  } catch (error: any) {
    console.error("Error creating classroom:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create classroom" },
      { status: 500 }
    );
  }
}
