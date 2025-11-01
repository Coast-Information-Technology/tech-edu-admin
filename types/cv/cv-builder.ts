import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Award as AwardType,
  Project,
  Interest,
  Course,
  Organization,
  Publication as PublicationType,
  Reference,
  Declaration,
  CustomSection,
  Template,
  Section,
  ProfessionalSummary,
  ResumeSection,
} from "./index";

// CV Builder State Types
export interface CVBuilderState {
  // UI State
  showTemplateSelector: boolean;
  showLoadCVModal: boolean;
  showCVUpload: boolean;
  selectedMode: "scratch" | "upload" | null;
  activeSection: string;
  showPreview: boolean;
  showSectionModal: boolean;
  showAddSectionModal: boolean;
  showPreviewModal: boolean;
  showJobMatchModal: boolean;
  showAnalytics: boolean;
  showVersions: boolean;
  showSharing: boolean;
  showJobBoards: boolean;
  selectedTemplate: Template;
  isExporting: boolean;
  builderMode: "content" | "customize";
  templateConfig: any;
  resumeData: ResumeSection[];

  // Resume Data
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  awards: AwardType[];
  projects: Project[];
  interests: Interest[];
  courses: Course[];
  organizations: Organization[];
  publications: PublicationType[];
  references: Reference[];
  declarations: Declaration[];
  customSections: CustomSection[];
  enabledSections: string[];
}

// Section Management Types
export interface SectionManager {
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (
    id: string,
    field: keyof Experience,
    value: string | boolean
  ) => void;

  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (
    id: string,
    field: keyof Education,
    value: string | boolean
  ) => void;

  addSkill: () => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, field: keyof Skill, value: string) => void;

  addLanguage: () => void;
  removeLanguage: (id: string) => void;
  updateLanguage: (id: string, field: keyof Language, value: string) => void;

  addCertification: () => void;
  removeCertification: (id: string) => void;
  updateCertification: (
    id: string,
    field: keyof Certification,
    value: string
  ) => void;

  addAward: () => void;
  removeAward: (id: string) => void;
  updateAward: (id: string, field: keyof AwardType, value: string) => void;

  addProject: () => void;
  removeProject: (id: string) => void;
  updateProject: (
    id: string,
    field: keyof Project,
    value: string | string[]
  ) => void;

  addInterest: () => void;
  removeInterest: (id: string) => void;
  updateInterest: (id: string, field: keyof Interest, value: string) => void;

  addCustomSection: () => void;
  removeCustomSection: (id: string) => void;
  updateCustomSection: (
    id: string,
    field: keyof CustomSection,
    value: string
  ) => void;
}

// CV Builder Props Types
export interface CVBuilderProps {
  initialState?: Partial<CVBuilderState>;
  autoSaveConfig?: Partial<AutoSaveConfig>;
  onStateChange?: (state: CVBuilderState) => void;
  onSave?: (state: CVBuilderState) => Promise<void>;
  onLoad?: (id: string) => Promise<Partial<CVBuilderState>>;
  onExport?: (state: CVBuilderState) => Promise<void>;
}

// Auto-save Configuration
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // milliseconds
  debounceDelay: number; // milliseconds
  onSave: (state: CVBuilderState) => Promise<void>;
}

// Form Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Undo/Redo Types
export interface HistoryState {
  state: CVBuilderState;
  timestamp: number;
  action: string;
}

export interface HistoryManager {
  history: HistoryState[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  push: (state: CVBuilderState, action: string) => void;
  undo: () => CVBuilderState | null;
  redo: () => CVBuilderState | null;
  clear: () => void;
}

// Keyboard Shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

// Performance Optimization Types
export interface MemoizedComponentProps {
  data: any;
  templateId: string;
  templateConfig?: any;
  dependencies?: any[];
}

// Error Boundary Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
