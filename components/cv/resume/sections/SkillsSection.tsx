// src/components/resume/SkillsSection.tsx
import { Skill } from "@/types/cv";

interface Props {
  heading: string;
  data: Skill[];
  templateStyles?: any;
}

export default function SkillsSection({
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {data.map((skill, i) => (
          <span
            key={i}
            style={{
              backgroundColor: styles.colors.primary,
              color: "#ffffff",
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: `${styles.typography.bodySize - 2}px`,
              fontWeight: "500",
              display: "inline-block",
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
}
