export type CVData = {
  // Basic Info
  name: string;
  headline: string; // e.g. "Business Development Consultant"
  profileSummary: string; // Professional summary or profile
  photoUrl?: string;

  // Contact
  email: string;
  phone: string;
  address?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  twitter?: string;
  otherContacts?: { label: string; value: string }[];

  // Experience
  experience: {
    id: string;
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description: string;
    achievements?: string[]; // bullet points
  }[];

  // Education
  education: {
    id: string;
    degree: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate?: string;
    honors?: string;
    description?: string;
  }[];

  // Skills
  skills: {
    id: string;
    name: string;
    level?: string; // e.g. "Expert", "Intermediate", "Beginner"
    category?: string; // e.g. "Technical", "Soft"
  }[];

  // Certifications
  certifications?: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    description?: string;
  }[];

  // Languages
  languages?: {
    id: string;
    name: string;
    proficiency: string; // e.g. "Native", "C2", "Fluent"
  }[];

  // Awards & Honors
  awards?: {
    id: string;
    title: string;
    issuer: string;
    year: string;
    description?: string;
  }[];

  // Projects
  projects?: {
    id: string;
    title: string;
    description: string;
    technologies?: string[];
    link?: string;
  }[];

  // Tools (for design/tech resumes)
  tools?: string[];

  // Publications
  publications?: {
    id: string;
    title: string;
    publication: string;
    year: string;
    link?: string;
  }[];

  // Memberships
  memberships?: {
    id: string;
    organization: string;
    role?: string;
    years?: string;
  }[];

  // References
  references?: {
    id: string;
    name: string;
    position: string;
    company: string;
    email?: string;
    phone?: string;
  }[];

  // Interests (optional)
  interests?: string[];

  // Favorite Books (for creative/UX layouts)
  favoriteBooks?: string[];

  // Custom Sections (future-proofing)
  customSections?: {
    id: string;
    title: string;
    content: string;
  }[];

  // Layout & Customization
  layout: string; // e.g. "cv_1"
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    isCustom?: boolean;
  };
  font: string;
  spacing: string;
  spacingValue: number;
};
