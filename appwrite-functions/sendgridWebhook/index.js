/**
 * Appwrite Function: sendgridWebhook
 * 
 * Trigger: HTTP POST
 * Purpose: Handle SendGrid webhook events (bounces, spam reports, etc.)
 * 
 * Environment Variables Required:
 * - APPWRITE_ENDPOINT
 * - APPWRITE_PROJECT
 * - APPWRITE_API_KEY
 * - SENDGRID_WEBHOOK_SECRET (optional, for signature verification)
 * - DB_ID
 * - USERS_META_COLLECTION
 * - EMAIL_LOG_COLLECTION
 */

const sdk = require('node-appwrite');
const crypto = require('crypto');
const { log, sanitizeError } = require('../shared/utils');

/**
 * Verify SendGrid webhook signature
 */
function verifySignature(payload, signature, timestamp, secret) {
  if (!secret || !signature) {
    return true; // Skip verification if not configured
  }
  
  try {
    const data = timestamp + payload;
    const hash = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64');
    
    return hash === signature;
  } catch (error) {
    log('error', 'Signature verification failed', { error: error.message });
    return false;
  }
}

/**
 * Process SendGrid event
 */
async function processEvent(event, databases, dbId, usersMetaCollection, emailLogCollection) {
  const { email, event: eventType, timestamp, reason, sg_message_id } = event;
  
  log('info', 'Processing SendGrid event', { email, eventType });
  
  try {
    // Find user by email
    const users = await databases.listDocuments(
      dbId,
      usersMetaCollection,
      [sdk.Query.equal('email', email)]
    );
    
    if (users.total === 0) {
      log('warn', 'User not found for email event', { email, eventType });
      return { processed: false, reason: 'user_not_found' };
    }
    
    const user = users.documents[0];
    const userId = user.$id;
    
    // Handle different event types
    switch (eventType) {
      case 'bounce':
      case 'dropped':
        // Mark email as bounced
        await databases.updateDocument(
          dbId,
          usersMetaCollection,
          userId,
          {
            emailDeliverability: 'bounced',
            notes: `Email bounced: ${reason || 'Unknown reason'}`
          }
        );
        
        log('warn', 'Email bounced', { userId, email, reason });
        break;
        
      case 'spam_report':
      case 'unsubscribe':
        // Mark user as opted out
        await databases.updateDocument(
          dbId,
          usersMetaCollection,
          userId,
          {
            emailOptOut: true,
            emailDeliverability: 'suppressed',
            notes: `User ${eventType === 'spam_report' ? 'marked as spam' : 'unsubscribed'}`
          }
        );
        
        log('warn', 'Email suppressed', { userId, email, eventType });
        break;
        
      case 'delivered':
        // Update email log as delivered
        log('info', 'Email delivered successfully', { userId, email });
        break;
        
      case 'open':
      case 'click':
        // Track engagement (optional)
        log('info', 'Email engagement', { userId, email, eventType });
        break;
        
      default:
        log('info', 'Unhandled event type', { eventType });
    }
    
    // Log event in email_logs
    await databases.createDocument(
      dbId,
      emailLogCollection,
      'unique()',
      {
        userId,
        email,
        type: 'webhook_event',
        provider: 'sendgrid',
        status: eventType,
        sentAt: new Date(timestamp * 1000).toISOString(),
        error: reason || '',
        metadata: JSON.stringify({ 
          eventType, 
          sg_message_id,
          reason 
        })
      }
    );
    
    return { processed: true, eventType, userId };
    
  } catch (error) {
    log('error', 'Failed to process event', { 
      email,
      eventType,
      error: error.message 
    });
    throw error;
  }
}

module.exports = async function (req, res) {
  const startTime = Date.now();
  
  try {
    // Verify webhook signature (if configured)
    const signature = req.headers['x-twilio-email-event-webhook-signature'];
    const timestamp = req.headers['x-twilio-email-event-webhook-timestamp'];
    const secret = process.env.SENDGRID_WEBHOOK_SECRET;
    
    if (secret && !verifySignature(req.payload, signature, timestamp, secret)) {
      log('warn', 'Invalid webhook signature');
      return res.json({
        ok: false,
        error: 'Invalid signature',
        code: 'INVALID_SIGNATURE'
      }, 401);
    }
    
    // Parse webhook payload
    const events = JSON.parse(req.payload || '[]');
    
    if (!Array.isArray(events) || events.length === 0) {
      log('warn', 'Invalid webhook payload');
      return res.json({
        ok: false,
        error: 'Invalid payload',
        code: 'INVALID_PAYLOAD'
      }, 400);
    }
    
    // Initialize Appwrite client
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_API_KEY);
    
    const databases = new sdk.Databases(client);
    
    const DB_ID = process.env.DB_ID;
    const USERS_META_COLLECTION = process.env.USERS_META_COLLECTION;
    const EMAIL_LOG_COLLECTION = process.env.EMAIL_LOG_COLLECTION;
    
    // Process each event
    const results = [];
    for (const event of events) {
      try {
        const result = await processEvent(
          event,
          databases,
          DB_ID,
          USERS_META_COLLECTION,
          EMAIL_LOG_COLLECTION
        );
        results.push(result);
      } catch (error) {
        results.push({ 
          processed: false, 
          error: error.message,
          event: event.event 
        });
      }
    }
    
    const duration = Date.now() - startTime;
    log('info', 'Webhook processed', { 
      totalEvents: events.length,
      processed: results.filter(r => r.processed).length,
      duration
    });
    
    return res.json({
      ok: true,
      processed: results.length,
      results,
      duration
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    log('error', 'Webhook processing failed', { 
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
