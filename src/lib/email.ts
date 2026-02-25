import nodemailer from 'nodemailer'
import {
  buyerConfirmationEmail,
  adminOrderNotificationEmail,
  adminContactNotificationEmail,
  adminReplyToClientEmail,
} from './emailTemplates'

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  console.log('[EMAIL] Config check:', {
    host,
    port,
    user: user ? `${user.substring(0,5)}...` : 'MISSING',
    pass: pass ? `${pass.length} chars` : 'MISSING',
  })

  if (!user || !pass) {
    console.error('[EMAIL] ERROR: SMTP_USER or SMTP_PASS environment variable is missing!')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })
}

const FROM = `"Ballon Global Ventures Ltd" <${process.env.SMTP_USER}>`
const NOTIFY = process.env.NOTIFY_EMAIL || 'ballonholdingsltd@gmail.com'

export async function sendOrderEmails(order: Record<string, string>) {
  console.log('[EMAIL] Sending order emails for:', order.product_name, '| To admin:', NOTIFY)
  const t = getTransporter()

  const tasks = []

  // Email to buyer
  if (order.email) {
    console.log('[EMAIL] Sending buyer confirmation to:', order.email)
    tasks.push(
      t.sendMail({
        from: FROM,
        to: order.email,
        subject: `✅ Order Received — ${order.product_name} | Ballon Global Ventures`,
        html: buyerConfirmationEmail(order),
      }).then(() => {
        console.log('[EMAIL] ✅ Buyer email sent successfully to:', order.email)
      }).catch(e => {
        console.error('[EMAIL] ❌ Buyer email FAILED:', e.message, '| Code:', e.code)
      })
    )
  }

  // Email to admin
  console.log('[EMAIL] Sending admin notification to:', NOTIFY)
  tasks.push(
    t.sendMail({
      from: FROM,
      to: NOTIFY,
      replyTo: order.email,
      subject: `🔔 [NEW ORDER] ${order.product_name} — ${order.buyer_name}`,
      html: adminOrderNotificationEmail(order),
    }).then(() => {
      console.log('[EMAIL] ✅ Admin notification sent successfully to:', NOTIFY)
    }).catch(e => {
      console.error('[EMAIL] ❌ Admin email FAILED:', e.message, '| Code:', e.code, '| Full error:', JSON.stringify(e))
    })
  )

  await Promise.allSettled(tasks)
  console.log('[EMAIL] All email tasks completed')
}

export async function sendContactEmails(msg: Record<string, string>) {
  console.log('[EMAIL] Sending contact message from:', msg.email)
  const t = getTransporter()
  await t.sendMail({
    from: FROM,
    to: NOTIFY,
    replyTo: msg.email,
    subject: `📨 [CONTACT] ${msg.subject || 'New Message'} — ${msg.name}`,
    html: adminContactNotificationEmail(msg),
  }).then(() => {
    console.log('[EMAIL] ✅ Contact email sent to:', NOTIFY)
  }).catch(e => {
    console.error('[EMAIL] ❌ Contact email FAILED:', e.message, '| Code:', e.code)
  })
}

export async function sendAdminReply(params: {
  to: string; clientName: string; productName: string;
  adminMessage: string; quotedPrice?: string; validUntil?: string
}) {
  console.log('[EMAIL] Sending admin reply to:', params.to)
  const t = getTransporter()
  await t.sendMail({
    from: FROM,
    to: params.to,
    subject: `RE: Your Enquiry — ${params.productName} | Ballon Global Ventures`,
    html: adminReplyToClientEmail(params),
  }).then(() => {
    console.log('[EMAIL] ✅ Admin reply sent to:', params.to)
  }).catch(e => {
    console.error('[EMAIL] ❌ Admin reply FAILED:', e.message)
    throw e
  })
}
