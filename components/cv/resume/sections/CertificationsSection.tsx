// components/resume/sections/CertificationsSection.tsx
import { Certification } from "@/types/cv";

interface Props {
  heading: string;
  data: Certification[];
  templateStyles?: any;
}

export default function CertificationsSection({
  heading,
  data,
  templateStyles,
}: Props) {
  if (!data?.length) return null;

  // Use template styles if available, otherwise fall back to default styling
  const styles = templateStyles || {
    colors: { primary: "#1e3a8a", text: "#111827", secondary: "#6b7280" },
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
      {data.map((cert, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: `${styles.typography.bodySize}px`,
              color: styles.colors.text,
              marginBottom: "4px",
            }}
          >
            {cert.name}
          </p>
          <p
            style={{
              fontSize: `${styles.typography.bodySize - 2}px`,
              color: styles.colors.secondary,
              marginBottom: "2px",
            }}
          >
            {cert.issuer}
          </p>
          {cert.date && (
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.secondary,
              }}
            >
              {cert.date}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
