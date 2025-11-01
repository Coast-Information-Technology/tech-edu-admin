// components/resume/sections/ReferencesSection.tsx
import React from "react";
import { Reference } from "@/types/cv";

interface Props {
  heading: string;
  data: Reference[];
  templateStyles?: any;
}

const ReferencesSection: React.FC<Props> = ({
  heading,
  data,
  templateStyles,
}) => {
  if (!data.length) return null;

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
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontSize: `${styles.typography.bodySize - 2}px`,
          color: styles.colors.text,
        }}
      >
        {data.map((ref, i) => (
          <li key={i} style={{ marginBottom: "8px" }}>
            <p
              style={{
                fontWeight: "500",
                fontSize: `${styles.typography.bodySize}px`,
                color: styles.colors.text,
                marginBottom: "2px",
              }}
            >
              {ref.name}
            </p>
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 4}px`,
                color: styles.colors.secondary,
                marginBottom: "2px",
              }}
            >
              {ref.title} @ {ref.company}
            </p>
            {ref.email && (
              <p
                style={{
                  fontSize: `${styles.typography.bodySize - 4}px`,
                  color: styles.colors.text,
                  marginBottom: "2px",
                }}
              >
                {ref.email}
              </p>
            )}
            {ref.phone && (
              <p
                style={{
                  fontSize: `${styles.typography.bodySize - 4}px`,
                  color: styles.colors.text,
                  marginBottom: "2px",
                }}
              >
                {ref.phone}
              </p>
            )}
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 4}px`,
                color: styles.colors.secondary,
              }}
            >
              Relationship: {ref.relationship}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReferencesSection;
