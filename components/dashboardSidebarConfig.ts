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
            label: "Booked Services",
            icon: Calendar,
            href: "/dashboard/booked-services",
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
        ],
      },
      {
        title: "Profiles & CVs",
        items: [
          { label: "CVs / Profiles", icon: FileText, href: "/dashboard/cvs" },
          {
            label: "CV Builder",
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
        title: "Course Management",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/instructor",
          },
          {
            label: "Student",
            icon: BookOpen,
            href: "/dashboard/users",
          },
          {
            label: "Academic Services",
            icon: BookOpen,
            href: "/dashboard/products",
          },
          {
            label: "Bookings",
            icon: BookOpen,
            href: "/dashboard/bookings",
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
        ],
      },
      {
        title: "Student Engagement",
        items: [
          {
            label: "Enrolled Students",
            icon: Users,
            href: "/dashboard/enrolled-students",
          },
          {
            label: "Attendance",
            icon: FileText,
            href: "/dashboard/attendance",
          },
          {
            label: "Live Sessions",
            icon: Calendar,
            href: "/dashboard/sessions",
          },
        ],
      },
      {
        title: "Reports & Insights",
        items: [
          {
            label: "Feedback",
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
