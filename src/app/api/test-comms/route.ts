import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const results: Record<string, any> = {}

  // ── ENV VAR CHECK ──────────────────────────────
  results.env = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? `SET (${process.env.RESEND_API_KEY.length} chars, starts: ${process.env.RESEND_API_KEY.substring(0,8)}...)` : '❌ MISSING',
    NOTIFY_EMAIL: process.env.NOTIFY_EMAIL || '❌ MISSING',
    ULTRAMSG_INSTANCE: process.env.ULTRAMSG_INSTANCE || '❌ MISSING',
    ULTRAMSG_TOKEN: process.env.ULTRAMSG_TOKEN ? `SET (${process.env.ULTRAMSG_TOKEN.length} chars)` : '❌ MISSING',
    ULTRAMSG_TO: process.env.ULTRAMSG_TO || '❌ MISSING',
    ADMIN_WHATSAPP: process.env.ADMIN_WHATSAPP || '❌ MISSING',
  }

  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.NOTIFY_EMAIL || 'ballonholdingsltd@gmail.com'

  // ── SEND TEST EMAIL VIA RESEND ────────────────
  if (req.nextUrl.searchParams.get('send') === '1') {
    if (!resendKey) {
      results.email = { status: '❌ NOT CONFIGURED', fix: 'Add RESEND_API_KEY to Railway Variables. Get it free at resend.com' }
    } else {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Ballon Global Ventures <onboarding@resend.dev>',
            to: notifyEmail,
            subject: '✅ BGVL Email Test — Working!',
            html: `<div style="background:#111;padding:40px;font-family:Arial;color:#eee;text-align:center;">
              <h2 style="color:#C9A84C;font-family:Georgia;letter-spacing:3px;">✅ EMAIL IS WORKING</h2>
              <p style="color:#888;">Your Resend email integration is configured correctly.</p>
              <p style="color:#555;font-size:12px;">Sent to: ${notifyEmail} · ${new Date().toISOString()}</p>
            </div>`
          }),
        })
        const json = await res.json()
        if (json.id) {
          results.email = { status: '✅ SENT', id: json.id, to: notifyEmail, message: 'Check your inbox!' }
        } else {
          results.email = {
            status: '❌ FAILED', response: json,
            fix: json.message?.includes('API key') ? 'RESEND_API_KEY is invalid — get a new one at resend.com/api-keys'
               : json.message?.includes('domain') ? 'Using onboarding@resend.dev (free plan) — this should work. Check your key.'
               : 'Check RESEND_API_KEY in Railway Variables'
          }
        }
      } catch (e: any) {
        results.email = { status: '❌ ERROR', error: e.message }
      }
    }
  }

  // ── WHATSAPP TEST ──────────────────────────────
  const waTest = req.nextUrl.searchParams.get('wa') === '1'
  const waConfigured = !!(process.env.ULTRAMSG_INSTANCE && process.env.ULTRAMSG_TOKEN && process.env.ULTRAMSG_TO)
  if (waTest && waConfigured) {
    try {
      const body = new URLSearchParams({
        token: process.env.ULTRAMSG_TOKEN!,
        to: `${process.env.ULTRAMSG_TO}@c.us`,
        body: `✅ BGVL WhatsApp Test — Working! ${new Date().toLocaleString()}`,
        priority: '1',
      })
      const res = await fetch(`https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE}/messages/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString(),
      })
      const json = await res.json()
      results.whatsapp = json.sent === 'true' || json.id
        ? { status: '✅ SENT', message: 'Check your WhatsApp!' }
        : { status: '❌ FAILED', response: json }
    } catch (e: any) {
      results.whatsapp = { status: '❌ ERROR', error: e.message }
    }
  } else if (waTest) {
    results.whatsapp = { status: '❌ NOT CONFIGURED', fix: 'Set ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN, ULTRAMSG_TO in Railway' }
  }

  return NextResponse.json(results)
}
