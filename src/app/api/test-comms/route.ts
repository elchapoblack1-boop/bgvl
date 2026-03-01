import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const results: Record<string, any> = {}

  // ── ENV VAR CHECK ──────────────────────────────
  results.env = {
    BREVO_API_KEY: process.env.BREVO_API_KEY ? `SET (${process.env.BREVO_API_KEY.length} chars, starts: ${process.env.BREVO_API_KEY.substring(0,8)}...)` : '❌ MISSING',
    NOTIFY_EMAIL: process.env.NOTIFY_EMAIL || '❌ MISSING',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? `SET (${process.env.TELEGRAM_BOT_TOKEN.length} chars)` : '❌ MISSING',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '❌ MISSING',
    ADMIN_WHATSAPP: process.env.ADMIN_WHATSAPP || '❌ MISSING',
  }

  const brevoKey = process.env.BREVO_API_KEY
  const notifyEmail = process.env.NOTIFY_EMAIL || 'ballonholdingsltd@gmail.com'

  // ── SEND TEST EMAIL VIA BREVO ─────────────────
  if (req.nextUrl.searchParams.get('send') === '1') {
    if (!brevoKey) {
      results.email = { status: '❌ NOT CONFIGURED', fix: 'Add BREVO_API_KEY to Railway Variables. Get it free at brevo.com' }
    } else {
      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Ballon Global Ventures Ltd', email: 'ballonholdingsltd@gmail.com' },
            to: [{ email: notifyEmail }],
            subject: '✅ BGVL Email Test — Working!',
            htmlContent: `<div style="background:#111;padding:40px;font-family:Arial;color:#eee;text-align:center;">
              <h2 style="color:#C9A84C;font-family:Georgia;letter-spacing:3px;">✅ EMAIL IS WORKING</h2>
              <p style="color:#888;">Your Brevo email integration is configured correctly.</p>
              <p style="color:#555;font-size:12px;">Sent to: ${notifyEmail} · ${new Date().toISOString()}</p>
            </div>`
          }),
        })
        const json = await res.json()
        if (json.messageId) {
          results.email = { status: '✅ SENT', messageId: json.messageId, to: notifyEmail, message: 'Check your inbox!' }
        } else {
          results.email = {
            status: '❌ FAILED', response: json,
            fix: res.status === 401 ? 'BREVO_API_KEY is invalid — get a new one at brevo.com/settings/keys/api'
               : res.status === 400 && JSON.stringify(json).includes('sender') ? 'Verify ballonholdingsltd@gmail.com as a sender in Brevo → Senders & Domains'
               : 'Check BREVO_API_KEY in Railway Variables'
          }
        }
      } catch (e: any) {
        results.email = { status: '❌ ERROR', error: e.message }
      }
    }
  }

  // ── TELEGRAM TEST ─────────────────────────────
  const tgTest = req.nextUrl.searchParams.get('wa') === '1'
  const tgConfigured = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
  if (tgTest && tgConfigured) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `✅ *BGVL Telegram Test — Working!*\n\nYour Telegram notification is configured correctly.\n\n_Sent: ${new Date().toISOString()}_`,
          parse_mode: 'Markdown',
        }),
      })
      const json = await res.json()
      results.telegram = json.ok
        ? { status: '✅ SENT', message: 'Check your Telegram!' }
        : { status: '❌ FAILED', response: json,
            fix: json.error_code === 401 ? 'TELEGRAM_BOT_TOKEN is wrong — get it from @BotFather'
               : json.error_code === 400 ? 'TELEGRAM_CHAT_ID is wrong — visit https://api.telegram.org/bot<TOKEN>/getUpdates to find it'
               : 'Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Railway' }
    } catch (e: any) {
      results.telegram = { status: '❌ ERROR', error: e.message }
    }
  } else if (tgTest) {
    results.telegram = { status: '❌ NOT CONFIGURED', fix: 'Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Railway' }
  }

  return NextResponse.json(results)
}
