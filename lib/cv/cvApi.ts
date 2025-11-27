// CV Builder API client
import { ResumeSection } from "@/types/cv/index";

// Types for API responses
export interface CVResponse {
  id: string;
  data: ResumeSection[];
  template: string;
  enabledSections: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CVDraftResponse {
  id: string;
  data: ResumeSection[];
  template: string;
  enabledSections: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCVRequest {
  data: ResumeSection[];
  template: string;
  enabledSections: string[];
}

export interface UpdateCVRequest {
  data?: ResumeSection[];
  template?: string;
  enabledSections?: string[];
}

export interface ReorderSectionsRequest {
  sectionIds: string[];
}

export interface ToggleSectionRequest {
  sectionId: string;
  visible: boolean;
}

export interface PublishCVRequest {
  cvId: string;
}

export interface AIExperienceRequest {
  jobTitle: string;
  description: string;
}

export interface AIExperienceResponse {
  suggestions: string[];
  missingSkills: string[];
  experienceLevel: "entry" | "mid" | "senior" | "executive";
}

// API Base URL - you can move this to environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// CV Builder API functions
export const cvApi = {
  // Create a new CV
  async createCV(request: CreateCVRequest): Promise<CVResponse> {
    return apiCall<CVResponse>("/cv", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  // Get CV by ID
  async getCV(id: string): Promise<CVResponse> {
    return apiCall<CVResponse>(`/cv/${id}`);
  },

  // Update CV
  async updateCV(id: string, request: UpdateCVRequest): Promise<CVResponse> {
    return apiCall<CVResponse>(`/cv/${id}`, {
      method: "PATCH",
      body: JSON.stringify(request),
    });
  },

  // Reorder CV sections
  async reorderSections(
    id: string,
    request: ReorderSectionsRequest
  ): Promise<CVResponse> {
    return apiCall<CVResponse>(`/cv/${id}/sections/reorder`, {
      method: "PATCH",
      body: JSON.stringify(request),
    });
  },

  // Toggle section visibility
  async toggleSection(
    id: string,
    request: ToggleSectionRequest
  ): Promise<CVResponse> {
    return apiCall<CVResponse>(`/cv/${id}/sections/toggle`, {
      method: "PATCH",
      body: JSON.stringify(request),
    });
  },

  // Publish CV from draft
  async publishCV(request: PublishCVRequest): Promise<CVResponse> {
    return apiCall<CVResponse>("/cv/publish", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  // Drafts API functions
  // Create or update CV draft
  async saveDraft(
    id: string,
    request: CreateCVRequest
  ): Promise<CVDraftResponse> {
    return apiCall<CVDraftResponse>(`/cv/drafts/${id}`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  // Get CV draft by ID
  async getDraft(id: string): Promise<CVDraftResponse> {
    return apiCall<CVDraftResponse>(`/cv/drafts/${id}`);
  },

  // AI Features
  // AI-powered experience analysis
  async analyzeExperience(
    request: AIExperienceRequest
  ): Promise<AIExperienceResponse> {
    return apiCall<AIExperienceResponse>("/cv/ai/experience-required", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

export default cvApi;
