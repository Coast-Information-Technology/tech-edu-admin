export interface Classroom {
  _id: string;
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose: string;
  instructorId?: string;
  minutesPerSession?: number;
  numberOfExpectedParticipants: number;
  completionNotes?: string;
  instructorNotes?: string;
  internalNotes?: string;
  status: string;
  attendance?: {
    present: number;
    absent: number;
    total: number;
  };
  meetingLink?: string;
  actualDaysAndTime?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  sessionType?: "group" | "1-on-1";
  participantType: "institution" | "team" | "individual";
  sessionsCompleted?: number;
  sessionsRemaining: number;
  avgRating?: number;
  userNotes?: string;
  participants: Array<{
    participantType: string;
    platformRole: string;
    profileId?: string;
    email: string;
    fullName: string;
  }>;
  scheduleAt: string;
  endAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
