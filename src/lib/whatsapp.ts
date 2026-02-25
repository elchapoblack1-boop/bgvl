// UltraMsg WhatsApp notification
// Your ballonholdingsltd WhatsApp account sends messages to itself
// Setup: Sign up at ultramsg.com, create instance, scan QR with your WhatsApp
// Add ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN, ULTRAMSG_TO to Railway variables

async function sendUltraMsg(message: string) {
  const instance = process.env.ULTRAMSG_INSTANCE
  const token = process.env.ULTRAMSG_TOKEN
  const to = process.env.ULTRAMSG_TO

  if (!instance || !token || !to) {
    console.log('[WHATSAPP] Skipping — ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN or ULTRAMSG_TO not set in Railway variables')
    return
  }

  const url = `https://api.ultramsg.com/${instance}/messages/chat`

  const body = new URLSearchParams({
    token,
    to: `${to}@c.us`,
    body: message,
    priority: '1',
  })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    const json = await res.json()
    if (json.sent === 'true' || json.id) {
      console.log('[WHATSAPP] ✅ UltraMsg message sent successfully')
    } else {
      console.error('[WHATSAPP] ❌ UltraMsg failed:', JSON.stringify(json))
    }
  } catch (err: any) {
    console.error('[WHATSAPP] ❌ UltraMsg request error:', err.message)
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
    `⚡ Login to your admin panel to view and reply to this order.`,
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
