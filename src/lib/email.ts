import nodemailer from 'nodemailer'
import {
  buyerConfirmationEmail,
  adminOrderNotificationEmail,
  adminContactNotificationEmail,
  adminReplyToClientEmail,
} from './emailTemplates'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
  })
}

const FROM = `"Ballon Global Ventures Ltd" <${process.env.SMTP_USER}>`
const NOTIFY = process.env.NOTIFY_EMAIL || 'ballonholdingsltd@gmail.com'

export async function sendOrderEmails(order: Record<string, string>) {
  const t = getTransporter()
  const tasks = []
  if (order.email) {
    tasks.push(t.sendMail({ from: FROM, to: order.email, subject: `✅ Order Received — ${order.product_name} | Ballon Global Ventures`, html: buyerConfirmationEmail(order) }).catch(e => console.error('Buyer email:', e)))
  }
  tasks.push(t.sendMail({ from: FROM, to: NOTIFY, replyTo: order.email, subject: `🔔 [NEW ORDER] ${order.product_name} — ${order.buyer_name}`, html: adminOrderNotificationEmail(order) }).catch(e => console.error('Admin order email:', e)))
  await Promise.allSettled(tasks)
}

export async function sendContactEmails(msg: Record<string, string>) {
  const t = getTransporter()
  await t.sendMail({ from: FROM, to: NOTIFY, replyTo: msg.email, subject: `📨 [CONTACT] ${msg.subject || 'New Message'} — ${msg.name}`, html: adminContactNotificationEmail(msg) }).catch(e => console.error('Contact email:', e))
}

export async function sendAdminReply(params: { to: string; clientName: string; productName: string; adminMessage: string; quotedPrice?: string; validUntil?: string }) {
  const t = getTransporter()
  await t.sendMail({ from: FROM, to: params.to, subject: `RE: Your Enquiry — ${params.productName} | Ballon Global Ventures`, html: adminReplyToClientEmail(params) })
}
