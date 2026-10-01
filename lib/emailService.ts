import nodemailer, { Transporter } from 'nodemailer';
import { StoredEvent } from './dataStoreServer';

let cachedTransporter: Transporter | null = null;

// Pooled Brevo SMTP transporter for instant parallel delivery
export function getMailTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // port 587 uses STARTTLS
    pool: true,
    maxConnections: 5,
    maxMessages: 50,
    rateDelta: 1000,
    rateLimit: 10,
    auth: { user, pass },
  });

  return cachedTransporter;
}

/**
 * Builds a minimalist, Swiss-editorial HTML email template matching the website aesthetic.
 * Strict rule: NO EMOJIS — clean geometric line icons only.
 */
export function buildEventAnnouncementEmailHtml(event: StoredEvent, siteUrl: string = 'https://ecell-vsbcetc.vercel.app'): string {
  const regUrl = event.registrationUrl || `${siteUrl}/events`;
  const eventBadge = event.isFree ? 'FREE ENTRY' : 'REGISTRATION OPEN';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Event: ${event.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #121316;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F7F4; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          
          <!-- Top Border Vermilion Accent -->
          <tr>
            <td height="3" style="background-color: #FF4D2E; line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #EFECE6;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #827E73; margin-bottom: 4px;">
                      E-Cell VSBCETC
                    </div>
                    <div style="font-size: 13px; font-weight: 500; color: #121316;">
                      Venture Foundry &bull; Coimbatore, Tamil Nadu
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; font-family: 'SF Mono', Consolas, monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; background-color: rgba(255, 77, 46, 0.08); color: #FF4D2E;">
                      ${eventBadge}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              
              <!-- Subhead -->
              <div style="font-family: 'SF Mono', Consolas, monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #FF4D2E; font-weight: 600; margin-bottom: 8px;">
                Event Announcement
              </div>

              <!-- Title -->
              <h1 style="margin: 0 0 14px 0; font-size: 24px; font-weight: 700; line-height: 1.25; color: #121316; letter-spacing: -0.02em;">
                ${event.name}
              </h1>

              <!-- Short Description -->
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #58554E;">
                ${event.shortDescription || 'A flagship innovation event hosted by the Entrepreneurship Cell at VSB College of Engineering & Technical Campus.'}
              </p>

              <!-- Event Detail Specs (Line Icons) -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; border: 1px solid #EFECE6; border-radius: 3px; margin-bottom: 32px;">
                
                <!-- Date Row -->
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFECE6;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="24" valign="middle" style="padding-right: 12px;">
                          <!-- Line Calendar Icon -->
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#121316" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </td>
                        <td>
                          <div style="font-family: 'SF Mono', Consolas, monospace; font-size: 10px; text-transform: uppercase; color: #8A857A; letter-spacing: 0.08em;">Date</div>
                          <div style="font-size: 13px; font-weight: 600; color: #121316;">${event.date}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Time Row -->
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFECE6;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="24" valign="middle" style="padding-right: 12px;">
                          <!-- Line Clock Icon -->
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#121316" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </td>
                        <td>
                          <div style="font-family: 'SF Mono', Consolas, monospace; font-size: 10px; text-transform: uppercase; color: #8A857A; letter-spacing: 0.08em;">Time</div>
                          <div style="font-size: 13px; font-weight: 600; color: #121316;">${event.time || 'TBA'}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Venue Row -->
                <tr>
                  <td style="padding: 14px 18px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="24" valign="middle" style="padding-right: 12px;">
                          <!-- Line Pin Icon -->
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#121316" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </td>
                        <td>
                          <div style="font-family: 'SF Mono', Consolas, monospace; font-size: 10px; text-transform: uppercase; color: #8A857A; letter-spacing: 0.08em;">Location</div>
                          <div style="font-size: 13px; font-weight: 600; color: #121316;">Central Auditorium & Innovation Foundry, VSBCETC, Coimbatore</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- Action Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color: #121316; border-radius: 2px;">
                    <a href="${regUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 13px; font-weight: 600; color: #FFFFFF; text-decoration: none; letter-spacing: 0.02em;">
                      Register for Event &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #827E73;">
                Direct inquiries or prototyping registration queries can be directed to the E-Cell desk at VSB CETC, Coimbatore.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAF9F6; border-top: 1px solid #EFECE6; font-size: 11px; line-height: 1.6; color: #8A857A;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <strong>VSB College of Engineering & Technical Campus</strong><br>
                    Pollachi Main Road, Coimbatore, Tamil Nadu<br>
                    <span style="font-family: 'SF Mono', Consolas, monospace; font-size: 10px; color: #A6A298;">10.8277&deg; N, 77.0195&deg; E</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 14px; font-size: 10px; color: #A6A298;">
                    You received this notification because you subscribed to event updates from E-Cell VSBCETC.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Builds a welcome confirmation email for new subscribers.
 */
export function buildWelcomeSubscriptionEmailHtml(siteUrl: string = 'https://ecell-vsbcetc.vercel.app'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscribed to E-Cell VSBCETC Updates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121316;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F7F4; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 4px; overflow: hidden;">
          <tr>
            <td height="3" style="background-color: #FF4D2E;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 1px solid #EFECE6;">
              <div style="font-family: 'SF Mono', Consolas, monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #827E73; margin-bottom: 4px;">
                E-Cell VSBCETC
              </div>
              <div style="font-size: 13px; font-weight: 500; color: #121316;">
                Venture Foundry &bull; Coimbatore
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 36px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #121316;">
                You are subscribed to event updates.
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #58554E;">
                You will receive a brief notification whenever a new hackathon, Project Expo announcement, or founder workshop is announced by E-Cell VSBCETC.
              </p>
              <div style="margin-top: 24px;">
                <a href="${siteUrl}/events" style="display: inline-block; padding: 10px 22px; font-size: 13px; font-weight: 600; color: #FFFFFF; background-color: #121316; text-decoration: none; border-radius: 2px;">
                  Explore Current Events &rarr;
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 36px; background-color: #FAF9F6; border-top: 1px solid #EFECE6; font-size: 11px; color: #8A857A;">
              VSB College of Engineering & Technical Campus &bull; Coimbatore, Tamil Nadu
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

import { getSiteSettings } from './siteSettingsServer';

export function resolveSender(overrideEmail?: string, overrideName?: string) {
  let settingsEmail = '';
  let settingsName = '';
  try {
    const s = getSiteSettings();
    settingsEmail = s.brevoSenderEmail || '';
    settingsName = s.brevoSenderName || '';
  } catch {}

  const fromEmail =
    (overrideEmail && overrideEmail.includes('@') ? overrideEmail : null) ||
    (settingsEmail && settingsEmail.includes('@') ? settingsEmail : null) ||
    (process.env.SMTP_FROM_EMAIL && process.env.SMTP_FROM_EMAIL.includes('@') ? process.env.SMTP_FROM_EMAIL : null) ||
    'b58da7001@smtp-brevo.com';

  const fromName =
    overrideName ||
    settingsName ||
    process.env.SMTP_FROM_NAME ||
    'E-Cell VSBCETC';

  return { fromEmail, fromName };
}

/**
 * Sends event notification to a list of subscriber emails via pooled Brevo SMTP concurrently.
 */
export async function sendEventToSubscribers(
  event: StoredEvent,
  subscribers: string[],
  senderOptions?: { senderEmail?: string; senderName?: string }
): Promise<{ success: boolean; sentCount: number; fromEmailUsed: string; errors?: string[] }> {
  if (!subscribers || subscribers.length === 0) {
    const { fromEmail } = resolveSender(senderOptions?.senderEmail, senderOptions?.senderName);
    return { success: true, sentCount: 0, fromEmailUsed: fromEmail };
  }

  const transporter = getMailTransporter();
  const htmlContent = buildEventAnnouncementEmailHtml(event);
  const { fromEmail, fromName } = resolveSender(senderOptions?.senderEmail, senderOptions?.senderName);

  if (fromEmail.endsWith('@smtp-brevo.com')) {
    console.warn(
      `[Brevo Warning]: Sending with ${fromEmail}. Brevo requires the sender address to be verified under 'Senders & IPs' in your Brevo dashboard, otherwise emails may be silently discarded.`
    );
  }

  const sendPromises = subscribers.map(async (recipient) => {
    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        replyTo: fromEmail,
        to: recipient,
        subject: `New Event: ${event.name} — E-Cell VSBCETC`,
        html: htmlContent,
      });
      return { success: true, recipient, messageId: info.messageId };
    } catch (err: any) {
      console.error(`Failed to send email to ${recipient}:`, err.message);
      return { success: false, recipient, error: err.message };
    }
  });

  const results = await Promise.allSettled(sendPromises);
  let sentCount = 0;
  const errors: string[] = [];

  for (const res of results) {
    if (res.status === 'fulfilled') {
      if (res.value.success) {
        sentCount++;
      } else if (res.value.error) {
        errors.push(`${res.value.recipient}: ${res.value.error}`);
      }
    } else {
      errors.push(res.reason?.message || 'Send failed');
    }
  }

  return {
    success: sentCount > 0 || errors.length === 0,
    sentCount,
    fromEmailUsed: fromEmail,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Sends a welcome subscription confirmation email.
 */
export async function sendWelcomeEmail(
  email: string,
  senderOptions?: { senderEmail?: string; senderName?: string }
): Promise<boolean> {
  try {
    const transporter = getMailTransporter();
    const { fromEmail, fromName } = resolveSender(senderOptions?.senderEmail, senderOptions?.senderName);

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: fromEmail,
      to: email,
      subject: `Confirmed: E-Cell VSBCETC Event Notifications`,
      html: buildWelcomeSubscriptionEmailHtml(),
    });
    return true;
  } catch (err) {
    console.error('Failed to send welcome email:', err);
    return false;
  }
}

