import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { sendOrderEmails } from '@/lib/email'
import { isAdminAuthenticated } from '@/lib/auth'
import { buildWhatsAppMessage, buildWhatsAppLink } from '@/lib/emailTemplates'

function generateId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2,6).toUpperCase()
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDB()
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  let query = 'SELECT * FROM orders WHERE 1=1'
  const params: any[] = []
  if (type) { query += ' AND type = ?'; params.push(type) }
  if (status) { query += ' AND status = ?'; params.push(status) }
  if (search) { query += ' AND (buyer_name LIKE ? OR email LIKE ? OR product_name LIKE ? OR destination LIKE ?)'; const s = `%${search}%`; params.push(s,s,s,s) }
  query += ' ORDER BY created_at DESC'
  const orders = db.prepare(query).all(...params)
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = getDB()
    const id = generateId()
    const { type, buyer_name, whatsapp, email, company, product_name, quantity, contract_quantity,
      destination, payment_term, shipment_term, incoterms, price, purity, moisture, odor_taste,
      appearance, oil_content, packaging_size, delivery_schedule, notes,
      buyer_city, buyer_country, buyer_ip } = body

    if (!type || !buyer_name || !whatsapp || !email || !product_name || !quantity || !destination) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get client IP for location tracking
    const clientIP = buyer_ip || req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'Unknown'

    db.prepare(`INSERT INTO orders (id,type,buyer_name,whatsapp,email,company,product_name,
      quantity,contract_quantity,destination,payment_term,shipment_term,incoterms,price,purity,
      moisture,odor_taste,appearance,oil_content,packaging_size,delivery_schedule,notes,buyer_city,buyer_country,buyer_ip)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(id,type,buyer_name,whatsapp,email,company,product_name,quantity,contract_quantity,
        destination,payment_term,shipment_term,incoterms,price,purity,moisture,odor_taste,
        appearance,oil_content,packaging_size,delivery_schedule,notes,buyer_city||'',buyer_country||'',clientIP)

    const orderData = { id, type, buyer_name, whatsapp, email, company, product_name,
      quantity, contract_quantity, destination, payment_term, shipment_term, incoterms,
      price, purity, moisture, odor_taste, appearance, oil_content, packaging_size,
      delivery_schedule, notes, buyer_city: buyer_city||'', buyer_country: buyer_country||'' }

    // Fire-and-forget: email (buyer confirmation + admin notification)
    sendOrderEmails(orderData)

    // Build WhatsApp notification link for admin
    const waMsg = buildWhatsAppMessage(orderData)
    const adminWANumber = process.env.ADMIN_WHATSAPP || ''
    const waLink = adminWANumber ? buildWhatsAppLink(adminWANumber, waMsg) : null

    return NextResponse.json({ success: true, id, whatsappLink: waLink })
  } catch (err: any) {
    console.error('Order POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
