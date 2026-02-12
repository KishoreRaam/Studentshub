export interface Department {
  id: string;
  name: string;
  icon: string;
}

export interface Specialization {
  id: string;
  name: string;
  icon: string;
}

export interface SummaryContent {
  aiTools: string[];
  courses: string[];
  perks: string[];
}

export const departments: Department[] = [
  { id: 'engineering', name: 'Engineering', icon: '⚙️' },
  { id: 'cs-it', name: 'Computer Science & IT', icon: '💻' },
  { id: 'design', name: 'Design & Multimedia', icon: '🎨' },
  { id: 'business', name: 'Business & Management', icon: '📊' },
  { id: 'science', name: 'Science & Research', icon: '🔬' },
  { id: 'humanities', name: 'Humanities & Arts', icon: '🌐' },
  { id: 'others', name: 'Others', icon: '📚' },
];

export const specializations: Record<string, Specialization[]> = {
  engineering: [
    { id: 'mechanical', name: 'Mechanical Engineering', icon: '🔧' },
    { id: 'electrical', name: 'Electrical Engineering', icon: '⚡' },
    { id: 'civil', name: 'Civil Engineering', icon: '🏗️' },
    { id: 'electronics', name: 'Electronics & Communication', icon: '📡' },
    { id: 'mechatronics', name: 'Mechatronics', icon: '🤖' },
    { id: 'chemical', name: 'Chemical Engineering', icon: '🧪' },
  ],
  'cs-it': [
    { id: 'software-dev', name: 'Software Development', icon: '</>' },
    { id: 'data-science', name: 'Data Science & Analytics', icon: '💾' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️' },
    { id: 'ai-ml', name: 'AI & Machine Learning', icon: '🤖' },
    { id: 'embedded', name: 'Embedded Systems', icon: '⚡' },
    { id: 'web-dev', name: 'Web Development', icon: '🌐' },
  ],
  design: [
    { id: 'graphic-design', name: 'Graphic Design', icon: '🖌️' },
    { id: 'ui-ux', name: 'UI/UX Design', icon: '📱' },
    { id: 'animation', name: 'Animation & Motion', icon: '🎬' },
    { id: 'game-design', name: 'Game Design', icon: '🎮' },
    { id: 'photography', name: 'Photography & Video', icon: '📷' },
    { id: 'architecture', name: 'Architecture', icon: '🏛️' },
  ],
  business: [
    { id: 'finance', name: 'Finance & Accounting', icon: '💰' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'entrepreneurship', name: 'Entrepreneurship', icon: '🚀' },
    { id: 'hr', name: 'Human Resources', icon: '👥' },
    { id: 'operations', name: 'Operations Management', icon: '📋' },
    { id: 'economics', name: 'Economics', icon: '📈' },
  ],
  science: [
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology & Life Sciences', icon: '🧬' },
    { id: 'math', name: 'Mathematics & Statistics', icon: '📐' },
    { id: 'environmental', name: 'Environmental Science', icon: '🌍' },
    { id: 'biotech', name: 'Biotechnology', icon: '🔬' },
  ],
  humanities: [
    { id: 'literature', name: 'Literature & Languages', icon: '📖' },
    { id: 'history', name: 'History & Political Science', icon: '🏛️' },
    { id: 'psychology', name: 'Psychology', icon: '🧠' },
    { id: 'media', name: 'Media & Communication', icon: '📺' },
    { id: 'fine-arts', name: 'Fine Arts', icon: '🎨' },
    { id: 'law', name: 'Law & Legal Studies', icon: '⚖️' },
  ],
  others: [
    { id: 'education', name: 'Education & Teaching', icon: '🎓' },
    { id: 'health', name: 'Health Sciences', icon: '🏥' },
    { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
    { id: 'sports', name: 'Sports & Physical Education', icon: '🏅' },
    { id: 'hospitality', name: 'Hospitality & Tourism', icon: '🏨' },
    { id: 'general', name: 'General / Undecided', icon: '📚' },
  ],
};

// Default summary content used as fallback
const defaultSummary: SummaryContent = {
  aiTools: ['ChatGPT Plus', 'Notion AI', 'Grammarly Premium'],
  courses: ['Coursera for Students', 'LinkedIn Learning', 'Skillshare Free'],
  perks: ['GitHub Student Pack', 'Microsoft Office 365', 'Canva Pro'],
};

export const summaryContent: Record<string, SummaryContent> = {
  // CS & IT
  'software-dev': {
    aiTools: ['GitHub Copilot', 'Cursor AI', 'VS Code Pro'],
    courses: ['Coursera CS', 'Udemy Pro', 'Google Cloud Skills', 'LinkedIn Learning'],
    perks: ['GitHub Student Pack', 'Azure Credits', 'AWS Educate', 'JetBrains License'],
  },
  'data-science': {
    aiTools: ['GitHub Copilot', 'Kaggle Notebooks', 'Google Colab Pro'],
    courses: ['Coursera Data Science', 'DataCamp', 'Udacity Nanodegree'],
    perks: ['GitHub Student Pack', 'Tableau Student', 'Azure Credits'],
  },
  cybersecurity: {
    aiTools: ['GitHub Copilot', 'Burp Suite Community', 'Snyk'],
    courses: ['Cybrary', 'TryHackMe Premium', 'Coursera Cybersecurity'],
    perks: ['GitHub Student Pack', 'AWS Educate', 'Azure Credits'],
  },
  'ai-ml': {
    aiTools: ['GitHub Copilot', 'Google Colab Pro', 'Hugging Face Pro'],
    courses: ['DeepLearning.AI', 'Fast.ai', 'Coursera ML Specialization'],
    perks: ['GitHub Student Pack', 'Google Cloud Credits', 'NVIDIA Developer'],
  },
  embedded: {
    aiTools: ['GitHub Copilot', 'PlatformIO', 'Keil MDK'],
    courses: ['Coursera Embedded', 'Udemy IoT', 'edX Embedded Systems'],
    perks: ['GitHub Student Pack', 'ARM University', 'Texas Instruments'],
  },
  'web-dev': {
    aiTools: ['GitHub Copilot', 'Cursor AI', 'VS Code Pro'],
    courses: ['Coursera CS', 'Udemy Pro', 'Google Cloud Skills', 'LinkedIn Learning'],
    perks: ['GitHub Student Pack', 'Azure Credits', 'AWS Educate', 'JetBrains License'],
  },
  // Engineering
  mechanical: {
    aiTools: ['MATLAB Student', 'Autodesk Fusion 360', 'SolidWorks Student'],
    courses: ['Coursera Engineering', 'NPTEL', 'edX Mechanical'],
    perks: ['Autodesk Education', 'MATLAB Student License', 'GrabCAD'],
  },
  electrical: {
    aiTools: ['MATLAB Student', 'LTSpice', 'Multisim'],
    courses: ['NPTEL Electrical', 'Coursera Circuits', 'edX Power Systems'],
    perks: ['MATLAB Student License', 'National Instruments', 'Altium Student'],
  },
  civil: {
    aiTools: ['AutoCAD Student', 'Revit Student', 'ETABS Student'],
    courses: ['NPTEL Civil', 'Coursera Structural', 'edX Construction'],
    perks: ['Autodesk Education', 'Bentley Student', 'SketchUp Free'],
  },
  electronics: {
    aiTools: ['MATLAB Student', 'Proteus', 'Eagle PCB'],
    courses: ['NPTEL Electronics', 'Coursera Signal Processing', 'edX VLSI'],
    perks: ['MATLAB Student License', 'Altium Student', 'Xilinx Academic'],
  },
  mechatronics: {
    aiTools: ['MATLAB Student', 'ROS Student', 'Arduino IDE Pro'],
    courses: ['Coursera Robotics', 'NPTEL Mechatronics', 'edX Control Systems'],
    perks: ['MATLAB Student License', 'Autodesk Education', 'Arduino Student'],
  },
  chemical: {
    aiTools: ['Aspen HYSYS Student', 'ChemDraw Student', 'MATLAB Student'],
    courses: ['NPTEL Chemical', 'Coursera Process Engineering', 'edX Thermodynamics'],
    perks: ['Aspen Student License', 'MATLAB Student License', 'COMSOL Academic'],
  },
  // Design
  'graphic-design': {
    aiTools: ['Figma Pro', 'Adobe Firefly', 'Canva Pro'],
    courses: ['Skillshare Design', 'Coursera Graphic Design', 'Domestika'],
    perks: ['Adobe Creative Cloud', 'Figma Education', 'Canva Pro Student'],
  },
  'ui-ux': {
    aiTools: ['Figma Pro', 'Maze', 'Hotjar Student'],
    courses: ['Google UX Certificate', 'Coursera Interaction Design', 'Designlab'],
    perks: ['Figma Education', 'InVision Education', 'Sketch Student'],
  },
  animation: {
    aiTools: ['Adobe After Effects', 'Blender', 'Runway ML'],
    courses: ['School of Motion', 'Coursera Animation', 'Domestika Motion'],
    perks: ['Adobe Creative Cloud', 'Maxon Student', 'Autodesk Maya Student'],
  },
  'game-design': {
    aiTools: ['Unity Student', 'Unreal Engine', 'Blender'],
    courses: ['Coursera Game Design', 'Udemy Game Dev', 'GameDev.tv'],
    perks: ['Unity Student Plan', 'Epic Games Student', 'Autodesk Education'],
  },
  photography: {
    aiTools: ['Adobe Lightroom', 'Luminar AI', 'Topaz AI'],
    courses: ['Skillshare Photography', 'Coursera Visual Arts', 'MasterClass'],
    perks: ['Adobe Creative Cloud', 'SmugMug Student', '500px Portfolio'],
  },
  architecture: {
    aiTools: ['Revit Student', 'SketchUp Pro', 'Rhino Student'],
    courses: ['Coursera Architecture', 'Archdaily Courses', 'NPTEL Architecture'],
    perks: ['Autodesk Education', 'Chaos V-Ray Student', 'Enscape Student'],
  },
  // Business
  finance: {
    aiTools: ['Bloomberg Terminal', 'Excel Pro', 'Tableau Student'],
    courses: ['Coursera Finance', 'CFI Student', 'edX Financial Analysis'],
    perks: ['Microsoft Office 365', 'Bloomberg Access', 'Wall Street Prep'],
  },
  marketing: {
    aiTools: ['HubSpot Student', 'Canva Pro', 'Semrush Academy'],
    courses: ['Google Digital Marketing', 'Coursera Marketing', 'HubSpot Academy'],
    perks: ['Canva Pro Student', 'Hootsuite Student', 'Mailchimp Student'],
  },
  entrepreneurship: {
    aiTools: ['Notion AI', 'Canva Pro', 'ChatGPT Plus'],
    courses: ['Coursera Entrepreneurship', 'Y Combinator Startup School', 'edX Business'],
    perks: ['AWS Activate', 'Stripe Atlas', 'Notion for Startups'],
  },
  hr: {
    aiTools: ['LinkedIn Premium', 'Notion AI', 'Grammarly Premium'],
    courses: ['Coursera HR', 'SHRM Learning', 'LinkedIn Learning HR'],
    perks: ['LinkedIn Premium Student', 'Microsoft Office 365', 'Canva Pro'],
  },
  operations: {
    aiTools: ['Tableau Student', 'Excel Pro', 'Notion AI'],
    courses: ['Coursera Operations', 'edX Supply Chain', 'APICS Student'],
    perks: ['Microsoft Office 365', 'Minitab Student', 'Smartsheet Student'],
  },
  economics: {
    aiTools: ['STATA Student', 'R Studio', 'Tableau Student'],
    courses: ['Coursera Economics', 'edX Econometrics', 'MIT OpenCourseWare'],
    perks: ['STATA Student License', 'EViews Student', 'Microsoft Office 365'],
  },
  // Science
  physics: {
    aiTools: ['MATLAB Student', 'Wolfram Alpha Pro', 'COMSOL Student'],
    courses: ['MIT OpenCourseWare', 'Coursera Physics', 'NPTEL Physics'],
    perks: ['MATLAB Student License', 'Wolfram Student', 'COMSOL Academic'],
  },
  chemistry: {
    aiTools: ['ChemDraw Student', 'Gaussian Student', 'MATLAB Student'],
    courses: ['Coursera Chemistry', 'NPTEL Chemistry', 'edX Organic Chemistry'],
    perks: ['ChemDraw Student License', 'ACS Student Membership', 'MATLAB Student'],
  },
  biology: {
    aiTools: ['MEGA Student', 'PyMOL Student', 'R Studio'],
    courses: ['Coursera Biology', 'NPTEL Life Sciences', 'edX Genomics'],
    perks: ['Benchling Academic', 'SnapGene Student', 'BioRender Student'],
  },
  math: {
    aiTools: ['MATLAB Student', 'Wolfram Alpha Pro', 'R Studio'],
    courses: ['MIT OpenCourseWare', 'Coursera Mathematics', 'NPTEL Math'],
    perks: ['MATLAB Student License', 'Wolfram Student', 'Overleaf Pro'],
  },
  environmental: {
    aiTools: ['ArcGIS Student', 'MATLAB Student', 'R Studio'],
    courses: ['Coursera Environmental', 'edX Climate Science', 'NPTEL Environmental'],
    perks: ['ESRI Student License', 'MATLAB Student', 'Google Earth Engine'],
  },
  biotech: {
    aiTools: ['Benchling Academic', 'SnapGene Student', 'MATLAB Student'],
    courses: ['Coursera Biotechnology', 'NPTEL Biotech', 'edX Bioinformatics'],
    perks: ['Benchling Academic', 'SnapGene Student', 'BioRender Student'],
  },
  // Humanities
  literature: {
    aiTools: ['Grammarly Premium', 'Notion AI', 'ChatGPT Plus'],
    courses: ['Coursera Literature', 'edX Creative Writing', 'MasterClass Writing'],
    perks: ['Grammarly Student', 'Scribd Student', 'JSTOR Access'],
  },
  history: {
    aiTools: ['Notion AI', 'Grammarly Premium', 'ChatGPT Plus'],
    courses: ['Coursera History', 'edX Political Science', 'Khan Academy'],
    perks: ['JSTOR Access', 'Scribd Student', 'Microsoft Office 365'],
  },
  psychology: {
    aiTools: ['SPSS Student', 'R Studio', 'Notion AI'],
    courses: ['Coursera Psychology', 'edX Behavioral Science', 'Khan Academy'],
    perks: ['APA PsycINFO Student', 'SPSS Student License', 'Qualtrics Student'],
  },
  media: {
    aiTools: ['Adobe Premiere Pro', 'Canva Pro', 'ChatGPT Plus'],
    courses: ['Coursera Media', 'Skillshare Video', 'Google Digital Marketing'],
    perks: ['Adobe Creative Cloud', 'Canva Pro Student', 'Hootsuite Student'],
  },
  'fine-arts': {
    aiTools: ['Adobe Creative Cloud', 'Procreate', 'Canva Pro'],
    courses: ['Skillshare Art', 'Domestika', 'Coursera Arts'],
    perks: ['Adobe Creative Cloud', 'Canva Pro Student', 'Artsy Student'],
  },
  law: {
    aiTools: ['Grammarly Premium', 'Notion AI', 'ChatGPT Plus'],
    courses: ['Coursera Law', 'edX Legal Studies', 'Swayam Law'],
    perks: ['Westlaw Student', 'LexisNexis Student', 'Microsoft Office 365'],
  },
  // Others
  education: {
    aiTools: ['Notion AI', 'Canva Pro', 'Grammarly Premium'],
    courses: ['Coursera Education', 'edX Teaching', 'Google Educator'],
    perks: ['Google Workspace Education', 'Canva Pro Student', 'Kahoot! Pro'],
  },
  health: {
    aiTools: ['Complete Anatomy Student', 'Notion AI', 'Grammarly Premium'],
    courses: ['Coursera Health', 'edX Public Health', 'Khan Academy Medicine'],
    perks: ['Amboss Student', 'Osmosis Student', 'UpToDate Student'],
  },
  agriculture: {
    aiTools: ['ArcGIS Student', 'MATLAB Student', 'R Studio'],
    courses: ['Coursera Agriculture', 'NPTEL Agriculture', 'edX Food Science'],
    perks: ['ESRI Student License', 'MATLAB Student', 'Climate FieldView'],
  },
  sports: {
    aiTools: ['Notion AI', 'Canva Pro', 'ChatGPT Plus'],
    courses: ['Coursera Sports Science', 'edX Exercise Physiology', 'NSCA Student'],
    perks: ['NSCA Student Membership', 'Strava Student', 'Microsoft Office 365'],
  },
  hospitality: {
    aiTools: ['Canva Pro', 'Notion AI', 'ChatGPT Plus'],
    courses: ['Coursera Hospitality', 'edX Tourism', 'eCornell Hospitality'],
    perks: ['Canva Pro Student', 'Microsoft Office 365', 'Amadeus Student'],
  },
  general: {
    aiTools: ['ChatGPT Plus', 'Notion AI', 'Grammarly Premium'],
    courses: ['Coursera for Students', 'LinkedIn Learning', 'Skillshare Free'],
    perks: ['GitHub Student Pack', 'Microsoft Office 365', 'Canva Pro'],
  },
};

export function getSummaryForSpecialization(specId: string): SummaryContent {
  return summaryContent[specId] || defaultSummary;
}

export function getDepartmentById(deptId: string): Department | undefined {
  return departments.find((d) => d.id === deptId);
}

export function getSpecializationsForDepartment(deptId: string): Specialization[] {
  return specializations[deptId] || [];
}
