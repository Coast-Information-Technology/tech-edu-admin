"use client";

import React, { useState } from "react";
import { ResumeSection } from "@/types/cv/index";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface SectionArrangementProps {
  sections: ResumeSection[];
  onReorder: (sections: ResumeSection[]) => void;
  leftColumnSections: string[];
  onLeftColumnChange: (sections: string[]) => void;
}

export function SectionArrangement({
  sections,
  onReorder,
  leftColumnSections,
  onLeftColumnChange,
}: SectionArrangementProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const toggleLeftColumn = (sectionType: string) => {
    const newLeftColumn = leftColumnSections.includes(sectionType)
      ? leftColumnSections.filter((type) => type !== sectionType)
      : [...leftColumnSections, sectionType];

    onLeftColumnChange(newLeftColumn);
  };

  const getSectionDisplayName = (type: string) => {
    const names: { [key: string]: string } = {
      "professional-summary": "Professional Summary",
      "work-experience": "Work Experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      projects: "Projects",
      certifications: "Certifications",
      awards: "Awards",
      interests: "Interests",
      courses: "Courses",
      organizations: "Organizations",
      publications: "Publications",
      references: "References",
      declarations: "Declarations",
      custom: "Custom Section",
    };
    return (
      names[type] ||
      type?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      type ||
      "Unknown Section"
    );
  };

  return (
    <div className="bg-white border rounded-[10px] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Section Arrangement</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          {isOpen ? "Hide" : "Arrange Sections"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Drag to reorder sections:
            </h4>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {sections.map((section, index) => (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-[10px] bg-white shadow-sm ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="text-gray-400">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                  </svg>
                                </div>
                                <span className="font-medium">
                                  {getSectionDisplayName(section.type)}
                                </span>
                              </div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={leftColumnSections.includes(
                                    section.type
                                  )}
                                  onChange={() =>
                                    toggleLeftColumn(section.type)
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">
                                  Left Column
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="bg-gray-50 p-3 rounded-[10px]">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Column Distribution:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-600 mb-1">
                  Left Column (35%)
                </div>
                <div className="space-y-1">
                  {leftColumnSections.map((type) => (
                    <div key={type} className="text-gray-600">
                      • {getSectionDisplayName(type)}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium text-green-600 mb-1">
                  Right Column (65%)
                </div>
                <div className="space-y-1">
                  {sections
                    .filter(
                      (section) => !leftColumnSections.includes(section.type)
                    )
                    .map((section) => (
                      <div key={section.id} className="text-gray-600">
                        • {getSectionDisplayName(section.type)}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
