/**
 * Appwrite Function: resendVerification
 * 
 * Trigger: HTTP POST
 * Purpose: Allow users to request verification email resend with rate limiting
 * 
 * Environment Variables Required:
 * - APPWRITE_ENDPOINT
 * - APPWRITE_PROJECT
 * - APPWRITE_API_KEY
 * - DB_ID
 * - USERS_META_COLLECTION
 * - AUDIT_LOG_COLLECTION
 * - RATE_LIMIT_RESEND (default: 3)
 * - FRONTEND_URL (for verification redirect)
 */

const sdk = require('node-appwrite');
const { 
  checkRateLimit, 
  validateSession, 
  log, 
  createAuditLog,
  sanitizeError 
} = require('../shared/utils');

module.exports = async function (req, res) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body = JSON.parse(req.payload || '{}');
    
    // Initialize Appwrite client
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_API_KEY);
    
    const databases = new sdk.Databases(client);
    const users = new sdk.Users(client);
    
    const DB_ID = process.env.DB_ID;
    const USERS_META_COLLECTION = process.env.USERS_META_COLLECTION;
    const AUDIT_LOG_COLLECTION = process.env.AUDIT_LOG_COLLECTION;
    const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_RESEND || '3');
    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://studentperks.me';
    
    // Validate session
    const sessionClient = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT);
    
    const sessionValidation = await validateSession(req, sessionClient);
    
    if (!sessionValidation.valid) {
      log('warn', 'Invalid session for resend verification', { 
        error: sessionValidation.error 
      });
      
      return res.json({ 
        ok: false, 
        error: 'Unauthorized',
        code: 'INVALID_SESSION'
      }, 401);
    }
    
    const user = sessionValidation.user;
    const userId = user.$id;
    const email = user.email;
    
    log('info', 'Resend verification requested', { userId, email });
    
    // Check if already verified
    if (user.emailVerification) {
      log('info', 'Email already verified', { userId });
      return res.json({ 
        ok: false, 
        error: 'Email already verified',
        code: 'ALREADY_VERIFIED'
      }, 400);
    }
    
    // Get user meta for rate limiting
    let userMeta;
    try {
      userMeta = await databases.getDocument(DB_ID, USERS_META_COLLECTION, userId);
    } catch (error) {
      // Create user meta if doesn't exist
      userMeta = await databases.createDocument(
        DB_ID, 
        USERS_META_COLLECTION, 
        userId,
        {
          role: 'guest',
          verified: false,
          email,
          signupSource: 'email',
          createdAt: new Date().toISOString(),
          resendCountWindow: 0,
          lastVerificationResend: null
        }
      );
    }
    
    // Check rate limit
    const rateLimit = checkRateLimit(
      userMeta.lastVerificationResend ? 
        new Date(userMeta.lastVerificationResend).getTime() : null,
      userMeta.resendCountWindow || 0,
      RATE_LIMIT
    );
    
    if (!rateLimit.allowed) {
      log('warn', 'Rate limit exceeded for resend', { 
        userId, 
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt 
      });
      
      return res.json({
        ok: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: rateLimit.resetAt,
        remaining: rateLimit.remaining
      }, 429);
    }
    
    // Create verification using Appwrite built-in
    const redirectUrl = `${FRONTEND_URL}/verify-email`;
    
    try {
      // Use Appwrite Account API to create verification
      // Note: This requires server-side SDK with admin privileges
      await users.createEmailVerification(redirectUrl);
      
      // Update rate limit counters
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      const shouldResetCount = !userMeta.lastVerificationResend || 
                               userMeta.lastVerificationResend < oneHourAgo;
      
      await databases.updateDocument(
        DB_ID,
        USERS_META_COLLECTION,
        userId,
        {
          lastVerificationResend: now,
          resendCountWindow: shouldResetCount ? 1 : (userMeta.resendCountWindow || 0) + 1
        }
      );
      
      // Create audit log
      await createAuditLog(databases, DB_ID, AUDIT_LOG_COLLECTION, {
        userId,
        email,
        event: 'verification_resent',
        method: 'appwrite_builtin',
        remaining: rateLimit.remaining - 1
      });
      
      const duration = Date.now() - startTime;
      log('info', 'Verification email resent successfully', { 
        userId, 
        email,
        duration,
        remaining: rateLimit.remaining - 1
      });
      
      return res.json({
        ok: true,
        message: 'Verification email sent',
        remaining: rateLimit.remaining - 1,
        duration
      });
      
    } catch (error) {
      log('error', 'Failed to send verification email', { 
        userId,
        error: error.message,
        code: error.code
      });
      
      // Create error audit log
      await createAuditLog(databases, DB_ID, AUDIT_LOG_COLLECTION, {
        userId,
        email,
        event: 'verification_resend_failed',
        error: error.message
      });
      
      throw error;
    }
    
  } catch (error) {
    const duration = Date.now() - startTime;
    log('error', 'resendVerification failed', { 
      error: error.message,
      stack: error.stack,
      duration
    });
    
    return res.json({
      ok: false,
      ...sanitizeError(error),
      duration
    }, 500);
  }
};
