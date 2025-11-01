# Firebase Storage Security Rules Guide

This guide explains how to configure Firebase Storage security rules safely for the TechEdu Solution Admin application.

## Current Issue

Your current rules are too restrictive:

```javascript
match /{allPaths=**} {
  allow read, write: if false; // This blocks ALL access
}
```

## Recommended Security Configurations

### 1. Basic Configuration (Recommended for Development)

**File**: `firebase-storage-rules.txt`

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files (for download URLs)
    match /{allPaths=**} {
      allow read: if true;
    }

    // Restrict write access based on authentication
    match /assets/{allPaths=**} {
      allow write: if request.auth != null;
    }

    match /attachments/{allPaths=**} {
      allow write: if request.auth != null;
    }

    match /materials/{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

**Pros:**

- Simple and easy to implement
- Allows authenticated users to upload
- Public read access for download URLs

**Cons:**

- No role-based access control
- No file size/type validation

### 2. Advanced Configuration (Recommended for Production)

**File**: `firebase-storage-rules-advanced.txt`

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserData() {
      return firestore.get(/databases/(default)/documents/users/$(request.auth.uid));
    }

    function isAdmin() {
      return isAuthenticated() &&
             getUserData().data.role == 'admin';
    }

    function isInstructor() {
      return isAuthenticated() &&
             getUserData().data.role == 'instructor';
    }

    // Allow public read access
    match /{allPaths=**} {
      allow read: if true;
    }

    // Assets folder - Only admins and instructors
    match /assets/{allPaths=**} {
      allow write: if isAdmin() || isInstructor();
      allow delete: if isAdmin();
    }

    // Attachments folder - Any authenticated user
    match /attachments/{allPaths=**} {
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated() &&
                       resource.metadata.uploadedBy == request.auth.uid;
    }

    // Materials folder - Only admins and instructors
    match /materials/{allPaths=**} {
      allow write: if isAdmin() || isInstructor();
      allow delete: if isAdmin();
    }
  }
}
```

**Pros:**

- Role-based access control
- Users can only delete their own attachments
- Clear separation of permissions

**Cons:**

- Requires Firestore user data
- More complex to implement

### 3. Production Configuration (Maximum Security)

**File**: `firebase-storage-rules-production.txt`

Includes all advanced features plus:

- File size validation (50MB max)
- File type validation
- Content type checking
- Separate permissions for create/update/delete

## Implementation Steps

### Step 1: Choose Your Configuration

1. **Development**: Use Basic Configuration
2. **Staging**: Use Advanced Configuration
3. **Production**: Use Production Configuration

### Step 2: Update Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Storage** → **Rules**
4. Replace the existing rules with your chosen configuration
5. Click **Publish**

### Step 3: Test the Rules

1. **Test Upload**: Try uploading files from your app
2. **Test Download**: Verify download URLs work
3. **Test Permissions**: Ensure users can only access what they should

### Step 4: Monitor Usage

1. Check **Storage** → **Usage** for upload activity
2. Monitor **Firestore** → **Usage** for rule evaluations
3. Check **Authentication** → **Users** for user roles

## Security Best Practices

### 1. File Organization

```
gs://techedu-solution.firebasestorage.app/
├── assets/           # UI assets, product images
│   ├── product-icons/
│   └── product-thumbnails/
├── attachments/      # User uploads
│   └── booking-attachments/
└── materials/        # Training materials
    └── course-materials/
```

### 2. Access Control Matrix

| Folder      | Read   | Write            | Delete | Who                |
| ----------- | ------ | ---------------- | ------ | ------------------ |
| assets      | Public | Admin/Instructor | Admin  | Product management |
| attachments | Public | Authenticated    | Owner  | User uploads       |
| materials   | Public | Admin/Instructor | Admin  | Training content   |

### 3. File Validation

- **Images**: JPEG, PNG, WebP, GIF (max 5MB)
- **Documents**: PDF, DOC, DOCX, TXT, ZIP (max 20MB)
- **Materials**: All types (max 50MB)

### 4. User Roles

Ensure your Firestore users collection has a `role` field:

```javascript
// Firestore document: /users/{userId}
{
  email: "user@example.com",
  role: "admin", // or "instructor", "student"
  // ... other fields
}
```

## Troubleshooting

### Common Issues

1. **Permission Denied**

   - Check if user is authenticated
   - Verify user role in Firestore
   - Check file size/type restrictions

2. **Download URLs Not Working**

   - Ensure `allow read: if true` is present
   - Check if file exists in Storage
   - Verify URL format

3. **Upload Fails**
   - Check file size limits
   - Verify file type restrictions
   - Ensure user has write permissions

### Debug Steps

1. **Check Firebase Console Logs**

   - Go to **Storage** → **Rules** → **Simulator**
   - Test your rules with sample data

2. **Verify User Authentication**

   - Check if `request.auth.uid` exists
   - Verify user data in Firestore

3. **Test File Uploads**
   - Try different file sizes
   - Test different file types
   - Check browser console for errors

## Migration from Current Rules

### Current Rules (Too Restrictive)

```javascript
match /{allPaths=**} {
  allow read, write: if false; // Blocks everything
}
```

### Recommended Migration

1. Start with Basic Configuration
2. Test all upload/download functionality
3. Gradually implement Advanced Configuration
4. Add Production Configuration for security

## Monitoring and Alerts

### Set Up Alerts

1. **Storage Usage**: Monitor storage consumption
2. **Rule Evaluations**: Track rule performance
3. **Authentication Failures**: Monitor failed uploads

### Regular Audits

1. Review user permissions monthly
2. Check for unused files
3. Monitor storage costs
4. Update rules as needed

## Support

If you encounter issues:

1. Check Firebase Console logs
2. Test rules in the simulator
3. Verify user authentication
4. Check file size/type restrictions

Remember: Start simple and gradually add complexity as needed!
