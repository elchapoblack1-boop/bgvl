import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDB()
  db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(params.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDB()
  db.prepare('DELETE FROM messages WHERE id = ?').run(params.id)
  return NextResponse.json({ success: true })
}
