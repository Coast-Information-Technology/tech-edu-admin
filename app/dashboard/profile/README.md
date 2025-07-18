# Dynamic Profile System

This directory contains a dynamic profile system that renders different profile components based on the user's role.

## Structure

```
profile/
├── page.tsx                                    # Main profile page that routes to role-specific components
├── components/                                 # Role-specific profile components
│   ├── StudentProfile.tsx                      # Student profile component
│   ├── InstitutionProfile.tsx                  # Institution profile component
│   ├── IndividualTechProfessionalProfile.tsx   # Individual tech professional profile component
│   ├── TeamTechProfessionalProfile.tsx         # Team tech professional profile component
│   └── RecruiterProfile.tsx                    # Recruiter profile component
└── README.md                                   # This documentation
```

## How It Works

The main `page.tsx` file:

1. Fetches user profile data from `/api/users/me`
2. Determines the user's role from the response
3. Renders the appropriate role-specific component
4. Handles profile updates through a common `onUpdate` function

## Supported Roles

### 1. Student (`student`)

- **Data Structure**: Based on student onboarding data
- **Key Fields**:
  - Personal info (name, email, phone, gender, date of birth)
  - Academic info (level, field of study, graduation year)
  - Interest areas, availability preferences
  - Documents (CV, transcript, etc.)
  - Goals and challenges

### 2. Institution (`institution`)

- **Data Structure**: Based on institution onboarding data
- **Key Fields**:
  - Institution details (name, type, contact info)
  - Location information
  - Academic focus areas
  - Verification status
  - Preferences and referral info

### 3. Individual Tech Professional (`individualTechProfessional`)

- **Data Structure**: Individual consultant/freelancer profile data
- **Key Fields**:
  - Personal and contact information
  - Professional title and bio
  - Skills and technologies
  - Work experience
  - Specialization areas
  - Hourly rates and availability
  - Professional links (LinkedIn, GitHub, portfolio)
  - Preferred project types

### 4. Team Tech Professional (`teamTechProfessional`)

- **Data Structure**: Team lead/manager profile data
- **Key Fields**:
  - Personal and contact information
  - Professional title and bio
  - Technical and leadership skills
  - Team management experience
  - Leadership level and team size
  - Management approach
  - Professional links (LinkedIn, GitHub, portfolio)

### 5. Recruiter (`recruiter`)

- **Data Structure**: Recruiter-specific data
- **Key Fields**:
  - Personal and company information
  - Hiring goals and target roles
  - Company details (size, industry, website)
  - Recruiting preferences
  - Hiring requirements and company culture

## Features

### Common Features Across All Roles

- **Edit Mode**: Toggle between view and edit modes
- **Form Validation**: Client-side validation for required fields
- **API Integration**: Automatic saving to backend
- **Loading States**: Visual feedback during save operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile

### Role-Specific Features

- **Student**: Document uploads, academic tracking, availability scheduling
- **Institution**: Verification status, academic focus areas, institutional preferences
- **Individual Tech Professional**: Skills management, experience tracking, rate setting, availability management
- **Team Tech Professional**: Leadership skills, team management experience, management approach
- **Recruiter**: Hiring goals, company information, recruiting preferences

## API Endpoints

### Fetch Profile

```
GET /api/users/me
```

### Update Profile

```
PUT /api/users/profile
Body: Role-specific profile data
```

## Adding New Roles

To add support for a new role:

1. Create a new component in `components/` directory
2. Follow the naming convention: `{RoleName}Profile.tsx`
3. Implement the component interface:
   ```typescript
   interface {RoleName}ProfileProps {
     userProfile: any;
     onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
   }
   ```
4. Add the role case to the switch statement in `page.tsx`
5. Update this documentation

## Styling

All components use:

- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Consistent color scheme**: Primary blue `#011F72`
- **Responsive grid layouts** for different screen sizes
- **Card-based design** with rounded corners and shadows

## Data Flow

1. **Initial Load**: Fetch user data → Determine role → Render component
2. **Edit Mode**: User clicks edit → Load data into form → User makes changes
3. **Save**: Validate data → Send to API → Update local state → Exit edit mode
4. **Error Handling**: Show error message → Allow retry → Maintain form state

## Future Enhancements

- [ ] Add image upload for profile pictures
- [ ] Implement real-time validation
- [ ] Add profile completion percentage
- [ ] Support for multiple languages
- [ ] Advanced search and filtering for recruiters
- [ ] Integration with external services (LinkedIn, GitHub)
- [ ] Profile analytics and insights
