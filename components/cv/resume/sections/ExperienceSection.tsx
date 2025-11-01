// src/components/resume/ExperienceSection.tsx
import { Experience } from "@/types/cv";

interface Props {
  heading: string;
  data: Experience[];
  templateStyles?: any;
  showHeading?: boolean;
}

export default function ExperienceSection({
  heading,
  data,
  templateStyles,
  showHeading = true,
}: Props) {
  // Handle undefined data gracefully
  if (!data || !Array.isArray(data)) {
    return null;
  }

  // Use template styles if available, otherwise fall back to default styling
  const styles = templateStyles || {
    colors: { primary: "#1e3a8a", text: "#111827", secondary: "#6b7280" },
    typography: { headingSize: 18, bodySize: 14 },
    spacing: { sectionGap: 24, margin: 16 },
  };

  return (
    <section style={{ marginBottom: `${styles.spacing.sectionGap}px` }}>
      {showHeading && (
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
      )}
      {data.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: `${styles.typography.bodySize}px`,
              fontWeight: "600",
              color: styles.colors.text,
              marginBottom: "4px",
            }}
          >
            {exp.position} - {exp.company}
          </h3>
          <p
            style={{
              fontSize: `${styles.typography.bodySize - 2}px`,
              color: styles.colors.secondary,
              marginBottom: "8px",
            }}
          >
            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            {exp.location && ` • ${exp.location}`}
          </p>
          {exp.description && (
            <div
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.text,
                lineHeight: 1.5,
              }}
              className="prose prose-sm max-w-none rich-text-content [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          )}
        </div>
      ))}
    </section>
  );
}
