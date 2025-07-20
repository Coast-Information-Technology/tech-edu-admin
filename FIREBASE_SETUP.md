# Firebase Setup for Image Upload

## Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firebase Storage in your project
3. Install Firebase dependencies

## Installation

### 1. Install Firebase Dependencies
```bash
npm install firebase
```

### 2. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 3. Firebase Storage Rules
Update your Firebase Storage rules to allow image uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Usage

The image upload functionality is now integrated into:
- Instructor creation form
- Customer Care representative creation form

### Features:
- ✅ File type validation (images only)
- ✅ File size validation (max 5MB)
- ✅ Real-time preview
- ✅ Firebase Storage upload
- ✅ Error handling with toast notifications
- ✅ Loading states during upload

### How it works:
1. User selects an image file
2. File is validated (type and size)
3. Image is uploaded to Firebase Storage in `profile-images/` folder
4. Download URL is returned and stored in form data
5. Local preview is shown for immediate feedback

## Security Notes:
- Images are stored in Firebase Storage with unique timestamps
- File size is limited to 5MB
- Only authenticated users can upload images
- Images are publicly readable but only authenticated users can write 