/**
 * Template Persistence Utilities
 *
 * Handles saving and loading template configurations to/from localStorage
 * Provides a simple interface for persisting template customizations
 */

import { TemplateLayout } from "@/types/cv/template";

export class TemplatePersistence {
  private static readonly STORAGE_KEY_PREFIX = "cv_template_config_";

  /**
   * Save template configuration to localStorage
   */
  static saveTemplateConfig(templateId: string, config: TemplateLayout): void {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${templateId}`;
      const serializedConfig = JSON.stringify(config);
      localStorage.setItem(key, serializedConfig);
      console.log(`Template config saved for ${templateId}:`, config);
    } catch (error) {
      console.error(`Failed to save template config for ${templateId}:`, error);
    }
  }

  /**
   * Load template configuration from localStorage
   */
  static loadTemplateConfig(templateId: string): TemplateLayout | null {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${templateId}`;
      const serializedConfig = localStorage.getItem(key);

      if (!serializedConfig) {
        return null;
      }

      const config = JSON.parse(serializedConfig) as TemplateLayout;
      console.log(`Template config loaded for ${templateId}:`, config);
      return config;
    } catch (error) {
      console.error(`Failed to load template config for ${templateId}:`, error);
      return null;
    }
  }

  /**
   * Remove template configuration from localStorage
   */
  static removeTemplateConfig(templateId: string): void {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${templateId}`;
      localStorage.removeItem(key);
      console.log(`Template config removed for ${templateId}`);
    } catch (error) {
      console.error(
        `Failed to remove template config for ${templateId}:`,
        error
      );
    }
  }

  /**
   * Clear all template configurations
   */
  static clearAllTemplateConfigs(): void {
    try {
      const keys = Object.keys(localStorage);
      const templateKeys = keys.filter((key) =>
        key.startsWith(this.STORAGE_KEY_PREFIX)
      );

      templateKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log(`Cleared ${templateKeys.length} template configurations`);
    } catch (error) {
      console.error("Failed to clear template configurations:", error);
    }
  }

  /**
   * Get all saved template configurations
   */
  static getAllTemplateConfigs(): Record<string, TemplateLayout> {
    try {
      const configs: Record<string, TemplateLayout> = {};
      const keys = Object.keys(localStorage);
      const templateKeys = keys.filter((key) =>
        key.startsWith(this.STORAGE_KEY_PREFIX)
      );

      templateKeys.forEach((key) => {
        const templateId = key.replace(this.STORAGE_KEY_PREFIX, "");
        const config = this.loadTemplateConfig(templateId);
        if (config) {
          configs[templateId] = config;
        }
      });

      return configs;
    } catch (error) {
      console.error("Failed to get all template configurations:", error);
      return {};
    }
  }

  /**
   * Check if template configuration exists
   */
  static hasTemplateConfig(templateId: string): boolean {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${templateId}`;
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(
        `Failed to check template config for ${templateId}:`,
        error
      );
      return false;
    }
  }

  /**
   * Get template configuration size in bytes
   */
  static getTemplateConfigSize(templateId: string): number {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${templateId}`;
      const serializedConfig = localStorage.getItem(key);
      return serializedConfig ? new Blob([serializedConfig]).size : 0;
    } catch (error) {
      console.error(
        `Failed to get template config size for ${templateId}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Export template configuration as JSON string
   */
  static exportTemplateConfig(templateId: string): string | null {
    try {
      const config = this.loadTemplateConfig(templateId);
      return config ? JSON.stringify(config, null, 2) : null;
    } catch (error) {
      console.error(
        `Failed to export template config for ${templateId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Import template configuration from JSON string
   */
  static importTemplateConfig(templateId: string, jsonString: string): boolean {
    try {
      const config = JSON.parse(jsonString) as TemplateLayout;
      this.saveTemplateConfig(templateId, config);
      return true;
    } catch (error) {
      console.error(
        `Failed to import template config for ${templateId}:`,
        error
      );
      return false;
    }
  }
}
