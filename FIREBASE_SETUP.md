# Firebase Storage Setup

This document explains how to set up Firebase Storage for the TechEdu Solution Admin application.

## Prerequisites

1. A Firebase project with Storage enabled
2. Firebase Storage bucket: `gs://techedu-solution.firebasestorage.app`

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=techedu-solution.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=techedu-solution
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=techedu-solution.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Storage Folders Structure

The Firebase Storage is organized into three main folders:

```
gs://techedu-solution.firebasestorage.app/
├── assets/          # Images (icons, thumbnails, profile pictures)
├── attachments/     # User-uploaded attachments
└── materials/       # Training materials and course content
```

### Folder Usage:

- **assets/**: Images only (JPEG, PNG, WebP, GIF)

  - Product icons
  - Thumbnails
  - Profile pictures
  - UI assets

- **attachments/**: User-uploaded files

  - Student submissions
  - Assignment files
  - User documents
  - Any file type supported

- **materials/**: Training materials
  - Course content
  - Training documents
  - Educational resources
  - PDFs, presentations, etc.

## Installation

1. Install Firebase SDK:

```bash
npm install firebase
```

2. Add environment variables to `.env.local`

3. The Firebase Storage utility is ready to use!

## Usage Examples

### Upload Image to Assets

```typescript
import { uploadAssetImage } from "@/lib/firebase";

const handleImageUpload = async (file: File) => {
  try {
    const downloadURL = await uploadAssetImage(file, "product-icons");
    console.log("Image uploaded:", downloadURL);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Upload Training Material

```typescript
import { uploadMaterial } from "@/lib/firebase";

const handleMaterialUpload = async (file: File) => {
  try {
    const downloadURL = await uploadMaterial(file, "course-materials");
    console.log("Material uploaded:", downloadURL);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Upload User Attachment

```typescript
import { uploadAttachment } from "@/lib/firebase";

const handleAttachmentUpload = async (file: File) => {
  try {
    const downloadURL = await uploadAttachment(file, "booking-attachments");
    console.log("Attachment uploaded:", downloadURL);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Delete File

```typescript
import { deleteFileFromFirebase } from "@/lib/firebase";

const handleDeleteFile = async (downloadURL: string) => {
  try {
    await deleteFileFromFirebase(downloadURL);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
```

## File Type Validation

### Assets Folder (Images Only)

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- Max size: 5MB

### Attachments & Materials Folders

- All image types (JPEG, PNG, WebP, GIF)
- PDF documents (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft PowerPoint (.ppt, .pptx)
- Microsoft Excel (.xls, .xlsx)
- Text files (.txt)
- CSV files (.csv)
- Archives (.zip, .rar)
- Max size: 20MB (attachments), 50MB (materials)

## Security Rules

Make sure your Firebase Storage security rules are properly configured:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }

    // Allow write access only to authenticated users
    match /{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## Migration from Cloudinary

To migrate from Cloudinary to Firebase Storage:

1. Update all imports from `@/lib/cloudinary` to `@/lib/firebase-storage`
2. Replace `uploadImageToCloudinary` with `uploadImageToFirebase`
3. Update any custom upload functions to use the new Firebase functions
4. Test file uploads in all areas of the application

## Troubleshooting

### Common Issues:

1. **CORS Error**: Make sure your Firebase project has proper CORS configuration
2. **Permission Denied**: Check Firebase Storage security rules
3. **File Too Large**: Verify file size limits in the upload functions
4. **Invalid File Type**: Check the file type validation logic

### Debug Mode:

Enable debug logging by adding this to your environment:

```env
NEXT_PUBLIC_FIREBASE_DEBUG=true
```

## Support

For issues related to Firebase Storage integration, check:

1. Firebase Console for upload errors
2. Browser Network tab for failed requests
3. Console logs for detailed error messages
