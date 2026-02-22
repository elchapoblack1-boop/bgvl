import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { sendContactEmails } from '@/lib/email'
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
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const db = getDB()
    const id = generateId()
    db.prepare('INSERT INTO messages (id, name, email, subject, message) VALUES (?,?,?,?,?)').run(id, name, email, subject || '', message)
    // Send beautifully designed notification email to admin
    sendContactEmails({ id, name, email, subject: subject || '', message })
    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('Message POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
