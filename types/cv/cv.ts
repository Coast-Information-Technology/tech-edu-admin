export interface CVExperience {
  title?: string;
  company?: string;
  duration?: string;
  description?: string;
}

export interface CVEducation {
  school?: string;
  degree?: string;
  field?: string;
  year?: string;
}

export interface CVLinks {
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}

export interface CVData {
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  bio?: string;
  cvbuilderImageUrl?: string;
  skills?: string[];
  experience?: CVExperience[];
  education?: CVEducation[];
  links?: CVLinks;
}
