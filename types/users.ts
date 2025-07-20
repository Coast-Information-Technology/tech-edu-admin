export interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "student"
    | "individualTechProfessional"
    | "instructor"
    | "teamTechProfessional"
    | "recruiter"
    | "admin";
  status: "active" | "inactive" | "pending" | "suspended";
  avatar: string;
  location: string;
  phone: string;
  joinDate: string;
  lastActive: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  certifications: number;
  department?: string;
  company?: string;
  institution?: string;
  bio?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  isVerified?: boolean;
  onboardingStatus?: string;
  // Role-specific fields
  title?: string;
  specializationAreas?: string[];
  yearsOfExperience?: number;
  experienceDetails?: string;
  linkedIn?: string;
  totalStudents?: number;
  rating?: number;
  // Team Tech Professional specific
  teamName?: string;
  teamSize?: number;
  companyInfo?: any;
  members?: any[];
  // Student specific
  academicLevel?: string;
  currentInstitution?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  interestAreas?: string[];
  // Individual Tech Professional specific
  currentJobTitle?: string;
  employmentStatus?: string;
  industryFocus?: string;
  programmingLanguages?: string[];
  softSkills?: string[];
  activityHistory?: Array<{
    id: string;
    action: string;
    timestamp: string;
    details: string;
  }>;
}

export interface AdminProfile {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  onboardingStatus: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    _id: string;
    userId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: string;
    permissions: string[];
    departments: string[];
    assignedRegions: string[];
    status: string;
    bio: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}
