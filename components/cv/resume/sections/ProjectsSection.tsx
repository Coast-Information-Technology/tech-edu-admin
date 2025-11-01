// components/resume/sections/ProjectsSection.tsx
import { Project } from "@/types/cv";

interface Props {
  heading: string;
  data: Project[];
  templateStyles?: any;
}

export default function ProjectsSection({
  heading,
  data,
  templateStyles,
}: Props) {
  if (!data?.length) return null;

  // Use template styles if available, otherwise fall back to default styling
  const styles = templateStyles || {
    colors: {
      primary: "#1e3a8a",
      text: "#111827",
      secondary: "#6b7280",
      accent: "#2563eb",
    },
    typography: { headingSize: 18, bodySize: 14 },
    spacing: { sectionGap: 24, margin: 16 },
  };

  return (
    <section style={{ marginBottom: `${styles.spacing.sectionGap}px` }}>
      <h2
        style={{
          fontSize: `${styles.typography.headingSize}px`,
          fontWeight: "bold",
          color: styles.colors.primary,
          marginBottom: `${styles.spacing.margin}px`,
        }}
      >
        {heading}
      </h2>
      {data.map((project, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: `${styles.typography.bodySize}px`,
              color: styles.colors.text,
              marginBottom: "4px",
            }}
          >
            {project.name}
          </p>
          {project.url && (
            <a
              href={project.url}
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.accent,
                textDecoration: "underline",
                marginBottom: "4px",
                display: "block",
              }}
            >
              {project.url}
            </a>
          )}
          {project.description && (
            <div
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.text,
                lineHeight: 1.5,
              }}
              className="prose prose-sm max-w-none rich-text-content [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          )}
        </div>
      ))}
    </section>
  );
}
