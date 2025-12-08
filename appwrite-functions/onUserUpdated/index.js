/**
 * Appwrite Function: onUserUpdated
 * 
 * Trigger: users.*.update event
 * Purpose: Automatically assign 'student' role when email is verified
 *          and domain is on allowed list
 * 
 * Environment Variables Required:
 * - APPWRITE_ENDPOINT
 * - APPWRITE_PROJECT
 * - APPWRITE_API_KEY
 * - ALLOWED_DOMAINS (comma-separated)
 * - DB_ID
 * - USERS_META_COLLECTION
 * - AUDIT_LOG_COLLECTION
 */

const sdk = require('node-appwrite');
const { isAllowedDomain, retryWithBackoff, log, createAuditLog } = require('../shared/utils');

module.exports = async function (req, res) {
  const startTime = Date.now();
  
  try {
    // Parse event payload
    const payload = JSON.parse(req.payload || '{}');
    const user = payload?.user || payload;
    
    if (!user || !user.$id) {
      log('warn', 'Invalid payload received', { payload });
      return res.json({ ok: true, skipped: 'invalid_payload' });
    }
    
    const userId = user.$id;
    const email = user.email;
    const emailVerified = user.emailVerification === true;
    
    log('info', 'Processing user update', { userId, email, emailVerified });
    
    // Skip if email not verified
    if (!emailVerified) {
      log('info', 'Email not verified, skipping', { userId });
      return res.json({ ok: true, skipped: 'not_verified' });
    }
    
    // Initialize Appwrite client with admin key
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_API_KEY);
    
    const users = new sdk.Users(client);
    const databases = new sdk.Databases(client);
    
    const DB_ID = process.env.DB_ID;
    const USERS_META_COLLECTION = process.env.USERS_META_COLLECTION;
    const AUDIT_LOG_COLLECTION = process.env.AUDIT_LOG_COLLECTION;
    
    // Check if user meta already has verified status
    let userMeta;
    try {
      userMeta = await databases.getDocument(DB_ID, USERS_META_COLLECTION, userId);
      
      // If already verified and role assigned, skip
      if (userMeta.verified && userMeta.role === 'student') {
        log('info', 'User already processed', { userId });
        return res.json({ ok: true, skipped: 'already_processed' });
      }
    } catch (error) {
      // Document doesn't exist, will be created below
      log('info', 'User meta not found, will create', { userId });
    }
    
    // Validate domain
    const allowedDomains = process.env.ALLOWED_DOMAINS;
    const domainAllowed = isAllowedDomain(email, allowedDomains);
    
    log('info', 'Domain validation', { 
      email, 
      domainAllowed, 
      allowedDomains: allowedDomains?.split(',').map(d => d.trim()) 
    });
    
    // Retry logic for database operations
    const updateUserMeta = async () => {
      if (domainAllowed) {
        // Allowed domain: assign student role
        const data = {
          role: 'student',
          verified: true,
          email,
          verifiedAt: new Date().toISOString()
        };
        
        if (userMeta) {
          await databases.updateDocument(DB_ID, USERS_META_COLLECTION, userId, data);
        } else {
          await databases.createDocument(DB_ID, USERS_META_COLLECTION, userId, {
            ...data,
            signupSource: 'email',
            createdAt: new Date().toISOString(),
            resendCountWindow: 0
          });
        }
        
        // Update Appwrite user preferences (optional custom attributes)
        try {
          await users.updatePrefs(userId, { role: 'student', verified: true });
        } catch (error) {
          log('warn', 'Failed to update user prefs', { error: error.message });
        }
        
        // Create audit log
        await createAuditLog(databases, DB_ID, AUDIT_LOG_COLLECTION, {
          userId,
          email,
          event: 'role_assigned',
          role: 'student',
          domain: email.split('@').pop(),
          metadata: { emailVerified: true }
        });
        
        log('info', 'Student role assigned successfully', { userId, email });
        
        return { success: true, role: 'student' };
      } else {
        // Not allowed domain: mark verified but don't assign student role
        const data = {
          role: 'guest',
          verified: true,
          email,
          verifiedAt: new Date().toISOString(),
          notes: 'Email verified but domain not on allowed list'
        };
        
        if (userMeta) {
          await databases.updateDocument(DB_ID, USERS_META_COLLECTION, userId, data);
        } else {
          await databases.createDocument(DB_ID, USERS_META_COLLECTION, userId, {
            ...data,
            signupSource: 'email',
            createdAt: new Date().toISOString(),
            resendCountWindow: 0
          });
        }
        
        // Create audit log for review
        await createAuditLog(databases, DB_ID, AUDIT_LOG_COLLECTION, {
          userId,
          email,
          event: 'verified_non_allowed_domain',
          role: 'guest',
          domain: email.split('@').pop(),
          needsReview: true,
          metadata: { emailVerified: true, reason: 'Domain not on allowed list' }
        });
        
        log('warn', 'Email verified but domain not allowed', { userId, email });
        
        return { success: true, role: 'guest', needsReview: true };
      }
    };
    
    // Execute with retry
    const result = await retryWithBackoff(updateUserMeta, 3, 1000);
    
    const duration = Date.now() - startTime;
    log('info', 'User update completed', { userId, duration, result });
    
    return res.json({ 
      ok: true, 
      userId, 
      role: result.role,
      duration 
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    log('error', 'onUserUpdated failed', { 
      error: error.message, 
      stack: error.stack,
      duration 
    });
    
    // Return success to avoid retries on unrecoverable errors
    // Log error for monitoring
    return res.json({ 
      ok: false, 
      error: error.message,
      duration 
    });
  }
};
