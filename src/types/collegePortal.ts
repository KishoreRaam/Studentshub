/**
 * TypeScript interfaces for College Portal Registration
 */

export interface CollegeRegistrationForm {
  // Institution Details
  institutionName: string;
  institutionType: string;
  state: string;
  district: string;
  studentStrength: number;
  departments: number;

  // Contact Information
  principalName: string;
  officialEmail: string;
  phoneNumber: string;
  preferredDomain: string;

  // Timeline & System
  timeline: 'immediate' | 'semester' | 'planning';
  currentEmailSystem: string;
  comments: string;
}

export interface DomainCheckResult {
  available: boolean;
  checking: boolean;
  domain: string;
  suggestion?: string;
}

export interface FormDraft {
  data: Partial<CollegeRegistrationForm>;
  savedAt: string;
}

// Dropdown options
export const INSTITUTION_TYPES = [
  'Engineering College',
  'Arts & Science College',
  'Medical College',
  'Polytechnic',
  'University',
  'Management College',
  'Law College',
  'Pharmacy College',
  'Architecture College',
  'Other'
] as const;

export const STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Delhi',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Goa',
  'Manipur',
  'Meghalaya',
  'Tripura',
  'Mizoram',
  'Nagaland',
  'Arunachal Pradesh',
  'Sikkim',
  'Other'
] as const;

export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kancheepuram',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivagangai',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar'
] as const;

// Districts for other major states (add as needed)
export const DISTRICTS_BY_STATE: Record<string, readonly string[]> = {
  'Tamil Nadu': TAMIL_NADU_DISTRICTS,
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary', 'Other'],
  'Kerala': ['Thiruvananthapuram', 'Kollam', 'Kochi', 'Thrissur', 'Kozhikode', 'Kannur', 'Kottayam', 'Palakkad', 'Other'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Thane', 'Other'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa', 'Other'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Other'],
  'Other': ['Other']
};

export const CURRENT_EMAIL_SYSTEMS = [
  'None (No institutional emails)',
  'Gmail (Free accounts)',
  'Google Workspace',
  'Microsoft 365',
  'Zoho Mail',
  'Custom Email Server',
  'Other'
] as const;

export const TIMELINE_OPTIONS = [
  { value: 'immediate', label: 'Immediate (Within 1 month)', description: 'Need setup as soon as possible' },
  { value: 'semester', label: 'Next Semester', description: 'Planning for upcoming semester' },
  { value: 'planning', label: 'Future Planning', description: 'Exploring options for later' }
] as const;

// Trust indicators for hero section
export interface TrustIndicator {
  label: string;
  value: string;
  icon: string;
}

export const TRUST_INDICATORS: TrustIndicator[] = [
  { label: 'Colleges Onboarded', value: '125+', icon: 'building' },
  { label: 'Students Served', value: '50,000+', icon: 'users' },
  { label: 'Market Value', value: '₹80Cr+', icon: 'trending-up' }
];

// Testimonials
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  institution: string;
  content: string;
  rating: number;
  image?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    role: 'Principal',
    institution: 'PSG College of Technology',
    content: 'The institutional email setup was seamless. Our students now have professional email addresses that enhance our college\'s credibility.',
    rating: 5
  },
  {
    id: 2,
    name: 'Prof. Lakshmi Narayan',
    role: 'Dean of Students',
    institution: 'Anna University',
    content: 'Excellent service! The setup was completed in just 2 days. The support team was very responsive and helpful throughout.',
    rating: 5
  },
  {
    id: 3,
    name: 'Dr. Priya Sharma',
    role: 'IT Administrator',
    institution: 'VIT Chennai',
    content: 'Very professional service. The domain verification and email setup was handled efficiently. Highly recommend for educational institutions.',
    rating: 5
  }
];

// FAQ items
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is included in the institutional email service?',
    answer: 'We provide custom domain email addresses (@yourcollegename.edu.in), full Google Workspace or Microsoft 365 integration, admin dashboard for managing users, security features, and 24/7 technical support.'
  },
  {
    question: 'How long does the setup process take?',
    answer: 'Once you submit the registration and complete verification, the entire setup process takes 24-48 hours. This includes domain verification, email configuration, and user account creation.'
  },
  {
    question: 'What documents are needed for verification?',
    answer: 'You\'ll need: (1) Valid college registration certificate, (2) Principal\'s authorization letter, (3) Proof of address, and (4) Educational institution accreditation documents.'
  },
  {
    question: 'Is there any setup fee or hidden charges?',
    answer: 'No setup fees! Our pricing is transparent with affordable annual plans based on student strength. You only pay for what you need, with no hidden charges.'
  },
  {
    question: 'Can we customize the email domain?',
    answer: 'Yes! You can choose your preferred domain (e.g., yourcollegename.edu.in or yourcollegename.ac.in). We\'ll check availability and help you secure the best option.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We provide comprehensive support including initial setup assistance, admin training, 24/7 technical support via email and phone, and regular updates and maintenance.'
  },
  {
    question: 'Can students access premium services with institutional emails?',
    answer: 'Absolutely! Students with verified institutional emails get access to premium student discounts on software, cloud services, and various educational tools worth thousands of rupees.'
  },
  {
    question: 'What happens when students graduate?',
    answer: 'You have full control over email retention policies. Typically, alumni can retain their emails for life or for a specified period as per your institution\'s policy.'
  }
];
