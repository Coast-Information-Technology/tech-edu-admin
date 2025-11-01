# PDF Size Consistency Guide

## The Problem

PDFs appear much larger than web previews even when using the same CSS properties and values. This happens due to several fundamental differences:

### 1. **Page Size Differences**

- **Web Preview**: Renders at actual CSS pixel size (e.g., 800px width)
- **PDF**: Uses A4 page size (595 × 842 points) by default
- **Result**: PDF appears ~25% larger than web preview

### 2. **Unit Conversion Issues**

- **Web**: Uses CSS pixels (1px = 1/96 inch)
- **PDF**: Uses points (1pt = 1/72 inch)
- **Conversion**: 1px ≈ 0.75pt, so PDF elements appear larger

### 3. **Font Rendering Differences**

- **Web**: Uses system fonts with subpixel rendering
- **PDF**: Uses embedded fonts with different metrics
- **Result**: Text appears larger and bolder in PDF

### 4. **Default Padding/Margins**

- **Web**: Browser default margins (~8px)
- **PDF**: React PDF adds default padding (32pt = ~43px)
- **Result**: More white space in PDF

## Solutions Applied

### 1. **Reduced Font Sizes**

```typescript
// Before
fontSize: 24, // Too large for PDF

// After
fontSize: 18, // Scaled down to match web preview
```

### 2. **Reduced Padding/Margins**

```typescript
// Before
padding: 32, // 32pt = ~43px

// After
padding: 20, // 20pt = ~27px, closer to web
```

### 3. **Smaller Profile Images**

```typescript
// Before
width: 90, height: 90

// After
width: 60, height: 60 // Better proportion
```

### 4. **Tighter Line Heights**

```typescript
// Before
lineHeight: 1.5;

// After
lineHeight: 1.4; // More compact
```

## Best Practices for PDF Consistency

### 1. **Use Smaller Base Font Sizes**

- Web: 12px → PDF: 10pt
- Web: 16px → PDF: 12pt
- Web: 24px → PDF: 18pt

### 2. **Reduce Padding by ~30%**

- Web: 32px → PDF: 20pt
- Web: 16px → PDF: 12pt

### 3. **Scale Images Appropriately**

- Profile images: 60-80pt max
- Icons: 12-16pt max

### 4. **Use Consistent Line Heights**

- Headers: 1.2-1.3
- Body text: 1.4-1.5
- Lists: 1.3-1.4

## Technical Implementation

### Scaling Utility Functions

```typescript
// utils/pdfScaling.ts
export const PDF_SCALE_FACTOR = 0.75; // Scale down by 25%

export function scaleToPDF(cssPixels: number): number {
  return cssPixels * PDF_SCALE_FACTOR;
}
```

### Consistent Font Sizes

```typescript
const styles = StyleSheet.create({
  page: {
    fontSize: 10, // Base font size
    lineHeight: 1.4,
  },
  name: {
    fontSize: 18, // Scaled from 24px
  },
  title: {
    fontSize: 12, // Scaled from 16px
  },
});
```

## Results

After applying these changes:

- ✅ PDF size matches web preview more closely
- ✅ Text appears at similar sizes
- ✅ Layout proportions are consistent
- ✅ Better user experience

## Future Improvements

1. **Dynamic Scaling**: Calculate scale factor based on actual web preview width
2. **Template-Specific Scaling**: Different scales for different templates
3. **User Preferences**: Allow users to adjust PDF scale
4. **Print Optimization**: Separate scaling for print vs. screen

## Testing

To verify consistency:

1. Open web preview in browser
2. Generate PDF
3. Compare side-by-side
4. Adjust scaling factors as needed

The goal is to achieve true WYSIWYG (What You See Is What You Get) consistency between web preview and PDF output.
