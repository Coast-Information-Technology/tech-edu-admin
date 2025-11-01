import { Pricing } from "@/lib/constants/pricing";

export type ProductType = string;

export interface Product {
  _id: string;
  productType: ProductType;

  // Basic Information
  service: string;
  description: string;
  slug: string;

  // Pricing
  price: number;
  currency: string;
  discountPercentage?: number;
  originalPrice?: number;
  pricing?: Partial<Pricing> | null;

  // Visual Assets
  thumbnailUrl?: string;
  iconUrl?: string;
  images?: string[];

  // Categorization (New Structure)
  productCategoryId?:
    | string
    | { _id: string; title: string; productType: string };
  productCategoryTitle?: string;
  productSubCategoryId?:
    | string
    | { _id: string; name: string; productType: string };
  productSubcategoryName?: string;

  // Legacy Structure Support
  category?: string;
  subcategories?: string[];
  difficultyLevel?: string;
  targetAudience?: string[];

  // Delivery & Session Configuration
  deliveryMode: string; // "online" | "physical" | "hybrid"
  sessionType: string; // "1-on-1" | "group" | "classroom"
  programLength: number; // Total duration
  mode: string; // "weeks", "months", "sessions"
  durationInMinutes?: number;
  durationMinutes?: number; // Legacy support
  minutesPerSession?: number;
  totalSessions?: number;

  // Service Features
  hasClassroom: boolean;
  hasSession: boolean;
  hasAssessment: boolean;
  hasCertificate: boolean;
  requiresBooking: boolean;
  requiresEnrollment: boolean;
  isAttachmentRequired?: boolean; // New field
  isBookableService: boolean;
  isRecurring: boolean;

  // Instructor Information
  instructorId?: string;
  instructorName?: string;
  instructorBio?: string;
  instructorAvatar?: string;

  // Classroom Configuration
  classroomCapacity?: number;
  classroomRequirements?: string[];
  virtualPlatform?: "zoom" | "teams" | "google-meet" | "custom";

  // Content & Materials
  tags: string[];
  materialUrl?: string;
  videoUrl?: string;
  syllabus?: string;

  // Status & Availability
  enabled: boolean;
  isActive?: boolean;
  enrollmentOpen?: boolean;
  maxEnrollment?: number;
  maxParticipants?: number;
  currentEnrollment?: number;

  // Scheduling URLs
  publicSchedulingUrl?: string;
  schedulingUrl?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;

  // Metadata
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
}
