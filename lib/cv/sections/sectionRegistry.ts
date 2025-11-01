// Dynamic Section Registry - No more hardcoded sections!
import { ComponentType } from "react";

// Section component registry - dynamically maps section types to their components
export interface SectionComponentRegistry {
  [sectionType: string]: {
    component: ComponentType<any>;
    displayName: string;
    description?: string;
    icon?: string;
    category?: string;
  };
}

// Dynamic section registry
const sectionRegistry: SectionComponentRegistry = {};

/**
 * Register a section component dynamically
 */
export function registerSection(
  sectionType: string,
  config: {
    component: ComponentType<any>;
    displayName: string;
    description?: string;
    icon?: string;
    category?: string;
  }
) {
  sectionRegistry[sectionType] = config;
}

/**
 * Get a section component by type
 */
export function getSectionComponent(sectionType: string) {
  return sectionRegistry[sectionType];
}

/**
 * Get all registered sections
 */
export function getAllSections(): SectionComponentRegistry {
  return { ...sectionRegistry };
}

/**
 * Get sections by category
 */
export function getSectionsByCategory(category: string) {
  return Object.entries(sectionRegistry)
    .filter(([_, config]) => config.category === category)
    .reduce((acc, [type, config]) => ({ ...acc, [type]: config }), {});
}

/**
 * Check if a section type is registered
 */
export function isSectionRegistered(sectionType: string): boolean {
  return sectionType in sectionRegistry;
}

/**
 * Get section display name
 */
export function getSectionDisplayName(sectionType: string): string {
  return sectionRegistry[sectionType]?.displayName || sectionType;
}

/**
 * Get section description
 */
export function getSectionDescription(sectionType: string): string {
  return sectionRegistry[sectionType]?.description || "";
}

/**
 * Get section icon
 */
export function getSectionIcon(sectionType: string): string {
  return sectionRegistry[sectionType]?.icon || "📄";
}

/**
 * Get section category
 */
export function getSectionCategory(sectionType: string): string {
  return sectionRegistry[sectionType]?.category || "general";
}
