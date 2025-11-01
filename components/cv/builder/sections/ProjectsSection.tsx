"use client";

import { BookOpen } from "lucide-react";
import { Project } from "@/types/cv";
import GenericSection from "./GenericSection";
import RichTextEditor from "./RichTextEditor";

interface ProjectsSectionProps {
  projects: Project[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof Project,
    value: string | string[]
  ) => void;
}

export default function ProjectsSection({
  projects,
  onAdd,
  onRemove,
  onUpdate,
}: ProjectsSectionProps) {
  return (
    <GenericSection
      title="Projects"
      items={projects}
      emptyStateIcon={BookOpen}
      emptyStateTitle="No projects added yet"
      emptyStateDescription='Click "Add Project" to get started'
      addButtonText="Add Project"
      onAdd={onAdd}
      onRemove={onRemove}
    >
      {(project: Project) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => onUpdate(project.id, "name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Project name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <RichTextEditor
                value={project.description || ""}
                onChange={(value) => onUpdate(project.id, "description", value)}
                placeholder="Describe your project..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project URL (Optional)
              </label>
              <input
                type="url"
                value={project.url || ""}
                onChange={(e) => onUpdate(project.id, "url", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub URL (Optional)
              </label>
              <input
                type="url"
                value={project.githubUrl || ""}
                onChange={(e) =>
                  onUpdate(project.id, "githubUrl", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                value={project.technologies?.join(", ") || ""}
                onChange={(e) =>
                  onUpdate(
                    project.id,
                    "technologies",
                    e.target.value.split(", ").filter((t) => t.trim())
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="React, Node.js, MongoDB, etc."
              />
            </div>
          </div>
        </>
      )}
    </GenericSection>
  );
}
