// src/components/resume/PersonalInfoSection.tsx
import { PersonalInfo } from "@/types/cv";

interface Props {
  heading: string;
  data: PersonalInfo;
  templateStyles?: any;
}

export default function PersonalInfoSection({
  heading,
  data,
  templateStyles,
}: Props) {
  // Use template styles if available, otherwise fall back to default styling
  const styles = templateStyles || {
    colors: { primary: "#1e3a8a", text: "#111827", background: "#ffffff" },
    typography: { headingSize: 18, bodySize: 14 },
    spacing: { sectionGap: 24, margin: 16 },
  };

  // Handle undefined data gracefully
  if (!data) {
    return (
      <section style={{ marginBottom: `${styles.spacing.sectionGap}px` }}>
        <div style={{ textAlign: "center", color: styles.colors.text }}>
          <p>No personal information available</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: `${styles.spacing.sectionGap}px` }}>
      {data.image && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <img
            src={data.image}
            alt="Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
            }}
          />
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: `${styles.typography.headingSize + 8}px`,
            fontWeight: "bold",
            color: styles.colors.text,
            marginBottom: "8px",
          }}
        >
          {data.firstName} {data.lastName}
        </h1>
        {data.targetedJobTitle && (
          <p
            style={{
              fontSize: `${styles.typography.bodySize}px`,
              fontWeight: "600",
              color: styles.colors.primary,
              marginBottom: "16px",
            }}
          >
            {data.targetedJobTitle}
          </p>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: `${styles.typography.bodySize - 2}px`,
          }}
        >
          {data.email && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>✉️</span>
              <span>{data.email}</span>
            </p>
          )}
          {data.phone && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>📞</span>
              <span>{data.phone}</span>
            </p>
          )}
          {data.location && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>📍</span>
              <span>{data.location}</span>
            </p>
          )}
          {data.linkedin && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>💼</span>
              <span>{data.linkedin}</span>
            </p>
          )}
          {data.github && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>💻</span>
              <span>{data.github}</span>
            </p>
          )}
          {data.website && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>🌐</span>
              <span>{data.website}</span>
            </p>
          )}
          {data.twitter && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>🐦</span>
              <span>{data.twitter}</span>
            </p>
          )}
          {data.instagram && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>📸</span>
              <span>{data.instagram}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
