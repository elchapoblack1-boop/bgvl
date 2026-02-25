import { NextRequest, NextResponse } from 'next/server'
import { dbRun } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbRun('UPDATE messages SET is_read = 1 WHERE id = ?', [params.id])
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await dbRun('DELETE FROM messages WHERE id = ?', [params.id])
  return NextResponse.json({ success: true })
}
