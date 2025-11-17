# College Portal - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Environment Setup
Create/update `.env` file in project root:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here

# College Portal Collection
VITE_APPWRITE_COLLECTION_COLLEGE_REGISTRATIONS=college_registrations

# For automated setup script (optional)
APPWRITE_API_KEY=your_api_key_here
```

### Step 2: Create Appwrite Collection

#### Option A: Automated Setup (Recommended)
```bash
node scripts/setup-college-portal.js
```

#### Option B: Manual Setup
1. Go to Appwrite Console → Databases → Your Database
2. Click "Add Collection"
3. Name: `College Registrations`
4. ID: `college_registrations`
5. Add these attributes:

**String Attributes:**
- `institutionName` (255, required)
- `institutionType` (100, required)
- `state` (100, required)
- `district` (100, required)
- `principalName` (255, required)
- `phoneNumber` (15, required)
- `preferredDomain` (100, optional)
- `timeline` (50, required)
- `currentEmailSystem` (100, optional)
- `comments` (1000, optional)
- `status` (50, required, default: "pending")

**Email Attribute:**
- `officialEmail` (required)

**Integer Attributes:**
- `studentStrength` (required)
- `departments` (required)

**DateTime Attribute:**
- `submittedAt` (required)

**Permissions:**
- Create: Role Any
- Read/Update/Delete: Role Users (admin only)

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Access the Page
Open browser and go to:
- **Direct URL**: `http://localhost:3000/college-portal`
- **Via Homepage**: Click "Get Started Now" in Benefits section

## 🧪 Quick Test

Use this data to test the form:

```
Institution Name: ABC Engineering College
Institution Type: Engineering College
State: Tamil Nadu
District: Coimbatore
Student Strength: 2500
Departments: 8
Principal Name: Dr. Rajesh Kumar
Official Email: principal@abcengineering.edu.in
Phone Number: 9876543210
Preferred Domain: abcengineering
Timeline: Immediate (Within 1 month)
Current Email System: Gmail (Free accounts)
Comments: We need this setup before the new semester starts
```

## ✅ Verify Everything Works

1. **Form Loads**: Visit `/college-portal` - should see registration form
2. **Validation**: Try invalid email (gmail.com) - should show error
3. **Domain Checker**: Type in domain field - should show checking animation
4. **Auto-save**: Fill some fields, wait 3 seconds, refresh page - should see resume banner
5. **Submit**: Fill complete form and submit - should see success modal
6. **Appwrite**: Check Appwrite Console - should see new document in collection

## 🔍 Troubleshooting

### Form doesn't load
- Check console for errors (F12)
- Verify all files are created in correct locations
- Restart dev server

### Validation errors
- Check `.env` file has correct values
- Ensure Appwrite collection exists
- Check collection permissions (Create: Any)

### Auto-save not working
- Check browser localStorage is enabled
- Look for auto-save logs in console
- Try clearing localStorage and retry

### Domain checker stuck
- It's a mock API with 800ms delay - this is normal
- Check console for errors
- Verify DomainChecker component is imported

## 📚 File Locations

| What | Where |
|------|-------|
| Main Page | `src/pages/CollegePortal.tsx` |
| Form Component | `src/components/college-portal/RegistrationForm.tsx` |
| Validation Schema | `src/lib/validations/collegeRegistration.ts` |
| Types | `src/types/collegePortal.ts` |
| Auto-save Hook | `src/hooks/useFormAutoSave.ts` |
| Setup Script | `scripts/setup-college-portal.js` |

## 🎯 Common Tasks

### Change Form Fields
Edit: `src/components/college-portal/RegistrationForm.tsx`

### Update Validation Rules
Edit: `src/lib/validations/collegeRegistration.ts`

### Modify Dropdown Options
Edit: `src/types/collegePortal.ts` (constants at bottom)

### Customize Success Modal
Edit: `src/components/college-portal/SuccessModal.tsx`

### Add More States/Districts
Edit: `src/types/collegePortal.ts` → `DISTRICTS_BY_STATE`

## 📞 Need Help?

1. Check `COLLEGE_PORTAL_README.md` for detailed documentation
2. Check `IMPLEMENTATION_SUMMARY.md` for technical details
3. Check browser console (F12) for error messages
4. Verify Appwrite collection setup in console

## 🎉 You're Ready!

The College Portal is now fully functional and ready to accept registrations!

Visit: `http://localhost:3000/college-portal`
