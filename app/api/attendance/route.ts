import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// GET /api/attendance - Get all attendance records with pagination, sorting, and filtering
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "scheduleAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status");
    const productType = searchParams.get("productType");
    const ledBy = searchParams.get("ledBy");
    const classroomId = searchParams.get("classroomId");
    const sessionId = searchParams.get("sessionId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    // TODO: Implement actual database query with filters
    // For now, return mock data
    const attendances = [
      {
        _id: "507f1f77bcf86cd799439011",
        sessionId: "507f1f77bcf86cd799439011",
        productType: "AcademicService",
        ledBy: "507f1f77bcf86cd799439013",
        scheduleAt: "2025-08-01T10:00:00.000Z",
        endAt: "2025-08-01T11:00:00.000Z",
        durationInMinutes: 60,
        status: "upcoming",
        title: "AcademicService | PhD Mentoring – 2025-08-01 10:00-11:00",
        bookerType: "individual",
        bookerPlatformRole: "student",
        bookerEmail: "student@example.com",
        bookerFullName: "Jane Smith",
        participants: [
          {
            participantType: "individual",
            platformRole: "student",
            email: "student@example.com",
            fullName: "Jane Smith",
          },
        ],
        numberOfExpectedParticipants: 1,
        calendar: {
          eventId: "event_123456",
          joinUrl: "https://teams.microsoft.com/l/meetup-join/...",
          synced: true,
        },
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T10:30:00.000Z",
      },
      {
        _id: "507f1f77bcf86cd799439012",
        sessionId: "507f1f77bcf86cd799439012",
        productType: "TrainingProgram",
        ledBy: "507f1f77bcf86cd799439014",
        scheduleAt: "2025-08-02T14:00:00.000Z",
        endAt: "2025-08-02T16:00:00.000Z",
        durationInMinutes: 120,
        status: "in_progress",
        title: "TrainingProgram | Data Science Fundamentals – Session 1",
        bookerType: "individual",
        bookerPlatformRole: "student",
        bookerEmail: "john.doe@example.com",
        bookerFullName: "John Doe",
        participants: [
          {
            participantType: "individual",
            platformRole: "student",
            email: "john.doe@example.com",
            fullName: "John Doe",
          },
        ],
        numberOfExpectedParticipants: 1,
        calendar: {
          eventId: "event_123457",
          joinUrl: "https://teams.microsoft.com/l/meetup-join/...",
          synced: true,
        },
        createdAt: "2024-01-15T11:30:00.000Z",
        updatedAt: "2024-01-15T11:30:00.000Z",
      },
    ];

    const total = attendances.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: "Attendance records retrieved successfully",
      data: attendances,
      meta: {
        total,
        page,
        limit,
        totalPages,
        requestId: "12345678-1234-1234-1234-123456789012",
        timestamp: new Date().toISOString(),
        durationMs: 50,
        path: "/api/attendance",
      },
    });
  } catch (error: any) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attendances" },
      { status: 500 }
    );
  }
}

// POST /api/attendance - Create a new attendance record
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
      sessionId,
      productType,
      ledBy,
      scheduleAt,
      endAt,
      durationInMinutes,
      title,
      bookerType,
      bookerPlatformRole,
      bookerEmail,
      bookerFullName,
      participants,
      numberOfExpectedParticipants,
    } = body;

    // Validate required fields
    if (
      !sessionId ||
      !productType ||
      !ledBy ||
      !scheduleAt ||
      !endAt ||
      !title
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Implement actual attendance creation logic with Microsoft Teams integration
    // For now, return mock response
    const newAttendance = {
      _id: `attendance_${Date.now()}`,
      sessionId,
      productType,
      ledBy,
      scheduleAt,
      endAt,
      durationInMinutes: durationInMinutes || 60,
      status: "upcoming",
      title,
      bookerType: bookerType || "individual",
      bookerPlatformRole: bookerPlatformRole || "student",
      bookerEmail: bookerEmail || "",
      bookerFullName: bookerFullName || "",
      participants: participants || [],
      numberOfExpectedParticipants: numberOfExpectedParticipants || 1,
      calendar: {
        eventId: `event_${Date.now()}`,
        joinUrl: "https://teams.microsoft.com/l/meetup-join/...",
        synced: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newAttendance,
      message: "Attendance created successfully",
    });
  } catch (error: any) {
    console.error("Error creating attendance:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create attendance" },
      { status: 500 }
    );
  }
}
