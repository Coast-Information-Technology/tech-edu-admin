# Firebase Storage CORS Configuration

This guide helps you fix CORS (Cross-Origin Resource Sharing) issues when uploading files to Firebase Storage from your domain.

## The Problem

You're getting this error:

```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/techedu-solution.firebasestorage.app/o?name=materials%2Fcourse-materials%2F...' from origin 'https://tech-eduk.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```

This happens because Firebase Storage doesn't allow uploads from your domain by default.

## Solution: Configure CORS for Firebase Storage

### Method 1: Using Google Cloud Console (Recommended)

1. **Go to Google Cloud Console**

   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Select your project: `techedu-solutions`

2. **Navigate to Cloud Storage**

   - Go to **Cloud Storage** → **Buckets**
   - Find your bucket: `techedu-solution.firebasestorage.app`

3. **Configure CORS**
   - Click on your bucket name
   - Go to **Permissions** tab
   - Click **Edit CORS configuration**
   - Replace the existing configuration with:

```json
[
  {
    "origin": [
      "https://tech-eduk.com",
      "https://www.tech-eduk.com",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers"
    ]
  }
]
```

4. **Save the Configuration**
   - Click **Save**
   - Wait a few minutes for changes to propagate

### Method 2: Using gsutil Command Line

1. **Install Google Cloud SDK**

   ```bash
   # Download and install from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate**

   ```bash
   gcloud auth login
   gcloud config set project techedu-solutions
   ```

3. **Apply CORS Configuration**
   ```bash
   gsutil cors set firebase-cors-config.json gs://techedu-solution.firebasestorage.app
   ```

### Method 3: Using Firebase CLI

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**

   ```bash
   firebase login
   firebase use techedu-solutions
   ```

3. **Apply CORS Configuration**
   ```bash
   gsutil cors set firebase-cors-config.json gs://techedu-solution.firebasestorage.app
   ```

## CORS Configuration Explained

### Origins

- `https://tech-eduk.com` - Your production domain
- `https://www.tech-eduk.com` - Your production domain with www
- `http://localhost:3000` - Local development
- `http://localhost:3001` - Alternative local development port

### Methods

- `GET` - Download files
- `POST` - Upload files
- `PUT` - Update files
- `DELETE` - Delete files
- `OPTIONS` - Preflight requests

### Headers

- `Content-Type` - File type information
- `Authorization` - Firebase authentication
- `X-Requested-With` - AJAX requests
- `Accept` - Accept headers
- `Origin` - Request origin
- `Access-Control-Request-Method` - Preflight method
- `Access-Control-Request-Headers` - Preflight headers

## Testing the Fix

### 1. Clear Browser Cache

- Clear your browser cache and cookies
- Or use incognito/private mode

### 2. Test File Upload

- Try uploading a file in your application
- Check browser console for errors

### 3. Verify CORS Configuration

- Open browser developer tools
- Go to Network tab
- Try uploading a file
- Look for OPTIONS request to Firebase Storage
- Should return 200 status with CORS headers

## Troubleshooting

### Common Issues

1. **Still Getting CORS Error**

   - Wait 5-10 minutes for changes to propagate
   - Clear browser cache
   - Check if you're using the correct domain

2. **Configuration Not Applied**

   - Verify you're editing the correct bucket
   - Check if you have proper permissions
   - Try using gsutil command line method

3. **Partial CORS Support**
   - Some requests work, others don't
   - Check if all required headers are included
   - Verify all HTTP methods are allowed

### Debug Steps

1. **Check Current CORS Configuration**

   ```bash
   gsutil cors get gs://techedu-solution.firebasestorage.app
   ```

2. **Test with curl**

   ```bash
   curl -X OPTIONS \
     -H "Origin: https://tech-eduk.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     https://firebasestorage.googleapis.com/v0/b/techedu-solution.firebasestorage.app/o
   ```

3. **Check Firebase Console**
   - Go to Firebase Console → Storage
   - Check if there are any error logs
   - Verify bucket permissions

## Alternative Solutions

### 1. Use Firebase Admin SDK (Server-Side Upload)

If CORS continues to be an issue, you can implement server-side uploads:

```typescript
// API route: /api/upload-material
import { admin } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  // Handle file upload on server side
  // Return download URL to client
}
```

### 2. Use Firebase Storage Rules

Ensure your Firebase Storage rules allow uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Security Considerations

### 1. Limit Origins

Only include domains you actually use:

- Production domain
- Development domains
- Staging domains (if applicable)

### 2. Limit Methods

Only allow necessary HTTP methods:

- `GET` for downloads
- `POST` for uploads
- `PUT` for updates
- `DELETE` for deletions

### 3. Set Appropriate Max Age

- `maxAgeSeconds: 3600` (1 hour) is reasonable
- Longer values reduce preflight requests
- Shorter values provide more security

## Next Steps

After applying the CORS configuration:

1. **Test thoroughly** - Try all file upload operations
2. **Monitor usage** - Check Firebase Console for any issues
3. **Update documentation** - Document the CORS configuration for your team
4. **Set up monitoring** - Monitor for CORS-related errors

## Support

If you continue to have issues:

1. Check Firebase Console for error logs
2. Verify your domain is correctly configured
3. Test with a simple HTML file upload
4. Contact Firebase support if needed

Remember: CORS changes can take a few minutes to propagate, so be patient!
