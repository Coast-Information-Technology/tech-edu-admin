import { NextRequest, NextResponse } from "next/server";

// Mock data for development - replace with actual database calls
const mockJobs = [
  {
    _id: "1",
    title: "Senior Software Engineer",
    description:
      "We are looking for a senior software engineer to join our team and help build scalable applications.",
    location: "London, UK",
    employmentType: "full-time",
    requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript"],
    tags: ["frontend", "backend", "fullstack"],
    salaryRange: "60000-90000 GBP",
    company: "TechCorp Solutions",
    department: "Engineering",
    contactEmail: "hr@techcorp.com",
    contactPhone: "+44 20 7123 4567",
    website: "https://techcorp.com",
    recruiter: "Sarah Johnson",
    isFeatured: true,
    isUrgent: false,
    expiryDate: "2024-12-31",
    isDeleted: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    slug: "senior-software-engineer-london",
  },
  {
    _id: "2",
    title: "UX/UI Designer",
    description:
      "Join our design team to create beautiful and intuitive user experiences for our products.",
    location: "Remote",
    employmentType: "contract",
    requiredSkills: [
      "Figma",
      "Adobe Creative Suite",
      "User Research",
      "Prototyping",
    ],
    tags: ["design", "ux", "ui", "remote"],
    salaryRange: "40000-60000 USD",
    company: "Design Studio Pro",
    department: "Design",
    contactEmail: "design@studiopro.com",
    contactPhone: "+1 555 123 4567",
    website: "https://studiopro.com",
    recruiter: "Mike Chen",
    isFeatured: false,
    isUrgent: true,
    expiryDate: "2024-11-30",
    isDeleted: false,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    slug: "ux-ui-designer-remote",
  },
  {
    _id: "3",
    title: "Data Scientist",
    description:
      "Help us analyze complex data sets and build machine learning models to drive business decisions.",
    location: "New York, NY",
    employmentType: "full-time",
    requiredSkills: ["Python", "R", "Machine Learning", "SQL", "Statistics"],
    tags: ["data", "ml", "analytics", "python"],
    salaryRange: "80000-120000 USD",
    company: "Data Insights Inc",
    department: "Data Science",
    contactEmail: "data@insights.com",
    contactPhone: "+1 555 987 6543",
    website: "https://insights.com",
    recruiter: "Emily Rodriguez",
    isFeatured: true,
    isUrgent: false,
    expiryDate: "2024-12-15",
    isDeleted: false,
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    slug: "data-scientist-new-york",
  },
];

export async function GET(request: NextRequest) {
  try {
    // Add authentication check here if needed
    // const token = request.headers.get('authorization');
    // if (!token) {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // }

    // For now, return mock data
    // In production, you would fetch from your database here
    // const jobs = await prisma.job.findMany({ where: { isDeleted: false } });

    return NextResponse.json({
      success: true,
      data: mockJobs,
      message: "Jobs fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "location",
      "employmentType",
      "requiredSkills",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new job (mock implementation)
    const newJob = {
      _id: Date.now().toString(),
      ...body,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: body.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
    };

    // In production, you would save to database here
    // const job = await prisma.job.create({ data: newJob });

    return NextResponse.json(
      {
        success: true,
        data: newJob,
        message: "Job created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
