"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Award,
  Languages,
  FileText,
} from "lucide-react";

export default function AddTalentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    location: "",
    roleInterest: "",
    availability: "",
    experience: "",
    salary: "",
    about: "",

    // Education
    degree: "",
    university: "",
    graduationYear: "",
    gpa: "",

    // Skills & Certifications
    skills: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],

    // Work Experience
    workExperience: [] as Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>,

    // Projects
    projects: [] as Array<{
      title: string;
      description: string;
      tools: string[];
    }>,

    // Status
    coachVerified: false,
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newProjectTool, setNewProjectTool] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certifications.includes(newCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          title: "",
          company: "",
          duration: "",
          description: "",
        },
      ],
    }));
  };

  const updateWorkExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
          tools: [],
        },
      ],
    }));
  };

  const updateProject = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const addProjectTool = (projectIndex: number) => {
    if (newProjectTool.trim()) {
      const currentProject = formData.projects[projectIndex];
      if (!currentProject.tools.includes(newProjectTool.trim())) {
        updateProject(projectIndex, "tools", [
          ...currentProject.tools,
          newProjectTool.trim(),
        ]);
        setNewProjectTool("");
      }
    }
  };

  const removeProjectTool = (projectIndex: number, tool: string) => {
    const currentProject = formData.projects[projectIndex];
    updateProject(
      projectIndex,
      "tools",
      currentProject.tools.filter((t) => t !== tool)
    );
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log("Talent data:", formData);
    // For now, just redirect back to the talent management page
    router.push("/dashboard/talent-management");
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-10 px-4">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 mb-8">
        <Link href="/dashboard/talent-management">
          <Button variant="outline" size="sm" className="rounded-[10px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Talents
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#011F72]">Add New Talent</h1>
          <p className="text-gray-600 mt-2">
            Create a new talent profile for your institution
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  className="rounded-[10px]"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  className="rounded-[10px]"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  className="rounded-[10px]"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  className="rounded-[10px]"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) =>
                    handleInputChange("linkedin", e.target.value)
                  }
                  placeholder="LinkedIn profile URL"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  className="rounded-[10px]"
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="City, Country"
                  required
                />
              </div>
              <div>
                <Label htmlFor="roleInterest">Role Interest *</Label>
                <Input
                  className="rounded-[10px]"
                  id="roleInterest"
                  value={formData.roleInterest}
                  onChange={(e) =>
                    handleInputChange("roleInterest", e.target.value)
                  }
                  placeholder="e.g., Data Analyst, Software Engineer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) =>
                    handleInputChange("availability", value)
                  }
                >
                  <SelectTrigger className="rounded-[10px]">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px] bg-white">
                    <SelectItem value="Immediate">Immediate</SelectItem>
                    <SelectItem value="2 weeks notice">
                      2 weeks notice
                    </SelectItem>
                    <SelectItem value="1 month notice">
                      1 month notice
                    </SelectItem>
                    <SelectItem value="3 months notice">
                      3 months notice
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  className="rounded-[10px]"
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  placeholder="e.g., 2 years"
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  className="rounded-[10px]"
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="about">About</Label>
              <Textarea
                className="rounded-[10px]"
                id="about"
                value={formData.about}
                onChange={(e) => handleInputChange("about", e.target.value)}
                placeholder="Tell us about the talent's background, interests, and career goals..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  className="rounded-[10px]"
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  placeholder="e.g., BSc Computer Science"
                  required
                />
              </div>
              <div>
                <Label htmlFor="university">University *</Label>
                <Input
                  className="rounded-[10px]"
                  id="university"
                  value={formData.university}
                  onChange={(e) =>
                    handleInputChange("university", e.target.value)
                  }
                  placeholder="University name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  className="rounded-[10px]"
                  id="graduationYear"
                  value={formData.graduationYear}
                  onChange={(e) =>
                    handleInputChange("graduationYear", e.target.value)
                  }
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  className="rounded-[10px]"
                  id="gpa"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange("gpa", e.target.value)}
                  placeholder="e.g., 3.8/4.0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                className="rounded-[10px]"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
              />
              <Button
                type="button"
                className="rounded-[10px]"
                onClick={addSkill}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                className="rounded-[10px]"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add a certification"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCertification())
                }
              />
              <Button
                type="button"
                className="rounded-[10px]"
                onClick={addCertification}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {cert}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeCertification(cert)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                className="rounded-[10px]"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add a language"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addLanguage())
                }
              />
              <Button
                type="button"
                className="rounded-[10px]"
                onClick={addLanguage}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {lang}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeLanguage(lang)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              className="rounded-[10px]"
              onClick={addWorkExperience}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Work Experience
            </Button>
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="border rounded-[10px] p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Experience {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeWorkExperience(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      className="rounded-[10px]"
                      value={exp.title}
                      onChange={(e) =>
                        updateWorkExperience(index, "title", e.target.value)
                      }
                      placeholder="e.g., Data Analyst"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      className="rounded-[10px]"
                      value={exp.company}
                      onChange={(e) =>
                        updateWorkExperience(index, "company", e.target.value)
                      }
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      className="rounded-[10px]"
                      value={exp.duration}
                      onChange={(e) =>
                        updateWorkExperience(index, "duration", e.target.value)
                      }
                      placeholder="e.g., 2022 - Present"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateWorkExperience(index, "description", e.target.value)
                    }
                    placeholder="Describe the role and achievements..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              className="rounded-[10px]"
              onClick={addProject}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
            {formData.projects.map((project, index) => (
              <div key={index} className="border rounded-[10px] p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Project {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label>Project Title</Label>
                  <Input
                    className="rounded-[10px]"
                    value={project.title}
                    onChange={(e) =>
                      updateProject(index, "title", e.target.value)
                    }
                    placeholder="Project name"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    placeholder="Describe the project..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Tools & Technologies</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      className="rounded-[10px]"
                      value={newProjectTool}
                      onChange={(e) => setNewProjectTool(e.target.value)}
                      placeholder="Add a tool"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addProjectTool(index))
                      }
                    />
                    <Button
                      type="button"
                      onClick={() => addProjectTool(index)}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool, toolIndex) => (
                      <Badge
                        key={toolIndex}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {tool}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeProjectTool(index, tool)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coachVerified"
                checked={formData.coachVerified}
                onCheckedChange={(checked) =>
                  handleInputChange("coachVerified", checked as boolean)
                }
              />
              <Label htmlFor="coachVerified">Coach Verified</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/talent-management">
            <Button className="rounded-[10px]" variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="text-white hover:text-black rounded-[10px]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Talent
          </Button>
        </div>
      </form>
    </div>
  );
}
