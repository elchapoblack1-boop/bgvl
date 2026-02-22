import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  const db = getDB()
  const rows = db.prepare('SELECT key, value FROM settings').all() as any[]
  const settings: Record<string, string> = {}
  for (const row of rows) settings[row.key] = row.value
  return NextResponse.json({ settings })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = getDB()
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?,?,CURRENT_TIMESTAMP)')
  for (const [key, value] of Object.entries(body)) {
    stmt.run(key, String(value))
  }
  return NextResponse.json({ success: true })
}
