// src/components/resume/OrganizationsSection.tsx
import { Organization } from "@/types/cv";

interface Props {
  heading: string;
  data: Organization[];
  templateStyles?: any;
}

export default function OrganizationsSection({
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
      {data.map((org) => (
        <div key={org.id} style={{ marginBottom: "12px" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: `${styles.typography.bodySize}px`,
              color: styles.colors.text,
              marginBottom: "4px",
            }}
          >
            {org.name}
          </p>
          <p
            style={{
              fontSize: `${styles.typography.bodySize - 2}px`,
              fontStyle: "italic",
              color: styles.colors.text,
              marginBottom: "2px",
            }}
          >
            {org.role}
          </p>
          <p
            style={{
              fontSize: `${styles.typography.bodySize - 2}px`,
              color: styles.colors.secondary,
              marginBottom: "4px",
            }}
          >
            {org.startDate} – {org.current ? "Present" : org.endDate || ""}
          </p>
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.accent,
                textDecoration: "underline",
                marginBottom: "4px",
                display: "block",
              }}
            >
              {org.website}
            </a>
          )}
          {org.description && (
            <div
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.text,
                lineHeight: 1.5,
                marginTop: "4px",
              }}
              className="prose prose-sm max-w-none rich-text-content [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: org.description }}
            />
          )}
        </div>
      ))}
    </section>
  );
}
