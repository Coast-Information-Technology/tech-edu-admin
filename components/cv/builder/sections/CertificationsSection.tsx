"use client";

import { FileCheck } from "lucide-react";
import { Certification } from "@/types/cv";
import GenericSection from "./GenericSection";

interface CertificationsSectionProps {
  certifications: Certification[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Certification, value: string) => void;
}

export default function CertificationsSection({
  certifications,
  onAdd,
  onRemove,
  onUpdate,
}: CertificationsSectionProps) {
  return (
    <GenericSection
      title="/* Certifications */"
      items={certifications}
      emptyStateIcon={FileCheck}
      emptyStateTitle="No certifications added yet"
      emptyStateDescription='Click "Add Certification" to get started'
      addButtonText="Add Certification"
      onAdd={onAdd}
      onRemove={onRemove}
    >
      {(cert: Certification) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Certification Name
            </label>
            <input
              type="text"
              value={cert.name}
              onChange={(e) => onUpdate(cert.id, "name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Certification name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issuing Organization
            </label>
            <input
              type="text"
              value={cert.issuer}
              onChange={(e) => onUpdate(cert.id, "issuer", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Issuing organization"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issue Date
            </label>
            <input
              type="month"
              value={cert.date}
              onChange={(e) => onUpdate(cert.id, "date", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Credential ID (Optional)
            </label>
            <input
              type="text"
              value={cert.credentialId || ""}
              onChange={(e) =>
                onUpdate(cert.id, "credentialId", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Credential ID"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Credential URL (Optional)
            </label>
            <input
              type="url"
              value={cert.credentialUrl || ""}
              onChange={(e) =>
                onUpdate(cert.id, "credentialUrl", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://..."
            />
          </div>
        </div>
      )}
    </GenericSection>
  );
}
