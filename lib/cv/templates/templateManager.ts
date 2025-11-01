// Dynamic Template Manager - No more hardcoding!

import {
  ColumnSectionType,
  SectionConfig,
  TemplateLayout,
} from "@/types/cv/template";

const isColumnSectionType = (v: unknown): v is ColumnSectionType =>
  typeof v === "string" &&
  [
    "professional-summary",
    "education",
    "work-experience",
    "skills",
    "certifications",
    "languages",
    "awards",
    "projects",
    "interests",
  ].includes(v as string);

export class TemplateManager {
  private templates: Map<string, TemplateLayout> = new Map();
  private sectionConfigs: Map<string, SectionConfig> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeSectionConfigs();
  }

  // Template Management
  getTemplate(id: string): TemplateLayout | null {
    return this.templates.get(id) || null;
  }

  getTemplates(): TemplateLayout[] {
    return Array.from(this.templates.values());
  }

  // Debug method to check template status
  debugTemplate(id: string): any {
    const template = this.getTemplate(id);
    return {
      id,
      found: !!template,
      template: template
        ? {
            id: template.id,
            name: template.name,
            columns: template.columns?.length,
            hasStyles: !!template.styles,
          }
        : null,
      allTemplates: Array.from(this.templates.keys()),
    };
  }

  createTemplate(template: Omit<TemplateLayout, "id">): TemplateLayout {
    const id = this.generateTemplateId(template.name);
    const newTemplate: TemplateLayout = {
      ...template,
      id,
      metadata: {
        ...template.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  updateTemplate(
    id: string,
    updates: Partial<TemplateLayout>
  ): TemplateLayout | null {
    const existing = this.templates.get(id);
    if (!existing) return null;

    const updated: TemplateLayout = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      metadata: {
        ...existing.metadata,
        ...updates.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
    this.templates.set(id, updated);
    return updated;
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  // Section Configuration
  getSectionConfig(type: string): SectionConfig | null {
    return this.sectionConfigs.get(type) || null;
  }

  getSectionConfigs(): SectionConfig[] {
    return Array.from(this.sectionConfigs.values());
  }

  // Dynamic Section Placement
  getSectionsForColumn(
    templateId: string,
    columnId: string
  ): ColumnSectionType[] {
    const template = this.getTemplate(templateId);
    if (!template) return [];
    const column = template.columns.find((col) => col.id === columnId);
    // Filter defensively to ensure only ColumnSectionType passes through
    return (column?.sections || []).filter(isColumnSectionType);
  }

  // Get default template (classic)
  getDefaultTemplate(): TemplateLayout {
    return this.getTemplate("classic")!;
  }

  // Get popular templates
  getPopularTemplates(): TemplateLayout[] {
    return this.getTemplates().filter(
      (template) => template.metadata.isPopular
    );
  }

  // Generate dynamic layouts
  generateDynamicLayout(data: any[]): TemplateLayout {
    // Analyze data to determine optimal layout
    const hasPhoto = data.some(
      (section) => section.type === "personal-info" && section.data?.image
    );
    const hasManySections =
      data.filter((s) => s?.type && s.type !== "personal-info").length > 6;

    if (hasManySections) {
      // Use two-column layout for extensive content
      return this.getTemplate("two-column") || this.getDefaultTemplate();
    } else if (hasPhoto) {
      // Use classic layout for photos
      return this.getTemplate("classic") || this.getDefaultTemplate();
    } else {
      // Return the default classic template
      return this.getDefaultTemplate();
    }
  }

  private generateTemplateId(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  private initializeDefaultTemplates(): void {
    // Two Column Template
    this.templates.set("two-column", {
      id: "two-column",
      name: "Two Column",
      description: "Professional sidebar layout with contact info and skills",
      columns: [
        {
          id: "left",
          width: 40,
          // DO NOT include "personal-info" here; renderer handles header separately
          sections: [
            "skills",
            "languages",
            "certifications",
            "awards",
            "interests",
          ],
          styles: {
            backgroundColor: "#1e3a8a",
            textColor: "#f9fafb",
            padding: 32,
          },
          order: 1,
        },
        {
          id: "right",
          width: 60,
          sections: [
            "professional-summary",
            "work-experience",
            "education",
            "projects",
          ],
          styles: {
            backgroundColor: "#ffffff",
            textColor: "#111827",
            padding: 32,
          },
          order: 2,
        },
      ],
      styles: {
        colors: {
          primary: "#1e3a8a",
          secondary: "#3b82f6",
          background: "#ffffff",
          text: "#111827",
          accent: "#f59e0b",
          headerBackground: "#60a5fa", // added for consistency
        },
        typography: {
          fontFamily: "Helvetica, sans-serif",
          headingSize: 16,
          bodySize: 12,
          lineHeight: 1.5,
          // Optional extended sizes can be provided by the user/template:
          // nameSize, titleSize, smallSize, contactSize, skillSize
        },
        spacing: {
          padding: 32,
          margin: 16,
          sectionGap: 24,
        },
        layout: {
          pageWidth: "210mm",
          pageHeight: "297mm",
          borderRadius: 8,
          shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      },
      metadata: {
        category: "professional",
        industry: ["technology", "business", "finance"],
        features: ["photo", "sidebar", "skills"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    // Minimal Template - Clean and simple
    this.templates.set("minimal", {
      id: "minimal",
      name: "Minimal",
      description: "Clean single column layout with minimal styling",
      columns: [
        {
          id: "main",
          width: 100,
          // no "personal-info" here; header is separate in renderer
          sections: [
            "professional-summary",
            "education",
            "work-experience",
            "skills",
            "certifications",
            "projects",
            "languages",
            "awards",
            "interests",
          ],
          styles: {
            backgroundColor: "#ffffff",
            textColor: "#111827",
            padding: 40,
          },
          order: 1,
        },
      ],
      styles: {
        colors: {
          primary: "#059669",
          secondary: "#10b981",
          background: "#ffffff",
          text: "#111827",
          accent: "#f59e0b",
          headerBackground: "#60a5fa",
        },
        typography: {
          fontFamily: "Helvetica, sans-serif",
          headingSize: 16,
          bodySize: 12,
          lineHeight: 1.5,
        },
        spacing: {
          padding: 32,
          margin: 16,
          sectionGap: 24,
        },
        layout: {
          pageWidth: "210mm",
          pageHeight: "297mm",
          borderRadius: 12,
          shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
        },
      },
      metadata: {
        category: "minimal",
        industry: ["design", "marketing", "creative"],
        features: ["clean", "typography", "spacious"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    // Modern Template - Contemporary design
    this.templates.set("modern", {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with bold colors and modern typography",
      columns: [
        {
          id: "header",
          width: 100,
          // keep header row; sections empty (no personal-info in ColumnSectionType)
          sections: [],
          styles: {
            backgroundColor: "#1e40af",
            textColor: "#ffffff",
            padding: 32,
          },
          order: 1,
        },
        {
          id: "left",
          width: 40,
          sections: [
            "skills",
            "languages",
            "certifications",
            "awards",
            "interests",
          ],
          styles: {
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            padding: 24,
          },
          order: 2,
        },
        {
          id: "right",
          width: 60,
          sections: [
            "professional-summary",
            "work-experience",
            "education",
            "projects",
          ],
          styles: {
            backgroundColor: "#ffffff",
            textColor: "#1a1a1a",
            padding: 32,
          },
          order: 3,
        },
      ],
      styles: {
        colors: {
          primary: "#6366f1",
          secondary: "#8b5cf6",
          background: "#ffffff",
          text: "#1a1a1a",
          accent: "#f59e0b",
          headerBackground: "#1e40af",
        },
        typography: {
          fontFamily: "Helvetica, sans-serif",
          headingSize: 16,
          bodySize: 12,
          lineHeight: 1.5,
        },
        spacing: {
          padding: 32,
          margin: 16,
          sectionGap: 24,
        },
        layout: {
          pageWidth: "210mm",
          pageHeight: "297mm",
          borderRadius: 16,
          shadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
        },
      },
      metadata: {
        category: "modern",
        industry: ["tech", "design", "startup"],
        features: ["bold", "contemporary", "dark-sidebar"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    // Classic Template - Traditional and professional
    this.templates.set("classic", {
      id: "classic",
      name: "Classic",
      description:
        "Traditional professional layout with structured header and styled sections",
      columns: [
        {
          id: "header",
          width: 100,
          // sections must be empty here due to ColumnSectionType
          sections: [],
          styles: {
            backgroundColor: "#f8fafc",
            textColor: "#1f2937",
            padding: 32,
            borderBottom: "2px solid #dc2626",
          },
          order: 1,
        },
        {
          id: "main",
          width: 100,
          sections: [
            "professional-summary",
            "education",
            "work-experience",
            "skills",
            "certifications",
            "projects",
            "languages",
            "awards",
            "interests",
          ],
          styles: {
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            padding: 32,
          },
          order: 2,
        },
      ],
      styles: {
        colors: {
          primary: "#1f2937",
          secondary: "#374151",
          background: "#ffffff",
          text: "#1f2937",
          accent: "#dc2626",
          headerBackground: "#f8fafc",
          sectionHeadingBackground: "#e5e7eb",
        },
        typography: {
          fontFamily: "Times-Roman, serif",
          headingSize: 16,
          bodySize: 12,
          lineHeight: 1.7,
          sectionHeadingStyle: "bold",
          sectionHeadingCase: "uppercase",
        },
        spacing: {
          padding: 32,
          margin: 24,
          sectionGap: 24,
          headerPadding: 32,
        },
        layout: {
          pageWidth: "210mm",
          pageHeight: "297mm",
          borderRadius: 0,
          shadow: "none",
          headerBorder: "2px solid #dc2626",
        },
        sectionHeadings: {
          backgroundColor: "#e5e7eb",
          padding: "8px 16px",
          marginBottom: "16px",
          borderRadius: "4px",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "14px",
          letterSpacing: "0.5px",
        },
      },
      metadata: {
        category: "classic",
        industry: ["finance", "legal", "academic"],
        features: ["traditional", "professional", "serif", "structured-header"],
        isDefault: true,
        isPopular: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }

  private initializeSectionConfigs(): void {
    const configs: SectionConfig[] = [
      {
        type: "personal-info",
        displayName: "Personal Information",
        icon: "User",
        category: "personal",
        required: true,
        order: 1,
        defaultVisibility: true,
        styling: {
          showHeader: false,
          headerStyle: "uppercase",
          showDividers: false,
          compact: false,
          icon: true,
        },
      },
      {
        type: "education",
        displayName: "Education",
        icon: "GraduationCap",
        category: "education",
        required: true,
        order: 2,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: false,
          icon: true,
        },
      },
      {
        type: "work-experience",
        displayName: "Work Experience",
        icon: "Briefcase",
        category: "professional",
        required: true,
        order: 3,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: false,
          icon: true,
        },
      },
      {
        type: "skills",
        displayName: "Skills",
        icon: "Zap",
        category: "skills",
        required: false,
        order: 4,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: true,
          icon: true,
        },
      },
      {
        type: "professional-summary",
        displayName: "Professional Summary",
        icon: "FileText",
        category: "professional",
        required: false,
        order: 5,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: false,
          icon: false,
        },
      },
      {
        type: "languages",
        displayName: "Languages",
        icon: "Globe",
        category: "skills",
        required: false,
        order: 6,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: true,
          icon: true,
        },
      },
      {
        type: "certifications",
        displayName: "Certifications",
        icon: "Award",
        category: "professional",
        required: false,
        order: 7,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: true,
          icon: true,
        },
      },
      {
        type: "awards",
        displayName: "Awards",
        icon: "Trophy",
        category: "professional",
        required: false,
        order: 8,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: true,
          icon: true,
        },
      },
      {
        type: "projects",
        displayName: "Projects",
        icon: "FolderOpen",
        category: "professional",
        required: false,
        order: 9,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: false,
          icon: true,
        },
      },
      {
        type: "interests",
        displayName: "Interests",
        icon: "Heart",
        category: "additional",
        required: false,
        order: 10,
        defaultVisibility: true,
        styling: {
          showHeader: true,
          headerStyle: "uppercase",
          showDividers: true,
          compact: true,
          icon: true,
        },
      },
    ];

    configs.forEach((config) => {
      this.sectionConfigs.set(config.type, config);
    });
  }
}

// Export singleton instance
export const templateManager = new TemplateManager();
