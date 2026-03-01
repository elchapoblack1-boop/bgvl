// ══════════════════════════════════════════════════════
// BGVL NOTIFICATIONS
// 1. Telegram Bot — free forever, auto-sends on every order/contact
// 2. WhatsApp Link — pre-filled wa.me link returned to frontend button
//
// Telegram setup (2 min):
//   1. Open Telegram → search @BotFather → /newbot → copy token
//   2. Message your new bot once, then visit:
//      https://api.telegram.org/bot<TOKEN>/getUpdates  → copy your chat_id
//   3. Add to Railway: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// ══════════════════════════════════════════════════════

// ── TELEGRAM ─────────────────────────────────────────

async function sendTelegram(message: string): Promise<void> {
  const token   = process.env.TELEGRAM_BOT_TOKEN
  const chat_id = process.env.TELEGRAM_CHAT_ID

  if (!token || !chat_id) {
    console.log('[TELEGRAM] ⛔ Skipping — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Railway.')
    return
  }

  console.log('[TELEGRAM] Sending notification...')

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text: message, parse_mode: 'Markdown' }),
    })
    const json = await res.json()
    if (json.ok) {
      console.log('[TELEGRAM] ✅ Sent successfully | message_id:', json.result?.message_id)
    } else {
      console.error('[TELEGRAM] ❌ Failed:', JSON.stringify(json))
      if (json.error_code === 401) console.error('[TELEGRAM]   Fix: TELEGRAM_BOT_TOKEN is wrong — get it from @BotFather')
      if (json.error_code === 400) console.error('[TELEGRAM]   Fix: TELEGRAM_CHAT_ID is wrong — visit https://api.telegram.org/bot<TOKEN>/getUpdates to find it')
    }
  } catch (err: any) {
    console.error('[TELEGRAM] ❌ Request error:', err.message)
  }
}

// ── ORDER NOTIFICATION ────────────────────────────────

export async function sendWhatsAppNotification(order: Record<string, string>) {
  const message = [
    `🔔 *NEW ORDER — Ballon Global Ventures*`,
    ``,
    `📦 *Product:* ${order.product_name || '—'}`,
    `🔖 *Type:* ${order.type === 'agricultural' ? 'Agricultural 🌾' : 'Petroleum 🛢️'}`,
    ``,
    `👤 *Buyer:* ${order.buyer_name || '—'}`,
    `🏢 *Company:* ${order.company || '—'}`,
    `📱 *WhatsApp:* ${order.whatsapp || '—'}`,
    `📧 *Email:* ${order.email || '—'}`,
    `📍 *Location:* ${[order.buyer_city, order.buyer_country].filter(Boolean).join(', ') || '—'}`,
    ``,
    `📦 *Quantity:* ${order.quantity || '—'}`,
    `🌍 *Destination:* ${order.destination || '—'}`,
    `💰 *Price Target:* ${order.price || '—'}`,
    `💳 *Payment:* ${order.payment_term || '—'}`,
    `🚢 *Incoterm:* ${order.incoterms || '—'}`,
    ``,
    `🆔 *Order ID:* ${order.id || '—'}`,
    ``,
    `⚡ Login to your admin panel to view and reply.`,
  ].join('\n')

  await sendTelegram(message)
}

// ── CONTACT NOTIFICATION ──────────────────────────────

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

  await sendTelegram(message)
}
