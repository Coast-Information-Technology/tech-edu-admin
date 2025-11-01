# CV Builder Integration Guide

## 🎯 **Overview**

The CV Builder now integrates real API endpoints with existing components, providing a complete production-ready system instead of separate example components.

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components    │    │   API Endpoints  │    │   Renderers     │
│                 │    │                  │    │                 │
│ • Forms         │◄──►│ • Data Storage   │◄──►│ • HTML Preview  │
│ • Input Fields  │    │ • Validation     │    │ • PDF Export    │
│ • User Interface│    │ • Business Logic │    │ • Templates     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 **Integration Points**

### **1. Real Components + Real APIs**

Instead of creating separate example components, we integrated the API endpoints directly into the existing CV builder:

- **`CVBuilderMain`**: Main builder component (unchanged)
- **`useCVBuilder`**: Enhanced with real API integration
- **`useCV`**: Updated to use new API endpoints
- **`useAutoSave`**: Integrated with API for real-time saving

### **2. API Endpoints**

| Endpoint                        | Method | Purpose                   |
| ------------------------------- | ------ | ------------------------- |
| `/api/cv`                       | POST   | Create new CV             |
| `/api/cv`                       | GET    | List all CVs              |
| `/api/cv/[id]`                  | GET    | Get specific CV           |
| `/api/cv/[id]`                  | PATCH  | Update CV                 |
| `/api/cv/[id]`                  | DELETE | Delete CV                 |
| `/api/cv/drafts`                | POST   | Create/update draft       |
| `/api/cv/drafts`                | GET    | List drafts               |
| `/api/cv/drafts/[id]`           | GET    | Get specific draft        |
| `/api/cv/drafts/[id]`           | PUT    | Update draft              |
| `/api/cv/drafts/[id]`           | DELETE | Delete draft              |
| `/api/cv/[id]/sections/toggle`  | PATCH  | Toggle section visibility |
| `/api/cv/[id]/sections/reorder` | PATCH  | Reorder sections          |

### **3. Service Layer**

**`services/cvService.ts`**: Centralized API client

```typescript
// Create CV
await cvService.createCV({
  title: "My CV",
  sections: [...],
  consent: { aiProcessing: false, aiTraining: false }
});

// Auto-save draft
await cvService.createOrUpdateDraft({
  id: "draft-123",
  title: "My CV Draft",
  sections: [...]
});

// Toggle section visibility
await cvService.toggleSectionVisibility("cv-123", "section-1", false);

// Reorder sections
await cvService.reorderSections("cv-123", ["section-2", "section-1", "section-3"]);
```

## 🚀 **How It Works**

### **1. User Input Flow**

```
User fills form → Component updates state → Auto-save triggers → API saves draft
```

### **2. Data Persistence**

- **Local Storage**: Immediate persistence for offline work
- **API Drafts**: Real-time cloud backup
- **Final CVs**: Published versions for sharing

### **3. Real-time Features**

- **Auto-save**: Every 2 seconds after user stops typing
- **Draft Management**: Automatic draft creation and updates
- **Section Management**: Toggle visibility and reorder sections
- **Template Integration**: All existing templates work with APIs

## 📱 **Usage Examples**

### **1. Basic CV Creation**

```typescript
// Visit /cv-builder-integrated
// Fill in personal information
// Add work experience, education, skills
// CV auto-saves as draft every 2 seconds
// Click "Save CV" to create final version
```

### **2. Section Management**

```typescript
// Toggle section visibility
await cvService.toggleSectionVisibility("cv-123", "awards", false);

// Reorder sections
await cvService.reorderSections("cv-123", [
  "personal-info",
  "work-experience",
  "education",
  "skills",
]);
```

### **3. Template Integration**

```typescript
// All existing templates work with APIs:
// - Modern Template
// - Classic Template
// - Two Column Template
// - Minimal Template

// Template selection automatically configures:
// - Section layout
// - Visual styling
// - PDF export format
```

## 🎨 **Existing Components (Still Essential)**

### **Form Components**

- **`PersonalInfoSection`**: Name, email, phone, location
- **`WorkExperienceSection`**: Job history with descriptions
- **`EducationSection`**: Degrees and institutions
- **`SkillsSection`**: Technical and soft skills
- **`LanguagesSection`**: Language proficiency

### **Renderers**

- **`ModernTemplateHtmlRenderer`**: HTML preview
- **`ModernTemplatePdfRenderer`**: PDF export
- **`TwoColumnTemplateHtmlRenderer`**: Two-column layout
- **`ClassicTemplateHtmlRenderer`**: Traditional format
- **`MinimalTemplatePdfRenderer`**: Clean, minimal design

### **Builder Components**

- **`DynamicSectionContent`**: Section management
- **`SectionArrangement`**: Drag-and-drop reordering
- **`TemplateSelectorModal`**: Template selection
- **`LoadCVModal`**: CV loading interface

## 🔄 **Data Flow**

### **1. Input → Storage**

```
User Input → Component State → useCVBuilder → useAutoSave → cvService → API
```

### **2. Loading → Display**

```
API → cvService → useCV → Component State → Renderers → User Interface
```

### **3. Real-time Updates**

```
User Action → State Change → Auto-save → API Update → Success Feedback
```

## 🛠️ **Configuration**

### **Auto-save Settings**

```typescript
const autoSaveConfig = {
  enabled: true,
  delay: 2000, // 2 seconds after user stops typing
  interval: 30000, // Maximum 30 seconds between saves
};
```

### **API Configuration**

```typescript
// All API calls go through cvService
// Automatic error handling and retry logic
// Success/error feedback to users
```

## 📊 **Benefits of Integration**

### **1. Single Source of Truth**

- No duplicate components
- Consistent data flow
- Unified user experience

### **2. Production Ready**

- Real API endpoints
- Error handling
- Loading states
- Success feedback

### **3. Scalable Architecture**

- Service layer abstraction
- Easy to add new features
- Maintainable codebase

### **4. User Experience**

- Auto-save prevents data loss
- Real-time feedback
- Seamless template switching
- Professional output

## 🎯 **Next Steps**

1. **Visit `/cv-builder-integrated`** to see the integrated system
2. **Test auto-save** by filling in forms and waiting 2 seconds
3. **Try section management** by toggling visibility and reordering
4. **Export to PDF** to see the final output
5. **Switch templates** to see different layouts

## 🔧 **Development**

### **Adding New Features**

1. Add API endpoint in `/app/api/cv/`
2. Add service method in `services/cvService.ts`
3. Integrate with existing components
4. Update hooks if needed

### **Customizing Templates**

1. Modify template renderers
2. Update template configuration
3. Test with real data
4. Ensure API compatibility

The system now provides a complete, production-ready CV building experience with real data persistence, auto-save, and professional output! 🚀
