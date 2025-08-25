export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "remote";
  requiredSkills: string[];
  tags: string[];
  salaryRange: string;
  company?: string;
  companyId?: string;
  department?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  recruiter?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  expiryDate?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  // Additional fields from API
  experienceLevel?: string;
  companyLogo?: string | null;
  version?: number;
  previousVersions?: any[];
  recruiterId?: string;
}

export interface AppliedJob extends Job {
  applicationDate: string;
  applicationStatus:
    | "applied"
    | "reviewing"
    | "shortlisted"
    | "interviewed"
    | "offered"
    | "rejected";
  applicationId: string;
}

export interface JobFormData {
  title: string;
  description: string;
  location: string;
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "remote";
  requiredSkills: string[];
  tags: string[];
  salaryRange: string;
  company?: string;
  companyId?: string; // Add companyId field for API
  department?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  recruiter?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  expiryDate?: string;
}

export interface JobApplication {
  _id: string;
  jobPostId: string;
  applicantId: string;
  cvId: string;
  coverLetterId: string;
  status: string;
  applicationDate: string;
  assessmentScore: number;
  skillMatchScore: number;
  referralCode?: string;
  referrerId?: string;
  isDeleted: boolean;
  deletedAt?: string;
  version: number;
  previousVersions: any[];
  createdAt: string;
  updatedAt: string;
}
