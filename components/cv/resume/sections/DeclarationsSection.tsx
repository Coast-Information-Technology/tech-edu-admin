// components/resume/sections/DeclarationsSection.tsx
import React from "react";
import { Declaration } from "@/types/cv";

interface Props {
  heading: string;
  data: Declaration[];
  templateStyles?: any;
}

const DeclarationsSection: React.FC<Props> = ({
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontSize: `${styles.typography.bodySize - 2}px`,
          color: styles.colors.text,
        }}
      >
        {data.map((decl, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <p
              style={{
                fontSize: `${styles.typography.bodySize - 2}px`,
                color: styles.colors.text,
                lineHeight: 1.5,
                marginBottom: "4px",
              }}
            >
              {decl.content}
            </p>
            {decl.signature && (
              <p
                style={{
                  fontSize: `${styles.typography.bodySize - 4}px`,
                  color: styles.colors.text,
                  marginTop: "4px",
                  marginBottom: "2px",
                }}
              >
                Signed: {decl.signature}
              </p>
            )}
            {decl.date && (
              <p
                style={{
                  fontSize: `${styles.typography.bodySize - 4}px`,
                  color: styles.colors.secondary,
                }}
              >
                Date: {decl.date}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default DeclarationsSection;
