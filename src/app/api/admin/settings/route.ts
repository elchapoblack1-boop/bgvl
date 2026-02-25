import { NextRequest, NextResponse } from 'next/server'
import { dbAll, dbTransaction } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  const rows = await dbAll('SELECT key, value FROM settings')
  const settings: Record<string, string> = {}
  for (const row of rows) settings[row.key] = row.value
  return NextResponse.json({ settings })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const ops = Object.entries(body).map(([key, value]) => ({
    sql: 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?,?,CURRENT_TIMESTAMP)',
    params: [key, String(value)],
  }))
  await dbTransaction(ops)
  return NextResponse.json({ success: true })
}
