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

export interface InstructorFormData {
  email: string;
  password: string;
  fullName: string;
  profileImageUrl: string;
  title: string;
  bio: string;
  specializationAreas: string[];
  certifications: string[];
  yearsOfExperience: number;
  linkedInProfileUrl: string;
  languagesSpoken: string[];
  experience: number;
  experienceDetails: string;
  linkedIn: string;
}

export interface CustomerCareFormData {
  email: string;
  password: string;
  fullName: string;
  profileImageUrl: string;
  assignedDepartments: string[];
}

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role:
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "recruiter"
    | "institution"
    | "customerCareRepresentative"
    | "instructor"
    | "admin";
  isVerified: boolean;
  isLocked?: boolean;
  createdAt: string;
  updatedAt?: string;
  profileImageUrl?: string;
  lastLoginAt?: string;
  lastLoginIP?: string;
  lastLoginLocation?: string;
  onboardingStatus?: string;
  provider?: string;
  isPasswordResetPending?: boolean;
  lockExpiresAt?: string | null;
  loginAttempts?: number;
  tokenVersion?: number;
  profile?: {
    _id?: string;
    userId?: string;
    phoneNumber?: string;
    currentLocation?: string;
    currentJobTitle?: string;
    industryFocus?: string;
    yearsOfExperience?: number;
    employmentStatus?: string;
    academicLevel?: string;
    currentInstitution?: string;
    fieldOfStudy?: string;
    teamName?: string;
    teamSize?: number;
    major?: string;
    graduationYear?: number;
    gpa?: number;
    // Additional profile fields from the actual API response
    additionalProjectLinks?: string[];
    availableAsInstructor?: boolean;
    certifications?: string[];
    consentToTerms?: boolean;
    createdAt?: string;
    frameworksAndTools?: string[];
    interestedInTraining?: boolean;
    isActive?: boolean;
    learningGoals?: {
      priorityAreas?: string[];
    };
    lookingForJobs?: boolean;
    members?: any[];
    onboardingStatus?: string;
    platformGoals?: string[];
    preferredTechStack?: string[];
    programmingLanguages?: string[];
    registeredTrainings?: string[];
    remoteWorkExperience?: boolean;
    skillAssessmentInterested?: boolean;
    softSkills?: string[];
    teamAcknowledged?: boolean;
    trainingAvailability?: string;
    updatedAt?: string;
    // Recruiter-specific fields
    agreeToTerms?: boolean;
    companyId?: string;
    contactEmail?: string;
    hiringRegions?: string[];
    positionAtCompany?: string;
    preferredContactMethod?: string;
    preferredHiringModel?: string;
    recruiterAdminId?: string;
    recruitingName?: string;
    recruitmentFocusAreas?: string[];
    referralCodeOrName?: string;
    referralSource?: string;
    verificationStatus?: string;
    company?: {
      _id?: string;
      associatedUsers?: Array<{
        role: string;
        userId: string;
        _id: string;
      }>;
      contactPerson?: {
        email: string;
        phone: string;
      };
      createdAt?: string;
      industry?: string;
      isActive?: boolean;
      isVerified?: boolean;
      location?: {
        country: string;
        state: string;
        city: string;
      };
      logoUrl?: string;
      name: string;
      rcNumber?: string;
      type?: string;
      updatedAt?: string;
      website?: string;
      __v?: number;
    };
    [key: string]: any;
  };
}
