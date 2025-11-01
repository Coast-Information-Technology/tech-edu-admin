# Cloudinary to Firebase Storage Migration Guide

This guide helps you migrate from Cloudinary to Firebase Storage in the TechEdu Solution Admin application.

## Overview

We're migrating from Cloudinary to Firebase Storage to:

- Reduce costs
- Have better control over file organization
- Use a more integrated solution with our Firebase backend
- Organize files into specific folders (assets, attachments, materials)

## File Organization

### Firebase Storage Structure

```
gs://techedu-solution.firebasestorage.app/
├── assets/          # Images (icons, thumbnails, profile pictures)
├── attachments/     # User-uploaded attachments
└── materials/       # Training materials and course content
```

### Cloudinary vs Firebase Functions

| Cloudinary Function         | Firebase Function    | Folder       | Purpose            |
| --------------------------- | -------------------- | ------------ | ------------------ |
| `uploadImageToCloudinary()` | `uploadAssetImage()` | assets/      | Images only        |
| N/A                         | `uploadAttachment()` | attachments/ | User attachments   |
| N/A                         | `uploadMaterial()`   | materials/   | Training materials |

## Migration Steps

### 1. Install Firebase SDK

```bash
npm install firebase
```

### 2. Add Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=techedu-solution.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=techedu-solution
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=techedu-solution.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Update Imports

**Before:**

```typescript
import { uploadImageToCloudinary } from "@/lib/cloudinary";
```

**After:**

```typescript
import { uploadAssetImage, uploadMaterial } from "@/lib/firebase";
```

### 4. Update Upload Functions

#### For Images (Icons, Thumbnails, Profile Pictures)

**Before:**

```typescript
const url = await uploadImageToCloudinary(file);
```

**After:**

```typescript
const url = await uploadAssetImage(file, "product-icons");
```

#### For Training Materials

**Before:**

```typescript
const url = await uploadImageToCloudinary(file);
```

**After:**

```typescript
const url = await uploadMaterial(file, "course-materials");
```

#### For User Attachments

**Before:**

```typescript
const url = await uploadImageToCloudinary(file);
```

**After:**

```typescript
const url = await uploadAttachment(file, "booking-attachments");
```

### 5. Files Already Updated

The following files have been updated to use Firebase Storage:

- ✅ `app/dashboard/products/new/page.tsx` - Product creation form
- ✅ `app/dashboard/products/[id]/edit/page.tsx` - Product edit form
- ✅ `lib/firebase-storage.ts` - New Firebase Storage utility

### 6. Files That May Need Updates

Search for these patterns and update them:

```bash
# Find all Cloudinary imports
grep -r "from.*cloudinary" app/ components/ lib/

# Find all Cloudinary function calls
grep -r "uploadImageToCloudinary" app/ components/ lib/
```

### 7. Update File Type Validation

Firebase Storage has different file type restrictions:

#### Assets Folder (Images Only)

- JPEG, PNG, WebP, GIF
- Max size: 5MB

#### Attachments Folder

- All image types + documents
- PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP, RAR, XLSX, CSV
- Max size: 20MB

#### Materials Folder

- All image types + documents
- PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP, RAR, XLSX, CSV
- Max size: 50MB

## Testing the Migration

### 1. Test Image Uploads

- Product icons
- Thumbnails
- Profile pictures

### 2. Test Material Uploads

- Training materials
- Course content
- Educational resources

### 3. Test Attachment Uploads

- User submissions
- Assignment files
- Documents

### 4. Verify File Organization

- Check Firebase Console
- Ensure files are in correct folders
- Verify download URLs work

## Rollback Plan

If you need to rollback to Cloudinary:

1. Revert the import changes
2. Change function calls back to Cloudinary
3. Remove Firebase environment variables
4. Test all upload functionality

## Benefits of Migration

### Cost Savings

- Firebase Storage is generally more cost-effective
- Pay only for what you use
- No monthly subscription fees

### Better Organization

- Clear folder structure
- Easy to manage files
- Better for team collaboration

### Integration

- Seamless integration with Firebase backend
- Consistent authentication
- Better error handling

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check Firebase Storage CORS configuration
   - Ensure proper domain whitelisting

2. **Permission Denied**

   - Verify Firebase Storage security rules
   - Check authentication status

3. **File Upload Fails**

   - Check file size limits
   - Verify file type restrictions
   - Check network connectivity

4. **Download URLs Not Working**
   - Verify Firebase Storage rules allow public read
   - Check URL format

### Debug Steps

1. Check browser console for errors
2. Verify Firebase configuration
3. Test with smaller files first
4. Check Firebase Console for upload logs

## Support

For issues with the migration:

1. Check the Firebase Console
2. Review browser network tab
3. Check console logs for detailed errors
4. Verify environment variables are correct

## Next Steps

After successful migration:

1. Remove Cloudinary dependencies
2. Update documentation
3. Train team on new file organization
4. Monitor Firebase Storage usage
5. Set up monitoring and alerts
