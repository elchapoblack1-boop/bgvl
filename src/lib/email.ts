// ══════════════════════════════════════════════════════
// BGVL EMAIL — Powered by Resend (resend.com)
// Zero SMTP config. Just one API key: RESEND_API_KEY
// Free tier: 3,000 emails/month
// ══════════════════════════════════════════════════════

import {
  buyerConfirmationEmail,
  adminOrderNotificationEmail,
  adminContactNotificationEmail,
  adminReplyToClientEmail,
} from './emailTemplates'

const FROM_NAME = 'Ballon Global Ventures Ltd'
const FROM_ADDR = 'onboarding@resend.dev'  // works on free plan without domain verification
const FROM      = `${FROM_NAME} <${FROM_ADDR}>`
const NOTIFY    = () => process.env.NOTIFY_EMAIL || 'ballonholdingsltd@gmail.com'

async function sendViaResend(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[RESEND] ❌ RESEND_API_KEY not set in Railway Variables!')
    return
  }
  console.log(`[RESEND] Sending to: ${to} | Subject: ${subject}`)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  const json = await res.json()
  if (res.ok && json.id) {
    console.log(`[RESEND] ✅ Sent successfully | id: ${json.id}`)
  } else {
    console.error(`[RESEND] ❌ Failed:`, JSON.stringify(json))
    if (json.message?.includes('verify')) {
      console.error('[RESEND] Fix: Make sure your RESEND_API_KEY is correct in Railway Variables')
    }
  }
}

export async function sendOrderEmails(order: Record<string, string>) {
  console.log('[RESEND] ── sendOrderEmails ─────────────────')
  const adminTo = NOTIFY()
  await Promise.allSettled([
    order.email && sendViaResend(
      order.email,
      `✅ Order Received — ${order.product_name} | Ballon Global Ventures`,
      buyerConfirmationEmail(order)
    ),
    sendViaResend(
      adminTo,
      `🔔 [NEW ORDER] ${order.product_name} — ${order.buyer_name}`,
      adminOrderNotificationEmail(order)
    ),
  ])
  console.log('[RESEND] ── done ────────────────────────────')
}

export async function sendContactEmails(msg: Record<string, string>) {
  console.log('[RESEND] ── sendContactEmails ───────────────')
  await sendViaResend(
    NOTIFY(),
    `📨 [CONTACT] ${msg.subject || 'New Message'} — ${msg.name}`,
    adminContactNotificationEmail(msg)
  )
  console.log('[RESEND] ── done ────────────────────────────')
}

export async function sendAdminReply(params: {
  to: string; clientName: string; productName: string
  adminMessage: string; quotedPrice?: string; validUntil?: string
}) {
  console.log('[RESEND] ── sendAdminReply ──────────────────')
  await sendViaResend(
    params.to,
    `RE: Your Enquiry — ${params.productName} | Ballon Global Ventures`,
    adminReplyToClientEmail(params)
  )
}
