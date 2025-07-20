import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  User,
  Users,
  BookOpen,
  Briefcase,
  Award,
  BarChart3,
  Calendar,
  FileText,
  ClipboardList,
  MessageCircle,
  Tag,
  Bell,
  ShieldCheck,
  Layers,
  Video,
  HelpCircle,
  ShoppingCart,
  Building2,
  Settings,
  Home,
  DollarSign,
  Star,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Flag,
  Inbox,
  Bug,
  ArrowUpRight,
} from "lucide-react";
import {
  adminDashboardMock,
  instructorDashboardMock,
  customerCareDashboardMock,
} from "../mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaCertificate } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Loader2 } from "lucide-react";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import { getUserMe } from "@/lib/apiFetch";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "instructor", label: "Instructor" },
  { value: "customerCare", label: "Customer Care" },
];

// Reusable stat card component
interface DashboardStatCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tooltip: string;
  focusRingColor?: string;
}

function DashboardStatCard({
  href,
  icon,
  title,
  children,
  tooltip,
  focusRingColor = "blue",
}: DashboardStatCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            className="block hover:shadow-lg transition rounded"
            tabIndex={0}
            aria-label={title}
            role="link"
          >
            <div
              className={`cursor-pointer focus:ring-2 focus:ring-${focusRingColor}-500`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  {icon}
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>{children}</CardContent>
              </Card>
            </div>
          </a>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function DashboardOverview() {
  const [userRole, setUserRole] = useState<
    "admin" | "instructor" | "customerCare"
  >("admin");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const { accessToken, isLoading: tokenLoading } = useTokenManagement();
  const router = useRouter();

  // Fetch user fullName
  useEffect(() => {
    if (!accessToken) return;
    getUserMe(accessToken)
      .then((res) => {
        setFullName(res.data?.fullName || "User");
      })
      .catch(() => setFullName("User"));
  }, [accessToken]);

  // Simulate loading when switching roles
  const handleRoleChange = (role: typeof userRole) => {
    setLoading(true);
    setTimeout(() => {
      setUserRole(role);
      setLoading(false);
      router.push(`/dashboard/${role}`);
    }, 700);
  };

  // Branding: logo, platform name, and welcome message
  const platformName = "Tech Eduk";
  const roleDisplay =
    userRole === "admin"
      ? "Admin"
      : userRole === "instructor"
      ? "Instructor"
      : "Customer Care";
  const welcomeMsg = `Welcome, ${fullName || roleDisplay}!`;

  return (
    <TooltipProvider>
      <div>
        {/* Branding Header */}
        <header className="flex items-center gap-4 px-4 py-3 bg-blue-50 border-b border-blue-100 rounded-t-lg mb-6">
          <div className="flex items-center gap-2">
            {/* Logo placeholder */}
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="text-xl font-bold text-blue-700 tracking-tight">
              {platformName}
            </span>
          </div>
          <span className="ml-auto text-base font-medium text-gray-700">
            {welcomeMsg}
          </span>
        </header>
        {/* Role Selector and Demo Mode */}
        <div className="mb-6 flex items-center gap-2">
          <label
            htmlFor="role-select"
            className="font-medium"
            id="role-select-label"
          >
            Select Role:
          </label>
          <select
            id="role-select"
            aria-labelledby="role-select-label"
            value={userRole}
            onChange={(e) => handleRoleChange(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
            disabled={loading}
            aria-label="Select dashboard role"
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value} aria-label={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 select-none">
            Demo Mode
          </span>
          {loading && (
            <Loader2
              className="animate-spin ml-2 text-blue-600 w-5 h-5"
              aria-label="Loading"
            />
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-2" />
            <span className="text-gray-500">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Dashboard Content */}
            {userRole === "admin" &&
              (() => {
                const data = adminDashboardMock;
                return (
                  <>
                    <h2 className="text-lg font-semibold mb-2 mt-4">
                      Key Stats
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6">
                      <DashboardStatCard
                        href="/dashboard/users"
                        icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                        title="Platform Stats"
                        tooltip="View all users and platform stats"
                        focusRingColor="blue"
                      >
                        <div className="space-y-2">
                          <div>
                            <Users className="inline w-4 h-4 mr-1 text-gray-500" />
                            Total Users: <b>{data.platformStats.totalUsers}</b>
                          </div>
                          <div>
                            <User className="inline w-4 h-4 mr-1 text-gray-500" />
                            Instructors: <b>{data.platformStats.instructors}</b>
                          </div>
                          <div>
                            <Activity className="inline w-4 h-4 mr-1 text-gray-500" />
                            Active Learners:{" "}
                            <b>{data.platformStats.activeLearners}</b>
                          </div>
                          <div>
                            <BookOpen className="inline w-4 h-4 mr-1 text-gray-500" />
                            Completed Courses:{" "}
                            <b>{data.platformStats.completedCourses}</b>
                          </div>
                        </div>
                      </DashboardStatCard>
                      <DashboardStatCard
                        href="/dashboard/orders"
                        icon={<DollarSign className="w-5 h-5 text-green-600" />}
                        title="Earnings"
                        tooltip="View detailed earnings and payouts"
                        focusRingColor="green"
                      >
                        <div className="space-y-2">
                          <div>
                            <DollarSign className="inline w-4 h-4 mr-1 text-green-600" />
                            Total:{" "}
                            <b>
                              {data.earnings.currency}
                              {data.earnings.total.toLocaleString()}
                            </b>
                          </div>
                          <div>
                            <TrendingUp className="inline w-4 h-4 mr-1 text-purple-600" />
                            This Week:{" "}
                            <b>
                              {data.earnings.currency}
                              {data.earnings.thisWeek.toLocaleString()}
                            </b>{" "}
                            <Badge variant="secondary" className="ml-2">
                              This Week
                            </Badge>
                          </div>
                        </div>
                      </DashboardStatCard>
                      <DashboardStatCard
                        href="/dashboard/reports"
                        icon={<Inbox className="w-5 h-5 text-orange-600" />}
                        title="Pending Items"
                        tooltip="Review flagged and pending items"
                        focusRingColor="orange"
                      >
                        <div className="space-y-2">
                          <div>
                            <ClipboardList className="inline w-4 h-4 mr-1 text-orange-600" />
                            Pending Course Approvals:{" "}
                            <b>{data.pendingCourseApprovals}</b>{" "}
                            <Badge variant="destructive">Pending</Badge>
                          </div>
                          <div>
                            <Flag className="inline w-4 h-4 mr-1 text-red-500" />
                            Flagged Reviews: <b>{data.flaggedReviews}</b>
                          </div>
                          <div>
                            <User className="inline w-4 h-4 mr-1 text-blue-600" />
                            Pending Instructor Applications:{" "}
                            <b>{data.pendingInstructorApplications}</b>{" "}
                            <Badge variant="secondary">Review</Badge>
                          </div>
                          {data.pendingCourseApprovals === 0 &&
                            data.flaggedReviews === 0 &&
                            data.pendingInstructorApplications === 0 && (
                              <div className="text-gray-400 text-sm mt-2">
                                No pending items 🎉
                              </div>
                            )}
                        </div>
                      </DashboardStatCard>
                    </div>
                    <h2 className="text-lg font-semibold mb-2 mt-8">Trends</h2>
                    <Card className="mt-0">
                      <CardHeader className="flex flex-row items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <CardTitle>Earnings (Last 6 Weeks)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.earningsChart}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="week" />
                              <YAxis />
                              <RechartsTooltip />
                              <Bar
                                dataKey="earnings"
                                fill="#2563eb"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            {userRole === "instructor" &&
              (() => {
                const data = instructorDashboardMock;
                return (
                  <>
                    <h2 className="text-lg font-semibold mb-2 mt-4">
                      Key Stats
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6">
                      <DashboardStatCard
                        href="/dashboard/courses"
                        icon={<BookOpen className="w-5 h-5 text-blue-600" />}
                        title="My Courses"
                        tooltip="Manage your courses"
                        focusRingColor="blue"
                      >
                        <div>
                          <Layers className="inline w-4 h-4 mr-1 text-gray-500" />
                          Active Courses: <b>{data.activeCourses}</b>
                        </div>
                        <div>
                          <Users className="inline w-4 h-4 mr-1 text-gray-500" />
                          Enrolled Students: <b>{data.enrolledStudents}</b>
                        </div>
                        {data.activeCourses === 0 && (
                          <div className="text-gray-400 text-sm mt-2">
                            No active courses yet
                          </div>
                        )}
                      </DashboardStatCard>
                      <DashboardStatCard
                        href="/dashboard/orders"
                        icon={<DollarSign className="w-5 h-5 text-green-600" />}
                        title="Earnings"
                        tooltip="View your earnings and payouts"
                        focusRingColor="green"
                      >
                        <div>
                          <DollarSign className="inline w-4 h-4 mr-1 text-green-600" />
                          {data.currency}
                          {data.earnings.toLocaleString()}
                        </div>
                        {data.earnings === 0 && (
                          <div className="text-gray-400 text-sm mt-2">
                            No earnings yet
                          </div>
                        )}
                      </DashboardStatCard>
                      <DashboardStatCard
                        href="/dashboard/certificates"
                        icon={
                          <FaCertificate className="w-5 h-5 text-yellow-600" />
                        }
                        title="Certificates"
                        tooltip="Manage certificates for your students"
                        focusRingColor="yellow"
                      >
                        <div>
                          <CheckCircle className="inline w-4 h-4 mr-1 text-yellow-600" />
                          Issued Manually: <b>{data.certificatesIssued}</b>
                        </div>
                        {data.certificatesIssued === 0 && (
                          <div className="text-gray-400 text-sm mt-2">
                            No certificates issued
                          </div>
                        )}
                      </DashboardStatCard>
                    </div>
                    <h2 className="text-lg font-semibold mb-2 mt-8">Trends</h2>
                    <Card className="mt-0">
                      <CardHeader className="flex flex-row items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <CardTitle>Enrollments (Last 6 Weeks)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.enrollmentsChart}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="week" />
                              <YAxis />
                              <Tooltip />
                              <Bar
                                dataKey="enrollments"
                                fill="#a21caf"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            {userRole === "customerCare" &&
              (() => {
                const data = customerCareDashboardMock;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <DashboardStatCard
                      href="/dashboard/support-tickets"
                      icon={<Inbox className="w-5 h-5 text-blue-600" />}
                      title="Support Tickets"
                      tooltip="View all support tickets"
                      focusRingColor="blue"
                    >
                      <div>
                        <ClipboardList className="inline w-4 h-4 mr-1 text-blue-600" />
                        Open Tickets: <b>{data.openSupportTickets}</b>{" "}
                        <Badge variant="destructive">Open</Badge>
                      </div>
                      {data.openSupportTickets === 0 && (
                        <div className="text-gray-400 text-sm mt-2">
                          No open support tickets
                        </div>
                      )}
                    </DashboardStatCard>
                    <DashboardStatCard
                      href="/dashboard/onboarding"
                      icon={
                        <Award className="inline w-4 h-4 mr-1 text-green-600" />
                      }
                      title="Onboarding"
                      tooltip="Manage onboarding resets"
                      focusRingColor="green"
                    >
                      <div>
                        <Award className="inline w-4 h-4 mr-1 text-green-600" />
                        Resets This Week: <b>{data.onboardingResetsThisWeek}</b>
                      </div>
                      {data.onboardingResetsThisWeek === 0 && (
                        <div className="text-gray-400 text-sm mt-2">
                          No onboarding resets this week
                        </div>
                      )}
                    </DashboardStatCard>
                    <DashboardStatCard
                      href="/dashboard/escalations"
                      icon={
                        <AlertTriangle className="inline w-4 h-4 mr-1 text-orange-600" />
                      }
                      title="Escalations"
                      tooltip="View escalated issues"
                      focusRingColor="orange"
                    >
                      <div>
                        <ShieldCheck className="inline w-4 h-4 mr-1 text-orange-600" />
                        Last 7 Days: <b>{data.escalationsLast7Days}</b>
                      </div>
                      {data.escalationsLast7Days === 0 && (
                        <div className="text-gray-400 text-sm mt-2">
                          No escalations in the last 7 days
                        </div>
                      )}
                    </DashboardStatCard>
                    <DashboardStatCard
                      href="/dashboard/bug-reports"
                      icon={
                        <Bug className="inline w-4 h-4 mr-1 text-red-600" />
                      }
                      title="Bug Reports"
                      tooltip="Manage bug reports"
                      focusRingColor="red"
                    >
                      <div>
                        <AlertTriangle className="inline w-4 h-4 mr-1 text-red-600" />
                        Needing Follow-up:{" "}
                        <b>{data.bugReportsNeedingFollowup}</b>{" "}
                        <Badge variant="secondary">Follow-up</Badge>
                      </div>
                      {data.bugReportsNeedingFollowup === 0 && (
                        <div className="text-gray-400 text-sm mt-2">
                          No bug reports needing follow-up
                        </div>
                      )}
                    </DashboardStatCard>
                  </div>
                );
              })()}

            {!(
              userRole === "admin" ||
              userRole === "instructor" ||
              userRole === "customerCare"
            ) && <div>No dashboard data available.</div>}
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
