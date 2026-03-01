// ══════════════════════════════════════════════════════
// BGVL EMAIL — Powered by Brevo (brevo.com)
// Free tier: 300 emails/day, sends to ANY email address
// No domain verification required on free plan
// Env var needed: BREVO_API_KEY
// ══════════════════════════════════════════════════════

import {
  buyerConfirmationEmail,
  adminOrderNotificationEmail,
  adminContactNotificationEmail,
  adminReplyToClientEmail,
} from './emailTemplates'

const FROM_NAME = 'Ballon Global Ventures Ltd'
const FROM_ADDR = 'ballonholdingsltd@gmail.com'  // verified sender in Brevo
const NOTIFY    = () => process.env.NOTIFY_EMAIL || 'ballonholdingsltd@gmail.com'

async function sendViaBrevo(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('[BREVO] ❌ BREVO_API_KEY not set in Railway Variables!')
    return
  }

  console.log(`[BREVO] Sending to: ${to} | Subject: ${subject}`)

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_ADDR },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })

  const json = await res.json()

  if (res.ok && json.messageId) {
    console.log(`[BREVO] ✅ Sent successfully | messageId: ${json.messageId}`)
  } else {
    console.error(`[BREVO] ❌ Failed (${res.status}):`, JSON.stringify(json))
    if (res.status === 401) {
      console.error('[BREVO] Fix: Check your BREVO_API_KEY in Railway Variables')
    }
    if (res.status === 400 && JSON.stringify(json).includes('sender')) {
      console.error('[BREVO] Fix: Go to Brevo → Senders & Domains → verify ballonholdingsltd@gmail.com as a sender')
    }
  }
}

export async function sendOrderEmails(order: Record<string, string>) {
  console.log('[BREVO] ── sendOrderEmails ─────────────────')
  const adminTo = NOTIFY()
  await Promise.allSettled([
    order.email && sendViaBrevo(
      order.email,
      `✅ Order Received — ${order.product_name} | Ballon Global Ventures`,
      buyerConfirmationEmail(order)
    ),
    sendViaBrevo(
      adminTo,
      `🔔 [NEW ORDER] ${order.product_name} — ${order.buyer_name}`,
      adminOrderNotificationEmail(order)
    ),
  ])
  console.log('[BREVO] ── done ────────────────────────────')
}

export async function sendContactEmails(msg: Record<string, string>) {
  console.log('[BREVO] ── sendContactEmails ───────────────')
  await sendViaBrevo(
    NOTIFY(),
    `📨 [CONTACT] ${msg.subject || 'New Message'} — ${msg.name}`,
    adminContactNotificationEmail(msg)
  )
  console.log('[BREVO] ── done ────────────────────────────')
}

export async function sendAdminReply(params: {
  to: string; clientName: string; productName: string
  adminMessage: string; quotedPrice?: string; validUntil?: string
}) {
  console.log('[BREVO] ── sendAdminReply ──────────────────')
  await sendViaBrevo(
    params.to,
    `RE: Your Enquiry — ${params.productName} | Ballon Global Ventures`,
    adminReplyToClientEmail(params)
  )
  console.log('[BREVO] ── done ────────────────────────────')
}
