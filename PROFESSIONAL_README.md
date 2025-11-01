# 🚀 CV Builder - Professional Resume Builder

A modern, feature-rich resume builder application built with Next.js, React, and TypeScript. Create professional resumes with live preview, PDF export, and AI-powered CV upload functionality.

![CV Builder Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=CV+Builder+Preview)

## ✨ Features

### 🎨 **Multiple Templates**

- **Two-Column Layout**: Professional sidebar design
- **Modern**: Clean and contemporary styling
- **Classic**: Traditional resume format
- **Minimal**: Simple and elegant design

### 📝 **Comprehensive Resume Sections**

- **Personal Information**: Contact details, social profiles, profile photo
- **Professional Summary**: Career objectives and summaries
- **Work Experience**: Detailed job history with rich text descriptions
- **Education**: Academic background and qualifications
- **Skills**: Technical and soft skills with proficiency levels
- **Languages**: Language skills with proficiency indicators
- **Certifications**: Professional credentials and licenses
- **Awards**: Achievements and recognition
- **Projects**: Portfolio and project showcases
- **Interests**: Hobbies and personal interests
- **Custom Sections**: Flexible additional sections

### 🔧 **Advanced Features**

- **Rich Text Editor**: Format text with bold, italic, lists, links
- **Drag & Drop Reordering**: Intuitive section management
- **Live Preview**: Real-time resume preview
- **PDF Export**: High-quality PDF generation
- **Responsive Design**: Works on all devices
- **Dark Mode**: Modern UI with dark/light themes

### 🤖 **AI-Powered CV Upload**

- **Upload & Revamp**: Upload existing CVs for automatic modernization
- **Smart Parsing**: AI extracts data from PDF, DOC, DOCX, TXT files
- **Auto-Population**: Automatically fills all resume sections
- **Confidence Scoring**: Shows parsing accuracy percentage
- **Firebase Storage**: Secure file handling with TTL restrictions

### 🌐 **API Integration**

- **CV Management**: Create, update, and manage CVs
- **Draft System**: Save and load resume drafts
- **Publishing**: Publish CVs for sharing
- **AI Features**: Experience analysis and suggestions

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Tiptap** - Rich text editor
- **@react-pdf/renderer** - PDF generation
- **@dnd-kit** - Drag and drop functionality

### Backend Integration

- **Firebase Storage** - File upload and management
- **REST API** - CV Builder API endpoints
- **Custom Hooks** - State management and API integration

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (for CV upload feature)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/cv-builder.git
   cd cv-builder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   ```env
   # Firebase Configuration (for CV upload)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 User Guide

### Getting Started

#### Option 1: Start from Scratch

1. Click **"Start from Scratch"** on the homepage
2. Select your preferred template
3. Begin filling out your information in the sidebar sections
4. Use the rich text editor for detailed descriptions
5. Preview your resume in real-time
6. Export as PDF when ready

#### Option 2: Upload & Revamp

1. Click **"Upload & Revamp"** on the homepage
2. Drag and drop your existing CV or click to browse
3. Wait for AI processing to extract your data
4. Review and edit the automatically populated information
5. Select a new template for your revamped resume
6. Make final adjustments and export

### Using the Builder

#### Navigation

- **Sidebar**: Select and reorder resume sections
- **Main Content**: Edit section details
- **Preview**: Real-time resume preview
- **Export**: Generate PDF download

#### Rich Text Editor

- **Formatting**: Bold, italic, underline text
- **Lists**: Create bulleted and numbered lists
- **Links**: Add hyperlinks to your content
- **Alignment**: Left, center, right align text

#### Section Management

- **Add Sections**: Click "+" to add new sections
- **Remove Sections**: Click trash icon to remove sections
- **Reorder**: Drag sections to reorder them
- **Navigation**: Use arrow buttons to navigate between sections

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── builder/                  # Main builder page
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── builder/                 # Builder-specific components
│   │   ├── modals/              # Modal components
│   │   ├── sections/            # Section editors
│   │   ├── BuilderLayout.tsx    # Main builder layout
│   │   ├── Sidebar.tsx          # Section navigation
│   │   └── SectionContent.tsx   # Section content router
│   ├── resume/                  # Resume rendering components
│   │   └── sections/            # Section renderers
│   ├── TwoColumnPreview.tsx     # Live preview component
│   ├── TwoColumnPdf.tsx         # PDF generation component
│   └── TemplateSelectorModal.tsx # Template selection
├── hooks/                       # Custom React hooks
│   ├── useCV.ts                # CV API integration
│   └── useAIFeatures.ts        # AI features
├── lib/                        # Utility libraries
│   ├── api/                    # API clients
│   │   └── cvApi.ts           # CV Builder API
│   ├── firebase/               # Firebase integration
│   │   ├── config.ts          # Firebase config
│   │   └── uploadService.ts   # File upload service
│   └── services/               # Business logic services
│       ├── cvParserService.ts  # CV parsing logic
│       └── cvUploadWorkflow.ts # Upload workflow
├── types/                      # TypeScript definitions
│   └── index.ts               # Type definitions
└── utils/                      # Utility functions
    ├── reactPdfHelper.tsx     # PDF generation helpers
    └── resumeSectionMapper.ts # Data mapping utilities
```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firebase Storage

2. **Configure Storage Rules**

   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /uploaded-cvs/{userId}/{fileName} {
         allow read, write: if request.auth != null || userId == 'anonymous';
       }
     }
   }
   ```

3. **Get Configuration**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Add web app and copy config values

### API Configuration

The application integrates with a CV Builder API. Set up your API endpoint:

```typescript
// src/lib/api/cvApi.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
```

## 📱 Responsive Design

The CV Builder is fully responsive and works seamlessly across:

- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with bottom navigation

## 🎨 Customization

### Adding New Templates

1. **Create Template Component**

   ```typescript
   // src/components/NewTemplate.tsx
   export default function NewTemplate({ data }: TemplateProps) {
     return (
       <div className="template-container">{/* Your template layout */}</div>
     );
   }
   ```

2. **Add to Template Selector**

   ```typescript
   // src/components/TemplateSelectorModal.tsx
   const templates = [
     { id: "new-template", name: "New Template", component: NewTemplate },
   ];
   ```

3. **Update Types**
   ```typescript
   // src/types/index.ts
   export type Template =
     | "two-column"
     | "modern"
     | "classic"
     | "minimal"
     | "new-template";
   ```

### Adding New Sections

1. **Create Section Interface**

   ```typescript
   // src/types/index.ts
   export interface NewSection {
     id: string;
     title: string;
     content: string;
   }
   ```

2. **Add to Section Renderers**

   ```typescript
   // src/components/resume/sections/SectionRenderers.tsx
   export const sectionRenderers = {
     "new-section": (section) => <NewSectionRenderer section={section} />,
   };
   ```

3. **Create Builder Component**
   ```typescript
   // src/components/builder/sections/NewSection.tsx
   export default function NewSection({ data, onUpdate }) {
     // Section editor UI
   }
   ```

## 🧪 Testing

### Manual Testing Checklist

#### Basic Functionality

- [ ] Create new resume from scratch
- [ ] Upload and parse existing CV
- [ ] Edit all section types
- [ ] Use rich text editor formatting
- [ ] Reorder sections with drag & drop
- [ ] Preview resume in real-time
- [ ] Export resume as PDF

#### File Upload

- [ ] Upload PDF files
- [ ] Upload DOC/DOCX files
- [ ] Upload TXT files
- [ ] Test file size limits (10MB)
- [ ] Test invalid file types
- [ ] Test drag & drop functionality
- [ ] Verify data extraction accuracy

#### Responsive Design

- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify navigation works on all sizes
- [ ] Check preview scaling

#### API Integration

- [ ] Save CV to backend
- [ ] Load existing CV
- [ ] Save drafts
- [ ] Publish CV
- [ ] Handle API errors gracefully

### Running Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Environment Variables**
   Add all environment variables in Vercel dashboard:
   - Firebase configuration
   - API endpoints

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open Pull Request**

### Development Guidelines

- **Code Style**: Use Prettier and ESLint
- **TypeScript**: Maintain strict type checking
- **Components**: Use functional components with hooks
- **Testing**: Add tests for new features
- **Documentation**: Update README for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Beautiful utility-first CSS
- **Tiptap** - Powerful rich text editor
- **React PDF** - Excellent PDF generation library
- **Firebase** - Robust backend services

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/yourusername/cv-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cv-builder/discussions)
- **Email**: support@cvbuilder.com

## 🗺️ Roadmap

### Version 2.0

- [ ] Advanced AI parsing with machine learning
- [ ] Multiple language support
- [ ] Resume analytics and insights
- [ ] Collaboration features
- [ ] Advanced template customization

### Version 2.1

- [ ] ATS optimization suggestions
- [ ] Industry-specific templates
- [ ] Cover letter builder
- [ ] Portfolio integration
- [ ] Social media integration

### Version 3.0

- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Enterprise features
- [ ] White-label solutions
- [ ] API marketplace

---

**Made with ❤️ by the CV Builder Team**

_Build professional resumes that get you noticed!_
