// services/cv/cvServiceOptimized.ts

import { getTokenFromCookies } from "@/lib/cookies";

/* -----------------------------------------------------------------------------
   Safe JSON helpers: prune Window/DOM/React objects and break cycles
----------------------------------------------------------------------------- */

const PRUNE_KEYS = new Set([
  "window",
  "ownerDocument",
  "defaultView",
  "parentNode",
  "parentElement",
  "nextSibling",
  "previousSibling",
  "children",
  "childNodes",
  "view",
  "_owner",
  "__reactFiber$",
  "__reactInternalInstance",
]);

function isLikelyReactElement(v: any) {
  return !!(v && (v.$$typeof || v._owner || v._store));
}

function isDomLike(v: any) {
  return !!(
    v &&
    typeof v === "object" &&
    ("nodeType" in v || "tagName" in v || "ownerDocument" in v)
  );
}

function isWindowLike(v: any) {
  return !!(v && typeof v === "object" && (v.window === v || v.self === v));
}

function safeJsonStringify(input: any): string {
  const seen = new WeakSet<object>();

  return JSON.stringify(input, function (key, value) {
    // Drop known problematic keys early
    if (PRUNE_KEYS.has(key)) return undefined;

    // Functions / symbols / undefined => drop
    if (
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "undefined"
    ) {
      return undefined;
    }

    if (value && typeof value === "object") {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);

      if (isWindowLike(value)) return "[Window]";
      if (isDomLike(value)) {
        const name =
          (value as any).nodeName ||
          (value as any).tagName ||
          value.constructor?.name ||
          "DOMNode";
        return `[${name}]`;
      }
      if (isLikelyReactElement(value)) return "[ReactElement]";

      if (value instanceof Date) return value.toISOString();
      if (typeof File !== "undefined" && value instanceof File)
        return `[File:${value.name}]`;
      if (typeof Blob !== "undefined" && value instanceof Blob)
        return `[Blob:${value.size}]`;
      if (value instanceof Map)
        return { __type: "Map", value: Array.from(value.entries()) };
      if (value instanceof Set)
        return { __type: "Set", value: Array.from(value.values()) };
      if (value instanceof URL) return value.toString();
      if (value instanceof RegExp) return value.toString();
    }

    return value;
  });
}

/* -----------------------------------------------------------------------------
   Types
----------------------------------------------------------------------------- */

interface CVSection {
  id?: string;
  type: string;
  heading?: string;
  visible?: boolean;
  data?: Record<string, any>;
}

interface ConsentSettings {
  aiProcessing?: boolean;
  aiTraining?: boolean;
}

interface CreateCVRequest {
  title?: string;
  sections: CVSection[];
  consent?: ConsentSettings;
  template?: string;
}

interface CVResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    sections: CVSection[];
    consent: ConsentSettings;
    template?: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

interface DraftResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    cvId: string;
    working: any[];
    isDirty: boolean;
    template?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message?: string;
}

// Normalized shapes the UI can rely on
export type ExperienceAssessment = {
  seniority: "junior" | "mid" | "senior" | "lead";
  minYears: number; // >= 0
  // topSkills: string[]; // unique, non-empty
  // rationale: string; // string (may be empty)
  achievements: string[];
  description: string;
};

export type SkillItem = {
  name: string;
  score: number; // 0..100
  evidence?: string;
};

export type SkillsAssessment = {
  skills: SkillItem[]; // deduped by name
  top: string[]; // unique names
};

/*===========================================================================*/
/*===========================================================================*/
/*===============================AI NORMALIZER===============================*/
/*===========================================================================*/
/*===========================================================================*/

// Add near other types
export type ExperienceAIResult = {
  description?: string;
  achievements?: string[];
  // keep legacy fields in case you still surface them somewhere
  seniority?: "junior" | "mid" | "senior" | "lead";
  minYears?: number;
  topSkills?: string[];
  rationale?: string;
};

// helper: pick the best item based on jobTitle/company/current
function pickBestItem(
  items: any[] = [],
  sel?: { jobTitle?: string; company?: string; preferCurrent?: boolean }
) {
  const jt = (sel?.jobTitle || "").toLowerCase().trim();
  const co = (sel?.company || "").toLowerCase().trim();

  let best = items[0] || null;
  let bestScore = -1;

  for (const it of items) {
    let score = 0;
    const ij = (it?.jobTitle || "").toLowerCase();
    const ic = (it?.company || "").toLowerCase();

    if (jt && ij === jt) score += 3;
    else if (jt && ij.includes(jt)) score += 2;

    if (co && ic === co) score += 2;
    else if (co && ic.includes(co)) score += 1;

    if (sel?.preferCurrent && it?.current) score += 1;

    if (score > bestScore) {
      bestScore = score;
      best = it;
    }
  }
  return best || null;
}

function normalizeExperienceV2(
  raw: any,
  sel?: { jobTitle?: string; company?: string; preferCurrent?: boolean }
): ExperienceAIResult {
  const payload = raw?.data?.data ?? raw?.data ?? raw;

  // New shape: { ok, items: [...] }
  if (Array.isArray(payload?.items) && payload.items.length) {
    const chosen = pickBestItem(payload.items, sel) || payload.items[0];
    return {
      description: String(chosen?.description ?? "").trim(),
      achievements: Array.isArray(chosen?.achievements)
        ? chosen.achievements.map((s: any) => String(s).trim()).filter(Boolean)
        : [],
    };
  }

  // Legacy shape: { seniority, minYears, topSkills, rationale }
  if (payload?.rationale || payload?.topSkills) {
    return {
      description: String(payload?.rationale ?? "").trim(),
      achievements: Array.isArray(payload?.topSkills)
        ? payload.topSkills.map((s: any) => String(s).trim()).filter(Boolean)
        : [],
      seniority: payload?.seniority,
      minYears: payload?.minYears,
      topSkills: payload?.topSkills,
      rationale: payload?.rationale,
    };
  }

  return {};
}

// Add this near the "Types" section
export type AiSummary = { content: string; bullets: string[] };

function normalizeSummary(raw: any): AiSummary {
  // 1) plain string => treat as content only
  if (typeof raw === "string") return { content: raw.trim(), bullets: [] };
  if (!raw || typeof raw !== "object") return { content: "", bullets: [] };

  // 2) common shapes the frontend may see
  // a) { success, data: { content, bullets } }
  if (raw.success && raw.data && (raw.data.content || raw.data.bullets)) {
    return {
      content: String(raw.data.content ?? "").trim(),
      bullets: Array.isArray(raw.data.bullets) ? raw.data.bullets : [],
    };
  }

  // b) axios-like: { data: { success, data: { content, bullets } } }
  if (raw.data && raw.data.success && raw.data.data) {
    const d = raw.data.data;
    return {
      content: String(d.content ?? d.summary ?? "").trim(),
      bullets: Array.isArray(d.bullets) ? d.bullets : [],
    };
  }

  // c) axios-like: { data: { content, bullets } } or { data: { summary } }
  if (raw.data && (raw.data.content || raw.data.bullets || raw.data.summary)) {
    return {
      content: String(raw.data.content ?? raw.data.summary ?? "").trim(),
      bullets: Array.isArray(raw.data.bullets) ? raw.data.bullets : [],
    };
  }

  // d) flat: { content, bullets } or { summary }
  if (raw.content || raw.bullets || raw.summary) {
    return {
      content: String(raw.content ?? raw.summary ?? "").trim(),
      bullets: Array.isArray(raw.bullets) ? raw.bullets : [],
    };
  }

  return { content: "", bullets: [] };
}

function normalizeExperience(raw: any): ExperienceAssessment {
  // unwrap common axios/wrapper shapes
  const d = (raw?.data?.data ?? raw?.data ?? raw) as {
    seniority?: unknown;
    minYears?: unknown;
    // topSkills?: unknown;
    // rationale?: unknown;
    achievements?: unknown;
    description?: unknown;
  };

  // seniority
  let seniority = String(d?.seniority ?? "").toLowerCase();
  const valid = new Set<ExperienceAssessment["seniority"]>([
    "junior",
    "mid",
    "senior",
    "lead",
  ]);
  if (!valid.has(seniority as any)) seniority = "mid";

  // minYears
  const minYearsRaw = Number(d?.minYears);
  let minYears = Number.isFinite(minYearsRaw) ? minYearsRaw : 0;
  if (minYears < 0) minYears = 0;

  // topSkills (force element type to string)
  const achievementsInput = Array.isArray(d?.achievements)
    ? (d!.achievements as unknown[])
    : [];
  const achievements: string[] = Array.from(
    new Set<string>(
      achievementsInput
        .map((s) => String(s).trim())
        .filter((s): s is string => s.length > 0)
    )
  );

  // rationale
  const description = String(d?.description ?? "").trim();

  return {
    seniority: seniority as ExperienceAssessment["seniority"],
    minYears,
    achievements,
    description,
  };
}

function normalizeSkills(raw: any): SkillsAssessment {
  // unwrap common axios/wrapper shapes
  const d = (raw?.data?.data ?? raw?.data ?? raw) as {
    skills?: unknown;
    top?: unknown;
  };

  // skills[]
  const incomingSkills = Array.isArray(d?.skills)
    ? (d.skills as unknown[])
    : [];
  const skillsMap = new Map<string, SkillItem>();

  for (const itemAny of incomingSkills) {
    const item = itemAny as Partial<SkillItem> & {
      name?: unknown;
      score?: unknown;
      evidence?: unknown;
    };
    const name = String(item?.name ?? "").trim();
    if (!name) continue;

    let score = Number(item?.score);
    if (!Number.isFinite(score)) score = 0;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const ev = item?.evidence;
    const evidence = ev == null ? undefined : String(ev);

    const prev = skillsMap.get(name);
    if (
      !prev ||
      score > prev.score ||
      (evidence?.length ?? 0) > (prev.evidence?.length ?? 0)
    ) {
      skillsMap.set(name, { name, score, evidence });
    }
  }
  const skills = Array.from(skillsMap.values());

  // top[] as string[]
  const topInput = Array.isArray(d?.top) ? (d.top as unknown[]) : [];
  const top: string[] = Array.from(
    new Set<string>(
      topInput
        .map((s) => String(s).trim())
        .filter((s): s is string => s.length > 0)
    )
  );

  return { skills, top };
}

/* -----------------------------------------------------------------------------
   Optimized CV service
----------------------------------------------------------------------------- */

class OptimizedCVService {
  // Generic API request method
  private async apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    body?: any
  ): Promise<T> {
    // Safe JSON stringify function for logging
    const safeStringify = (obj: any) => {
      try {
        return JSON.stringify(
          obj,
          (key, value) => {
            if (value && typeof value === "object") {
              // Handle all HTML elements
              if (
                value.constructor &&
                value.constructor.name.startsWith("HTML")
              ) {
                return `[${value.constructor.name}]`;
              }
              // Handle SVG elements
              if (
                value.constructor &&
                value.constructor.name.startsWith("SVG")
              ) {
                return `[${value.constructor.name}]`;
              }
              // Handle React Fiber nodes
              if (value.__reactFiber$ || value.__reactInternalInstance) {
                return "[ReactElement]";
              }
              // Handle circular references
              if (value.constructor && value.constructor.name === "FiberNode") {
                return "[FiberNode]";
              }
              // Handle any other DOM-like objects
              if (value.nodeType || value.tagName || value.ownerDocument) {
                return "[DOMElement]";
              }
            }
            return value;
          },
          2
        );
      } catch (error) {
        return "[Circular Reference Error]";
      }
    };

    console.log(`🌐 API Request: ${method} ${endpoint}`, {
      hasBody: !!body,
      bodyKeys: body ? Object.keys(body) : [],
      bodyPreview: body ? safeStringify(body).substring(0, 500) + "..." : null,
    });

    const token = getTokenFromCookies();
    if (!token) {
      console.error("❌ Authentication token not found");
      throw new Error("Authentication token not found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${endpoint}`;

    console.log(`🔗 Full URL: ${url}`);
    console.log(`🚀 API Call: ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: body ? safeJsonStringify(body) : undefined,
    });

    console.log(
      `📡 Response status: ${response.status} ${response.statusText}`
    );

    // Safer parsing: tolerate non-JSON error responses
    const raw = await response.text();
    let parsed: any = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = { message: raw || "Non-JSON response" };
    }

    console.log(`📥 Response data:`, parsed);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        parsed,
        url: response.url,
        method,
        endpoint,
      });
      throw new Error(
        parsed?.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    console.log(`✅ API Success: ${method} ${endpoint}`);
    return parsed as T;
  }

  // CV Operations
  async createCV(data: CreateCVRequest): Promise<string> {
    console.log("🔧 createCV called with:", {
      hasTitle: !!data.title,
      hasSections: !!data.sections,
      sectionsCount: data.sections?.length,
      hasConsent: !!data.consent,
    });

    const response = await this.apiRequest<CVResponse>("/api/cv", "POST", data);

    console.log("✅ New CV created:", response.data.id);
    return response.data.id;
  }

  async getCV(id: string): Promise<CVResponse["data"]> {
    const response = await this.apiRequest<CVResponse>(`/api/cv/${id}`, "GET");
    return response.data;
  }

  async updateCV(
    id: string,
    data: Partial<CreateCVRequest>
  ): Promise<CVResponse["data"]> {
    console.log("🔧 updateCV called with:", {
      id,
      hasTitle: !!data.title,
      hasSections: !!data.sections,
      sectionsCount: data.sections?.length,
      hasConsent: !!data.consent,
    });

    const response = await this.apiRequest<CVResponse>(
      `/api/cv/${id}`,
      "PATCH",
      data
    );

    console.log("✅ CV updated successfully:", response.data.id);
    return response.data;
  }

  // Get all CVs for authenticated user
  async getAllCVs(): Promise<CVResponse["data"][]> {
    const response = await this.apiRequest<{
      success: boolean;
      data: CVResponse["data"][];
    }>("/api/cv", "GET");
    return response.data;
  }

  async deleteCV(id: string): Promise<void> {
    await this.apiRequest(`/api/cv/${id}`, "DELETE");
  }

  // Draft Operations
  async getDraft(id: string): Promise<DraftResponse["data"]> {
    const response = await this.apiRequest<DraftResponse>(
      `/api/cv/drafts/${id}`,
      "GET"
    );
    return response.data;
  }

  // Try to find a draft by associated CV id
  async getDraftIdForCv(cvId: string): Promise<string | null> {
    try {
      const response = await this.apiRequest<{
        success: boolean;
        data: DraftResponse["data"];
      }>(`/api/cv/drafts/by-cv/${encodeURIComponent(cvId)}`, "GET");
      return response?.data?._id || null;
    } catch (error) {
      console.warn(
        "No existing draft found for cvId or endpoint unavailable:",
        {
          cvId,
          error,
        }
      );
      return null;
    }
  }

  // Create draft with working data (template draft or with cvId)
  async createDraft(data: {
    cvId?: string;
    working: any[];
    isDirty?: boolean;
    aiSuggestions?: any;
    template?: string;
  }): Promise<string> {
    const response = await this.apiRequest<DraftResponse>(
      "/api/cv/drafts",
      "POST",
      data
    );
    return response.data._id;
  }

  // Create or update draft - prevents multiple drafts
  async createOrUpdateDraft(data: {
    cvId?: string;
    working: any[];
    isDirty?: boolean;
    aiSuggestions?: any;
    template?: string;
    draftId?: string; // If provided, update existing draft
  }): Promise<string> {
    console.log("🔧 createOrUpdateDraft called with:", {
      cvId: data.cvId,
      draftId: data.draftId,
      hasWorking: data.working?.length,
    });

    if (data.draftId) {
      console.log("🔄 Updating existing draft:", data.draftId);
      // Remove draftId from the request body since it's in the URL
      const { draftId, ...updateData } = data;
      const response = await this.apiRequest<DraftResponse>(
        `/api/cv/drafts/${data.draftId}`,
        "PATCH",
        updateData
      );
      console.log("✅ Draft updated successfully:", response.data._id);
      return response.data._id;
    }

    console.log("🆕 Creating new draft for cvId:", data.cvId);
    const response = await this.apiRequest<DraftResponse>(
      "/api/cv/drafts",
      "POST",
      data
    );
    console.log("✅ New draft created:", response.data._id);
    return response.data._id;
  }

  // Publish CV from draft
  async publishCV(draftId: string): Promise<string> {
    const response = await this.apiRequest<CVResponse>(
      `/api/cv/publish`,
      "POST",
      { draftId }
    );
    return response.data.id;
  }

  /*****************************************************************
 *****************************************************************
// AI OPERATIONS
******************************************************************
******************************************************************/
  // GENERATE SUMMARY
  async generateSummary(
    cvId: string,
    tone: string = "professional and concise"
  ): Promise<AiSummary> {
    const response = await this.apiRequest<any>(
      `/api/cv/ai/summary?cvId=${encodeURIComponent(cvId)}`,
      "POST",
      { tone }
    );
    return normalizeSummary(response);
  }

  // EXPERIENCE: returns ExperienceAssessment
  // services/cv/cvServiceOptimized.ts

  // … keep the rest …

  // EXPERIENCE: returns normalized { description, achievements } (and legacy fields if present)
  async generateExperience(
    cvId: string,
    context: { targetRole?: string; industry?: string },
    extra?: { jobTitle?: string; company?: string; preferCurrent?: boolean }
  ): Promise<ExperienceAIResult> {
    if (!cvId) throw new Error("CV must be created first");

    const res = await this.apiRequest<any>(
      `/api/cv/ai/experience?cvId=${encodeURIComponent(cvId)}`,
      "POST",
      {
        cvId,
        context,
        ...(extra || {}),
      }
    );

    // Surface server-side failure reasons
    if (res?.data?.ok === false) {
      const reason =
        res?.error?.details?.[0] ||
        res?.data?.reason ||
        res?.message ||
        "AI experience generation failed";
      throw new Error(reason);
    }

    return normalizeExperienceV2(res, extra);
  }

  /**
   * Call once if backend requires explicit AI processing consent
   * POST /api/auth/ai/consent/accept  -> { ok: true }
   */
  async acceptAIProcessing() {
    const json = await this.apiRequest<any>(
      `/api/auth/ai/consent/accept`,
      "POST"
    );
    if (!json?.ok) throw new Error("Failed to accept AI processing consent");
    return true;
  }

  // SKILLS: returns SkillsAssessment
  async generateSkills(
    cvId: string,
    level: "all" | "top-5" = "all",
    prompt?: string,
    context?: { targetRole: string; industry: string | undefined }
  ): Promise<SkillsAssessment> {
    const body: any = { level };
    if (prompt) body.prompt = prompt;
    if (context) body.context = context;

    const res = await this.apiRequest<any>(
      `/api/cv/ai/skills?cvId=${encodeURIComponent(cvId)}`,
      "POST",
      body
    );
    return normalizeSkills(res);
  }

  async generateProjects(
    cvId: string,
    prompt?: string,
    context?: { targetRole: string; emphasize: string[] }
  ): Promise<any> {
    const requestBody: any = {};
    if (prompt) requestBody.prompt = prompt;
    if (context) requestBody.context = context;

    const response = await this.apiRequest(
      `/api/cv/ai/projects?cvId=${encodeURIComponent(cvId)}`,
      "POST",
      requestBody
    );
    return response;
  }

  async getMatchScore(cvId: string, jobDescription: string): Promise<any> {
    const response = await this.apiRequest(
      `/api/cv/ai/match-score?cvId=${encodeURIComponent(cvId)}`,
      "POST",
      {
        jobDescription,
      }
    );
    return response;
  }

  // Helpers
  transformPersonalInfo(personalInfo: any): any {
    const firstName = personalInfo.firstName || "User";
    const lastName = personalInfo.lastName || "Name";
    const fullName = `${firstName} ${lastName}`.trim();

    return { ...personalInfo, fullName };
  }

  createCVData(
    personalInfo: any,
    sections: any[],
    consent?: ConsentSettings,
    template?: string
  ): CreateCVRequest {
    const transformedPersonalInfo = this.transformPersonalInfo(personalInfo);

    const transformedSections = sections.map((section) => {
      if (section.type === "personal-info" && section.data) {
        return {
          ...section,
          data: {
            ...section.data,
            fullName: transformedPersonalInfo.fullName,
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
          },
        };
      }
      return section;
    });

    return {
      title: `${transformedPersonalInfo.fullName} - CV`,
      sections: transformedSections,
      consent: consent || { aiProcessing: false, aiTraining: false },
      template: template,
    };
  }
}

// Export singleton instance
export const cvService = new OptimizedCVService();
export type { CreateCVRequest, CVResponse, CVSection, ConsentSettings };
