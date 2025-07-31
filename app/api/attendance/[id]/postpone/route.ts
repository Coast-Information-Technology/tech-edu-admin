import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

// PUT /api/attendance/{id}/postpone - Postpone attendance
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

    const attendanceId = params.id;
    const body = await request.json();
    const { newScheduleAt, newEndAt, reason } = body;

    if (!newScheduleAt || !newEndAt || !reason?.trim()) {
      return NextResponse.json(
        { success: false, message: "New schedule and reason are required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual attendance postponement logic with Microsoft Teams integration
    // For now, return mock response
    const originalAttendance = {
      _id: attendanceId,
      status: "postponed",
      isPostponed: true,
      postponedTo: {
        date: newScheduleAt,
        reason: reason,
      },
    };

    const newAttendance = {
      _id: `attendance_${Date.now()}`,
      status: "upcoming",
      isPostponed: false,
      scheduleAt: newScheduleAt,
      endAt: newEndAt,
      rescheduledFrom: attendanceId,
      rescheduledMeetingLink: "https://teams.microsoft.com/l/meetup-join/...",
    };

    return NextResponse.json({
      success: true,
      message: "Attendance postponed successfully",
      data: {
        originalAttendance,
        newAttendance,
      },
      meta: {
        requestId: "12345678-1234-1234-1234-123456789012",
        timestamp: new Date().toISOString(),
        durationMs: 200,
        path: `/api/attendance/${attendanceId}/postpone`,
      },
    });
  } catch (error: any) {
    console.error("Error postponing attendance:", error);
    return NextResponse.json(
      { success: false, message: "Failed to postpone attendance" },
      { status: 500 }
    );
  }
}
