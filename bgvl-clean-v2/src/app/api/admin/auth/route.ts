import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signAdminToken } from '@/lib/auth'
import { getDB } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const valid = await verifyPassword(password)
  if (!valid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  const token = signAdminToken()
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('admin_token')
  return res
}

export async function GET() {
  // Check auth status + return stats
  const db = getDB()
  const agriCount = (db.prepare("SELECT COUNT(*) as c FROM orders WHERE type='agricultural'").get() as any).c
  const petroCount = (db.prepare("SELECT COUNT(*) as c FROM orders WHERE type='petroleum'").get() as any).c
  const msgCount = (db.prepare("SELECT COUNT(*) as c FROM messages").get() as any).c
  const newCount = (db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='New'").get() as any).c
  const unreadMsgs = (db.prepare("SELECT COUNT(*) as c FROM messages WHERE is_read=0").get() as any).c
  const recent = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5").all()
  return NextResponse.json({ agriCount, petroCount, msgCount, newCount: newCount + unreadMsgs, recent })
}
