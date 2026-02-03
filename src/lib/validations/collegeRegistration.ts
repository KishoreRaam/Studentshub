import { z } from 'zod';

/**
 * Zod validation schema for College Portal Registration Form
 * Provides comprehensive validation with custom error messages
 */

export const collegeRegistrationSchema = z.object({
  // Institution Details
  institutionName: z
    .string()
    .min(3, 'Institution name must be at least 3 characters')
    .max(100, 'Institution name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&'.()]+$/, 'Institution name contains invalid characters'),

  institutionType: z
    .string()
    .min(1, 'Please select an institution type'),

  state: z
    .string()
    .min(1, 'Please select a state'),

  district: z
    .string()
    .min(1, 'Please select a district'),

  studentStrength: z
    .number({
      required_error: 'Student strength is required',
      invalid_type_error: 'Student strength must be a number',
    })
    .int('Student strength must be a whole number')
    .min(100, 'Minimum student strength must be 100')
    .max(50000, 'Maximum student strength cannot exceed 50,000'),

  departments: z
    .number({
      required_error: 'Number of departments is required',
      invalid_type_error: 'Departments must be a number',
    })
    .int('Number of departments must be a whole number')
    .min(1, 'At least 1 department is required')
    .max(100, 'Number of departments cannot exceed 100'),

  // Contact Information
  principalName: z
    .string()
    .min(3, 'Principal name must be at least 3 characters')
    .max(100, 'Principal name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s.]+$/, 'Principal name should only contain letters, spaces, and dots'),

  officialEmail: z
    .string()
    .email('Please enter a valid email address')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac|org|gov|in)(\.[a-z]{2})?$/i,
      'Please use an official institutional email address (.edu, .ac, .org, .gov, or .in domain)'
    ),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),

  preferredDomain: z
    .string()
    .min(3, 'Domain must be at least 3 characters')
    .max(50, 'Domain must not exceed 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Domain can only contain lowercase letters, numbers, and hyphens'
    )
    .regex(/^[a-z]/, 'Domain must start with a letter')
    .regex(/[a-z0-9]$/, 'Domain must end with a letter or number')
    .refine(
      (val) => !val.includes('--'),
      'Domain cannot contain consecutive hyphens'
    )
    .optional()
    .or(z.literal('')),

  // Timeline & System
  timeline: z.enum(['immediate', 'semester', 'planning'], {
    required_error: 'Please select a timeline',
  }),

  currentEmailSystem: z.string().optional(),

  comments: z
    .string()
    .max(500, 'Comments must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

// Type inference from schema
export type CollegeRegistrationFormData = z.infer<typeof collegeRegistrationSchema>;

// Partial schema for auto-save (allows incomplete data)
export const collegeRegistrationDraftSchema = collegeRegistrationSchema.partial();

export type CollegeRegistrationDraft = z.infer<typeof collegeRegistrationDraftSchema>;

// Helper function to validate individual field
export const validateField = (
  fieldName: keyof CollegeRegistrationFormData,
  value: any
): { success: boolean; error?: string } => {
  try {
    const fieldSchema = collegeRegistrationSchema.shape[fieldName];
    fieldSchema.parse(value);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Validation failed' };
  }
};

// Domain validation helper (for real-time domain checker)
export const validateDomainFormat = (domain: string): { valid: boolean; error?: string } => {
  if (!domain) {
    return { valid: false, error: 'Domain is required' };
  }

  if (domain.length < 3) {
    return { valid: false, error: 'Domain must be at least 3 characters' };
  }

  if (domain.length > 50) {
    return { valid: false, error: 'Domain must not exceed 50 characters' };
  }

  if (!/^[a-z0-9-]+$/.test(domain)) {
    return { valid: false, error: 'Use only lowercase letters, numbers, and hyphens' };
  }

  if (!/^[a-z]/.test(domain)) {
    return { valid: false, error: 'Domain must start with a letter' };
  }

  if (!/[a-z0-9]$/.test(domain)) {
    return { valid: false, error: 'Domain must end with a letter or number' };
  }

  if (domain.includes('--')) {
    return { valid: false, error: 'Cannot contain consecutive hyphens' };
  }

  return { valid: true };
};

// Reserved/blocked domain keywords
export const RESERVED_DOMAINS = [
  'admin',
  'api',
  'www',
  'mail',
  'email',
  'smtp',
  'ftp',
  'test',
  'demo',
  'dev',
  'staging',
  'localhost',
  'example',
  'support',
  'help',
  'info',
  'contact',
  'abuse',
  'noreply',
  'postmaster',
  'webmaster',
  'hostmaster',
];

export const isDomainReserved = (domain: string): boolean => {
  return RESERVED_DOMAINS.includes(domain.toLowerCase());
};
