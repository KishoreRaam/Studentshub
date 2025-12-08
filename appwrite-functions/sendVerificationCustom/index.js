/**
 * Appwrite Function: sendVerificationCustom
 * 
 * Trigger: HTTP POST
 * Purpose: Send custom verification emails using SendGrid templates
 * 
 * Environment Variables Required:
 * - APPWRITE_ENDPOINT
 * - APPWRITE_PROJECT
 * - APPWRITE_API_KEY
 * - SENDGRID_API_KEY
 * - SENDGRID_TEMPLATE_ID
 * - SENDER_EMAIL
 * - FRONTEND_URL
 * - DB_ID
 * - USERS_META_COLLECTION
 * - EMAIL_LOG_COLLECTION
 */

const sdk = require('node-appwrite');
const fetch = require('node-fetch');
const { 
  retryWithBackoff, 
  validateSession, 
  log, 
  createAuditLog,
  sanitizeError 
} = require('../shared/utils');

/**
 * Send email via SendGrid
 */
async function sendSendGridEmail(to, templateId, dynamicData, from) {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  const payload = {
    personalizations: [{
      to: [{ email: to }],
      dynamic_template_data: dynamicData
    }],
    from: { email: from },
    template_id: templateId
  };
  
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${response.status} - ${error}`);
  }
  
  return response;
}

module.exports = async function (req, res) {
  const startTime = Date.now();
  
  try {
    // Initialize Appwrite client
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_API_KEY);
    
    const databases = new sdk.Databases(client);
    const users = new sdk.Users(client);
    const account = new sdk.Account(client);
    
    const DB_ID = process.env.DB_ID;
    const USERS_META_COLLECTION = process.env.USERS_META_COLLECTION;
    const EMAIL_LOG_COLLECTION = process.env.EMAIL_LOG_COLLECTION;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://studentperks.me';
    const SENDER_EMAIL = process.env.SENDER_EMAIL;
    const TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID;
    
    // Validate session
    const sessionClient = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT);
    
    const sessionValidation = await validateSession(req, sessionClient);
    
    if (!sessionValidation.valid) {
      return res.json({ 
        ok: false, 
        error: 'Unauthorized',
        code: 'INVALID_SESSION'
      }, 401);
    }
    
    const user = sessionValidation.user;
    const userId = user.$id;
    const email = user.email;
    const name = user.name || email.split('@')[0];
    
    log('info', 'Custom verification email requested', { userId, email });
    
    // Check if already verified
    if (user.emailVerification) {
      return res.json({ 
        ok: false, 
        error: 'Email already verified',
        code: 'ALREADY_VERIFIED'
      }, 400);
    }
    
    // Generate verification link using Appwrite
    // First create a verification token
    const redirectUrl = `${FRONTEND_URL}/verify-email`;
    let verificationUrl = redirectUrl;
    
    try {
      // Create Appwrite verification (this generates a token)
      // The actual URL with token will be sent by Appwrite
      // For custom emails, we need to extract or generate our own token
      
      // Option 1: Use Appwrite's built-in but with custom redirect
      await users.createEmailVerification(redirectUrl);
      
      // The verification URL would be: redirectUrl?userId=xxx&secret=xxx
      // Appwrite will include these params when user clicks
      verificationUrl = redirectUrl;
      
    } catch (error) {
      log('error', 'Failed to create verification token', { 
        error: error.message 
      });
      throw error;
    }
    
    // Prepare SendGrid template data
    const dynamicData = {
      user_name: name,
      verification_link: verificationUrl,
      project_name: 'StudentPerks',
      support_email: SENDER_EMAIL,
      current_year: new Date().getFullYear()
    };
    
    // Send email with retry logic
    const sendEmail = async () => {
      return await sendSendGridEmail(
        email,
        TEMPLATE_ID,
        dynamicData,
        SENDER_EMAIL
      );
    };
    
    try {
      await retryWithBackoff(sendEmail, 3, 1000);
      
      // Log email send success
      await databases.createDocument(
        DB_ID,
        EMAIL_LOG_COLLECTION,
        'unique()',
        {
          userId,
          email,
          type: 'verification',
          provider: 'sendgrid',
          templateId: TEMPLATE_ID,
          status: 'sent',
          sentAt: new Date().toISOString(),
          metadata: JSON.stringify({ 
            method: 'custom_sendgrid',
            dynamicData: Object.keys(dynamicData)
          })
        }
      );
      
      // Create audit log
      await createAuditLog(databases, DB_ID, process.env.AUDIT_LOG_COLLECTION, {
        userId,
        email,
        event: 'custom_verification_sent',
        provider: 'sendgrid'
      });
      
      const duration = Date.now() - startTime;
      log('info', 'Custom verification email sent', { 
        userId, 
        email,
        duration
      });
      
      return res.json({
        ok: true,
        message: 'Verification email sent',
        duration
      });
      
    } catch (error) {
      // Log email send failure
      await databases.createDocument(
        DB_ID,
        EMAIL_LOG_COLLECTION,
        'unique()',
        {
          userId,
          email,
          type: 'verification',
          provider: 'sendgrid',
          templateId: TEMPLATE_ID,
          status: 'failed',
          sentAt: new Date().toISOString(),
          error: error.message,
          metadata: JSON.stringify({ 
            method: 'custom_sendgrid',
            attempts: 3
          })
        }
      );
      
      throw error;
    }
    
  } catch (error) {
    const duration = Date.now() - startTime;
    log('error', 'sendVerificationCustom failed', { 
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
