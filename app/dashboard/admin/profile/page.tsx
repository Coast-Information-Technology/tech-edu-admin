"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Shield,
  Bell,
  Globe,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const adminProfile = {
  name: "Admin User",
  email: "admin@techedu.com",
  phone: "+234 801 234 5678",
  role: "System Administrator",
  avatar: "/assets/placeholder-avatar.jpg",
  location: "Lagos, Nigeria",
  timezone: "Africa/Lagos",
  bio: "Experienced system administrator with 8+ years in educational technology management. Passionate about creating seamless learning experiences and maintaining robust system infrastructure.",
  permissions: [
    "User Management",
    "Course Management",
    "Job Management",
    "Financial Management",
    "System Settings",
    "Security Administration",
    "Analytics & Reporting",
    "Support Management",
  ],
  lastLogin: "2024-01-15 14:30:00",
  accountCreated: "2020-03-15",
  securityLevel: "High",
  twoFactorEnabled: true,
  loginHistory: [
    {
      date: "2024-01-15 14:30:00",
      ip: "192.168.1.100",
      location: "Lagos, Nigeria",
    },
    {
      date: "2024-01-14 09:15:00",
      ip: "192.168.1.100",
      location: "Lagos, Nigeria",
    },
    {
      date: "2024-01-13 16:45:00",
      ip: "192.168.1.100",
      location: "Lagos, Nigeria",
    },
  ],
};

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Admin Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <Eye className="w-4 h-4 mr-2" />
            View Public Profile
          </Button>
          <Button
            className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#011F72]">
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage
                        src={adminProfile.avatar}
                        alt={adminProfile.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {adminProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[#011F72]">
                      {adminProfile.name}
                    </h3>
                    <p className="text-gray-600">{adminProfile.role}</p>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#011F72]">
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Member since</p>
                      <p className="font-medium">
                        {adminProfile.accountCreated}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Last login</p>
                      <p className="font-medium">{adminProfile.lastLogin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Security level</p>
                      <Badge className="bg-blue-100 text-blue-800">
                        {adminProfile.securityLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#011F72]">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue="Admin"
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue="User"
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={adminProfile.email}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      defaultValue={adminProfile.phone}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      defaultValue={adminProfile.location}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      defaultValue={adminProfile.bio}
                      disabled={!isEditing}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#011F72]">
                    System Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {adminProfile.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Change */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-1"
                  />
                </div>
                <Button className="w-full bg-[#011F72] hover:bg-blue-700 text-white">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2FA Status</p>
                    <p className="text-sm text-gray-600">
                      {adminProfile.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <Badge
                    className={
                      adminProfile.twoFactorEnabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {adminProfile.twoFactorEnabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full">
                  {adminProfile.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </CardContent>
            </Card>

            {/* Login History */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Recent Login History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminProfile.loginHistory.map((login, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-[10px]">
                          <Key className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{login.date}</p>
                          <p className="text-sm text-gray-600">
                            IP: {login.ip} • {login.location}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Successful
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications about system issues and updates
                    </p>
                  </div>
                  <Select defaultValue="email">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User Management</p>
                    <p className="text-sm text-gray-600">
                      Notifications about new user registrations and account
                      changes
                    </p>
                  </div>
                  <Select defaultValue="email">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Financial Reports</p>
                    <p className="text-sm text-gray-600">
                      Daily and weekly financial summaries
                    </p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-gray-600">
                      Critical security notifications and login attempts
                    </p>
                  </div>
                  <Select defaultValue="immediate">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Preferences */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  General Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue={adminProfile.timezone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">
                        Africa/Lagos (GMT+1)
                      </SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (GMT-5)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT+0)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="NGN">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Display Preferences */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="itemsPerPage">Items per Page</Label>
                  <Select defaultValue="20">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="DD/MM/YYYY">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
