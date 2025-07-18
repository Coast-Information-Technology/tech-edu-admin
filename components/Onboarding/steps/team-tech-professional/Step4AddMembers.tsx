import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface Step4AddMembersProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const roles = [
  "developer",
  "designer",
  "project_manager",
  "qa_tester",
  "devops_engineer",
  "data_scientist",
  "ui_ux_designer",
  "frontend_developer",
  "backend_developer",
  "full_stack_developer",
  "mobile_developer",
  "other",
];

export function Step4AddMembers({
  form,
  errors,
  handleChange,
}: Step4AddMembersProps) {
  const [newMember, setNewMember] = useState({
    userId: "",
    fullName: "",
    email: "",
    role: "",
  });

  const addMember = () => {
    if (newMember.fullName && newMember.email && newMember.role) {
      const updatedMembers = [...(form.members || []), { ...newMember }];
      const event = {
        target: {
          name: "members",
          value: updatedMembers,
        },
      } as any;
      handleChange(event);
      setNewMember({ userId: "", fullName: "", email: "", role: "" });
    }
  };

  const removeMember = (index: number) => {
    const updatedMembers = form.members.filter(
      (_: any, i: number) => i !== index
    );
    const event = {
      target: {
        name: "members",
        value: updatedMembers,
      },
    } as any;
    handleChange(event);
  };

  const updateNewMember = (field: string, value: string) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Add Team Members</h4>
        <p className="text-sm text-blue-800">
          Add existing Tech Professionals from the platform to your team. You
          can search for members by their email address or user ID. Each member
          will receive an invitation to join your team.
        </p>
      </div>

      {/* Existing Members */}
      {form.members && form.members.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Current Team Members
          </h4>
          <div className="space-y-3">
            {form.members.map((member: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px]"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.fullName}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Member */}
      <div className="border border-gray-200 rounded-[10px] p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Add New Member
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="newMemberUserId"
              className="text-sm font-medium text-gray-700"
            >
              User ID (Optional)
            </Label>
            <Input
              id="newMemberUserId"
              type="text"
              value={newMember.userId}
              onChange={(e) => updateNewMember("userId", e.target.value)}
              className="mt-1 rounded-[10px]"
              placeholder="Enter user ID if known"
            />
          </div>

          <div>
            <Label
              htmlFor="newMemberFullName"
              className="text-sm font-medium text-gray-700"
            >
              Full Name *
            </Label>
            <Input
              id="newMemberFullName"
              type="text"
              value={newMember.fullName}
              onChange={(e) => updateNewMember("fullName", e.target.value)}
              className="mt-1 rounded-[10px]"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <Label
              htmlFor="newMemberEmail"
              className="text-sm font-medium text-gray-700"
            >
              Email *
            </Label>
            <Input
              id="newMemberEmail"
              type="email"
              value={newMember.email}
              onChange={(e) => updateNewMember("email", e.target.value)}
              className="mt-1 rounded-[10px]"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label
              htmlFor="newMemberRole"
              className="text-sm font-medium text-gray-700"
            >
              Role *
            </Label>
            <Select
              value={newMember.role}
              onValueChange={(value) => updateNewMember("role", value)}
            >
              <SelectTrigger className="mt-1 rounded-[10px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] bg-white">
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            onClick={addMember}
            disabled={
              !newMember.fullName || !newMember.email || !newMember.role
            }
            className="flex items-center space-x-2 rounded-[10px] text-white hover:text-black"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {errors.members && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
          <p className="text-red-600 text-sm">{errors.members}</p>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Important Note</h4>
        <p className="text-sm text-yellow-800">
          Team members must be existing Tech Professionals on the platform. They
          will receive an invitation to join your team and can accept or decline
          the invitation.
        </p>
      </div>
    </div>
  );
}
