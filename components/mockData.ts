// Mock data for dashboard overviews for different roles

export interface AdminDashboardMock {
  pendingCourseApprovals: number;
  flaggedReviews: number;
  earnings: {
    total: number;
    thisWeek: number;
    currency: string;
  };
  pendingInstructorApplications: number;
  platformStats: {
    totalUsers: number;
    instructors: number;
    activeLearners: number;
    completedCourses: number;
  };
  quickLinks: { label: string; href: string }[];
  earningsChart: { week: string; earnings: number }[];
}

export interface InstructorDashboardMock {
  activeCourses: number;
  enrolledStudents: number;
  earnings: number;
  currency: string;
  certificatesIssued: number;
  reviewsToRespond: number;
  overview: {
    enrollmentsThisWeek: number;
    enrollmentsThisMonth: number;
    pendingReviews: number;
    earningsOverview: number;
  };
  enrollmentsChart: { week: string; enrollments: number }[];
}

export interface CustomerCareDashboardMock {
  openSupportTickets: number;
  onboardingResetsThisWeek: number;
  escalationsLast7Days: number;
  bugReportsNeedingFollowup: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    email: string;
    phone: string;
  };
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "active" | "inactive" | "draft" | "archived";
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  enrollment: {
    total: number;
    active: number;
    completed: number;
  };
  rating: {
    average: number;
    count: number;
  };
  duration: string;
  lessons: number;
  modules: number;
  lastUpdated: string;
  createdDate: string;
  isFeatured: boolean;
  isPopular: boolean;
  certificate: boolean;
  language: string;
  thumbnail: string;
  requirements: string[];
  outcomes: string[];
  tags: string[];
}

export const adminDashboardMock: AdminDashboardMock = {
  pendingCourseApprovals: 2,
  flaggedReviews: 4,
  earnings: {
    total: 350000,
    thisWeek: 75000,
    currency: "₦",
  },
  pendingInstructorApplications: 3,
  platformStats: {
    totalUsers: 1200,
    instructors: 45,
    activeLearners: 800,
    completedCourses: 320,
  },
  quickLinks: [
    { label: "Flagged Content", href: "/dashboard/reports" },
    { label: "Pending Approvals", href: "/dashboard/courses-management" },
  ],
  earningsChart: [
    { week: "Week 1", earnings: 40000 },
    { week: "Week 2", earnings: 50000 },
    { week: "Week 3", earnings: 60000 },
    { week: "Week 4", earnings: 70000 },
    { week: "Week 5", earnings: 80000 },
    { week: "Week 6", earnings: 50000 },
  ],
};

export const instructorDashboardMock: InstructorDashboardMock = {
  activeCourses: 3,
  enrolledStudents: 250,
  earnings: 125000,
  currency: "₦",
  certificatesIssued: 5,
  reviewsToRespond: 2,
  overview: {
    enrollmentsThisWeek: 30,
    enrollmentsThisMonth: 120,
    pendingReviews: 2,
    earningsOverview: 125000,
  },
  enrollmentsChart: [
    { week: "Week 1", enrollments: 30 },
    { week: "Week 2", enrollments: 40 },
    { week: "Week 3", enrollments: 35 },
    { week: "Week 4", enrollments: 50 },
    { week: "Week 5", enrollments: 45 },
    { week: "Week 6", enrollments: 50 },
  ],
};

export const customerCareDashboardMock: CustomerCareDashboardMock = {
  openSupportTickets: 5,
  onboardingResetsThisWeek: 2,
  escalationsLast7Days: 3,
  bugReportsNeedingFollowup: 1,
};

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    slug: "complete-web-development-bootcamp",
    description:
      "Learn web development from scratch with this comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, and more.",
    instructor: {
      name: "Dr. Sarah Johnson",
      avatar: "/assets/placeholder-avatar.jpg",
      email: "sarah.johnson@techedu.com",
      phone: "+44 20 7123 4567",
    },
    category: "Web Development",
    level: "beginner",
    status: "active",
    price: { amount: 89, currency: "GBP", isFree: false },
    enrollment: { total: 1247, active: 892, completed: 234 },
    rating: { average: 4.8, count: 156 },
    duration: "45 hours",
    lessons: 156,
    modules: 12,
    lastUpdated: "2024-01-15",
    createdDate: "2023-06-10",
    isFeatured: true,
    isPopular: true,
    certificate: true,
    language: "English",
    thumbnail: "/assets/courses.webp",
    requirements: [
      "Basic computer skills",
      "No prior programming experience required",
      "A computer with internet connection",
      "Willingness to learn and practice",
    ],
    outcomes: [
      "Build responsive websites from scratch",
      "Master HTML, CSS, and JavaScript",
      "Create dynamic web applications with React",
      "Develop backend APIs with Node.js",
      "Deploy applications to the web",
      "Understand modern web development practices",
    ],
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Web Development"],
  },
];
