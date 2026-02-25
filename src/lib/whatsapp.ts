// Callmebot WhatsApp notification
// Free service - sends direct WhatsApp message to admin's personal number
// Setup: Send "I allow callmebot to send me messages" to +34 644 69 75 37 on WhatsApp
// Then add WHATSAPP_BOT_NUMBER and WHATSAPP_BOT_APIKEY to Railway variables

export async function sendWhatsAppNotification(order: Record<string, string>) {
  const number = process.env.WHATSAPP_BOT_NUMBER
  const apiKey = process.env.WHATSAPP_BOT_APIKEY

  if (!number || !apiKey) {
    console.log('[WHATSAPP] Skipping - WHATSAPP_BOT_NUMBER or WHATSAPP_BOT_APIKEY not set')
    return
  }

  const message = [
    `🔔 *NEW ORDER — Ballon Global Ventures*`,
    ``,
    `📦 *Product:* ${order.product_name || '—'}`,
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
    `⚡ Login to admin panel to reply`,
  ].join('\n')

  const encoded = encodeURIComponent(message)
  const url = `https://api.callmebot.com/whatsapp.php?phone=${number}&text=${encoded}&apikey=${apiKey}`

  try {
    const res = await fetch(url)
    const text = await res.text()
    if (res.ok && text.includes('Message queued')) {
      console.log('[WHATSAPP] ✅ WhatsApp notification sent to:', number)
    } else {
      console.error('[WHATSAPP] ❌ Unexpected response:', text.substring(0, 200))
    }
  } catch (err: any) {
    console.error('[WHATSAPP] ❌ Failed to send WhatsApp notification:', err.message)
  }
}

export async function sendWhatsAppContactNotification(msg: Record<string, string>) {
  const number = process.env.WHATSAPP_BOT_NUMBER
  const apiKey = process.env.WHATSAPP_BOT_APIKEY

  if (!number || !apiKey) return

  const message = [
    `📨 *NEW CONTACT MESSAGE — BGVL*`,
    ``,
    `👤 *From:* ${msg.name || '—'}`,
    `📧 *Email:* ${msg.email || '—'}`,
    `📋 *Subject:* ${msg.subject || '—'}`,
    ``,
    `💬 *Message:*`,
    `${msg.message || '—'}`,
    ``,
    `⚡ Login to admin panel to reply`,
  ].join('\n')

  const encoded = encodeURIComponent(message)
  const url = `https://api.callmebot.com/whatsapp.php?phone=${number}&text=${encoded}&apikey=${apiKey}`

  try {
    const res = await fetch(url)
    const text = await res.text()
    if (res.ok) console.log('[WHATSAPP] ✅ Contact WhatsApp notification sent')
    else console.error('[WHATSAPP] ❌ Contact notification failed:', text.substring(0, 100))
  } catch (err: any) {
    console.error('[WHATSAPP] ❌ Contact WhatsApp failed:', err.message)
  }
}
