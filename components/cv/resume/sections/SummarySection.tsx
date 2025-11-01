// src/components/resume/SummarySection.tsx
import { ProfessionalSummary } from "@/types/cv";

interface Props {
  heading: string;
  data: ProfessionalSummary;
  templateStyles?: any;
  showHeading?: boolean;
}

export default function SummarySection({
  heading,
  data,
  templateStyles,
  showHeading = true,
}: Props) {
  if (!data) return null;

  // Use template styles if available, otherwise fall back to default styling
  const styles = templateStyles || {
    colors: { primary: "#1e3a8a", text: "#111827" },
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
      <div
        style={{
          fontSize: `${styles.typography.bodySize}px`,
          color: styles.colors.text,
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{ __html: data.summary }}
      />
    </section>
  );
}
