"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle } from "lucide-react";

interface CustomerCareProfileProps {
  profile: any;
}

export default function CustomerCareProfile({
  profile,
}: CustomerCareProfileProps) {
  if (!profile) {
    return (
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Customer Care Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-pink-50 rounded-lg border-2 border-dashed border-pink-300">
            <Users className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <h4 className="font-semibold text-pink-700 mb-2">
              Customer Care Profile Not Created
            </h4>
            <p className="text-sm text-pink-600 mb-4">
              This customer care representative hasn't completed their detailed
              profile setup yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Customer Care Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assigned Departments */}
        {profile.assignedDepartments &&
          profile.assignedDepartments.length > 0 && (
            <div>
              <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Assigned Departments
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.assignedDepartments.map(
                  (dept: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 text-xs"
                    >
                      {dept}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}

        {/* Status Information */}
        <div>
          <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Status Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Active Status</p>
              <Badge
                variant={profile.active ? "default" : "secondary"}
                className="capitalize"
              >
                {profile.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {profile.fullName && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Display Name
                </p>
                <p className="text-sm text-gray-900">{profile.fullName}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
