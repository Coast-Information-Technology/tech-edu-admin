import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Users, GraduationCap } from "lucide-react";

interface Step7InviteStudentsProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleAddAdminTeamMember: () => void;
  handleRemoveAdminTeamMember: (idx: number) => void;
  handleAdminTeamMemberChange: (
    idx: number,
    field: string,
    value: string
  ) => void;
  handleAddStudentOrProfessional: () => void;
  handleRemoveStudentOrProfessional: (idx: number) => void;
  handleStudentOrProfessionalChange: (
    idx: number,
    field: string,
    value: string
  ) => void;
}

const teamRoles = [
  "Academic Coordinator",
  "Student Affairs Officer",
  "Career Counselor",
  "IT Administrator",
  "Department Head",
  "Faculty Member",
  "Other",
];

const studentTypes = ["student", "graduate", "alumni", "professional"];

export default function Step7InviteStudents({
  form,
  errors,
  handleChange,
  handleAddAdminTeamMember,
  handleRemoveAdminTeamMember,
  handleAdminTeamMemberChange,
  handleAddStudentOrProfessional,
  handleRemoveStudentOrProfessional,
  handleStudentOrProfessionalChange,
}: Step7InviteStudentsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Invite Team Members & Students
        </h3>
        <p className="text-sm text-gray-600">
          Add your team members and invite students to join the platform
        </p>
      </div>

      <div className="space-y-6">
        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Team Members</h4>
          </div>

          {form.adminTeamMembers.map((member: any, idx: number) => (
            <div
              key={idx}
              className="grid md:grid-cols-3 gap-4 p-4 border rounded-[10px]"
            >
              <div>
                <Label>Name</Label>
                <Input
                  value={member.name}
                  onChange={(e) =>
                    handleAdminTeamMemberChange(idx, "name", e.target.value)
                  }
                  placeholder="Full name"
                  className="rounded-[10px]"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={member.email}
                  onChange={(e) =>
                    handleAdminTeamMemberChange(idx, "email", e.target.value)
                  }
                  placeholder="Email address"
                  type="email"
                  className="rounded-[10px]"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Role</Label>
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      handleAdminTeamMemberChange(idx, "role", value)
                    }
                  >
                    <SelectTrigger className="rounded-[10px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[10px] bg-white">
                      {teamRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAdminTeamMember(idx)}
                  className="px-2 rounded-[5px]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddAdminTeamMember}
            className="w-full rounded-[5px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Students Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">
              Students & Professionals
            </h4>
          </div>

          {form.studentsOrProfessionals.map((person: any, idx: number) => (
            <div
              key={idx}
              className="grid md:grid-cols-3 gap-4 p-4 border rounded-[10px]"
            >
              <div>
                <Label>Name</Label>
                <Input
                  value={person.name}
                  onChange={(e) =>
                    handleStudentOrProfessionalChange(
                      idx,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Full name"
                  className="rounded-[10px]"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={person.email}
                  onChange={(e) =>
                    handleStudentOrProfessionalChange(
                      idx,
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Email address"
                  type="email"
                  className="rounded-[10px]"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Type</Label>
                  <Select
                    value={person.type}
                    onValueChange={(value) =>
                      handleStudentOrProfessionalChange(idx, "type", value)
                    }
                  >
                    <SelectTrigger className="rounded-[10px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[10px] bg-white">
                      {studentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveStudentOrProfessional(idx)}
                  className="px-2 rounded-[5px]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddStudentOrProfessional}
            className="w-full rounded-[5px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student/Professional
          </Button>
        </div>

        {/* Skip Option */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="skipAndInviteLater"
            name="skipAndInviteLater"
            checked={form.skipAndInviteLater}
            onCheckedChange={(checked) =>
              handleChange({
                target: {
                  name: "skipAndInviteLater",
                  type: "checkbox",
                  checked,
                },
              } as any)
            }
            className="mt-1 rounded-[2px]"
          />
          <div>
            <Label
              htmlFor="skipAndInviteLater"
              className="text-base font-medium cursor-pointer"
            >
              Skip for now and invite later
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              You can always add team members and invite students after
              completing onboarding
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-blue-900 mb-2">
          Benefits of adding team members:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Collaborative management of student profiles</li>
          <li>• Access to institutional analytics and reports</li>
          <li>• Streamlined communication and updates</li>
          <li>• Enhanced student support and guidance</li>
        </ul>
      </div>
    </div>
  );
}
