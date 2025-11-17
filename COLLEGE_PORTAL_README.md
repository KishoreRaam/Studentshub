# College Portal Registration - Setup Guide

## Overview
The College Portal Registration page allows educational institutions to register for EduDomain Solutions institutional email services. This feature includes:

- ✅ Complete registration form with real-time validation
- ✅ Auto-save functionality (saves draft every 2 seconds)
- ✅ Domain availability checker
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Appwrite backend integration
- ✅ Success modal with next steps
- ✅ FAQ accordion
- ✅ Testimonials sidebar

## 🚀 Quick Start

### 1. Dependencies
All required dependencies are already installed:
- `zod` - Form validation schema
- `@hookform/resolvers` - React Hook Form + Zod integration
- `react-hook-form` - Form state management (already installed)
- `appwrite` - Backend integration (already installed)

### 2. Environment Variables
Add the following to your `.env` file:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id

# College Registrations Collection
VITE_APPWRITE_COLLECTION_COLLEGE_REGISTRATIONS=college_registrations
```

### 3. Appwrite Collection Setup

#### Create the Collection
1. Log in to your Appwrite Console
2. Navigate to Databases → Your Database
3. Click "Add Collection"
4. Name: `college_registrations`
5. Collection ID: `college_registrations`

#### Add Attributes
Create the following attributes in the collection:

| Attribute Name        | Type     | Size/Options | Required | Default |
|-----------------------|----------|--------------|----------|---------|
| institutionName       | string   | 255          | Yes      | -       |
| institutionType       | string   | 100          | Yes      | -       |
| state                 | string   | 100          | Yes      | -       |
| district              | string   | 100          | Yes      | -       |
| studentStrength       | integer  | -            | Yes      | -       |
| departments           | integer  | -            | Yes      | -       |
| principalName         | string   | 255          | Yes      | -       |
| officialEmail         | email    | 255          | Yes      | -       |
| phoneNumber           | string   | 15           | Yes      | -       |
| preferredDomain       | string   | 100          | No       | -       |
| timeline              | string   | 50           | Yes      | -       |
| currentEmailSystem    | string   | 100          | No       | -       |
| comments              | string   | 1000         | No       | -       |
| status                | string   | 50           | Yes      | pending |
| submittedAt           | datetime | -            | Yes      | -       |

#### Set Permissions
**Create:**
- Role: Any
- Permission: Create

**Read/Update/Delete:**
- Role: Users (Admin only)
- You can also set specific user roles for your admin users

### 4. Create Indexes (Optional but Recommended)
For better query performance:

| Index Name       | Type   | Attributes              |
|------------------|--------|-------------------------|
| status_idx       | key    | status                  |
| submittedAt_idx  | key    | submittedAt (DESC)      |
| state_idx        | key    | state                   |
| email_idx        | unique | officialEmail           |

## 📁 File Structure

```
src/
├── pages/
│   └── CollegePortal.tsx              # Main page component
├── components/
│   └── college-portal/
│       ├── HeroSection.tsx            # Hero with stats
│       ├── RegistrationForm.tsx       # Main form with validation
│       ├── FormField.tsx              # Reusable form field wrapper
│       ├── DomainChecker.tsx          # Domain availability checker
│       ├── TestimonialCard.tsx        # Testimonial display
│       ├── FAQAccordion.tsx           # FAQ section
│       └── SuccessModal.tsx           # Post-submission modal
├── hooks/
│   └── useFormAutoSave.ts             # Auto-save hook
├── lib/
│   ├── validations/
│   │   └── collegeRegistration.ts     # Zod validation schema
│   └── appwrite.ts                    # Appwrite config (updated)
└── types/
    └── collegePortal.ts               # TypeScript interfaces
```

## 🎨 Design Features

### Color Palette
- Primary: `#6366F1` (Indigo 500)
- Secondary: `#8B5CF6` (Purple 500)
- Success: `#10B981` (Emerald 500)
- Error: `#EF4444` (Red 500)
- Background: `#F9FAFB` (Gray 50)

### Typography
- Font: Inter (system font stack)
- Hero: 4xl-6xl, font-bold
- Section titles: 2xl-3xl, font-semibold
- Body: base, font-normal
- Labels: sm, font-medium

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1023px (single column)
- Desktop: ≥ 1024px (2-column layout with sidebar)

## 🔧 Key Features

### 1. Real-time Validation
- Uses Zod schema for robust validation
- Inline error messages
- Success indicators (checkmarks)
- Field-level and form-level validation

### 2. Auto-save Functionality
- Saves form progress every 2 seconds
- Stores draft in localStorage
- Shows "Resume draft" banner if available
- Draft expires after 7 days
- Clears draft on successful submission

### 3. Domain Availability Checker
- Real-time domain format validation
- Debounced availability check (500ms)
- Visual feedback (loading, available, taken, invalid)
- Suggestions for taken domains
- Reserved domain detection

### 4. Conditional Fields
- District dropdown appears when state is selected
- District options populate based on selected state
- Currently includes all Tamil Nadu districts
- Easily extensible for other states

### 5. Form Submission
- Submits to Appwrite collection
- Shows loading state during submission
- Displays success modal on completion
- Shows error alert on failure
- Resets form and clears draft on success

## 🧪 Testing the Form

### Test Data
Use this sample data for testing:

```javascript
{
  institutionName: "ABC Engineering College",
  institutionType: "Engineering College",
  state: "Tamil Nadu",
  district: "Coimbatore",
  studentStrength: 2500,
  departments: 8,
  principalName: "Dr. Rajesh Kumar",
  officialEmail: "principal@abcengineering.edu.in",
  phoneNumber: "9876543210",
  preferredDomain: "abcengineering",
  timeline: "immediate",
  currentEmailSystem: "Gmail (Free accounts)",
  comments: "We need this setup before the new semester starts"
}
```

### Validation Test Cases
1. **Valid Email**: Must end with .edu, .ac, .org, or .gov
   - ✅ principal@college.edu.in
   - ❌ principal@gmail.com

2. **Phone Number**: Must be 10-digit Indian number
   - ✅ 9876543210
   - ❌ 1234567890 (doesn't start with 6-9)

3. **Domain Format**: Lowercase, alphanumeric, hyphens only
   - ✅ abc-college
   - ❌ ABC College (uppercase/spaces)

4. **Student Strength**: Between 100-50,000
   - ✅ 2500
   - ❌ 50 (too low)

## 🚦 Routing

The College Portal is accessible at:
- URL: `/college-portal`
- Linked from: "Get Started Now" button in Benefits section (Homepage)

## 📱 Mobile Responsiveness

### Mobile (< 768px)
- Single column layout
- Stacked testimonials
- Full-width form fields
- Larger touch targets (44px min height)
- Bottom sticky submit button option

### Tablet (768px - 1023px)
- Single column layout
- Form full-width
- Testimonials below form
- 2-column grid for some fields

### Desktop (≥ 1024px)
- 2-column layout: Form (66%) + Sidebar (33%)
- Sticky sidebar on scroll
- 2-column grid for paired fields
- Hover effects on interactive elements

## 🔐 Security Considerations

1. **Client-side Validation**: Zod schema validates all inputs
2. **Server-side Validation**: Appwrite enforces required fields
3. **XSS Protection**: All user inputs are sanitized by React
4. **Email Verification**: Required institutional email domain
5. **Rate Limiting**: Consider adding to Appwrite functions
6. **Data Privacy**: Form auto-save uses localStorage (client-side only)

## 🎯 Future Enhancements

Potential improvements for v2:

1. **Email Verification**: Send OTP to official email
2. **Document Upload**: Allow uploading institution documents
3. **Payment Integration**: For premium tiers
4. **Admin Dashboard**: Manage registrations, approve/reject
5. **Real Domain API**: Integrate actual domain availability check
6. **Multi-step Form**: Break into wizard steps
7. **Progress Indicator**: Show completion percentage
8. **Analytics**: Track form abandonment, completion rates

## 🐛 Troubleshooting

### Form doesn't submit
- Check Appwrite credentials in `.env`
- Verify collection exists and has correct permissions
- Check browser console for errors
- Ensure all required fields are filled

### Auto-save not working
- Check localStorage is enabled in browser
- Clear localStorage if corrupted: `localStorage.removeItem('college-registration-draft')`
- Check console for auto-save logs

### Domain checker not responding
- Domain checker uses mock API (800ms delay)
- In production, replace with actual API endpoint
- See `DomainChecker.tsx:checkDomainAvailability()`

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check dark mode settings
- Verify all shadcn/ui components are installed

## 📞 Support

For questions or issues:
- Email: support@studentperks.in
- GitHub Issues: [Create an issue](https://github.com/yourusername/studentshub/issues)

## 📄 License

This project is part of StudentPerks platform.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Appwrite**
