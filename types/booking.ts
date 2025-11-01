export interface Booking {
  _id: string;
  productId?: {
    _id: string;
    service?: string;
    productType?: string;
    price?: number;
    currency?: string;
  };
  productType:
    | "AcademicService"
    | "Training & Certification"
    | "Academic Support Services"
    | "Career Development & Mentorship"
    | "Institutional & Team Services"
    | "AI-Powered or Automation Services"
    | "Recruitment & Job Matching"
    | "Marketing, Consultation & Free Services";
  instructorId?: {
    _id: string;
    fullName?: string;
    email?: string;
  };
  bookingPurpose: string;
  scheduleAt: string;
  endAt: string;
  minutesPerSession: number;
  durationInMinutes: number;
  numberOfExpectedParticipants: number;
  isClassroom: boolean;
  isSession: boolean;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  schedulingStatus?: string;
  meetingLink?: string;
  userNotes?: string;
  internalNotes?: string;
  attachments?: string[] | string;
  cancellation?: {
    isCancelled: boolean;
    cancelledBy?: string;
    reason?: string;
    cancelledAt?: string;
  };
  participantType:
    | "individual"
    | "team"
    | "institution"
    | "recruiter"
    | "visitor";
  platformRole: string;
  email: string;
  fullName: string;
  createdBy?: {
    _id: string;
    fullName?: string;
    email?: string;
  };
  participants?: any[];
  actualDaysAndTime?: any[];
  createdAt: string;
  updatedAt: string;
}
