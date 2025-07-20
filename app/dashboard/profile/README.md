# Dynamic Profile System

This directory contains a dynamic profile system that renders different profile components based on the user's role.

## Structure

```
profile/
├── page.tsx                                    # Main profile page that routes to role-specific components
├── components/                                 # Role-specific profile components
│   └── AdminProfile.tsx                        # Unified profile component for all roles
└── README.md                                   # This documentation
```

## How It Works

The main `page.tsx` file:

1. Fetches user profile data from `/api/users/me`
2. Determines the user's role from the response
3. Renders the appropriate role-specific component
4. Handles profile updates through a common `onUpdate` function

## Supported Roles

### 1. Admin (`admin`)

- **Data Structure**: Based on admin profile data
- **Key Fields**:
  - Personal info (name, email, phone)
  - System permissions
  - Departments and assigned regions
  - Bio and professional information
  - Security settings

### 2. Moderator (`moderator`)

- **Data Structure**: Based on moderator profile data
- **Key Fields**:
  - Personal info (name, email, phone)
  - Content moderation permissions
  - Assigned areas of responsibility
  - Bio and professional information
  - Security settings

### 3. Instructor (`instructor`)

- **Data Structure**: Based on instructor profile data
- **Key Fields**:
  - Personal info (name, email, phone)
  - Teaching permissions and specializations
  - Course management access
  - Bio and professional information
  - Security settings

### 4. Customer Representative (`customerRepresentative`)

- **Data Structure**: Based on customer representative profile data
- **Key Fields**:
  - Personal info (name, email, phone)
  - Customer support permissions
  - Assigned customer regions
  - Bio and professional information
  - Security settings

## Features

### Common Features Across All Roles

- **Edit Mode**: Toggle between view and edit modes
- **Form Validation**: Client-side validation for required fields
- **API Integration**: Automatic saving to backend
- **Loading States**: Visual feedback during save operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile
- **Role-Specific Titles**: Dynamic titles and descriptions based on user role
- **Security Settings**: Password change and 2FA management
- **Image Upload**: Profile picture upload with preview and validation

### Image Upload Features

- **File Selection**: Click camera icon to select image file
- **File Validation**:
  - Supported formats: JPG, PNG, GIF
  - Maximum size: 5MB
  - Recommended: Square image (400x400px)
- **Preview**: Real-time image preview before upload
- **Upload Controls**: Upload and remove buttons for selected images
- **Progress Feedback**: Loading states during upload
- **Error Handling**: Validation errors and upload failure messages
- **Success Feedback**: Toast notifications for successful uploads

### Role-Specific Features

- **Admin**: Full system permissions, department management, system-wide access
- **Moderator**: Content moderation permissions, user management access
- **Instructor**: Course management permissions, student support access
- **Customer Representative**: Customer support permissions, inquiry handling access

## API Endpoints

### Fetch Profile

```
GET /api/users/me
```

### Update Profile

```
PATCH /api/users/me
Body: Profile data to update
```

**Example Request Body:**

```json
{
  "profile": {
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "bio": "Professional bio text",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

### Upload Avatar

```
POST /api/users/upload-avatar
Content-Type: multipart/form-data
Body:
  - avatar: File (image)
```

**Response:**

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "avatarUrl": "/api/avatars/{timestamp}-{filename}",
  "fileName": "profile.jpg",
  "fileSize": 1024000,
  "fileType": "image/jpeg"
}
```

## Role Context Integration

The profile system integrates with the enhanced RoleContext that provides:

- **Role Management**: Centralized role state management
- **Role Information**: Display names and descriptions for each role
- **Role Validation**: Helper functions to check role validity
- **Dashboard Routing**: Automatic routing to role-specific dashboards

## Styling

All components use:

- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Consistent color scheme**: Primary blue `#011F72`
- **Responsive grid layouts** for different screen sizes
- **Card-based design** with rounded corners and shadows
- **Role-specific colors**: Different badge colors for each role

## Data Flow

1. **Initial Load**: Fetch user data → Determine role → Render component
2. **Edit Mode**: User clicks edit → Load data into form → User makes changes
3. **Save**: Validate data → Send to API → Update local state → Exit edit mode
4. **Error Handling**: Show error message → Allow retry → Maintain form state
5. **Image Upload**: Select file → Validate → Preview → Upload → Update profile

## Image Upload Flow

1. **File Selection**: User clicks camera icon → File picker opens
2. **Validation**: Check file type and size → Show errors if invalid
3. **Preview**: Display selected image in avatar component
4. **Upload Controls**: Show upload and remove buttons
5. **Upload Process**: Send file to server → Show loading state
6. **Success**: Update profile with new avatar URL → Clear selection
7. **Error Handling**: Show error message → Allow retry

## Role Icons and Colors

- **Admin**: Shield icon, Red badge
- **Moderator**: Shield icon, Yellow badge
- **Instructor**: Graduation cap icon, Blue badge
- **Customer Representative**: Users icon, Green badge

## File Upload Implementation Notes

### Current Implementation

- Uses FormData for file upload
- Converts files to base64 for storage (demo purposes)
- Returns mock URL structure
- Includes comprehensive validation
- Uses JWT token for user identification

### Production Implementation

For production, you should:

1. **Cloud Storage**: Upload to AWS S3, Cloudinary, or similar service
2. **Image Processing**: Resize and optimize images
3. **CDN**: Use CDN for fast image delivery
4. **Database**: Store image URLs in user profile
5. **Cleanup**: Remove old images when new ones are uploaded
6. **Security**: Validate file contents, not just extensions
7. **JWT Decoding**: Extract user ID from JWT token for file organization

### Example Cloud Storage Integration

```javascript
// Example with Cloudinary
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

const uploadToCloudinary = async (file, token) => {
  // Decode JWT to get user ID
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  const result = await cloudinary.uploader.upload(file, {
    folder: `avatars/${userId}`,
    transformation: [
      { width: 400, height: 400, crop: "fill" },
      { quality: "auto" },
    ],
  });
  return result.secure_url;
};
```

## Future Enhancements

- [x] Add image upload for profile pictures
- [ ] Add image cropping and editing tools
- [ ] Implement real-time validation
- [ ] Add profile completion percentage
- [ ] Support for multiple languages
- [ ] Advanced security features
- [ ] Integration with external services
- [ ] Profile analytics and insights
- [ ] Role-specific dashboard widgets
- [ ] Activity tracking and audit logs
- [ ] Bulk image upload for multiple users
- [ ] Image compression and optimization
- [ ] Avatar generation from initials
