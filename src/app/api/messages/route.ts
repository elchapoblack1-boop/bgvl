import { NextRequest, NextResponse } from 'next/server'
import { dbAll, dbRun } from '@/lib/db'
import { sendContactEmails } from '@/lib/email'
import { sendWhatsAppContactNotification } from '@/lib/whatsapp'
import { isAdminAuthenticated } from '@/lib/auth'

function generateId() {
  return 'MSG-' + Date.now() + '-' + Math.random().toString(36).substr(2,6).toUpperCase()
}

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const messages = await dbAll('SELECT * FROM messages ORDER BY created_at DESC')
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = generateId()
    await dbRun(
      'INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, subject || '', message]
    )

    try { await sendContactEmails({ name, email, subject: subject || '', message }) } catch (e: any) {
      console.error('[MESSAGE] Email failed:', e.message)
    }
    try { await sendWhatsAppContactNotification({ name, email, subject: subject || '', message }) } catch (e: any) {
      console.error('[MESSAGE] WhatsApp failed:', e.message)
    }

    return NextResponse.json({ success: true, id })
  } catch (err: any) {
    console.error('Message POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
