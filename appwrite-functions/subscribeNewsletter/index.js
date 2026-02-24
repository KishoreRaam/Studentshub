/**
 * Appwrite Function: subscribeNewsletter
 * 
 * Trigger: HTTP POST
 * Purpose: Add email to SendGrid Markdown Contacts
 * 
 * Environment Variables Required:
 * - SENDGRID_API_KEY
 */

const fetch = require('node-fetch');

module.exports = async function (req, res) {
    try {
        const payload = JSON.parse(req.payload || '{}');
        const email = payload.email;

        if (!email) {
            return res.json({ ok: false, error: 'Email is required' }, 400);
        }

        const apiKey = process.env.SENDGRID_API_KEY;
        if (!apiKey) {
            console.error('SENDGRID_API_KEY is not configured');
            return res.json({ ok: false, error: 'Server configuration error' }, 500);
        }

        // Call SendGrid Marketing Contacts API
        const sendgridData = {
            contacts: [
                {
                    email: email
                }
            ]
        };

        const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendgridData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`SendGrid Error: ${response.status} - ${errorText}`);
            throw new Error('Failed to subscribe to SendGrid');
        }

        return res.json({
            ok: true,
            message: 'Subscribed successfully'
        });

    } catch (error) {
        console.error('Newsletter subscription failed:', error);
        return res.json({ ok: false, error: error.message }, 500);
    }
};
