// UltraMsg WhatsApp notification
// Your ballonholdingsltd WhatsApp account sends messages to itself
// Setup: Sign up at ultramsg.com, create instance, scan QR with your WhatsApp
// Add ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN, ULTRAMSG_TO to your environment variables

async function sendUltraMsg(message: string) {
  const instance = process.env.ULTRAMSG_INSTANCE
  const token = process.env.ULTRAMSG_TOKEN
  const to = process.env.ULTRAMSG_TO

  console.log('[WHATSAPP] ── Config ────────────────────────────')
  console.log('[WHATSAPP]   INSTANCE:', instance || '❌ MISSING')
  console.log('[WHATSAPP]   TOKEN   :', token ? `✅ set (${token.length} chars)` : '❌ MISSING')
  console.log('[WHATSAPP]   TO      :', to || '❌ MISSING')
  console.log('[WHATSAPP] ────────────────────────────────────────')

  if (!instance || !token || !to) {
    console.log('[WHATSAPP] ⛔ Skipping — missing env vars. Set ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN, ULTRAMSG_TO in Railway.')
    return
  }

  const url = `https://api.ultramsg.com/${instance}/messages/chat`
  const body = new URLSearchParams({
    token,
    to: `${to}@c.us`,
    body: message,
    priority: '1',
  })

  console.log('[WHATSAPP] Sending to:', `${to}@c.us`, 'via instance:', instance)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    const json = await res.json()
    console.log('[WHATSAPP] Raw response:', JSON.stringify(json))
    if (json.sent === 'true' || json.id) {
      console.log('[WHATSAPP] ✅ Sent successfully | id:', json.id)
    } else {
      console.error('[WHATSAPP] ❌ Failed:', JSON.stringify(json))
      if (json.error?.includes('not authorized')) console.error('[WHATSAPP]   Fix: Wrong token or instance — check your UltraMsg dashboard')
      if (json.error?.includes('not subscriber') || json.error?.includes('invalid')) console.error('[WHATSAPP]   Fix: ULTRAMSG_TO must be digits only, no + sign. e.g. 2348012345678')
    }
  } catch (err: any) {
    console.error('[WHATSAPP] ❌ Request error:', err.message)
  }
}

export async function sendWhatsAppNotification(order: Record<string, string>) {
  const message = [
    `🔔 *NEW ORDER — Ballon Global Ventures*`,
    ``,
    `📦 *Product:* ${order.product_name || '—'}`,
    `🔖 *Type:* ${order.type === 'agricultural' ? 'Agricultural 🌾' : 'Petroleum 🛢️'}`,
    `👤 *Buyer:* ${order.buyer_name || '—'}`,
    `🏢 *Company:* ${order.company || '—'}`,
    `📱 *WhatsApp:* ${order.whatsapp || '—'}`,
    `📧 *Email:* ${order.email || '—'}`,
    `📦 *Quantity:* ${order.quantity || '—'}`,
    `🌍 *Destination:* ${order.destination || '—'}`,
    `💰 *Price Target:* ${order.price || '—'}`,
    `💳 *Payment:* ${order.payment_term || '—'}`,
    `🚢 *Shipment:* ${order.shipment_term || '—'}`,
    `📍 *Location:* ${[order.buyer_city, order.buyer_country].filter(Boolean).join(', ') || '—'}`,
    `🆔 *Order ID:* ${order.id || '—'}`,
    ``,
    `⚡ Login to your admin panel to view and reply.`,
  ].join('\n')

  await sendUltraMsg(message)
}

export async function sendWhatsAppContactNotification(msg: Record<string, string>) {
  const message = [
    `📨 *NEW CONTACT MESSAGE — BGVL*`,
    ``,
    `👤 *From:* ${msg.name || '—'}`,
    `📧 *Email:* ${msg.email || '—'}`,
    `📋 *Subject:* ${msg.subject || 'No subject'}`,
    ``,
    `💬 *Message:*`,
    `${msg.message || '—'}`,
    ``,
    `⚡ Login to your admin panel to reply.`,
  ].join('\n')

  await sendUltraMsg(message)
}
