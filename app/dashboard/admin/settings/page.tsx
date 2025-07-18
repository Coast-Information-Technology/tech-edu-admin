"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Shield,
  Globe,
  Database,
  Mail,
  Bell,
  Users,
  FileText,
  Palette,
  Server,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import { changePassword, postApiRequest } from "@/lib/apiFetch";
import ThemeToggle from "@/utils/ThemeToggle";
import { MdBackup } from "react-icons/md";

const systemSettings = {
  siteName: "TechEdu Solution",
  siteDescription: "Leading educational technology platform",
  siteUrl: "https://techedu.com",
  contactEmail: "admin@techedu.com",
  supportEmail: "support@techedu.com",
  defaultLanguage: "en",
  defaultCurrency: "NGN",
  timezone: "Africa/Lagos",
  maintenanceMode: false,
  registrationEnabled: true,
  emailVerification: true,
  twoFactorRequired: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  backupFrequency: "daily",
  lastBackup: "2024-01-15 02:00:00",
  systemVersion: "v2.1.0",
  databaseSize: "2.4 GB",
  activeUsers: 1247,
  serverStatus: "Healthy",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Site Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure system settings and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <MdBackup className="w-4 h-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Site Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    defaultValue={systemSettings.siteName}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    defaultValue={systemSettings.siteDescription}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    defaultValue={systemSettings.siteUrl}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    defaultValue={systemSettings.contactEmail}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    defaultValue={systemSettings.supportEmail}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select defaultValue={systemSettings.defaultLanguage}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select defaultValue={systemSettings.defaultCurrency}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue={systemSettings.timezone}>
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
                      <SelectItem value="Asia/Tokyo">
                        Asia/Tokyo (GMT+9)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Feature Toggles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-gray-600">
                          Temporarily disable the site for maintenance
                        </p>
                      </div>
                      <Switch defaultChecked={systemSettings.maintenanceMode} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">User Registration</p>
                        <p className="text-sm text-gray-600">
                          Allow new users to register
                        </p>
                      </div>
                      <Switch
                        defaultChecked={systemSettings.registrationEnabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-gray-600">
                          Require email verification for new accounts
                        </p>
                      </div>
                      <Switch
                        defaultChecked={systemSettings.emailVerification}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">
                          Require 2FA for all users
                        </p>
                      </div>
                      <Switch
                        defaultChecked={systemSettings.twoFactorRequired}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics Tracking</p>
                        <p className="text-sm text-gray-600">
                          Enable user analytics and tracking
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Debug Mode</p>
                        <p className="text-sm text-gray-600">
                          Enable debug logging and error reporting
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Authentication Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    defaultValue={systemSettings.sessionTimeout}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    defaultValue={systemSettings.maxLoginAttempts}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lockoutDuration">
                    Lockout Duration (minutes)
                  </Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    defaultValue={15}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password Complexity</p>
                    <p className="text-sm text-gray-600">
                      Require strong passwords
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>

            {/* Security Policies */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Security Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">HTTPS Only</p>
                    <p className="text-sm text-gray-600">
                      Force HTTPS connections
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Content Security Policy</p>
                    <p className="text-sm text-gray-600">Enable CSP headers</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rate Limiting</p>
                    <p className="text-sm text-gray-600">
                      Limit API requests per user
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">File Upload Scanning</p>
                    <p className="text-sm text-gray-600">
                      Scan uploaded files for malware
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-[10px]">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        SSL Certificate
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Valid until Dec 2024
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-[10px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Firewall
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Active and configured
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-[10px]">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        Updates
                      </span>
                    </div>
                    <p className="text-sm text-orange-700">
                      2 updates available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMTP Configuration */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  SMTP Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    defaultValue="smtp.gmail.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" defaultValue="587" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    defaultValue="noreply@techedu.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    defaultValue="••••••••"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Use SSL/TLS</p>
                    <p className="text-sm text-gray-600">
                      Enable secure connection
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>

            {/* Email Templates */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Email Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="welcomeEmail">Welcome Email Template</Label>
                  <Select defaultValue="default">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                      <SelectItem value="minimal">Minimal Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="resetEmail">Password Reset Template</Label>
                  <Select defaultValue="default">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                      <SelectItem value="minimal">Minimal Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notificationEmail">
                    Notification Template
                  </Label>
                  <Select defaultValue="default">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                      <SelectItem value="minimal">Minimal Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      defaultValue="#011F72"
                      className="w-16 h-10"
                    />
                    <Input defaultValue="#011F72" className="flex-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      defaultValue="#3B82F6"
                      className="w-16 h-10"
                    />
                    <Input defaultValue="#3B82F6" className="flex-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="defaultTheme">Default Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Logo & Branding */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Logo & Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Site Logo</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-[10px] text-center">
                    <p className="text-sm text-gray-600">
                      Upload your site logo
                    </p>
                    <Button variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Favicon</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-[10px] text-center">
                    <p className="text-sm text-gray-600">
                      Upload favicon (32x32px)
                    </p>
                    <Button variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Version</span>
                  <span className="font-medium">
                    {systemSettings.systemVersion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database Size</span>
                  <span className="font-medium">
                    {systemSettings.databaseSize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-medium">
                    {systemSettings.activeUsers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Server Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    {systemSettings.serverStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="font-medium">
                    {systemSettings.lastBackup}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Performance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cacheEnabled">Enable Caching</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">
                      Improve page load times
                    </span>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="compressionEnabled">Enable Compression</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">
                      Compress responses
                    </span>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cdnEnabled">Use CDN</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">
                      Serve static files via CDN
                    </span>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backup Configuration */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Backup Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select defaultValue={systemSettings.backupFrequency}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backupRetention">
                    Retention Period (days)
                  </Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    defaultValue={30}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Backup</p>
                    <p className="text-sm text-gray-600">
                      Automatically create backups
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Database</p>
                    <p className="text-sm text-gray-600">
                      Include database in backups
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Files</p>
                    <p className="text-sm text-gray-600">
                      Include uploaded files
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>

            {/* Backup Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#011F72]">
                  Backup Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-[#011F72] hover:bg-blue-700 text-white">
                  <MdBackup className="w-4 h-4 mr-2" />
                  Create Manual Backup
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Latest Backup
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restore from Backup
                </Button>
                <div className="p-4 bg-blue-50 rounded-[10px]">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Last Backup
                  </h4>
                  <p className="text-sm text-blue-700">
                    {systemSettings.lastBackup}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Size: 245 MB • Status: Completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
