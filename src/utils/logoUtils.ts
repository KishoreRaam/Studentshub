const BRANDFETCH_KEY = '1idHgzTH40svQnGmzjQ';

export function getBrandfetchUrl(domain: string): string {
  return `https://cdn.brandfetch.io/${domain}?c=${BRANDFETCH_KEY}&type=logo&theme=light&fallback=brandfetch`;
}

export function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

const BRAND_DOMAINS: Record<string, string> = {
  'Microsoft 365': 'microsoft.com',
  'Spotify Premium': 'spotify.com',
  'Adobe Creative Cloud': 'adobe.com',
  'Figma Professional': 'figma.com',
  'Figma': 'figma.com',
  'GitHub Student Pack': 'github.com',
  'StudentGithub Pack': 'github.com',
  'GitHub Student Developer Pack': 'github.com',
  'Amazon Prime Student': 'amazon.com',
  'Todoist': 'todoist.com',
  'Evernote': 'evernote.com',
  'Dell Student Store': 'dell.com',
  'HP Student Store': 'hp.com',
  'Disney+ Hotstar': 'hotstar.com',
  "Domino's Pizza": 'dominos.com',
  "McDonald's": 'mcdonalds.com',
  'JetBrains': 'jetbrains.com',
  'JetBrains Student Pack': 'jetbrains.com',
  'DigitalOcean': 'digitalocean.com',
  'Namecheap': 'namecheap.com',
  'MongoDB Atlas': 'mongodb.com',
  'Canva Pro': 'canva.com',
  'Canva': 'canva.com',
  'Auth0': 'auth0.com',
  'Stripe': 'stripe.com',
  'Mailgun': 'mailgun.com',
  'Heroku': 'heroku.com',
  'Notion': 'notion.so',
  'Apple Music': 'apple.com',
  'Google Workspace for Education': 'google.com',
  'Coursera': 'coursera.org',
  'Udemy': 'udemy.com',
  'LinkedIn Learning': 'linkedin.com',
  'Apple Education Store': 'apple.com',
  'Lenovo Student Store': 'lenovo.com',
  'Samsung Student Offers': 'samsung.com',
  'Autodesk': 'autodesk.com',
  'MATLAB': 'mathworks.com',
  'Dropbox': 'dropbox.com',
  '1Password': '1password.com',
  'LastPass': 'lastpass.com',
  'Hulu': 'hulu.com',
  'SolidWorks': 'solidworks.com',
  'RoboForm': 'roboform.com',
  'Alibaba Cloud Academy': 'alibabacloud.com',
  'Spotify': 'spotify.com',
  'Adobe': 'adobe.com',
  'Microsoft': 'microsoft.com',
  'Google': 'google.com',
  'Apple': 'apple.com',
  'Samsung': 'samsung.com',
  'Lenovo': 'lenovo.com',
  'Dell': 'dell.com',
  'HP': 'hp.com',
};

/**
 * Get a Brandfetch logo URL for a brand.
 * Tries: curated mapping → extract domain from URL → guess from name.
 */
export function getLogoUrl(brandName: string, websiteUrl?: string): string {
  const trimmed = brandName.trim();

  // 1. Check curated mapping
  const domain = BRAND_DOMAINS[trimmed];
  if (domain) return getBrandfetchUrl(domain);

  // 2. Try extracting domain from provided URL
  if (websiteUrl) {
    const extracted = extractDomain(websiteUrl);
    if (extracted) return getBrandfetchUrl(extracted);
  }

  // 3. Guess domain from brand name (strip common suffixes)
  const slug = trimmed
    .toLowerCase()
    .replace(/\s*(student|pack|premium|pro|education|store|offers|academy|professional|creative cloud)\s*/gi, '')
    .replace(/[^a-z0-9]+/g, '')
    .trim();

  if (slug) return getBrandfetchUrl(`${slug}.com`);

  return '';
}
