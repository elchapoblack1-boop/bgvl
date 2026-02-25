import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { sendContactEmails } from '@/lib/email'
import { sendWhatsAppContactNotification } from '@/lib/whatsapp'
import { isAdminAuthenticated } from '@/lib/auth'

function generateId() {
  return 'MSG-' + Date.now() + '-' + Math.random().toString(36).substr(2,6).toUpperCase()
}

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDB()
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDB()
    const id = generateId()
    db.prepare('INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)')
      .run(id, name, email, subject || '', message)

    // ✅ Send email (awaited - bug fixed)
    try {
      await sendContactEmails({ name, email, subject: subject || '', message })
    } catch (emailErr: any) {
      console.error('[MESSAGE] Email failed but message saved:', emailErr.message)
    }

    // ✅ Send WhatsApp via Callmebot
    try {
      await sendWhatsAppContactNotification({ name, email, subject: subject || '', message })
    } catch (waErr: any) {
      console.error('[MESSAGE] WhatsApp failed but message saved:', waErr.message)
    }

    return NextResponse.json({ success: true, id })
  } catch (err: any) {
    console.error('Message POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
