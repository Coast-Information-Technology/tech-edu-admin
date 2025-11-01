import React from "react";
import { Text, View } from "@react-pdf/renderer";

interface HtmlToPdfProps {
  html: string;
  styles?: any;
}

/**
 * Enhanced HTML to PDF converter component
 * Converts HTML tags to React PDF components with proper formatting
 */
export const HtmlToPdf: React.FC<HtmlToPdfProps> = ({ html, styles = {} }) => {
  if (!html) return null;

  // Enhanced HTML parser that handles common formatting
  const parseHtml = (htmlString: string) => {
    // First, handle lists
    if (htmlString.includes("<ul>") || htmlString.includes("<ol>")) {
      return parseList(htmlString);
    }

    // Handle paragraphs and basic formatting
    return parseParagraphs(htmlString);
  };

  const parseList = (htmlString: string) => {
    const listItems: React.ReactNode[] = [];

    // Extract list items
    const listMatch = htmlString.match(/<(ul|ol)[^>]*>([\s\S]*?)<\/(ul|ol)>/);
    if (listMatch) {
      const listType = listMatch[1].toLowerCase();
      const listContent = listMatch[2];
      const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/g);

      if (items) {
        items.forEach((item, index) => {
          const itemText = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/, "$1");
          const parsedItem = parseInlineFormatting(itemText);

          listItems.push(
            <Text
              key={`list-${index}`}
              style={{ marginBottom: 4, paddingLeft: 8 }}
            >
              {listType === "ol" ? `${index + 1}. ` : "• "}
              {parsedItem}
            </Text>
          );
        });
      }
    }

    return <View>{listItems}</View>;
  };

  const parseParagraphs = (htmlString: string) => {
    const paragraphs: React.ReactNode[] = [];

    // Handle content with or without paragraph tags
    if (htmlString.includes("<p>")) {
      // Split by paragraph tags
      const parts = htmlString.split(/<\/?p[^>]*>/);

      parts.forEach((part, index) => {
        if (part.trim()) {
          const parsedText = parseInlineFormatting(part);
          paragraphs.push(
            <Text key={`p-${index}`} style={{ marginBottom: 8, ...styles }}>
              {parsedText}
            </Text>
          );
        }
      });
    } else {
      // No paragraph tags, treat as single paragraph
      const parsedText = parseInlineFormatting(htmlString);
      paragraphs.push(
        <Text key="single-p" style={{ marginBottom: 8, ...styles }}>
          {parsedText}
        </Text>
      );
    }

    return paragraphs.length > 0 ? <View>{paragraphs}</View> : null;
  };

  const parseInlineFormatting = (text: string): React.ReactNode => {
    if (!text) return null;

    // First, remove any paragraph tags that might be nested
    let processedText = text.replace(/<\/?p[^>]*>/g, "");

    // Clean the text
    const cleanTextContent = cleanText(processedText);

    // Handle bold, italic, and other inline formatting
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Find all formatting tags
    const tagRegex = /<(strong|b|em|i|u)[^>]*>(.*?)<\/(strong|b|em|i|u)>/g;
    let match;

    while ((match = tagRegex.exec(processedText)) !== null) {
      // Add text before the tag
      if (match.index > currentIndex) {
        const beforeText = cleanText(
          processedText.slice(currentIndex, match.index)
        );
        if (beforeText) {
          parts.push(beforeText);
        }
      }

      // Add formatted text
      const tagName = match[1].toLowerCase();
      const content = match[2];
      const formattedText = parseInlineFormatting(content); // Recursive for nested tags

      let textStyle = {};
      if (tagName === "strong" || tagName === "b") {
        textStyle = { fontWeight: "bold" };
      } else if (tagName === "em" || tagName === "i") {
        textStyle = { fontStyle: "italic" };
      } else if (tagName === "u") {
        textStyle = { textDecoration: "underline" };
      }

      parts.push(
        <Text key={`${match.index}-${tagName}`} style={textStyle}>
          {formattedText}
        </Text>
      );

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < processedText.length) {
      const remainingText = cleanText(processedText.slice(currentIndex));
      if (remainingText) {
        parts.push(remainingText);
      }
    }

    // If no formatting found, return plain text
    if (parts.length === 0) {
      return cleanTextContent;
    }

    return parts;
  };

  const cleanText = (text: string) => {
    return text
      .replace(/<[^>]*>/g, "") // Remove any remaining HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  };

  const parsedContent = parseHtml(html);

  return parsedContent || <Text style={styles}>{cleanText(html)}</Text>;
};

export default HtmlToPdf;
