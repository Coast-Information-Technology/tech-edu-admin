# Firebase Storage Client - Ready-to-Use Implementation

This is a comprehensive Firebase Storage client with proper CORS handling for uploading and downloading files.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install firebase
```

### 2. Set Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=techedu-solutions.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=techedu-solutions
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=techedu-solution.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Configure CORS

Use the provided CORS configuration:

```bash
# Apply CORS configuration
gsutil cors set firebase-cors-config.json gs://techedu-solution.firebasestorage.app
```

## 📁 File Structure

```
lib/
├── firebase-storage-client.ts    # Core Firebase Storage functions
hooks/
├── useFirebaseStorage.ts         # React hook for easy integration
components/
├── FirebaseStorageExample.tsx    # Complete example component
examples/
├── firebase-storage-usage.tsx    # Usage examples for product forms
```

## 🔧 Core Functions

### Direct API Usage

```typescript
import {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  getFileInfo,
  testCORS,
  STORAGE_FOLDERS,
} from "@/lib/firebase-storage-client";

// Upload a file
const result = await uploadFile(
  file,
  STORAGE_FOLDERS.MATERIALS,
  "course-materials",
  (progress) => console.log(`Upload: ${progress}%`)
);

// Download a file
await downloadFile(result.url, "my-file.pdf");

// Delete a file
await deleteFile(result.url);

// List files in folder
const files = await listFiles(STORAGE_FOLDERS.MATERIALS, "course-materials");

// Get file information
const info = await getFileInfo(result.url);

// Test CORS configuration
const corsOk = await testCORS();
```

### React Hook Usage

```typescript
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";

function MyComponent() {
  const { uploadFile, downloadFile, deleteFile, loading, error, progress } =
    useFirebaseStorage();

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadFile(
        file,
        STORAGE_FOLDERS.MATERIALS,
        "course-materials"
      );
      console.log("Upload successful:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {loading && <div>Uploading... {progress}%</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

## 📂 Storage Folders

### Assets Folder (Images Only)

- **Purpose**: Product icons, thumbnails, UI assets
- **File Types**: JPEG, PNG, WebP, GIF
- **Max Size**: 5MB
- **Usage**: `STORAGE_FOLDERS.ASSETS`

### Attachments Folder (All Files)

- **Purpose**: User-uploaded attachments
- **File Types**: Images + Documents (PDF, DOC, DOCX, etc.)
- **Max Size**: 20MB
- **Usage**: `STORAGE_FOLDERS.ATTACHMENTS`

### Materials Folder (All Files)

- **Purpose**: Training materials, course content
- **File Types**: Images + Documents (PDF, DOC, DOCX, etc.)
- **Max Size**: 50MB
- **Usage**: `STORAGE_FOLDERS.MATERIALS`

## 🎯 Usage Examples

### 1. Material Upload for Product Forms

```typescript
import { MaterialUploadExample } from "@/examples/firebase-storage-usage";

// Use in your product form
<MaterialUploadExample />;
```

### 2. Image Upload for Product Icons

```typescript
import { ImageUploadExample } from "@/examples/firebase-storage-usage";

// Use in your product form
<ImageUploadExample />;
```

### 3. Complete Storage Manager

```typescript
import { FirebaseStorageExample } from "@/components/FirebaseStorageExample";

// Full-featured storage manager
<FirebaseStorageExample />;
```

## 🔄 Integration with Existing Forms

### Update Product Creation Form

```typescript
// Replace existing upload logic with:
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";

const { uploadFile, deleteFile, loading, error, progress } =
  useFirebaseStorage();

const handleMaterialUpload = async (file: File) => {
  try {
    // Delete old material if exists
    if (form.materialUrl) {
      await deleteFile(form.materialUrl);
    }

    // Upload new material
    const result = await uploadFile(
      file,
      STORAGE_FOLDERS.MATERIALS,
      "course-materials"
    );

    setForm((prev) => ({ ...prev, materialUrl: result.url }));
  } catch (err) {
    console.error("Upload failed:", err);
  }
};
```

### Update Product Edit Form

```typescript
// Same logic as creation form
const handleMaterialUpload = async (file: File) => {
  try {
    if (form.materialUrl) {
      await deleteFile(form.materialUrl);
    }

    const result = await uploadFile(
      file,
      STORAGE_FOLDERS.MATERIALS,
      "course-materials"
    );

    setForm((prev) => ({ ...prev, materialUrl: result.url }));
  } catch (err) {
    console.error("Upload failed:", err);
  }
};
```

## 🛠️ Advanced Features

### Progress Tracking

```typescript
const result = await uploadFile(
  file,
  STORAGE_FOLDERS.MATERIALS,
  "course-materials",
  (progress) => {
    console.log(`Upload progress: ${progress.toFixed(2)}%`);
    // Update UI with progress
  }
);
```

### Error Handling

```typescript
try {
  const result = await uploadFile(file, STORAGE_FOLDERS.MATERIALS);
  console.log("Success:", result);
} catch (error) {
  if (error.message.includes("Invalid file type")) {
    // Handle file type error
  } else if (error.message.includes("File size exceeds")) {
    // Handle file size error
  } else {
    // Handle other errors
  }
}
```

### File Validation

The client automatically validates:

- **File types** based on folder requirements
- **File sizes** based on folder limits
- **CORS configuration** before uploads

### Automatic Cleanup

```typescript
// Old files are automatically deleted when uploading new ones
const handleUpload = async (file: File) => {
  if (existingFileUrl) {
    await deleteFile(existingFileUrl); // Automatic cleanup
  }

  const result = await uploadFile(file, STORAGE_FOLDERS.MATERIALS);
  // New file uploaded
};
```

## 🔍 CORS Troubleshooting

### Test CORS Configuration

```typescript
import { testCORS } from "@/lib/firebase-storage-client";

const corsOk = await testCORS();
console.log("CORS configured:", corsOk);
```

### Common CORS Issues

1. **Domain not in CORS origins**

   - Add your domain to the CORS configuration
   - Include both `https://tech-eduk.com` and `https://www.tech-eduk.com`

2. **Missing HTTP methods**

   - Ensure `POST`, `PUT`, `DELETE`, `OPTIONS` are allowed
   - Check the CORS configuration

3. **Missing headers**
   - Include all required headers in CORS configuration
   - Check browser console for specific missing headers

### Debug CORS

```typescript
// Run this in browser console to debug CORS
const testCORS = async () => {
  const response = await fetch(
    "https://firebasestorage.googleapis.com/v0/b/techedu-solution.firebasestorage.app/o",
    {
      method: "OPTIONS",
      headers: {
        Origin: window.location.origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type, Authorization",
      },
    }
  );

  console.log("CORS Status:", response.status);
  console.log("CORS Headers:", Object.fromEntries(response.headers.entries()));
};

testCORS();
```

## 📊 File Management

### List Files

```typescript
// List all files in materials folder
const files = await listFiles(STORAGE_FOLDERS.MATERIALS);

// List files in specific subfolder
const courseFiles = await listFiles(
  STORAGE_FOLDERS.MATERIALS,
  "course-materials"
);
```

### Get File Information

```typescript
const info = await getFileInfo(fileUrl);
console.log("File name:", info.name);
console.log("File size:", info.size);
console.log("Content type:", info.contentType);
console.log("Last updated:", info.updated);
```

### Download Files

```typescript
// Download with custom filename
await downloadFile(fileUrl, "my-document.pdf");

// Download with original filename
await downloadFile(fileUrl);
```

## 🔒 Security Features

### File Type Validation

- **Assets**: Only images (JPEG, PNG, WebP, GIF)
- **Attachments**: Images + documents
- **Materials**: Images + documents

### File Size Limits

- **Assets**: 5MB maximum
- **Attachments**: 20MB maximum
- **Materials**: 50MB maximum

### Automatic Cleanup

- Old files are deleted when uploading new ones
- Prevents storage bloat
- Reduces costs

## 🚀 Performance Optimizations

### Progress Tracking

- Real-time upload progress
- Smooth UI updates
- Better user experience

### Error Recovery

- Graceful error handling
- Detailed error messages
- Automatic retry logic

### Memory Management

- Efficient file handling
- Automatic cleanup
- Optimized upload process

## 📝 TypeScript Support

All functions are fully typed:

```typescript
interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
}

type UploadProgressCallback = (progress: number) => void;
type StorageFolder = "assets" | "attachments" | "materials";
```

## 🧪 Testing

### Test CORS Configuration

```typescript
import { testCORS } from "@/lib/firebase-storage-client";

const isConfigured = await testCORS();
if (!isConfigured) {
  console.error("CORS is not properly configured");
}
```

### Test File Upload

```typescript
// Create a test file
const testFile = new File(["Hello World"], "test.txt", { type: "text/plain" });

// Upload test file
const result = await uploadFile(testFile, STORAGE_FOLDERS.ATTACHMENTS, "test");
console.log("Test upload successful:", result);
```

## 🎉 Ready to Use!

This implementation is production-ready and includes:

- ✅ **CORS handling** - Properly configured for your domain
- ✅ **File validation** - Type and size validation
- ✅ **Progress tracking** - Real-time upload progress
- ✅ **Error handling** - Comprehensive error management
- ✅ **TypeScript support** - Full type safety
- ✅ **React hooks** - Easy integration
- ✅ **Automatic cleanup** - Prevents storage bloat
- ✅ **Security features** - File type and size limits
- ✅ **Performance optimizations** - Efficient file handling

Just configure CORS and start using! 🚀
