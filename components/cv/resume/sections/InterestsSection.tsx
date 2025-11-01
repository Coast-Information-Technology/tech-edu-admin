// src/components/resume/InterestsSection.tsx
import React from "react";
import { Interest } from "@/types/cv";

interface Props {
  heading: string;
  data: Interest[];
  templateStyles?: any;
}

const InterestsSection: React.FC<Props> = ({
  heading,
  data,
  templateStyles,
}) => {
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
          borderBottom: `2px solid ${styles.colors.primary}`,
          marginBottom: `${styles.spacing.margin}px`,
          paddingBottom: "4px",
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
        {data.map((interest) => (
          <li key={interest.id} style={{ marginBottom: "4px" }}>
            <span style={{ fontWeight: "500" }}>{interest.name}</span>
            {interest.description && (
              <span style={{ color: styles.colors.secondary }}>
                {" "}
                – {interest.description}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default InterestsSection;
