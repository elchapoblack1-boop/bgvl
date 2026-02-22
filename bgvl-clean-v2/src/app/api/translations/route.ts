import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  const db = getDB()
  const rows = db.prepare('SELECT lang, key, value FROM translations').all() as any[]
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
  const db = getDB()
  const stmt = db.prepare('INSERT OR REPLACE INTO translations (lang, key, value, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP)')
  const insertMany = db.transaction((entries: [string, string][]) => {
    for (const [key, value] of entries) stmt.run(lang, key, value)
  })
  insertMany(Object.entries(translations))
  return NextResponse.json({ success: true })
}
