import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signAdminToken } from '@/lib/auth'
import { dbGet, dbAll } from '@/lib/db'

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
  const [agriRow, petroRow, msgRow, newRow, unreadRow, recent] = await Promise.all([
    dbGet(`SELECT COUNT(*) as c FROM orders WHERE type='agricultural'`),
    dbGet(`SELECT COUNT(*) as c FROM orders WHERE type='petroleum'`),
    dbGet(`SELECT COUNT(*) as c FROM messages`),
    dbGet(`SELECT COUNT(*) as c FROM orders WHERE status='New'`),
    dbGet(`SELECT COUNT(*) as c FROM messages WHERE is_read=0`),
    dbAll(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`),
  ])
  return NextResponse.json({
    agriCount: parseInt(agriRow?.c ?? 0),
    petroCount: parseInt(petroRow?.c ?? 0),
    msgCount: parseInt(msgRow?.c ?? 0),
    newCount: parseInt(newRow?.c ?? 0) + parseInt(unreadRow?.c ?? 0),
    recent,
  })
}
