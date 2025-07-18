import React from "react";
import { Mail, Phone, Home, MapPin, Globe, Linkedin } from "lucide-react";
import { CVData } from "@/types/cv-layout";
import CV1Layout from "@/components/CVLayouts/CV_1";
import CV2Layout from "@/components/CVLayouts/CV_2";
import CV3Layout from "@/components/CVLayouts/CV_3";
// import other layouts as needed

interface CVPreviewProps {
  data: CVData;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ title, children, className = "", style = {} }) => (
  <div className={`mb-4 ${className}`} style={style}>
    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
      {title}
    </h3>
    <div className="text-xs">{children}</div>
  </div>
);

// Template-specific layout components
const TemplateLayouts = {
  // Modern Professional Template
  cv_1: CV1Layout,

  // Clean Minimal Template
  cv_2: CV2Layout,

  // Creative Portfolio Template
  cv_3: CV3Layout,

  // Default template for other CV layouts
  default: ({ data }: { data: any }) => (
    <div className="bg-white font-sans text-gray-800 leading-tight p-6">
      <div className="text-center mb-6">
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            color: data.colors?.primary || "#1e40af",
            fontFamily:
              data.font === "inter"
                ? "Inter, sans-serif"
                : data.font === "roboto"
                ? "Roboto, sans-serif"
                : data.font === "open-sans"
                ? "Open Sans, sans-serif"
                : data.font === "lato"
                ? "Lato, sans-serif"
                : data.font === "poppins"
                ? "Poppins, sans-serif"
                : data.font === "montserrat"
                ? "Montserrat, sans-serif"
                : data.font === "raleway"
                ? "Raleway, sans-serif"
                : "Source Sans Pro, sans-serif",
          }}
        >
          {data?.name || "John Doe"}
        </h1>
        <p
          className="text-lg mb-2"
          style={{ color: data.colors?.secondary || "#3b82f6" }}
        >
          {data?.cvTrack || "Tech Professional"}
        </p>
        <div className="text-sm text-gray-600">
          {data?.email || "john.doe@email.com"} •{" "}
          {data?.phone || "+1 (555) 123-4567"}
        </div>
      </div>

      <div
        className="space-y-4"
        style={{
          lineHeight: `${(data.spacingValue || 1.0) * 1.5}`,
          fontFamily:
            data.font === "inter"
              ? "Inter, sans-serif"
              : data.font === "roboto"
              ? "Roboto, sans-serif"
              : data.font === "open-sans"
              ? "Open Sans, sans-serif"
              : data.font === "lato"
              ? "Lato, sans-serif"
              : data.font === "poppins"
              ? "Poppins, sans-serif"
              : data.font === "montserrat"
              ? "Montserrat, sans-serif"
              : data.font === "raleway"
              ? "Raleway, sans-serif"
              : "Source Sans Pro, sans-serif",
        }}
      >
        <Section title="Summary">
          <p className="text-sm">
            {data?.experience ||
              "Experienced professional with expertise in modern technologies and best practices."}
          </p>
        </Section>

        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {data?.skills?.length > 0
              ? data.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: data.colors?.accent || "#60a5fa",
                      color: "white",
                    }}
                  >
                    {skill}
                  </span>
                ))
              : ["Leadership", "Communication", "Problem Solving"].map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: data.colors?.accent || "#60a5fa",
                      color: "white",
                    }}
                  >
                    {s}
                  </span>
                ))}
          </div>
        </Section>
      </div>
    </div>
  ),
};

const DefaultLayout = ({ data }: { data: CVData }) => (
  <div className="p-8 text-center text-gray-500">
    <p>No preview available for this template yet.</p>
  </div>
);

const layoutMap: Record<string, React.ComponentType<any>> = {
  cv_1: CV1Layout,
  cv_2: CV2Layout,
  cv_3: CV3Layout,
  // ...add more as you create them
};

const CVPreview: React.FC<CVPreviewProps> = ({ data }) => {
  const SelectedLayout = layoutMap[data?.layout] || DefaultLayout;
  return (
    <div className="w-full max-w-4xl mx-auto">
      <SelectedLayout data={data} />
    </div>
  );
};

export default CVPreview;
