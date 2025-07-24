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
            label: "Products Management",
            icon: Package,
            href: "/dashboard/products",
          },
          {
            label: "Course Management",
            icon: BookOpen,
            href: "/dashboard/courses-management",
          },
          {
            label: "Job Management",
            icon: Briefcase,
            href: "/dashboard/jobs-management",
          },
          {
            label: "Staffs Management",
            icon: Users,
            href: "/dashboard/staffs",
          },
          { label: "Companies", icon: Building2, href: "/dashboard/companies" },
          {
            label: "Services Management",
            icon: Layers,
            href: "/dashboard/services",
          },
          {
            label: "Career Connect",
            icon: Users,
            href: "/dashboard/career-connect",
          },
          {
            label: "Academic Services",
            icon: Award,
            href: "/dashboard/academic-services",
          },
          {
            label: "Bookings",
            icon: Calendar,
            href: "/dashboard/booked-services",
          },
          {
            label: "Onboarding",
            icon: ClipboardList,
            href: "/dashboard/onboarding",
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
      {
        title: "Commerce",
        items: [
          {
            label: "Orders",
            icon: ShoppingCart,
            href: "/dashboard/orders",
          },
          {
            label: "Payments",
            icon: ShoppingCart,
            href: "/dashboard/payments",
          },
          { label: "Promo Codes", icon: Tag, href: "/dashboard/promo-codes" },
        ],
      },
      {
        title: "Resources & Support",
        items: [
          { label: "Resources", icon: Layers, href: "/dashboard/resources" },
          {
            label: "Feedback / Support",
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
            icon: Settings,
            href: "/dashboard/notifications",
          },
          {
            label: "Site Settings",
            icon: Settings,
            href: "/dashboard/settings",
          },
          {
            label: "FAQ Management",
            icon: HelpCircle,
            href: "/dashboard/faqs",
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
            label: "My Courses",
            icon: BookOpen,
            href: "/dashboard/courses",
          },
          {
            label: "Create Course",
            icon: ClipboardList,
            href: "/dashboard/create-course",
          },
          {
            label: "Lesson Videos",
            icon: Video,
            href: "/dashboard/videos",
          },
        ],
      },
      {
        title: "Student Engagement",
        items: [
          {
            label: "Enrolled Students",
            icon: Users,
            href: "/dashboard/students",
          },
          {
            label: "Assignments / Grading",
            icon: FileText,
            href: "/dashboard/assignments",
          },
          {
            label: "Live Sessions",
            icon: Calendar,
            href: "/dashboard/live-sessions",
          },
        ],
      },
      {
        title: "Reports & Insights",
        items: [
          {
            label: "Course Performance",
            icon: BarChart3,
            href: "/dashboard/performance",
          },
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
            href: "/dashboard/customerRepresentative",
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
