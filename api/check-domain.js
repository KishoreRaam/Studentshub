const dns = require('dns').promises;

/**
 * DNS-based domain availability checker
 * Checks if a domain with specified extension has DNS records (A, MX, or NS)
 * 
 * Logic:
 * - If DNS records exist -> domain is NOT available (in use)
 * - If no DNS records or lookup fails -> domain is AVAILABLE
 * 
 * This is a probabilistic check and not a guarantee of availability
 */
async function checkDomainAvailability(domain, extension = '.edu.in') {
  // Remove leading dot if present in extension
  const cleanExtension = extension.startsWith('.') ? extension.slice(1) : extension;
  const fullDomain = `${domain}.${cleanExtension}`;
  
  try {
    // Check for different types of DNS records
    const checks = await Promise.allSettled([
      dns.resolve4(fullDomain),    // A records (IPv4)
      dns.resolveMx(fullDomain),   // MX records (Mail Exchange)
      dns.resolveNs(fullDomain),   // NS records (Name Server)
    ]);

    // If any DNS record exists, domain is not available
    const hasRecords = checks.some(result => 
      result.status === 'fulfilled' && result.value && result.value.length > 0
    );

    if (hasRecords) {
      return { available: false };
    }

    // No records found - domain appears available
    return { available: true };
    
  } catch (error) {
    // DNS lookup error usually means domain doesn't exist
    // Treat as available (probabilistic indicator)
    return { available: true };
  }
}

/**
 * API Handler for Vercel/Serverless environment
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { domain, extension } = req.body;

    if (!domain || typeof domain !== 'string') {
      res.status(400).json({ error: 'Domain parameter is required' });
      return;
    }

    // Validate domain format (basic alphanumeric and hyphens)
    if (!/^[a-z0-9-]+$/.test(domain)) {
      res.status(400).json({ error: 'Invalid domain format' });
      return;
    }

    // Validate extension (if provided)
    const validExtensions = ['.edu.in', '.ac.in', '.edu', '.org', '.in'];
    const domainExtension = extension || '.edu.in';
    
    if (!validExtensions.includes(domainExtension)) {
      res.status(400).json({ error: 'Invalid domain extension' });
      return;
    }

    const result = await checkDomainAvailability(domain, domainExtension);
    res.status(200).json(result);

  } catch (error) {
    console.error('Domain check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// For local development with Express
if (require.main === module) {
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  
  app.use(bodyParser.json());
  app.use(require('cors')());
  
  app.post('/api/check-domain', module.exports);
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}
