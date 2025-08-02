"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/users";

interface UserEditFormProps {
  user: UserProfile;
  onUpdate: (data: {
    email?: string;
    fullName?: string;
    profileImageUrl?: string;
    isVerified?: boolean;
    isLocked?: boolean;
  }) => void;
  updating: boolean;
}

export default function UserEditForm({ user, onUpdate, updating }: UserEditFormProps) {
  const [formData, setFormData] = useState({
    email: user.email || "",
    fullName: user.fullName || "",
    profileImageUrl: user.profileImageUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter full name"
            disabled={updating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            disabled={updating}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="profileImageUrl">Profile Image URL</Label>
        <Input
          id="profileImageUrl"
          value={formData.profileImageUrl}
          onChange={(e) => handleInputChange("profileImageUrl", e.target.value)}
          placeholder="Enter profile image URL"
          disabled={updating}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
} 