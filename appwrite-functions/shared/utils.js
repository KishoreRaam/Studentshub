// Shared utilities for Appwrite Functions

/**
 * Validate if email domain is allowed
 */
function isAllowedDomain(email, allowedDomains) {
  if (!email || !allowedDomains) return false;
  
  const domain = email.split('@').pop().toLowerCase().trim();
  const allowed = allowedDomains.split(',').map(d => d.trim().toLowerCase());
  
  return allowed.includes(domain);
}

/**
 * Rate limiter check for resends
 */
function checkRateLimit(lastResend, resendCount, rateLimitPerHour = 3) {
  if (!lastResend) return { allowed: true, remaining: rateLimitPerHour };
  
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const count = lastResend > oneHourAgo ? resendCount : 0;
  
  return {
    allowed: count < rateLimitPerHour,
    remaining: Math.max(0, rateLimitPerHour - count),
    resetAt: new Date(lastResend + (60 * 60 * 1000))
  };
}

/**
 * Exponential backoff retry
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (client errors)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Safe JSON parse
 */
function safeJsonParse(str, fallback = {}) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

/**
 * Log with timestamp and context
 */
function log(level, message, context = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...context
  };
  
  console.log(JSON.stringify(logEntry));
}

/**
 * Validate Appwrite session
 */
async function validateSession(req, appwriteClient) {
  try {
    const sessionToken = req.headers['x-appwrite-jwt'] || 
                        req.headers['authorization']?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return { valid: false, error: 'No session token provided' };
    }
    
    // Set JWT for client
    appwriteClient.setJWT(sessionToken);
    
    const account = new require('node-appwrite').Account(appwriteClient);
    const user = await account.get();
    
    return { valid: true, user };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Check if user has required role
 */
async function hasRole(userId, requiredRole, databases, dbId, collectionId) {
  try {
    const doc = await databases.getDocument(dbId, collectionId, userId);
    return doc.role === requiredRole;
  } catch (error) {
    return false;
  }
}

/**
 * Create audit log entry
 */
async function createAuditLog(databases, dbId, collectionId, entry) {
  try {
    await databases.createDocument(dbId, collectionId, 'unique()', {
      ...entry,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    log('error', 'Failed to create audit log', { error: error.message, entry });
  }
}

/**
 * Sanitize error for client response
 */
function sanitizeError(error) {
  return {
    error: true,
    message: error.message || 'An error occurred',
    code: error.code || 'UNKNOWN_ERROR'
  };
}

module.exports = {
  isAllowedDomain,
  checkRateLimit,
  retryWithBackoff,
  safeJsonParse,
  log,
  validateSession,
  hasRole,
  createAuditLog,
  sanitizeError
};
