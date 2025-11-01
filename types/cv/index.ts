// src/types/index.ts

// =====================
// Personal Information
// =====================
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  targetedJobTitle: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  summary?: string;
  image?: string;
  imageSize?: "small" | "medium" | "large";
  industry?: string; // For AI experience generation (not displayed in resume)
}

// =====================
// Professional Summary
// =====================
export interface ProfessionalSummary {
  id: string;
  summary: string;
}

// =====================
// Experience
// =====================
export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // ISO YYYY-MM
  endDate?: string; // ISO YYYY-MM
  current?: boolean;
  description?: string; // plain text or ATS-friendly bullet points
  achievements?: string[];
}

// =====================
// Education
// =====================
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string; // ISO YYYY-MM
  endDate?: string; // ISO YYYY-MM
  gpa?: string;
  current?: boolean;
}

// =====================
// Skills
// =====================
export interface Skill {
  id: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

// =====================
// Languages
// =====================
export interface Language {
  id: string;
  name: string;
  level?: "Basic" | "Conversational" | "Professional" | "Native";
}

// =====================
// Certifications
// =====================
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string; // YYYY-MM
  credentialId?: string;
  credentialUrl?: string;
}

// =====================
// Awards
// =====================
export interface Award {
  id: string;
  title: string;
  issuer?: string;
  date?: string; // YYYY-MM
  description?: string;
}

// =====================
// Projects
// =====================
export interface Project {
  id: string;
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
  githubUrl?: string;
}

// =====================
// Interests
// =====================
export interface Interest {
  id: string;
  name: string;
  description?: string;
}

// =====================
// Courses
// =====================
export interface Course {
  id: string;
  name: string;
  provider?: string;
  completionDate?: string; // YYYY-MM
  certificateUrl?: string;
  description?: string;
}

// =====================
// Organizations
// =====================
export interface Organization {
  id: string;
  name: string;
  role: string;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM
  current?: boolean;
  description?: string;
  website?: string;
}

// =====================
// Publications
// =====================
export interface Publication {
  id: string;
  title: string;
  authors?: string;
  publicationDate?: string; // YYYY-MM
  journal?: string;
  url?: string;
  doi?: string;
  description?: string;
}

// =====================
// References
// =====================
export interface Reference {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

// =====================
// Declarations
// =====================
export interface Declaration {
  id: string;
  content: string;
  signature?: string;
  date?: string;
}

// =====================
// Custom Sections
// =====================
export interface CustomSection {
  id: string;
  title: string;
  content: string; // Rich text kept as plain string for ATS parsing
}

// =====================
// Templates
// =====================
export type Template = "modern" | "classic" | "minimal" | "two-column";

// =====================
// Navigation Sections
// =====================
export interface Section {
  id: string;
  label: string;
  icon: any; // Lucide icon (kept generic for now)
}

// Section discriminated union
type BaseSection<TType extends string, TData> = {
  id: string;
  type: TType;
  heading: string;
  visible: boolean;
  data: TData;
  templateStyles?: any; // Dynamic template styles
  showHeading?: boolean; // Whether to show the section heading
};

export type ResumeSection =
  | BaseSection<"personal-info", PersonalInfo>
  | BaseSection<"professional-summary", ProfessionalSummary>
  | BaseSection<"work-experience", Experience[]>
  | BaseSection<"education", Education[]>
  | BaseSection<"skills", Skill[]>
  | BaseSection<"languages", Language[]>
  | BaseSection<"certifications", Certification[]>
  | BaseSection<"awards", Award[]>
  | BaseSection<"projects", Project[]>
  | BaseSection<"interests", Interest[]>
  | BaseSection<"courses", Course[]>
  | BaseSection<"organizations", Organization[]>
  | BaseSection<"publications", Publication[]>
  | BaseSection<"references", Reference[]>
  | BaseSection<"declarations", Declaration[]>
  | BaseSection<"custom", CustomSection>;

export interface TwoColumnResumeProps {
  data: ResumeSection[];
}
