import { useState, useCallback, useMemo } from "react";
import { ValidationSchema, ValidationResult } from "@/types/cv/cv-builder";

interface UseValidationProps {
  schema: ValidationSchema;
  initialData?: Record<string, any>;
}

interface UseValidationReturn {
  validate: (data: Record<string, any>) => ValidationResult;
  validateField: (field: string, value: any) => string | null;
  errors: Record<string, string>;
  isValid: boolean;
  clearErrors: () => void;
  setErrors: (errors: Record<string, string>) => void;
}

export function useValidation({
  schema,
  initialData = {},
}: UseValidationProps): UseValidationReturn {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate a single field
  const validateField = useCallback(
    (field: string, value: any): string | null => {
      const rule = schema[field];
      if (!rule) return null;

      // Required validation
      if (
        rule.required &&
        (!value || value === "" || (Array.isArray(value) && value.length === 0))
      ) {
        return `${field} is required`;
      }

      // Skip other validations if value is empty and not required
      if (!value || value === "") return null;

      // Min length validation
      if (
        rule.minLength &&
        typeof value === "string" &&
        value.length < rule.minLength
      ) {
        return `${field} must be at least ${rule.minLength} characters`;
      }

      // Max length validation
      if (
        rule.maxLength &&
        typeof value === "string" &&
        value.length > rule.maxLength
      ) {
        return `${field} must be no more than ${rule.maxLength} characters`;
      }

      // Pattern validation
      if (
        rule.pattern &&
        typeof value === "string" &&
        !rule.pattern.test(value)
      ) {
        return `${field} format is invalid`;
      }

      // Custom validation
      if (rule.custom) {
        return rule.custom(value);
      }

      return null;
    },
    [schema]
  );

  // Validate all fields
  const validate = useCallback(
    (data: Record<string, any>): ValidationResult => {
      const newErrors: Record<string, string> = {};

      Object.keys(schema).forEach((field) => {
        const error = validateField(field, data[field]);
        if (error) {
          newErrors[field] = error;
        }
      });

      setErrors(newErrors);
      return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors,
      };
    },
    [schema, validateField]
  );

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    validate,
    validateField,
    errors,
    isValid,
    clearErrors,
    setErrors,
  };
}

// Predefined validation schemas for CV sections
export const CVValidationSchemas = {
  personalInfo: {
    firstName: { required: true, minLength: 1, maxLength: 50 },
    lastName: { required: true, minLength: 1, maxLength: 50 },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (!value.includes("@")) return "Email must contain @ symbol";
        return null;
      },
    },
    phone: {
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      custom: (value: string) => {
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
          return "Phone number format is invalid";
        }
        return null;
      },
    },
    targetedJobTitle: { maxLength: 100 },
    summary: { maxLength: 500 },
  } as ValidationSchema,

  experience: {
    company: { required: true, minLength: 1, maxLength: 100 },
    position: { required: true, minLength: 1, maxLength: 100 },
    location: { maxLength: 100 },
    startDate: { required: true },
    description: { maxLength: 1000 },
  } as ValidationSchema,

  education: {
    institution: { required: true, minLength: 1, maxLength: 100 },
    degree: { required: true, minLength: 1, maxLength: 100 },
    field: { maxLength: 100 },
    location: { maxLength: 100 },
    startDate: { required: true },
    gpa: {
      custom: (value: string) => {
        if (value && !/^[0-4]\.?\d*$/.test(value)) {
          return "GPA must be a valid number between 0 and 4";
        }
        return null;
      },
    },
  } as ValidationSchema,

  skill: {
    name: { required: true, minLength: 1, maxLength: 50 },
    level: { required: true },
  } as ValidationSchema,

  language: {
    name: { required: true, minLength: 1, maxLength: 50 },
    level: { required: true },
  } as ValidationSchema,

  certification: {
    name: { required: true, minLength: 1, maxLength: 100 },
    issuer: { required: true, minLength: 1, maxLength: 100 },
    date: { required: true },
    credentialId: { maxLength: 100 },
    credentialUrl: {
      custom: (value: string) => {
        if (value && !/^https?:\/\/.+/.test(value)) {
          return "URL must start with http:// or https://";
        }
        return null;
      },
    },
  } as ValidationSchema,

  project: {
    name: { required: true, minLength: 1, maxLength: 100 },
    description: { maxLength: 1000 },
    url: {
      custom: (value: string) => {
        if (value && !/^https?:\/\/.+/.test(value)) {
          return "URL must start with http:// or https://";
        }
        return null;
      },
    },
    githubUrl: {
      custom: (value: string) => {
        if (value && !/^https?:\/\/.+/.test(value)) {
          return "URL must start with http:// or https://";
        }
        return null;
      },
    },
  } as ValidationSchema,
};
