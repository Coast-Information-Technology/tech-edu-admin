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
  department?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  recruiter?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  expiryDate?: string;
}
