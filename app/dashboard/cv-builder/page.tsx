"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  User2,
  Calendar,
  MapPin,
  BookOpen,
  Briefcase,
  Link as LinkIcon,
  X,
  Plus,
  Save,
  Edit2,
  Eye,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CVTemplateClassic } from "@/components/cv-templates/CVTemplateClassic";
import { CVTemplateProfessional } from "@/components/cv-templates/CVTemplateProfessional";
import { CVData } from "@/types/cv";

const initialCVBuilder: CVData = {
  fullName: "Jane Doe",
  gender: "Female",
  dateOfBirth: "1995-06-15",
  nationality: "Nigerian",
  phone: "+234 801 234 5678",
  email: "jane.doe@example.com",
  bio: "Passionate software engineer with a love for building impactful products. Always learning, always growing.",
  cvbuilderImageUrl: "/assets/placeholder-avatar.jpg",
  skills: ["React", "Node.js", "TypeScript", "UI/UX", "MongoDB"],
  experience: [
    {
      title: "Frontend Developer",
      company: "TechEdu Solutions",
      duration: "2022 - Present",
      description:
        "Building and maintaining the TechEdu dashboard and learning platform. Led the UI redesign project.",
    },
    {
      title: "Intern Developer",
      company: "InnovateX",
      duration: "2021 - 2022",
      description: "Worked on internal tools and automation scripts.",
    },
  ],
  education: [
    {
      school: "University of Lagos",
      degree: "B.Sc.",
      field: "Computer Science",
      year: "2017 - 2021",
    },
  ],
  links: {
    linkedIn: "https://linkedin.com/in/janedoe",
    github: "https://github.com/janedoe",
    portfolio: "https://janedoe.dev",
  },
};

// Add this style block at the top-level of your component (or in your global CSS)
const a4Styles = `
.cv-a4-page {
  width: 794px;
  min-height: 1123px;
  max-width: 100%;
  margin: 0 auto 32px auto;
  background: white;
  box-shadow: 0 0 8px rgba(0,0,0,0.08);
  padding: 48px 40px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
@media print {
  .cv-a4-page {
    page-break-after: always;
    box-shadow: none;
    margin-bottom: 0;
  }
}
`;

export default function CVBuilderPage() {
  const searchParams = useSearchParams();
  const templateFromUrl = searchParams.get("template");

  const [cvbuilder, setCVBuilder] = useState<CVData>(initialCVBuilder);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<CVData>(cvbuilder);
  const [selectedTemplate, setSelectedTemplate] = useState(
    templateFromUrl || "classic"
  );
  const [previewScale, setPreviewScale] = useState(1);
  const [cvImageObjectUrl, setCvImageObjectUrl] = useState<string | null>(null);
  const [compactPreview, setCompactPreview] = useState(true);

  // Handlers
  const handleEdit = () => {
    setDraft(cvbuilder);
    setEditMode(true);
  };
  const handleCancel = () => {
    setEditMode(false);
    // Revoke any created object URLs to free memory
    if (cvImageObjectUrl) {
      URL.revokeObjectURL(cvImageObjectUrl);
      setCvImageObjectUrl(null);
    }
  };
  const handleSave = () => {
    setCVBuilder(draft);
    setEditMode(false);
  };
  const handleChange = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };
  // For nested fields
  const handleLinkChange = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, links: { ...prev.links, [field]: value } }));
  };
  // Skills
  const handleSkillChange = (idx: number, value: string) => {
    const newSkills = [...(draft.skills || [])];
    newSkills[idx] = value;
    setDraft((prev) => ({ ...prev, skills: newSkills }));
  };
  const handleAddSkill = () => {
    setDraft((prev) => ({ ...prev, skills: [...(prev.skills || []), ""] }));
  };
  const handleRemoveSkill = (idx: number) => {
    const newSkills = (draft.skills || []).filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, skills: newSkills }));
  };
  // Experience
  const handleExpChange = (
    idx: number,
    field: "title" | "company" | "duration" | "description",
    value: string
  ) => {
    const newExp = [...(draft.experience || [])];
    newExp[idx][field] = value;
    setDraft((prev) => ({ ...prev, experience: newExp }));
  };
  const handleAddExp = () => {
    setDraft((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { title: "", company: "", duration: "", description: "" },
      ],
    }));
  };
  const handleRemoveExp = (idx: number) => {
    const newExp = (draft.experience || []).filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, experience: newExp }));
  };
  // Education
  const handleEduChange = (
    idx: number,
    field: "school" | "degree" | "field" | "year",
    value: string
  ) => {
    const newEdu = [...(draft.education || [])];
    newEdu[idx][field] = value;
    setDraft((prev) => ({ ...prev, education: newEdu }));
  };
  const handleAddEdu = () => {
    setDraft((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { school: "", degree: "", field: "", year: "" },
      ],
    }));
  };
  const handleRemoveEdu = (idx: number) => {
    const newEdu = (draft.education || []).filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, education: newEdu }));
  };

  // Reordering helpers
  const moveItem = <T,>(arr: T[], from: number, to: number): T[] => {
    const copy = [...arr];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  };
  const handleMoveExp = (idx: number, direction: "up" | "down") => {
    const list = draft.experience || [];
    const targetIndex = direction === "up" ? idx - 1 : idx + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    setDraft((prev) => ({
      ...prev,
      experience: moveItem(list, idx, targetIndex),
    }));
  };
  const handleMoveEdu = (idx: number, direction: "up" | "down") => {
    const list = draft.education || [];
    const targetIndex = direction === "up" ? idx - 1 : idx + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    setDraft((prev) => ({
      ...prev,
      education: moveItem(list, idx, targetIndex),
    }));
  };

  const handlePrint = () => {
    const previous = previewScale;
    setPreviewScale(1);
    const restore = () => {
      setPreviewScale(previous);
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    setTimeout(() => window.print(), 0);
  };

  // Helper to check if all fields are empty
  const isDraftEmpty =
    !draft.fullName &&
    !draft.bio &&
    !draft.cvbuilderImageUrl &&
    !draft.email &&
    !draft.phone &&
    !draft.gender &&
    !draft.dateOfBirth &&
    !draft.nationality &&
    (!draft.skills || (draft.skills || []).every((s) => !s)) &&
    (!draft.experience ||
      (draft.experience || []).every(
        (e) => !e.title && !e.company && !e.duration && !e.description
      )) &&
    (!draft.education ||
      (draft.education || []).every(
        (e) => !e.degree && !e.field && !e.school && !e.year
      )) &&
    (!draft.links ||
      (!draft.links?.linkedIn &&
        !draft.links?.github &&
        !draft.links?.portfolio));

  return (
    <div className="p-6 space-y-6">
      <style>{a4Styles}</style>
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cv-editor, .cv-toolbar, .cv-header { display: none !important; }
          .cv-preview-only { display: block !important; }
          .cv-preview-only .cv-a4-page {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            background: white !important;
          }
          /* Hide everything except the explicit print area */
          body * { visibility: hidden !important; }
          .cv-print-area, .cv-print-area * { visibility: visible !important; }
          .cv-print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
        @page { size: A4; margin: 10mm; }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between cv-header">
        <div>
          <h1 className="text-3xl font-bold">CV Builder</h1>
          <p className="text-gray-600 mt-2">
            Create and customize your professional CV
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleEdit}
            variant="outline"
            className="rounded-[10px] border-gray-500"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit CV
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[10px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={() => {
              setDraft(initialCVBuilder);
              setCVBuilder(initialCVBuilder);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Main Content - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - CV Editor with Accordion */}
        <Accordion
          type="multiple"
          defaultValue={["personal-info"]}
          className="space-y-4 cv-editor"
        >
          {/* Personal Information */}
          <AccordionItem
            value="personal-info"
            className="bg-blue-50 rounded-[10px] shadow-sm p-0 border-none"
          >
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-primary">
              Personal Information
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div>
                <Label htmlFor="cvbuilderImageUrl">Display Photo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="cvbuilderImageUrl"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (cvImageObjectUrl) {
                        URL.revokeObjectURL(cvImageObjectUrl);
                      }
                      const objectUrl = URL.createObjectURL(file);
                      setCvImageObjectUrl(objectUrl);
                      setDraft((prev) => ({
                        ...prev,
                        cvbuilderImageUrl: objectUrl,
                      }));
                    }}
                    className="rounded-[10px] border-gray-500"
                    disabled={!editMode}
                    type="file"
                    accept="image/*"
                  />
                  {draft.cvbuilderImageUrl && (
                    <Avatar>
                      <AvatarImage src={draft.cvbuilderImageUrl} />
                      <AvatarFallback>CV</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG or JPG, up to 2MB
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={draft.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="rounded-[10px] border-gray-500"
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="rounded-[10px] border-gray-500"
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={draft.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="rounded-[10px] border-gray-500"
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={draft.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="rounded-[10px] border-gray-500"
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={draft.dateOfBirth}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                    className="rounded-[10px] border-gray-500"
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={draft.nationality}
                    onChange={(e) =>
                      handleChange("nationality", e.target.value)
                    }
                    className="rounded-[10px] border-gray-500"
                    disabled={!editMode}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={draft.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-[10px] resize-none bg-blue-50"
                  rows={3}
                  maxLength={500}
                  disabled={!editMode}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {draft.bio?.length || 0}/500
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Skills */}
          <AccordionItem
            value="skills"
            className="bg-blue-50 rounded-[10px] shadow-sm p-0 border-none"
          >
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-primary">
              Skills
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="space-y-3">
                {(draft.skills || []).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(idx, e.target.value)}
                      className="rounded-[10px] border-gray-500"
                      placeholder="Enter skill"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddSkill}
                  className="w-full rounded-[10px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Experience */}
          <AccordionItem
            value="experience"
            className="bg-blue-50 rounded-[10px] shadow-sm p-0 border-none"
          >
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-primary">
              Experience
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <>
                {(draft.experience || []).map((exp, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-[10px] p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) =>
                            handleExpChange(idx, "title", e.target.value)
                          }
                          className="rounded-[10px] border-gray-500"
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={exp.duration}
                          onChange={(e) =>
                            handleExpChange(idx, "duration", e.target.value)
                          }
                          className="rounded-[10px] border-gray-500"
                          placeholder="2020 - Present"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          handleExpChange(idx, "company", e.target.value)
                        }
                        className="rounded-[10px] border-gray-500"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <textarea
                        value={exp.description}
                        onChange={(e) =>
                          handleExpChange(idx, "description", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-[10px] resize-none"
                        rows={3}
                        placeholder="Job description"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveExp(idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveExp(idx, "up")}
                      >
                        Move Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveExp(idx, "down")}
                      >
                        Move Down
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddExp}
                  className="w-full rounded-[10px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </>
            </AccordionContent>
          </AccordionItem>

          {/* Education */}
          <AccordionItem
            value="education"
            className="bg-blue-50 rounded-[10px] shadow-sm p-0 border-none"
          >
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-primary">
              Education
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <>
                {(draft.education || []).map((edu, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-[10px] p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            handleEduChange(idx, "degree", e.target.value)
                          }
                          className="rounded-[10px] border-gray-500"
                          placeholder="B.Sc."
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          value={edu.year}
                          onChange={(e) =>
                            handleEduChange(idx, "year", e.target.value)
                          }
                          className="rounded-[10px] border-gray-500"
                          placeholder="2017 - 2021"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) =>
                          handleEduChange(idx, "field", e.target.value)
                        }
                        className="rounded-[10px] border-gray-500"
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label>School</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) =>
                          handleEduChange(idx, "school", e.target.value)
                        }
                        className="rounded-[10px] border-gray-500"
                        placeholder="University Name"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEdu(idx)}
                        className="text-red-600 hover:text-red-700 rounded-[5px]"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveEdu(idx, "up")}
                      >
                        Move Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveEdu(idx, "down")}
                      >
                        Move Down
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddEdu}
                  className="w-full rounded-[10px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </>
            </AccordionContent>
          </AccordionItem>

          {/* Links */}
          <AccordionItem
            value="links"
            className="bg-blue-50 rounded-[10px] shadow-sm p-0 border-none"
          >
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-primary">
              Links
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={draft.links?.linkedIn || ""}
                  onChange={(e) => handleLinkChange("linkedIn", e.target.value)}
                  className="rounded-[10px] border-gray-500"
                  placeholder="https://linkedin.com/in/username"
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={draft.links?.github || ""}
                  onChange={(e) => handleLinkChange("github", e.target.value)}
                  className="rounded-[10px] border-gray-500"
                  placeholder="https://github.com/username"
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input
                  id="portfolio"
                  value={draft.links?.portfolio || ""}
                  onChange={(e) =>
                    handleLinkChange("portfolio", e.target.value)
                  }
                  className="rounded-[10px] border-gray-500"
                  placeholder="https://your-portfolio.com"
                  disabled={!editMode}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sticky Save/Cancel bar */}
          {editMode && (
            <div className="sticky bottom-0 z-10 bg-white border-t border-blue-100 flex gap-3 px-6 py-4 rounded-b-[10px] shadow-md mt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 rounded-[10px]"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </Accordion>

        {/* Right Side - CV Preview */}
        <div className="lg:sticky lg:top-6 overflow-x-auto cv-preview-only">
          {/* Preview Toolbar */}
          <div className="cv-toolbar mb-4 flex items-center gap-3 justify-between bg-white/70 backdrop-blur-sm border border-blue-100 rounded-[12px] p-3">
            <div className="flex gap-2">
              <Button
                variant={selectedTemplate === "classic" ? "default" : "outline"}
                onClick={() => setSelectedTemplate("classic")}
              >
                Classic
              </Button>
              <Button
                variant={
                  selectedTemplate === "professional" ? "default" : "outline"
                }
                onClick={() => setSelectedTemplate("professional")}
              >
                Professional
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Zoom</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreviewScale((s) => Math.max(0.8, +(s - 0.05).toFixed(2)))
                }
              >
                -
              </Button>
              <input
                type="range"
                min={0.8}
                max={1.4}
                step={0.05}
                value={previewScale}
                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                className="w-32"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreviewScale((s) => Math.min(1.4, +(s + 0.05).toFixed(2)))
                }
              >
                +
              </Button>
              <div className="mx-2 h-5 w-px bg-slate-200" />
              <Button
                variant={compactPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setCompactPreview((v) => !v)}
                title="Toggle compact preview"
              >
                {compactPreview ? "Compact" : "Full"}
              </Button>
            </div>
          </div>
          <div
            className={
              compactPreview
                ? "max-h-[75vh] overflow-auto rounded-xl border border-slate-200 bg-white/60 p-2"
                : ""
            }
          >
            <div
              className="flex justify-center cv-print-area"
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: "top center",
              }}
            >
              {isDraftEmpty ? (
                <div className="cv-a4-page flex items-center justify-center text-gray-400 text-xl">
                  Start building your CV!
                </div>
              ) : (
                <>
                  {selectedTemplate === "classic" && (
                    <CVTemplateClassic data={draft} />
                  )}
                  {selectedTemplate === "professional" && (
                    <CVTemplateProfessional data={draft} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
