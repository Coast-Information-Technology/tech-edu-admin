import { View, Text } from "@react-pdf/renderer";

interface BulletListProps {
  items: string[];
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  level?: number; // nesting level
  bulletChar?: string; // customizable bullet character
}

export function BulletList({
  items,
  fontSize = 10,
  color = "#000",
  fontFamily = "Helvetica",
  level = 0,
  bulletChar = "•",
}: BulletListProps) {
  return (
    <View style={{ marginLeft: level * 12, marginTop: 2 }}>
      {items.map((item, i) => {
        // Support splitting by paragraphs if bullet contains <p>
        const paragraphs = item
          .split(/<\/p>\s*<p[^>]*>/i)
          .map((p) => p.replace(/<p[^>]*>|<\/p>/gi, "").trim())
          .filter((p) => p.length > 0);

        return paragraphs.map((paragraph, j) => (
          <Text
            key={`${i}-${j}`}
            style={{
              fontSize,
              color,
              fontFamily,
              marginBottom: 2,
              marginLeft: 12, // Indent for bullet
            }}
          >
            {bulletChar} {paragraph.replace(/<[^>]*>/g, "")}
          </Text>
        ));
      })}
    </View>
  );
}
