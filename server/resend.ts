import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const isReplit = !!process.env.REPLIT_CONNECTORS_HOSTNAME;
  
  if (isReplit) {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY 
      ? 'repl ' + process.env.REPL_IDENTITY 
      : process.env.WEB_REPL_RENEWAL 
      ? 'depl ' + process.env.WEB_REPL_RENEWAL 
      : null;

    if (!xReplitToken) {
      throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }

    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    if (!connectionSettings || (!connectionSettings.settings.api_key)) {
      throw new Error('Resend not connected');
    }
    return {
      apiKey: connectionSettings.settings.api_key, 
      fromEmail: connectionSettings.settings.from_email
    };
  } else {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Vendra <hello@vendra.ng>';
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required for production');
    }
    
    return {
      apiKey,
      fromEmail
    };
  }
}

export async function getUncachableResendClient() {
  try {
    const credentials = await getCredentials();
    return {
      client: new Resend(credentials.apiKey),
      fromEmail: credentials.fromEmail
    };
  } catch (error) {
    console.error('Failed to initialize Resend client:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, position: number) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    if (!fromEmail) {
      console.warn('No from_email configured in Resend settings, skipping welcome email');
      return;
    }
    
    const earlyBirdPerks = position <= 100 
      ? "You're in the first 100! You've earned 3 months of Pro tier FREE when we launch."
      : "Thank you for joining! We'll keep you updated on our launch progress.";

    await client.emails.send({
      from: fromEmail || 'Vendra <hello@vendra.ng>',
      to: email,
      subject: position <= 100 ? "You're in the First 100! - Vendra Waitlist" : "Welcome to Vendra!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Inter, sans-serif; line-height: 1.6; color: #1a1a1a; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #00A651 0%, #33C47F 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-radius: 8px; margin-top: 20px; }
              .highlight { background: #FFF8E7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00A651; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; }
              .button { display: inline-block; background: #00A651; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .stats { display: flex; gap: 20px; margin: 20px 0; }
              .stat { flex: 1; text-align: center; padding: 15px; background: #f5f5f5; border-radius: 6px; }
              .stat-number { font-size: 24px; font-weight: bold; color: #00A651; }
              .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">Welcome to Vendra</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Africa's Trust Layer for Social Commerce</p>
              </div>
              
              <div class="content">
                <h2>Hey there!</h2>
                <p>Thank you for joining the Vendra waitlist. You're among the first to build trust in Nigeria's social commerce ecosystem.</p>
                
                <div class="highlight">
                  <strong>${earlyBirdPerks}</strong>
                </div>

                <h3>What You Get:</h3>
                <ul>
                  <li><strong>Escrow Protection</strong> - Payments held securely until delivery confirmed</li>
                  <li><strong>Automated Logistics</strong> - One-click Kwik delivery booking</li>
                  <li><strong>WhatsApp Updates</strong> - Automatic tracking notifications</li>
                  <li><strong>Professional Links</strong> - Share payment links on Instagram & WhatsApp</li>
                </ul>

                <div class="stats">
                  <div class="stat">
                    <div class="stat-number">${position}</div>
                    <div class="stat-label">Your Position</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">Q1 2026</div>
                    <div class="stat-label">Launch Date</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">6-9%</div>
                    <div class="stat-label">Platform Fee</div>
                  </div>
                </div>

                <h3>What Happens Next?</h3>
                <ol>
                  <li>We're building the MVP (you'll get updates)</li>
                  <li>Beta testing starts January 2026</li>
                  <li>Full launch Q1 2026</li>
                  <li>First 100 get 3 months Pro tier FREE</li>
                </ol>

                <p>Have questions? Just reply to this email. We read every message.</p>

                <p style="margin-top: 30px;">
                  <strong>— The Vendra Team</strong><br>
                  <span style="color: #666;">Built by Devlix.inc • Lagos, Nigeria</span>
                </p>
              </div>

              <div class="footer">
                <p>You're receiving this because you joined our waitlist at vendra.ng</p>
                <p style="color: #999; font-size: 12px;">Vendra © 2025 • hello@vendra.ng</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}
