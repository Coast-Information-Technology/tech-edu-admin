export interface JobApplication {
  _id: string;
  jobPostId: string;
  applicantId: string;
  cvId: string;
  coverLetterId?: string;
  status:
    | "applied"
    | "reviewed"
    | "shortlisted"
    | "interviewed"
    | "hired"
    | "rejected";
  applicationDate: string;
  assessmentScore?: number;
  skillMatchScore?: number;
  referralCode?: string;
  referrerId?: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  // Assuming the backend will populate these fields for the list view
  jobPost?: {
    title: string;
  };
  applicant?: {
    fullName: string;
    email: string;
  };
}
