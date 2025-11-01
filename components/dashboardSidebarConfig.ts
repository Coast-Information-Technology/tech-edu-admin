import {
  Home,
  User,
  BookOpen,
  FileText,
  Briefcase,
  ClipboardList,
  Layers,
  ShoppingCart,
  MessageCircle,
  Settings,
  Users,
  Building2,
  ShieldCheck,
  Tag,
  HelpCircle,
  Bell,
  Target,
  Video,
  Award,
  BarChart3,
  Calendar,
  LayoutDashboard,
  Package,
} from "lucide-react";

export const dashboardSidebarConfig = {
  admin: {
    displayName: "Admin Dashboard",
    sections: [
      {
        title: "Management",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/admin",
          },
          { label: "User Management", icon: Users, href: "/dashboard/users" },
          {
            label: "Products & Services",
            icon: Package,
            href: "/dashboard/products",
          },
          {
            label: "Products Management",
            icon: Package,
            href: "/dashboard/products-management",
          },
          {
            label: "Attendance Mgt.",
            icon: BookOpen,
            href: "/dashboard/attendance-management",
          },
          {
            label: "Job Management",
            icon: Briefcase,
            href: "/dashboard/jobs-management",
          },
          { label: "Companies", icon: Building2, href: "/dashboard/companies" },
          {
            label: "Bookings",
            icon: Calendar,
            href: "/dashboard/bookings",
          },
          {
            label: "User Entitlements",
            icon: Calendar,
            href: "/dashboard/entitlements",
          },
          {
            label: "User Subscriptions",
            icon: Package,
            href: "/dashboard/subscriptions",
          },
          {
            label: "Onboarding Stuck Users",
            icon: ClipboardList,
            href: "/dashboard/onboarding-stucked-users",
          },
          {
            label: "Payments",
            icon: ShoppingCart,
            href: "/dashboard/payments",
          },
          {
            label: "Classrooms",
            icon: BookOpen,
            href: "/dashboard/classrooms",
          },
          {
            label: "Attendance",
            icon: FileText,
            href: "/dashboard/attendance-management",
          },
          {
            label: "Live Sessions",
            icon: Calendar,
            href: "/dashboard/sessions",
          },
        ],
      },
      {
        title: "Profiles & CVs",
        items: [
          { label: "My Resumes", icon: FileText, href: "/dashboard/cvs" },
          {
            label: "Resume Builder",
            icon: FileText,
            href: "/dashboard/cv-builder",
          },
        ],
      },
      // {
      //   title: "Resources & Support",
      //   items: [
      //     { label: "Resources", icon: Layers, href: "/dashboard/resources" },
      //     {
      //       label: "Feedback / Support",
      //       icon: MessageCircle,
      //       href: "/dashboard/feedback",
      //     },
      //   ],
      // },
      {
        title: "System",
        items: [
          {
            label: "Notifications",
            icon: Settings,
            href: "/dashboard/notifications",
          },
          {
            label: "Site Settings",
            icon: Settings,
            href: "/dashboard/settings",
          },
        ],
      },
    ],
  },

  instructor: {
    displayName: "Instructor Dashboard",
    sections: [
      {
        title: "Services Management",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/instructor",
          },
          // {
          //   label: "Instructor Availability",
          //   icon: BookOpen,
          //   href: "/dashboard/instructor-availability",
          // },
          {
            label: "Student",
            icon: BookOpen,
            href: "/dashboard/users",
          },
          // {
          //   label: "Academic Services",
          //   icon: BookOpen,
          //   href: "/dashboard/products",
          // },
          {
            label: "Enrolled Students",
            icon: Users,
            href: "/dashboard/enrolled-students",
          },
          {
            label: "Bookings",
            icon: BookOpen,
            href: "/dashboard/bookings/instructor",
          },
          {
            label: "Classrooms",
            icon: BookOpen,
            href: "/dashboard/classrooms/instructor",
          },
          {
            label: "Sessions",
            icon: Video,
            href: "/dashboard/sessions/instructor",
          },
          {
            label: "Attendance",
            icon: FileText,
            href: "/dashboard/attendance",
          },
        ],
      },
      // {
      //   title: "Reports & Insights",
      //   items: [
      //     {
      //       label: "Feedback",
      //       icon: MessageCircle,
      //       href: "/dashboard/feedback",
      //     },
      //   ],
      // },
      {
        title: "System",
        items: [
          {
            label: "Notifications",
            icon: Bell,
            href: "/dashboard/notifications",
          },
          {
            label: "Profile",
            icon: User,
            href: "/dashboard/profile",
          },
        ],
      },
    ],
  },

  customerRepresentative: {
    displayName: "Customer Representative Dashboard",
    sections: [
      {
        title: "Support Center",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/customer-representative",
          },
          {
            label: "User Queries",
            icon: MessageCircle,
            href: "/dashboard/queries",
          },
          {
            label: "Products Management",
            icon: Package,
            href: "/dashboard/products",
          },
          {
            label: "Live Chat",
            icon: MessageCircle,
            href: "/dashboard/live-chat",
          },
          {
            label: "Support Tickets",
            icon: ClipboardList,
            href: "/dashboard/tickets",
          },
        ],
      },
      {
        title: "User Management",
        items: [
          {
            label: "View Users",
            icon: Users,
            href: "/dashboard/users",
          },
          {
            label: "Bookings",
            icon: Calendar,
            href: "/dashboard/bookings",
          },
          {
            label: "User Feedback",
            icon: MessageCircle,
            href: "/dashboard/feedback",
          },
        ],
      },
      {
        title: "System",
        items: [
          {
            label: "Notifications",
            icon: User,
            href: "/dashboard/notifications",
          },
        ],
      },
    ],
  },

  moderator: {
    displayName: "Moderator Dashboard",
    sections: [
      {
        title: "Content Moderation",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/moderator",
          },
          {
            label: "Review Submissions",
            icon: ClipboardList,
            href: "/dashboard/reviews",
          },
          {
            label: "Reported Content",
            icon: ShieldCheck,
            href: "/dashboard/reports",
          },
        ],
      },
      {
        title: "Community",
        items: [
          {
            label: "Discussions",
            icon: MessageCircle,
            href: "/dashboard/discussions",
          },
          {
            label: "User Behavior",
            icon: Users,
            href: "/dashboard/user-behavior",
          },
        ],
      },
      {
        title: "System",
        items: [
          {
            label: "Notifications",
            icon: User,
            href: "/dashboard/notifications",
          },
        ],
      },
    ],
  },
};
