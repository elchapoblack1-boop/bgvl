import { NextRequest, NextResponse } from 'next/server'
import { dbAll, dbTransaction } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  const rows = await dbAll('SELECT lang, key, value FROM translations')
  const result: Record<string, Record<string, string>> = {}
  for (const row of rows) {
    if (!result[row.lang]) result[row.lang] = {}
    result[row.lang][row.key] = row.value
  }
  return NextResponse.json({ translations: result })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { lang, translations } = await req.json()
  const ops = Object.entries(translations).map(([key, value]) => ({
    sql: 'INSERT OR REPLACE INTO translations (lang, key, value, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP)',
    params: [lang, key, value],
  }))
  await dbTransaction(ops)
  return NextResponse.json({ success: true })
}
