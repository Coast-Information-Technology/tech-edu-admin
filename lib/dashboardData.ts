import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  BookOpen,
  Award,
  MessageSquare,
  Calendar,
  BarChart3,
  Target,
  Heart,
  Globe,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  Home,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  CreditCard,
} from "lucide-react";

export type UserRole =
  | "admin"
  | "moderator"
  | "instructor"
  | "customerRepresentative";

export interface DashboardMenuItem {
  id: string;
  title: string;
  href: string;
  icon: any;
  badge?: string | number;
  isActive?: boolean;
  children?: DashboardMenuItem[];
}

export interface DashboardSection {
  id: string;
  title: string;
  items: DashboardMenuItem[];
}

export interface RoleDashboardData {
  role: UserRole;
  displayName: string;
  description: string;
  sections: DashboardSection[];
  quickActions: DashboardMenuItem[];
  stats: {
    label: string;
    value: string | number;
    change?: string;
    icon: any;
  }[];
}

export const dashboardData: Record<UserRole, RoleDashboardData> = {
  admin: {
    role: "admin",
    displayName: "Admin Dashboard",
    description: "System administration and user management",
    sections: [], // TODO: Fill with admin sections
    quickActions: [],
    stats: [],
  },
  moderator: {
    role: "moderator",
    displayName: "Moderator Dashboard",
    description: "Moderate content and manage users",
    sections: [], // TODO: Fill with moderator sections
    quickActions: [],
    stats: [],
  },
  instructor: {
    role: "instructor",
    displayName: "Instructor Dashboard",
    description: "Manage courses and students",
    sections: [], // TODO: Fill with instructor sections
    quickActions: [],
    stats: [],
  },
  customerRepresentative: {
    role: "customerRepresentative",
    displayName: "Customer Representative Dashboard",
    description: "Support customers and handle inquiries",
    sections: [], // TODO: Fill with customer rep sections
    quickActions: [],
    stats: [],
  },
};

export const getUserDashboardData = (role: UserRole): RoleDashboardData => {
  return dashboardData[role] || dashboardData.moderator;
};

export const getAllRoles = (): UserRole[] => {
  return Object.keys(dashboardData) as UserRole[];
};
