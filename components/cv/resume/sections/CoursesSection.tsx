// components/resume/sections/CoursesSection.tsx
import { Course } from "@/types/cv";

interface Props {
  heading: string;
  data: Course[];
  templateStyles?: any;
}

export default function CoursesSection({
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
      {data.map((course) => (
        <div key={course.id} style={{ marginBottom: "8px" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: `${styles.typography.bodySize}px`,
              color: styles.colors.text,
              marginBottom: "4px",
            }}
          >
            {course.name}
          </p>
          {course.provider && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.secondary,
                marginBottom: "2px",
              }}
            >
              {course.provider}
            </p>
          )}
          {course.completionDate && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.secondary,
                marginBottom: "2px",
              }}
            >
              {course.completionDate}
            </p>
          )}
          {course.certificateUrl && (
            <a
              href={course.certificateUrl}
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.accent,
                textDecoration: "underline",
                marginBottom: "4px",
                display: "block",
              }}
            >
              Certificate
            </a>
          )}
          {course.description && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.text,
                lineHeight: 1.5,
              }}
            >
              {course.description}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
