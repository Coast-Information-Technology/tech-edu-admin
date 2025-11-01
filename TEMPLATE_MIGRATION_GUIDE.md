# 🔄 Template Migration Guide - From Hardcoded to Dynamic

## 🎯 **Migration Overview**

This guide shows how to migrate from the old hardcoded template system to the new dynamic template system while maintaining backward compatibility.

## 📊 **Current Status**

### **✅ Migrated Templates**

- **`two-column`** - Fully migrated with dynamic configuration
- **`modern`** - New dynamic-only template

### **🚧 Partially Migrated**

- **`classic`** - Template defined, needs implementation
- **`minimal`** - Template defined, needs implementation

### **📋 Pending Migration**

- **`three-column`** - AI-generated template, not implemented
- **`photo-friendly`** - Layout optimized for photos

## 🔧 **Migration Components**

### **1. TemplateRenderer (Universal Bridge)**

```typescript
// src/components/dynamic/TemplateRenderer.tsx
<TemplateRenderer
  data={resumeData}
  templateId="two-column"
  mode="preview" // or "pdf"
/>
```

**Features:**

- ✅ Automatically routes to dynamic or legacy components
- ✅ Backward compatibility with existing templates
- ✅ Type-safe template selection
- ✅ Mode switching (preview/PDF)

### **2. Enhanced Preview Modal**

```typescript
// src/components/builder/modals/EnhancedPreviewModal.tsx
<EnhancedPreviewModal
  isOpen={showPreview}
  onClose={() => setShowPreview(false)}
  template={selectedTemplate}
  // ... all resume data props
/>
```

**Features:**

- ✅ Template configuration button (dynamic templates only)
- ✅ Preview/PDF mode toggle
- ✅ Template status indicators
- ✅ Backward compatibility

### **3. Template Configuration Modal**

```typescript
// src/components/builder/TemplateConfigModal.tsx
<TemplateConfigModal
  isOpen={showConfig}
  templateId="two-column"
  onSave={handleTemplateSave}
/>
```

**Features:**

- ✅ Visual template editor
- ✅ Layout customization
- ✅ Styling controls
- ✅ Section placement

## 🚀 **How to Use the New System**

### **Step 1: Update Imports**

```typescript
// OLD
import TwoColumnPreview from "@/components/TwoColumnPreview";
import TwoColumnPdf from "@/components/TwoColumnPdf";

// NEW
import TemplateRenderer from "@/components/dynamic/TemplateRenderer";
import EnhancedPreviewModal from "@/components/builder/modals/EnhancedPreviewModal";
```

### **Step 2: Replace Component Usage**

```typescript
// OLD - Hardcoded components
<TwoColumnPreview data={resumeData} />
<TwoColumnPdf data={resumeData} />

// NEW - Dynamic template system
<TemplateRenderer
  data={resumeData}
  templateId="two-column"
  mode="preview"
/>
<TemplateRenderer
  data={resumeData}
  templateId="two-column"
  mode="pdf"
/>
```

### **Step 3: Update PDF Export**

```typescript
// OLD
const blob = await pdf(<TwoColumnPdf data={resumeData} />).toBlob();

// NEW
const blob = await pdf(
  <TemplateRenderer
    data={resumeData}
    templateId={selectedTemplate}
    mode="pdf"
  />
).toBlob();
```

### **Step 4: Update Preview Modal**

```typescript
// OLD
<PreviewModal
  isOpen={showPreview}
  onClose={() => setShowPreview(false)}
  template={selectedTemplate}
  // ... props
/>

// NEW
<EnhancedPreviewModal
  isOpen={showPreview}
  onClose={() => setShowPreview(false)}
  template={selectedTemplate}
  // ... props (same interface, enhanced features)
/>
```

## 🔍 **Migration Detection**

### **Check Template Status**

```typescript
import { useTemplateRenderer } from "@/components/dynamic/TemplateRenderer";

const { isDynamic, supportsCustomization } = useTemplateRenderer("two-column");

if (isDynamic) {
  console.log("Template uses dynamic system");
}

if (supportsCustomization) {
  console.log("Template supports configuration");
}
```

### **Get Migration Status**

```typescript
import { getMigrationStatus } from "@/utils/templateMigration";

const statuses = getMigrationStatus();
const twoColumnStatus = statuses.find((s) => s.templateId === "two-column");

console.log("Migration status:", twoColumnStatus);
// Output: { isMigrated: true, hasDynamicVersion: true, ... }
```

## 🎨 **Template Configuration**

### **Access Template Configuration**

```typescript
import { templateManager } from "@/lib/templates/templateManager";

// Get template
const template = templateManager.getTemplate("two-column");

// Get section configs
const sectionConfigs = templateManager.getSectionConfigs();

// Create custom template
const customTemplate = templateManager.createTemplate({
  name: "My Custom Template",
  columns: [
    /* ... */
  ],
  styles: {
    /* ... */
  },
  metadata: {
    /* ... */
  },
});
```

### **Template Customization UI**

```typescript
import TemplateConfigModal from "@/components/builder/TemplateConfigModal";

const [showConfig, setShowConfig] = useState(false);

<TemplateConfigModal
  isOpen={showConfig}
  onClose={() => setShowConfig(false)}
  templateId="two-column"
  onSave={(updatedTemplate) => {
    console.log("Template updated:", updatedTemplate);
    // Save to user preferences or backend
  }}
/>;
```

## 🔄 **Backward Compatibility**

### **Legacy Template Support**

The system automatically detects and routes legacy templates:

```typescript
// These will use legacy components automatically
<TemplateRenderer data={data} templateId="legacy-template" mode="preview" />
<TemplateRenderer data={data} templateId="old-template" mode="pdf" />
```

### **Gradual Migration**

You can migrate templates one by one:

1. **Phase 1**: Update imports and use `TemplateRenderer`
2. **Phase 2**: Migrate templates to dynamic system
3. **Phase 3**: Remove legacy components (optional)

## 📈 **Benefits After Migration**

### **For Developers**

- ✅ No more hardcoded layouts
- ✅ Easy template creation
- ✅ Type-safe template system
- ✅ Modular architecture

### **For Users**

- ✅ Template customization UI
- ✅ Real-time preview changes
- ✅ More template options
- ✅ Better user experience

### **For Business**

- ✅ Scalable template system
- ✅ Easy white-label customization
- ✅ Template marketplace potential
- ✅ Reduced maintenance overhead

## 🚨 **Migration Checklist**

### **Before Migration**

- [ ] Backup current templates
- [ ] Test existing functionality
- [ ] Document current template usage

### **During Migration**

- [ ] Update imports to use `TemplateRenderer`
- [ ] Replace hardcoded components
- [ ] Test template rendering
- [ ] Verify PDF export functionality

### **After Migration**

- [ ] Test all template types
- [ ] Verify backward compatibility
- [ ] Update documentation
- [ ] Train team on new system

## 🔧 **Troubleshooting**

### **Template Not Found**

```typescript
// Check if template exists
const template = templateManager.getTemplate("my-template");
if (!template) {
  console.warn("Template not found, falling back to legacy");
}
```

### **Section Not Rendering**

```typescript
// Check section configuration
const sectionConfig = templateManager.getSectionConfig("my-section");
if (!sectionConfig) {
  console.warn("Section configuration not found");
}
```

### **Styling Issues**

```typescript
// Validate template compatibility
const validation = validateTemplateCompatibility("two-column", resumeData);
if (!validation.isCompatible) {
  console.warn("Template compatibility issues:", validation.warnings);
}
```

## 🎯 **Next Steps**

### **Immediate (Phase 1)**

1. ✅ Replace `TwoColumnPreview` with `TemplateRenderer`
2. ✅ Replace `TwoColumnPdf` with `TemplateRenderer`
3. ✅ Update `PreviewModal` to `EnhancedPreviewModal`

### **Short Term (Phase 2)**

1. 🔄 Complete `classic` and `minimal` template implementations
2. 🔄 Add more section renderers
3. 🔄 Implement template configuration persistence

### **Long Term (Phase 3)**

1. 📋 Template marketplace
2. 📋 AI-powered template suggestions
3. 📋 Industry-specific templates
4. 📋 A/B testing for templates

---

**The migration is designed to be seamless - existing functionality continues to work while new features become available!** 🚀✨
