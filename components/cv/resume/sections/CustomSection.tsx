// src/components/resume/CustomSectionRenderer.tsx
import { CustomSection } from "@/types/cv";

interface Props {
  heading: string;
  data: CustomSection;
  templateStyles?: any;
}

export default function CustomSectionRenderer({
  heading,
  data,
  templateStyles,
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
      {/* Use heading from ResumeSection for consistency */}
      <h2
        style={{
          fontSize: `${styles.typography.headingSize}px`,
          fontWeight: "bold",
          color: styles.colors.primary,
          marginBottom: `${styles.spacing.margin}px`,
        }}
      >
        {heading || data.title}
      </h2>
      <div
        style={{
          fontSize: `${styles.typography.bodySize - 2}px`,
          color: styles.colors.text,
          lineHeight: 1.5,
        }}
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </section>
  );
}
