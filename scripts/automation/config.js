const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

module.exports = {
  CSV_PATH: path.join(PROJECT_ROOT, 'public', 'assets', 'Name-Category-Description-DiscountOfferINR-VerificationMethod-Validity-ClaimLink.csv'),

  REPORTS_DIR: path.join(__dirname, 'reports'),
  STAGING_DIR: path.join(__dirname, 'staging'),

  CONCURRENCY_LIMIT: 5,
  REQUEST_TIMEOUT: 10000,
  MAX_REDIRECTS: 5,

  USER_AGENT: 'StudentsHub-Bot/1.0',

  CSV_COLUMNS: ['title', 'category', 'description', 'DiscountOffer', 'VerificationMethod', 'validity', 'claimlink', 'isActive'],

  MIN_ROW_COUNT: 30,

  KNOWN_SOURCES: [
    { name: 'GitHub Education', url: 'https://education.github.com/pack' },
    { name: 'UNiDAYS', url: 'https://www.myunidays.com/GB/en-GB/category/all' },
    { name: 'Student Beans', url: 'https://www.studentbeans.com/student-discount' },
    { name: 'Figma Education', url: 'https://www.figma.com/education/' },
    { name: 'JetBrains Education', url: 'https://www.jetbrains.com/community/education/#students' },
  ],
};
