// src/components/resume/LanguagesSection.tsx
import { Language } from "@/types/cv";

interface Props {
  heading: string;
  data: Language[];
  templateStyles?: any;
}

export default function LanguagesSection({
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
      <ul
        style={{
          listStyleType: "disc",
          listStylePosition: "inside",
          fontSize: `${styles.typography.bodySize - 2}px`,
          color: styles.colors.text,
          lineHeight: 1.5,
          paddingLeft: "0",
        }}
      >
        {data.map((lang, i) => (
          <li key={i} style={{ marginBottom: "4px" }}>
            {lang.name}{" "}
            {lang.level && (
              <span style={{ color: styles.colors.secondary }}>
                - {lang.level}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
