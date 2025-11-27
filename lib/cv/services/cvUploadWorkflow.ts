// CV Upload Workflow Service - Handles the complete upload and parsing process
import { uploadCV, UploadResult } from "@/lib/firebase/uploadService";
import { parseCV, ParsedCVData } from "./cvParserService";
import { cvApi } from "@/lib/cv/cvApi";
import { ResumeSection } from "@/types/cv";
import { mapResumePropsToSections } from "@/utils/cv/resumeSectionMapper";

export interface CVUploadWorkflowResult {
  uploadResult: UploadResult;
  parsedData: ParsedCVData;
  cvId?: string;
  error?: string;
}

export interface WorkflowOptions {
  userId?: string;
  autoCreateCV?: boolean;
  template?: string;
}

/**
 * Complete CV upload and parsing workflow
 */
export async function processCVUpload(
  file: File,
  options: WorkflowOptions = {}
): Promise<CVUploadWorkflowResult> {
  try {
    // Step 1: Upload file to Firebase
    console.log("Step 1: Uploading CV to Firebase...");
    const uploadResult = await uploadCV(file, options.userId);
    console.log("Upload completed:", uploadResult);

    // Step 2: Extract text from uploaded file
    console.log("Step 2: Extracting text from CV...");
    const extractedText = await extractTextFromFile(
      uploadResult.url,
      file.type
    );
    console.log("Text extraction completed, length:", extractedText.length);

    // Step 3: Parse the extracted text
    console.log("Step 3: Parsing CV content...");
    const parsedData = await parseCV(extractedText);
    console.log("Parsing completed, confidence:", parsedData.confidence);

    // Step 4: Optionally create CV in backend
    let cvId: string | undefined;
    if (options.autoCreateCV) {
      console.log("Step 4: Creating CV in backend...");
      const resumeData = mapResumePropsToSections({
        personalInfo: parsedData.personalInfo,
        professionalSummary: parsedData.professionalSummary,
        experiences: parsedData.experiences,
        educations: parsedData.educations,
        skills: parsedData.skills,
        languages: parsedData.languages,
        certifications: parsedData.certifications,
        awards: parsedData.awards,
        projects: parsedData.projects,
        interests: parsedData.interests,
      });

      const cvResponse = await cvApi.createCV({
        data: resumeData,
        template: options.template || "two-column",
        enabledSections: [
          "personal",
          "professional-summary",
          "experience",
          "education",
          "skills",
          "languages",
          "certifications",
          "awards",
          "projects",
          "interests",
        ],
      });

      cvId = cvResponse.id;
      console.log("CV created in backend with ID:", cvId);
    }

    return {
      uploadResult,
      parsedData,
      cvId,
    };
  } catch (error) {
    console.error("CV upload workflow failed:", error);
    return {
      uploadResult: {} as UploadResult,
      parsedData: {} as ParsedCVData,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Extract text content from uploaded file
 * This is a simplified implementation - in production, you'd use proper document parsing
 */
async function extractTextFromFile(
  fileUrl: string,
  fileType: string
): Promise<string> {
  try {
    // For now, we'll return a placeholder text
    // In a real implementation, you would:
    // 1. Download the file from the URL
    // 2. Use appropriate libraries to extract text:
    //    - PDF: pdf-parse, pdf2pic
    //    - DOC/DOCX: mammoth, docx-parser
    //    - TXT: direct text reading

    console.log("Extracting text from:", fileUrl, "Type:", fileType);

    // Placeholder implementation
    if (fileType === "text/plain") {
      // For text files, we could fetch and read directly
      const response = await fetch(fileUrl);
      return await response.text();
    } else {
      // For other file types, return a sample CV text for demonstration
      return getSampleCVText();
    }
  } catch (error) {
    console.error("Text extraction failed:", error);
    // Return sample text as fallback
    return getSampleCVText();
  }
}

/**
 * Sample CV text for demonstration purposes
 */
function getSampleCVText(): string {
  return `
John Doe
Senior Software Engineer
john.doe@email.com
+1 (555) 123-4567
San Francisco, CA
linkedin.com/in/johndoe
github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of experience in full-stack development. 
Specialized in React, Node.js, and cloud technologies. Passionate about building 
scalable applications and leading development teams.

EXPERIENCE
Senior Software Engineer, TechCorp Inc.
2020-01 - Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews
• Collaborated with product team to define technical requirements

Software Engineer, StartupXYZ
2018-06 - 2019-12
• Developed React applications with Redux state management
• Built RESTful APIs using Node.js and Express
• Implemented automated testing with Jest and Cypress
• Participated in agile development process

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley
2014-09 - 2018-05
GPA: 3.8/4.0

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, 
MongoDB, PostgreSQL, Git, Agile, Scrum

LANGUAGES
English - Native
Spanish - Fluent
French - Intermediate

CERTIFICATIONS
AWS Certified Solutions Architect - Associate
Google Cloud Professional Developer
Certified Scrum Master (CSM)

PROJECTS
E-commerce Platform
• Built full-stack e-commerce application with React and Node.js
• Implemented payment processing with Stripe API
• Deployed on AWS with Docker containers

Task Management App
• Developed collaborative task management tool
• Real-time updates using WebSocket connections
• Mobile-responsive design with Material-UI

INTERESTS
Open source contribution, hiking, photography, cooking
  `;
}

/**
 * Load existing CV by ID and populate builder
 */
export async function loadCVById(cvId: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cvResponse = await cvApi.getCV(cvId);

    // Convert ResumeSection[] back to individual props format
    const convertedData = convertResumeSectionsToProps(cvResponse.data);

    return {
      success: true,
      data: {
        ...convertedData,
        template: cvResponse.template,
        enabledSections: cvResponse.enabledSections,
      },
    };
  } catch (error) {
    console.error("Failed to load CV:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load CV",
    };
  }
}

/**
 * Convert ResumeSection[] back to individual props format
 * This is the reverse of mapResumePropsToSections
 */
function convertResumeSectionsToProps(sections: ResumeSection[]): any {
  const props: any = {
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
      website: "",
      targetedJobTitle: "",
      image: "",
    },
    professionalSummary: { summary: "" },
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    certifications: [],
    awards: [],
    projects: [],
    interests: [],
    customSections: [],
  };

  sections.forEach((section) => {
    switch (section.type) {
      case "personal-info":
        props.personalInfo = { ...props.personalInfo, ...section.data };
        break;
      case "professional-summary":
        props.professionalSummary = section.data;
        break;
      case "work-experience":
        props.experiences = section.data;
        break;
      case "education":
        props.educations = section.data;
        break;
      case "skills":
        props.skills = section.data;
        break;
      case "languages":
        props.languages = section.data;
        break;
      case "certifications":
        props.certifications = section.data;
        break;
      case "awards":
        props.awards = section.data;
        break;
      case "projects":
        props.projects = section.data;
        break;
      case "interests":
        props.interests = section.data;
        break;
      case "custom":
        props.customSections.push(section.data);
        break;
    }
  });

  return props;
}
