// ============================================================
// BALLON GLOBAL VENTURES — Beautiful Email Templates
// ============================================================

const BRAND_GOLD = '#C9A84C'
const BRAND_BLACK = '#0A0A0A'
const BRAND_DARK = '#111111'
const BRAND_CYAN = '#00B4D8'

function baseWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ballon Global Ventures Limited</title>
</head>
<body style="margin:0;padding:0;background:#030303;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#030303;min-height:100vh;">
<tr><td align="center" style="padding:40px 20px;">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#0A0A0A 0%,#1A1A1A 100%);border:1px solid rgba(201,168,76,0.3);border-bottom:none;padding:36px 40px;text-align:center;">
      <div style="display:inline-block;border:1px solid rgba(201,168,76,0.4);padding:6px 20px;margin-bottom:20px;">
        <span style="font-family:Georgia,serif;font-size:9px;letter-spacing:5px;color:${BRAND_GOLD};text-transform:uppercase;">Certified Global Exporter</span>
      </div>
      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:${BRAND_GOLD};letter-spacing:3px;line-height:1.2;">BALLON GLOBAL</h1>
      <h2 style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;font-weight:400;color:#888;letter-spacing:4px;">VENTURES LIMITED</h2>
      <div style="width:60px;height:1px;background:${BRAND_GOLD};margin:20px auto 0;"></div>
    </td>
  </tr>

  <!-- CONTENT -->
  <tr>
    <td style="background:#111111;border:1px solid rgba(201,168,76,0.3);border-top:none;border-bottom:none;padding:40px;">
      ${content}
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#0A0A0A;border:1px solid rgba(201,168,76,0.3);border-top:3px solid ${BRAND_GOLD};padding:24px 40px;text-align:center;">
      <p style="margin:0 0 8px;font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;">Certified & Compliant</p>
      <p style="margin:0 0 16px;font-size:10px;color:#555;letter-spacing:3px;">CAC &nbsp;|&nbsp; NEPC &nbsp;|&nbsp; SCUML &nbsp;|&nbsp; OGISP &nbsp;|&nbsp; NMDPRA &nbsp;|&nbsp; TRADEMARK®</p>
      <div style="border-top:1px solid rgba(201,168,76,0.15);padding-top:16px;margin-top:8px;">
        <p style="margin:0;font-size:11px;color:#555;">📧 <a href="mailto:ballonholdingsltd@gmail.com" style="color:${BRAND_GOLD};text-decoration:none;">ballonholdingsltd@gmail.com</a></p>
        <p style="margin:6px 0 0;font-size:10px;color:#444;">© ${new Date().getFullYear()} Ballon Global Ventures Limited. All rights reserved.</p>
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ── ORDER CONFIRMATION EMAIL → TO BUYER ─────────────────────────
export function buyerConfirmationEmail(order: Record<string, string>): string {
  const content = `
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;margin-bottom:16px;">✅</div>
      <h3 style="margin:0;font-family:Georgia,serif;font-size:22px;color:${BRAND_GOLD};letter-spacing:2px;">Order Enquiry Received</h3>
      <p style="margin:8px 0 0;font-size:14px;color:#888;">Thank you, ${order.buyer_name || 'Valued Buyer'}. We have received your enquiry.</p>
    </div>

    <div style="background:#0D0D0D;border:1px solid rgba(201,168,76,0.2);border-left:3px solid ${BRAND_GOLD};padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#AAA;line-height:1.8;">Our export team will review your requirements and contact you within <strong style="color:${BRAND_GOLD};">24 hours</strong> via email and WhatsApp. Please keep your phone accessible for follow-up.</p>
    </div>

    <h4 style="margin:0 0 16px;font-family:Georgia,serif;font-size:13px;letter-spacing:3px;color:${BRAND_GOLD};text-transform:uppercase;border-bottom:1px solid rgba(201,168,76,0.2);padding-bottom:10px;">Your Order Summary</h4>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ['Product', order.product_name],
        ['Order Type', order.type === 'agricultural' ? '🌾 Agricultural' : '🛢️ Petroleum'],
        ['Quantity', order.quantity],
        ['Contract Quantity', order.contract_quantity],
        ['Destination', order.destination],
        ['Payment Term', order.payment_term],
        ['Incoterms / Shipment Term', order.incoterms || order.shipment_term],
        ['Purity Required', order.purity],
        ['Moisture Content', order.moisture],
        ['Packaging Size', order.packaging_size],
        ['Notes', order.notes],
      ].filter(([, v]) => v).map(([k, v], i) => `
        <tr>
          <td style="padding:9px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#111'};border:1px solid rgba(201,168,76,0.1);font-size:11px;color:#777;letter-spacing:1px;text-transform:uppercase;width:40%;vertical-align:top;">${k}</td>
          <td style="padding:9px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#111'};border:1px solid rgba(201,168,76,0.1);font-size:13px;color:#E8E0D0;vertical-align:top;">${v}</td>
        </tr>`).join('')}
    </table>

    <div style="background:rgba(0,180,216,0.05);border:1px solid rgba(0,180,216,0.2);padding:20px 24px;margin-bottom:24px;">
      <h4 style="margin:0 0 12px;font-size:11px;letter-spacing:3px;color:${BRAND_CYAN};text-transform:uppercase;">What Happens Next?</h4>
      <table width="100%">
        ${[
          ['1', 'Our team reviews your product specifications and availability.'],
          ['2', 'We prepare a formal quotation with pricing and shipment schedule.'],
          ['3', 'We contact you via email and WhatsApp within 24 hours.'],
          ['4', 'Upon agreement, we issue a Proforma Invoice and contract.'],
        ].map(([n, s]) => `<tr><td style="width:32px;padding:6px 0;vertical-align:top;"><span style="background:${BRAND_GOLD};color:#000;font-size:10px;font-weight:700;padding:2px 7px;font-family:Georgia,serif;">${n}</span></td><td style="padding:6px 0 6px 10px;font-size:13px;color:#AAA;line-height:1.6;">${s}</td></tr>`).join('')}
      </table>
    </div>

    <div style="text-align:center;border-top:1px solid rgba(201,168,76,0.15);padding-top:24px;">
      <p style="margin:0 0 6px;font-size:12px;color:#666;">Questions? Contact us directly:</p>
      <a href="mailto:ballonholdingsltd@gmail.com" style="color:${BRAND_GOLD};font-size:13px;text-decoration:none;">📧 ballonholdingsltd@gmail.com</a>
    </div>
  `
  return baseWrapper(content)
}

// ── NEW ORDER NOTIFICATION EMAIL → TO ADMIN ─────────────────────
export function adminOrderNotificationEmail(order: Record<string, string>): string {
  const whatsappLink = `https://wa.me/${(order.whatsapp || '').replace(/\D/g, '')}`
  const mailtoLink = `mailto:${order.email}?subject=Re: Your Order Enquiry - ${order.product_name}`

  const allFields = [
    ['Order ID', order.id],
    ['Order Type', order.type === 'agricultural' ? '🌾 Agricultural' : '🛢️ Petroleum'],
    ['Product Name', order.product_name],
    ['Quantity', order.quantity],
    ['Contract Quantity', order.contract_quantity],
    ['Destination', order.destination],
    ['Payment Term', order.payment_term],
    ['Incoterms / Shipment', order.incoterms || order.shipment_term],
    ['Price Target', order.price],
    ['Purity', order.purity],
    ['Moisture Content', order.moisture],
    ['Odor & Taste', order.odor_taste],
    ['Appearance', order.appearance],
    ['Oil Content', order.oil_content],
    ['Packaging Size', order.packaging_size],
    ['Delivery Schedule', order.delivery_schedule],
    ['Notes', order.notes],
  ].filter(([, v]) => v)

  const content = `
    <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.3);border-left:4px solid ${BRAND_GOLD};padding:20px 24px;margin-bottom:28px;">
      <h3 style="margin:0 0 6px;font-family:Georgia,serif;font-size:18px;color:${BRAND_GOLD};">🔔 New Order Enquiry Received</h3>
      <p style="margin:0;font-size:13px;color:#AAA;">Received: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
    </div>

    <h4 style="margin:0 0 14px;font-family:Georgia,serif;font-size:12px;letter-spacing:3px;color:${BRAND_CYAN};text-transform:uppercase;">👤 Buyer Details</h4>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ['Full Name', order.buyer_name],
        ['Company', order.company || 'Not provided'],
        ['Email', `<a href="${mailtoLink}" style="color:${BRAND_GOLD};">${order.email}</a>`],
        ['WhatsApp', `<a href="${whatsappLink}" style="color:#25d366;">${order.whatsapp}</a>`],
      ].map(([k, v], i) => `
        <tr>
          <td style="padding:10px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#151515'};border:1px solid rgba(201,168,76,0.12);font-size:11px;color:#777;letter-spacing:1px;text-transform:uppercase;width:35%;font-weight:600;">${k}</td>
          <td style="padding:10px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#151515'};border:1px solid rgba(201,168,76,0.12);font-size:13px;color:#E8E0D0;">${v}</td>
        </tr>`).join('')}
    </table>

    <h4 style="margin:0 0 14px;font-family:Georgia,serif;font-size:12px;letter-spacing:3px;color:${BRAND_CYAN};text-transform:uppercase;">📦 Product & Order Details</h4>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${allFields.map(([k, v], i) => `
        <tr>
          <td style="padding:9px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#151515'};border:1px solid rgba(201,168,76,0.1);font-size:11px;color:#777;letter-spacing:1px;text-transform:uppercase;width:35%;vertical-align:top;">${k}</td>
          <td style="padding:9px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#151515'};border:1px solid rgba(201,168,76,0.1);font-size:13px;color:#E8E0D0;vertical-align:top;">${v}</td>
        </tr>`).join('')}
    </table>

    <div style="text-align:center;margin-top:28px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.15);">
      <p style="margin:0 0 16px;font-size:12px;color:#666;letter-spacing:1px;text-transform:uppercase;">Quick Actions</p>
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td align="center" style="padding:0 8px;">
          <a href="${mailtoLink}" style="display:inline-block;background:${BRAND_GOLD};color:#000;padding:13px 28px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:700;">📧 Reply by Email</a>
        </td>
        <td align="center" style="padding:0 8px;">
          <a href="${whatsappLink}" style="display:inline-block;background:#25d366;color:#fff;padding:13px 28px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:700;">💬 Open WhatsApp</a>
        </td>
      </tr></table>
    </div>
  `
  return baseWrapper(content)
}

// ── CONTACT MESSAGE NOTIFICATION → TO ADMIN ─────────────────────
export function adminContactNotificationEmail(msg: Record<string, string>): string {
  const content = `
    <div style="background:rgba(0,180,216,0.06);border:1px solid rgba(0,180,216,0.25);border-left:4px solid ${BRAND_CYAN};padding:20px 24px;margin-bottom:28px;">
      <h3 style="margin:0 0 6px;font-family:Georgia,serif;font-size:18px;color:${BRAND_CYAN};">📨 New Contact Message</h3>
      <p style="margin:0;font-size:13px;color:#AAA;">Received: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${[
        ['From', msg.name],
        ['Email', `<a href="mailto:${msg.email}" style="color:${BRAND_GOLD};">${msg.email}</a>`],
        ['Subject', msg.subject || '—'],
      ].map(([k, v], i) => `
        <tr>
          <td style="padding:10px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#151515'};border:1px solid rgba(201,168,76,0.1);font-size:11px;color:#777;letter-spacing:1px;text-transform:uppercase;width:30%;">${k}</td>
          <td style="padding:10px 14px;background:${i % 2 === 0 ? '#0A0A0A' : '#151515'};border:1px solid rgba(201,168,76,0.1);font-size:13px;color:#E8E0D0;">${v}</td>
        </tr>`).join('')}
    </table>

    <h4 style="margin:0 0 12px;font-size:11px;letter-spacing:3px;color:${BRAND_GOLD};text-transform:uppercase;">Message</h4>
    <div style="background:#0A0A0A;border:1px solid rgba(201,168,76,0.15);border-left:3px solid ${BRAND_GOLD};padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#CCC;line-height:1.8;">${msg.message.replace(/\n/g, '<br>')}</p>
    </div>

    <div style="text-align:center;">
      <a href="mailto:${msg.email}?subject=Re: ${msg.subject || 'Your Enquiry'}" style="display:inline-block;background:${BRAND_GOLD};color:#000;padding:13px 36px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:700;">📧 Reply to ${msg.name}</a>
    </div>
  `
  return baseWrapper(content)
}

// ── ADMIN → CLIENT REPLY TEMPLATE ───────────────────────────────
export function adminReplyToClientEmail(params: {
  clientName: string
  productName: string
  adminMessage: string
  quotedPrice?: string
  validUntil?: string
}): string {
  const content = `
    <div style="text-align:center;margin-bottom:32px;">
      <h3 style="margin:0;font-family:Georgia,serif;font-size:22px;color:${BRAND_GOLD};letter-spacing:2px;">Response to Your Enquiry</h3>
      <p style="margin:8px 0 0;font-size:14px;color:#888;">RE: ${params.productName}</p>
    </div>

    <p style="font-size:14px;color:#CCC;line-height:1.8;margin-bottom:24px;">Dear <strong style="color:${BRAND_GOLD};">${params.clientName}</strong>,</p>
    <p style="font-size:14px;color:#CCC;line-height:1.8;margin-bottom:24px;">Thank you for your interest in our products. We are pleased to respond to your enquiry regarding <strong style="color:#E8E0D0;">${params.productName}</strong>.</p>

    <div style="background:#0A0A0A;border:1px solid rgba(201,168,76,0.2);border-left:3px solid ${BRAND_GOLD};padding:24px;margin-bottom:28px;">
      <p style="margin:0;font-size:14px;color:#CCC;line-height:1.9;">${params.adminMessage.replace(/\n/g, '<br>')}</p>
    </div>

    ${params.quotedPrice ? `
    <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.25);padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;color:#888;text-transform:uppercase;">Quoted Price</p>
      <p style="margin:0;font-family:Georgia,serif;font-size:28px;color:${BRAND_GOLD};font-weight:700;">${params.quotedPrice}</p>
      ${params.validUntil ? `<p style="margin:8px 0 0;font-size:11px;color:#666;">Valid until: ${params.validUntil}</p>` : ''}
    </div>` : ''}

    <div style="background:#0A0A0A;border:1px solid rgba(201,168,76,0.15);padding:20px 24px;margin-bottom:24px;">
      <h4 style="margin:0 0 14px;font-size:11px;letter-spacing:3px;color:${BRAND_CYAN};text-transform:uppercase;">Next Steps</h4>
      <p style="margin:0;font-size:13px;color:#AAA;line-height:1.8;">To proceed, please reply to this email or contact us via WhatsApp. Upon your confirmation, we will issue a <strong style="color:#E8E0D0;">Proforma Invoice</strong> and <strong style="color:#E8E0D0;">Sales Contract</strong> for your review.</p>
    </div>

    <p style="font-size:14px;color:#CCC;line-height:1.8;">We look forward to doing business with you.</p>
    <p style="font-size:14px;color:#CCC;margin-top:20px;">Warm regards,<br><strong style="color:${BRAND_GOLD};">Ballon Global Ventures Limited</strong><br><span style="font-size:12px;color:#666;">Export Team</span></p>
  `
  return baseWrapper(content)
}

// ── WHATSAPP MESSAGE BUILDER ─────────────────────────────────────
export function buildWhatsAppMessage(order: Record<string, string>): string {
  const lines = [
    `🌍 *BALLON GLOBAL VENTURES LIMITED*`,
    `_New Order Enquiry Received_`,
    ``,
    `*📦 PRODUCT DETAILS*`,
    `• Product: ${order.product_name || '—'}`,
    `• Type: ${order.type === 'agricultural' ? '🌾 Agricultural' : '🛢️ Petroleum'}`,
    `• Quantity: ${order.quantity || '—'}`,
    order.contract_quantity ? `• Contract Qty: ${order.contract_quantity}` : '',
    `• Destination: ${order.destination || '—'}`,
    order.payment_term ? `• Payment Term: ${order.payment_term}` : '',
    order.incoterms || order.shipment_term ? `• Incoterms: ${order.incoterms || order.shipment_term}` : '',
    order.purity ? `• Purity: ${order.purity}` : '',
    order.moisture ? `• Moisture: ${order.moisture}` : '',
    order.price ? `• Target Price: ${order.price}` : '',
    ``,
    `*👤 BUYER DETAILS*`,
    `• Name: ${order.buyer_name || '—'}`,
    order.company ? `• Company: ${order.company}` : '',
    `• Email: ${order.email || '—'}`,
    `• WhatsApp: ${order.whatsapp || '—'}`,
    order.notes ? `\n*📝 NOTES*\n${order.notes}` : '',
    ``,
    `_Received via BGVL Website_`,
  ].filter(l => l !== '')

  return encodeURIComponent(lines.join('\n'))
}

// ── WHATSAPP LINK BUILDER ────────────────────────────────────────
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const clean = phoneNumber.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${message}`
}
