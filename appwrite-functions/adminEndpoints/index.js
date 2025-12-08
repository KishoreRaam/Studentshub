/**
 * Appwrite Function: adminEndpoints
 * 
 * Trigger: HTTP (GET/POST)
 * Purpose: Admin-only endpoints for user management and monitoring
 * 
 * Routes:
 * - GET /admin/users/:id - Get user details
 * - POST /admin/users/:id/role - Update user role
 * - GET /admin/email-logs - View email logs
 * - GET /admin/audit-logs - View audit logs
 * - GET /admin/stats - Get system statistics
 */

const sdk = require('node-appwrite');
const { log, sanitizeError } = require('../shared/utils');

/**
 * Validate admin API key
 */
function validateAdminKey(req) {
  const apiKey = req.headers['x-admin-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const expectedKey = process.env.ADMIN_API_KEY;
  
  if (!apiKey || !expectedKey) {
    return false;
  }
  
  return apiKey === expectedKey;
}

/**
 * Parse route and method
 */
function parseRequest(req) {
  const path = req.path || req.url || '';
  const method = req.method || 'GET';
  
  // Extract route parameters
  const userIdMatch = path.match(/\/admin\/users\/([^\/]+)/);
  const userId = userIdMatch ? userIdMatch[1] : null;
  
  return { path, method, userId };
}

/**
 * GET /admin/users/:id
 */
async function getUserDetails(userId, databases, users, dbId, usersMetaCollection) {
  try {
    // Get Appwrite user
    const user = await users.get(userId);
    
    // Get user meta
    let userMeta;
    try {
      userMeta = await databases.getDocument(dbId, usersMetaCollection, userId);
    } catch (error) {
      userMeta = null;
    }
    
    return {
      ok: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email,
        emailVerification: user.emailVerification,
        status: user.status,
        registration: user.registration,
        ...userMeta
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * POST /admin/users/:id/role
 */
async function updateUserRole(userId, newRole, databases, dbId, usersMetaCollection, auditLogCollection) {
  const validRoles = ['guest', 'student', 'admin', 'banned'];
  
  if (!validRoles.includes(newRole)) {
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }
  
  try {
    // Update user meta
    await databases.updateDocument(
      dbId,
      usersMetaCollection,
      userId,
      { 
        role: newRole,
        notes: `Role manually updated to ${newRole} by admin at ${new Date().toISOString()}`
      }
    );
    
    // Create audit log
    await databases.createDocument(
      dbId,
      auditLogCollection,
      'unique()',
      {
        userId,
        event: 'admin_role_change',
        role: newRole,
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        metadata: JSON.stringify({ 
          changedBy: 'admin',
          previousRole: 'unknown' 
        })
      }
    );
    
    return {
      ok: true,
      message: `Role updated to ${newRole}`,
      userId,
      newRole
    };
  } catch (error) {
    throw error;
  }
}

/**
 * GET /admin/email-logs
 */
async function getEmailLogs(databases, dbId, emailLogCollection, limit = 50) {
  try {
    const logs = await databases.listDocuments(
      dbId,
      emailLogCollection,
      [
        sdk.Query.limit(limit),
        sdk.Query.orderDesc('sentAt')
      ]
    );
    
    return {
      ok: true,
      logs: logs.documents,
      total: logs.total
    };
  } catch (error) {
    throw error;
  }
}

/**
 * GET /admin/audit-logs
 */
async function getAuditLogs(databases, dbId, auditLogCollection, limit = 100) {
  try {
    const logs = await databases.listDocuments(
      dbId,
      auditLogCollection,
      [
        sdk.Query.limit(limit),
        sdk.Query.orderDesc('timestamp')
      ]
    );
    
    return {
      ok: true,
      logs: logs.documents,
      total: logs.total
    };
  } catch (error) {
    throw error;
  }
}

/**
 * GET /admin/stats
 */
async function getStats(databases, dbId, usersMetaCollection, emailLogCollection) {
  try {
    // Get user counts by role
    const allUsers = await databases.listDocuments(dbId, usersMetaCollection);
    
    const stats = {
      totalUsers: allUsers.total,
      byRole: {},
      verified: 0,
      unverified: 0
    };
    
    allUsers.documents.forEach(user => {
      // Count by role
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
      
      // Count verified/unverified
      if (user.verified) {
        stats.verified++;
      } else {
        stats.unverified++;
      }
    });
    
    // Get email stats
    const recentEmails = await databases.listDocuments(
      dbId,
      emailLogCollection,
      [sdk.Query.limit(1000)]
    );
    
    stats.emails = {
      total: recentEmails.total,
      sent: 0,
      failed: 0,
      bounced: 0
    };
    
    recentEmails.documents.forEach(email => {
      if (email.status === 'sent') stats.emails.sent++;
      if (email.status === 'failed') stats.emails.failed++;
      if (email.status === 'bounced') stats.emails.bounced++;
    });
    
    return { ok: true, stats };
  } catch (error) {
    throw error;
  }
}

module.exports = async function (req, res) {
  const startTime = Date.now();
  
  try {
    // Validate admin key
    if (!validateAdminKey(req)) {
      log('warn', 'Unauthorized admin access attempt', { 
        ip: req.headers['x-forwarded-for'] || 'unknown' 
      });
      
      return res.json({
        ok: false,
        error: 'Unauthorized',
        code: 'INVALID_ADMIN_KEY'
      }, 401);
    }
    
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
    const EMAIL_LOG_COLLECTION = process.env.EMAIL_LOG_COLLECTION;
    
    // Parse request
    const { path, method, userId } = parseRequest(req);
    const body = req.payload ? JSON.parse(req.payload) : {};
    
    log('info', 'Admin endpoint called', { path, method, userId });
    
    let result;
    
    // Route handling
    if (path.includes('/admin/users/') && path.includes('/role') && method === 'POST') {
      // Update user role
      result = await updateUserRole(
        userId,
        body.role,
        databases,
        DB_ID,
        USERS_META_COLLECTION,
        AUDIT_LOG_COLLECTION
      );
    } else if (path.includes('/admin/users/') && method === 'GET') {
      // Get user details
      result = await getUserDetails(
        userId,
        databases,
        users,
        DB_ID,
        USERS_META_COLLECTION
      );
    } else if (path.includes('/admin/email-logs')) {
      // Get email logs
      const limit = parseInt(req.query?.limit || '50');
      result = await getEmailLogs(databases, DB_ID, EMAIL_LOG_COLLECTION, limit);
    } else if (path.includes('/admin/audit-logs')) {
      // Get audit logs
      const limit = parseInt(req.query?.limit || '100');
      result = await getAuditLogs(databases, DB_ID, AUDIT_LOG_COLLECTION, limit);
    } else if (path.includes('/admin/stats')) {
      // Get stats
      result = await getStats(databases, DB_ID, USERS_META_COLLECTION, EMAIL_LOG_COLLECTION);
    } else {
      return res.json({
        ok: false,
        error: 'Route not found',
        code: 'NOT_FOUND'
      }, 404);
    }
    
    const duration = Date.now() - startTime;
    return res.json({ ...result, duration });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    log('error', 'Admin endpoint error', { 
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
