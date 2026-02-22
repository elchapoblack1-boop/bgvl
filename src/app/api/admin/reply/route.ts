import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { sendAdminReply } from '@/lib/email'

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { to, clientName, productName, adminMessage, quotedPrice, validUntil } = await req.json()
    if (!to || !adminMessage) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await sendAdminReply({ to, clientName, productName, adminMessage, quotedPrice, validUntil })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
