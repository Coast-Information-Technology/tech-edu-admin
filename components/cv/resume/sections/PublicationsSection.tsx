// src/components/resume/PublicationsSection.tsx
import { Publication } from "@/types/cv";

interface Props {
  heading: string;
  data: Publication[];
  templateStyles?: any;
}

export default function PublicationsSection({
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
      {data.map((pub) => (
        <div key={pub.id} style={{ marginBottom: "12px" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: `${styles.typography.bodySize}px`,
              color: styles.colors.text,
              marginBottom: "4px",
            }}
          >
            {pub.title}
          </p>
          {pub.authors && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.text,
                marginBottom: "2px",
              }}
            >
              {pub.authors}
            </p>
          )}
          {pub.journal && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                fontStyle: "italic",
                color: styles.colors.text,
                marginBottom: "2px",
              }}
            >
              {pub.journal}
            </p>
          )}
          {pub.publicationDate && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.secondary,
                marginBottom: "4px",
              }}
            >
              {pub.publicationDate}
            </p>
          )}
          {pub.url && (
            <a
              href={pub.url}
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
              {pub.url}
            </a>
          )}
          {pub.doi && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.secondary,
                marginBottom: "4px",
              }}
            >
              DOI: {pub.doi}
            </p>
          )}
          {pub.description && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.text,
                lineHeight: 1.5,
                marginTop: "4px",
              }}
            >
              {pub.description}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
