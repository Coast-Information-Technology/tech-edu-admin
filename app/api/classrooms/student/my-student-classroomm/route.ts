import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// GET /api/classrooms/student/my-student-classroomm - Get student's classrooms
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Implement actual student classrooms fetching logic
    // For now, return mock data
    const studentClassrooms = [
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
      {
        _id: "classroom2",
        name: "Advanced JavaScript",
        description: "Deep dive into JavaScript concepts",
        instructorId: "instructor789",
        scheduleAt: "2024-01-16T14:00:00Z",
        endAt: "2024-01-16T16:00:00Z",
        minutesPerSession: 120,
        numberOfExpectedParticipants: 15,
        meetingLink: "https://meet.google.com/xyz-uvw-123",
        instructorNotes: "Prerequisites: Basic JavaScript knowledge",
        status: "active",
        actualDaysAndTime: [
          {
            day: "Tuesday",
            startTime: "14:00",
            endTime: "16:00",
          },
        ],
        createdAt: "2024-01-11T10:00:00Z",
        updatedAt: "2024-01-11T10:00:00Z",
      },
    ];

    return NextResponse.json({
      success: true,
      data: studentClassrooms,
      message: "Student classrooms retrieved successfully",
    });
  } catch (error: any) {
    console.error("Error fetching student classrooms:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch student classrooms" },
      { status: 500 }
    );
  }
}
