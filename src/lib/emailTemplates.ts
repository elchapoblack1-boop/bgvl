// ══════════════════════════════════════════════════════════════
// BALLON GLOBAL VENTURES — Premium Business Email Templates
// ══════════════════════════════════════════════════════════════

const G = '#C9A84C'   // gold
const G2 = '#A8863A'  // gold dark
const BK = '#0A0A0A'  // black
const DK = '#111111'  // dark
const D2 = '#1A1A1A'  // dark2
const CY = '#00B4D8'  // cyan

// ─── shared shell ────────────────────────────────────────────────
function shell(body: string, preheader = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>Ballon Global Ventures Limited</title>
<style>
  @media(max-width:600px){
    .wrap{width:100%!important;padding:0!important}
    .pad{padding:28px 20px!important}
    .col2{display:block!important;width:100%!important}
    h1.logo{font-size:22px!important}
    .hide-mobile{display:none!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#030303;-webkit-font-smoothing:antialiased;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;">${preheader}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#030303;min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">

<table class="wrap" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px;max-width:620px;">

  <!--╔══ HEADER ══╗-->
  <tr>
    <td style="background:${BK};border-left:1px solid rgba(201,168,76,0.35);border-right:1px solid rgba(201,168,76,0.35);border-top:1px solid rgba(201,168,76,0.35);padding:0;">
      <!-- gold top bar -->
      <div style="height:4px;background:linear-gradient(90deg,${G2} 0%,${G} 50%,${G2} 100%);"></div>
      <div style="padding:36px 44px 32px;text-align:center;">
        <!-- cert badge -->
        <div style="display:inline-block;border:1px solid rgba(201,168,76,0.35);padding:5px 18px;margin-bottom:22px;">
          <span style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:5px;color:${G};text-transform:uppercase;font-weight:600;">Certified Global Exporter</span>
        </div>
        <!-- logo text -->
        <h1 class="logo" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:${G};letter-spacing:4px;line-height:1.1;">BALLON GLOBAL</h1>
        <p style="margin:5px 0 0;font-family:Georgia,serif;font-size:13px;font-weight:400;color:#777;letter-spacing:5px;text-transform:uppercase;">VENTURES LIMITED</p>
        <!-- divider ornament -->
        <div style="margin:22px auto 0;width:120px;display:flex;align-items:center;justify-content:center;">
          <div style="flex:1;height:1px;background:${G};"></div>
          <div style="width:6px;height:6px;background:${G};transform:rotate(45deg);margin:0 10px;flex-shrink:0;"></div>
          <div style="flex:1;height:1px;background:${G};"></div>
        </div>
      </div>
    </td>
  </tr>

  <!--╔══ BODY ══╗-->
  <tr>
    <td class="pad" style="background:${DK};border-left:1px solid rgba(201,168,76,0.35);border-right:1px solid rgba(201,168,76,0.35);padding:44px;">
      ${body}
    </td>
  </tr>

  <!--╔══ FOOTER ══╗-->
  <tr>
    <td style="background:${BK};border:1px solid rgba(201,168,76,0.35);border-top:none;">
      <!-- gold divider -->
      <div style="height:2px;background:linear-gradient(90deg,transparent 0%,${G} 50%,transparent 100%);"></div>
      <div style="padding:28px 44px;text-align:center;">
        <!-- certifications row -->
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;color:#666;letter-spacing:2px;text-transform:uppercase;">Internationally Certified &amp; Compliant</p>
        <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:10px;color:#444;letter-spacing:3px;">
          CAC &nbsp;·&nbsp; NEPC &nbsp;·&nbsp; SCUML &nbsp;·&nbsp; OGISP &nbsp;·&nbsp; NMDPRA &nbsp;·&nbsp; TRADEMARK®
        </p>
        <div style="border-top:1px solid rgba(201,168,76,0.12);padding-top:20px;">
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;color:#555;">
            ✉ <a href="mailto:ballonholdingsltd@gmail.com" style="color:${G};text-decoration:none;font-weight:600;">ballonholdingsltd@gmail.com</a>
          </p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#333;letter-spacing:1px;">
            © ${new Date().getFullYear()} Ballon Global Ventures Limited. All rights reserved.
          </p>
        </div>
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── reusable building blocks ─────────────────────────────────────

function heroStrip(icon: string, headline: string, sub: string, color = G): string {
  return `
  <div style="background:linear-gradient(135deg,${D2} 0%,#0F0F0F 100%);border:1px solid rgba(201,168,76,0.15);border-left:4px solid ${color};padding:28px 32px;margin-bottom:32px;text-align:center;">
    <div style="font-size:42px;margin-bottom:12px;line-height:1;">${icon}</div>
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:20px;font-weight:700;color:${color};letter-spacing:2px;">${headline}</h2>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#888;line-height:1.6;">${sub}</p>
  </div>`
}

function sectionHeader(label: string, color = CY): string {
  return `
  <div style="display:flex;align-items:center;margin:28px 0 16px;">
    <span style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;color:${color};text-transform:uppercase;white-space:nowrap;">${label}</span>
    <div style="flex:1;height:1px;background:rgba(201,168,76,0.15);margin-left:12px;"></div>
  </div>`
}

function dataRow(label: string, value: string, accent = false): string {
  if (!value || value === '—') return ''
  return `
  <tr>
    <td style="padding:11px 14px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#666;letter-spacing:2px;text-transform:uppercase;width:38%;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);">${label}</td>
    <td style="padding:11px 14px;font-family:Arial,sans-serif;font-size:13px;color:${accent ? G : '#DDD'};font-weight:${accent ? '700' : '400'};vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);">${value}</td>
  </tr>`
}

function dataTable(rows: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0D0D0D;border:1px solid rgba(201,168,76,0.12);margin-bottom:8px;">${rows}</table>`
}

function ctaButton(label: string, url: string, bg = G): string {
  return `
  <div style="text-align:center;margin:32px 0 8px;">
    <a href="${url}" style="display:inline-block;background:${bg};color:${BK};font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:16px 40px;text-decoration:none;">${label}</a>
  </div>`
}

function alertBox(icon: string, text: string, color = G): string {
  return `
  <div style="background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.2);border-left:3px solid ${color};padding:16px 20px;margin:20px 0;">
    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#AAA;line-height:1.6;">${icon} ${text}</p>
  </div>`
}

function refId(id: string): string {
  return `<p style="text-align:center;font-family:'Courier New',monospace;font-size:11px;color:#555;letter-spacing:2px;margin:20px 0 0;">REF: ${id} &nbsp;·&nbsp; ${new Date().toUTCString()}</p>`
}

// ══════════════════════════════════════════════════════════════
// 1. BUYER CONFIRMATION EMAIL
// ══════════════════════════════════════════════════════════════
export function buyerConfirmationEmail(o: Record<string, string>): string {
  const body = `
    ${heroStrip('✅', 'Order Successfully Received', 'We have received your trade enquiry and our team is reviewing it now. You will hear from us within 24 business hours.', '#27ae60')}

    <p style="font-family:Arial,sans-serif;font-size:14px;color:#CCC;line-height:1.8;margin:0 0 24px;">
      Dear <strong style="color:${G};">${o.buyer_name || 'Valued Client'}</strong>,
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#999;line-height:1.8;margin:0 0 28px;">
      Thank you for your trade enquiry with <strong style="color:#DDD;">Ballon Global Ventures Limited</strong>. 
      We have successfully received your order request and our trading team is currently reviewing the details. 
      A dedicated trade officer will be in contact with you shortly.
    </p>

    ${sectionHeader('Your Order Summary')}
    ${dataTable(`
      ${dataRow('Order Reference', o.id || 'Pending', true)}
      ${dataRow('Product', o.product_name)}
      ${dataRow('Quantity', o.quantity)}
      ${o.contract_quantity ? dataRow('Contract Volume', o.contract_quantity) : ''}
      ${dataRow('Destination Port', o.destination)}
      ${o.payment_term ? dataRow('Payment Terms', o.payment_term) : ''}
      ${o.shipment_term || o.incoterms ? dataRow('Incoterms', o.shipment_term || o.incoterms) : ''}
    `)}

    ${sectionHeader('What Happens Next')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      ${[
        ['01', 'Order Review', 'Our trade team verifies your requirements and checks stock availability.'],
        ['02', 'Quotation', 'We prepare a formal proforma invoice with pricing and logistics.'],
        ['03', 'Agreement', 'Contract signing and payment terms are finalised.'],
        ['04', 'Shipment', 'Your cargo is prepared, inspected, and shipped to your port.'],
      ].map(([n, title, desc]) => `
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:44px;">
          <div style="width:32px;height:32px;background:${G};display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:${BK};text-align:center;line-height:32px;">${n}</div>
        </td>
        <td style="padding:10px 0 10px 14px;border-bottom:1px solid rgba(255,255,255,0.04);">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#DDD;">${title}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#777;line-height:1.5;">${desc}</p>
        </td>
      </tr>`).join('')}
    </table>

    ${alertBox('💬', 'For urgent enquiries, please reply to this email or contact us directly via WhatsApp. We respond within 24 business hours.')}

    ${refId(o.id || 'N/A')}
  `
  return shell(body, `Order received — ${o.product_name} — Ref: ${o.id}`)
}

// ══════════════════════════════════════════════════════════════
// 2. ADMIN ORDER NOTIFICATION
// ══════════════════════════════════════════════════════════════
export function adminOrderNotificationEmail(o: Record<string, string>): string {
  const isAgri = o.type === 'agricultural'
  const typeColor = isAgri ? '#27ae60' : '#e67e22'
  const typeLabel = isAgri ? '🌾 AGRICULTURAL' : '⛽ PETROLEUM'

  const body = `
    ${heroStrip('🔔', 'New Trade Order Received', `${typeLabel} — Submitted ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}`, typeColor)}

    ${sectionHeader('Buyer Information', G)}
    ${dataTable(`
      ${dataRow('Full Name', o.buyer_name, true)}
      ${dataRow('WhatsApp', o.whatsapp)}
      ${dataRow('Email', o.email)}
      ${o.company ? dataRow('Company', o.company) : ''}
      ${o.buyer_city || o.buyer_country ? dataRow('Location', [o.buyer_city, o.buyer_country].filter(Boolean).join(', ')) : ''}
      ${o.buyer_ip ? dataRow('IP Address', o.buyer_ip) : ''}
    `)}

    ${sectionHeader('Product & Logistics', G)}
    ${dataTable(`
      ${dataRow('Product', o.product_name, true)}
      ${dataRow('Order Quantity', o.quantity, true)}
      ${o.contract_quantity ? dataRow('Contract Volume', o.contract_quantity) : ''}
      ${dataRow('Destination Port', o.destination, true)}
      ${o.payment_term ? dataRow('Payment Terms', o.payment_term) : ''}
      ${o.shipment_term ? dataRow('Shipment Incoterm', o.shipment_term) : ''}
      ${o.incoterms ? dataRow('Incoterms', o.incoterms) : ''}
      ${o.price ? dataRow('Target Price', o.price) : ''}
      ${o.delivery_schedule ? dataRow('Delivery Schedule', o.delivery_schedule) : ''}
    `)}

    ${isAgri ? `
    ${sectionHeader('Quality Specifications', CY)}
    ${dataTable(`
      ${o.purity ? dataRow('Purity', o.purity) : ''}
      ${o.moisture ? dataRow('Moisture', o.moisture) : ''}
      ${o.oil_content ? dataRow('Oil Content', o.oil_content) : ''}
      ${o.odor_taste ? dataRow('Odor / Taste', o.odor_taste) : ''}
      ${o.appearance ? dataRow('Appearance', o.appearance) : ''}
      ${o.packaging_size ? dataRow('Packaging', o.packaging_size) : ''}
    `)}` : ''}

    ${o.notes ? `
    ${sectionHeader('Additional Notes', '#9b59b6')}
    <div style="background:#0D0D0D;border:1px solid rgba(201,168,76,0.12);border-left:3px solid #9b59b6;padding:16px 20px;margin-bottom:8px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#CCC;line-height:1.7;white-space:pre-wrap;">${o.notes}</p>
    </div>` : ''}

    <div style="display:grid;gap:12px;margin-top:32px;">
      ${ctaButton(`✉ Reply to ${o.buyer_name}`, `mailto:${o.email}?subject=RE: Your Trade Enquiry — ${encodeURIComponent(o.product_name)}`)}
      ${o.whatsapp ? ctaButton('💬 Message on WhatsApp', `https://wa.me/${o.whatsapp.replace(/[^0-9]/g,'')}?text=Hello+${encodeURIComponent(o.buyer_name)},+regarding+your+enquiry+for+${encodeURIComponent(o.product_name)}`, '#25d366') : ''}
    </div>

    ${refId(o.id || 'N/A')}
  `
  return shell(body, `New order: ${o.product_name} from ${o.buyer_name}`)
}

// ══════════════════════════════════════════════════════════════
// 3. ADMIN CONTACT NOTIFICATION
// ══════════════════════════════════════════════════════════════
export function adminContactNotificationEmail(m: Record<string, string>): string {
  const body = `
    ${heroStrip('📨', 'New Contact Message', `Received ${new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}`, CY)}

    ${sectionHeader('Sender Details', G)}
    ${dataTable(`
      ${dataRow('Name', m.name, true)}
      ${dataRow('Email', m.email)}
      ${m.subject ? dataRow('Subject', m.subject) : ''}
    `)}

    ${sectionHeader('Message', CY)}
    <div style="background:#0D0D0D;border:1px solid rgba(201,168,76,0.12);border-left:3px solid ${CY};padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#CCC;line-height:1.8;white-space:pre-wrap;">${m.message}</p>
    </div>

    ${ctaButton(`✉ Reply to ${m.name}`, `mailto:${m.email}?subject=RE: ${encodeURIComponent(m.subject || 'Your Message — Ballon Global Ventures')}`)}

    ${refId(m.id || 'MSG-' + Date.now())}
  `
  return shell(body, `New message from ${m.name}: ${m.subject || 'Contact enquiry'}`)
}

// ══════════════════════════════════════════════════════════════
// 4. ADMIN REPLY TO CLIENT
// ══════════════════════════════════════════════════════════════
export function adminReplyToClientEmail(p: {
  to: string; clientName: string; productName: string
  adminMessage: string; quotedPrice?: string; validUntil?: string
}): string {
  const body = `
    ${heroStrip('📋', 'Official Trade Response', `Regarding your enquiry for ${p.productName}`, G)}

    <p style="font-family:Arial,sans-serif;font-size:14px;color:#CCC;line-height:1.8;margin:0 0 28px;">
      Dear <strong style="color:${G};">${p.clientName}</strong>,<br/><br/>
      Thank you for your interest in trading with <strong style="color:#DDD;">Ballon Global Ventures Limited</strong>. 
      Please find our official response to your enquiry below.
    </p>

    ${p.quotedPrice ? `
    ${sectionHeader('Quoted Price', G)}
    <div style="background:linear-gradient(135deg,#1A1400 0%,#0F0C00 100%);border:1px solid rgba(201,168,76,0.3);padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#777;text-transform:uppercase;">Quoted Price</p>
      <p style="margin:0;font-family:Georgia,serif;font-size:32px;font-weight:700;color:${G};letter-spacing:2px;">${p.quotedPrice}</p>
      ${p.validUntil ? `<p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#666;">Valid until: <span style="color:#AAA;">${p.validUntil}</span></p>` : ''}
    </div>` : ''}

    ${sectionHeader('Our Response', CY)}
    <div style="background:#0D0D0D;border:1px solid rgba(201,168,76,0.12);border-left:3px solid ${CY};padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#CCC;line-height:1.8;white-space:pre-wrap;">${p.adminMessage}</p>
    </div>

    ${alertBox('📎', 'To proceed, please reply to this email or contact us directly. We look forward to establishing a successful trade partnership with you.')}

    ${ctaButton('✉ Reply to This Email', `mailto:ballonholdingsltd@gmail.com?subject=RE: Enquiry for ${encodeURIComponent(p.productName)}`)}

    <p style="text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#555;margin:24px 0 0;line-height:1.7;">
      Ballon Global Ventures Limited &nbsp;·&nbsp; Certified Export House<br/>
      CAC · NEPC · SCUML · OGISP · NMDPRA
    </p>

    ${refId('BGVL-' + Date.now())}
  `
  return shell(body, `Trade response regarding ${p.productName}`)
}

// ── WhatsApp helpers (unchanged) ──────────────────────────────
export function buildWhatsAppMessage(o: Record<string, string>): string {
  return `🔔 *NEW ORDER — BALLON GLOBAL VENTURES*\n\n` +
    `*Ref:* ${o.id || 'N/A'}\n` +
    `*Type:* ${o.type?.toUpperCase()}\n` +
    `*Product:* ${o.product_name}\n` +
    `*Quantity:* ${o.quantity}\n` +
    `*Destination:* ${o.destination}\n` +
    `*Buyer:* ${o.buyer_name}\n` +
    `*WhatsApp:* ${o.whatsapp}\n` +
    `*Email:* ${o.email}\n` +
    (o.company ? `*Company:* ${o.company}\n` : '') +
    (o.payment_term ? `*Payment:* ${o.payment_term}\n` : '') +
    (o.notes ? `\n*Notes:* ${o.notes}` : '')
}

export function buildWhatsAppLink(number: string, message: string): string {
  const clean = number.replace(/[^0-9]/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
