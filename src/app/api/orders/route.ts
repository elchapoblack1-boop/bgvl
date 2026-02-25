import { NextRequest, NextResponse } from 'next/server'
import { dbAll, dbRun } from '@/lib/db'
import { sendOrderEmails } from '@/lib/email'
import { sendWhatsAppNotification } from '@/lib/whatsapp'
import { isAdminAuthenticated } from '@/lib/auth'
import { buildWhatsAppMessage, buildWhatsAppLink } from '@/lib/emailTemplates'

function generateId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2,6).toUpperCase()
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let sql = 'SELECT * FROM orders WHERE 1=1'
  const params: any[] = []
  if (type) { sql += ' AND type = ?'; params.push(type) }
  if (status) { sql += ' AND status = ?'; params.push(status) }
  if (search) {
    sql += ' AND (buyer_name LIKE ? OR email LIKE ? OR product_name LIKE ? OR destination LIKE ?)'
    const s = `%${search}%`; params.push(s, s, s, s)
  }
  sql += ' ORDER BY created_at DESC'

  const orders = await dbAll(sql, params)
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const id = generateId()
    const {
      type, buyer_name, whatsapp, email, company, product_name, quantity,
      contract_quantity, destination, payment_term, shipment_term, incoterms,
      price, purity, moisture, odor_taste, appearance, oil_content,
      packaging_size, delivery_schedule, notes, buyer_city, buyer_country, buyer_ip
    } = body

    if (!type || !buyer_name || !whatsapp || !email || !product_name || !quantity || !destination) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const clientIP = buyer_ip || req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'Unknown'

    await dbRun(
      `INSERT INTO orders (id,type,buyer_name,whatsapp,email,company,product_name,
        quantity,contract_quantity,destination,payment_term,shipment_term,incoterms,price,purity,
        moisture,odor_taste,appearance,oil_content,packaging_size,delivery_schedule,notes,
        buyer_city,buyer_country,buyer_ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id,type,buyer_name,whatsapp,email,company||'',product_name,quantity,contract_quantity||'',
       destination,payment_term||'',shipment_term||'',incoterms||'',price||'',purity||'',
       moisture||'',odor_taste||'',appearance||'',oil_content||'',packaging_size||'',
       delivery_schedule||'',notes||'',buyer_city||'',buyer_country||'',clientIP]
    )

    const orderData = {
      id, type, buyer_name, whatsapp, email, company: company||'', product_name,
      quantity, contract_quantity: contract_quantity||'', destination,
      payment_term: payment_term||'', shipment_term: shipment_term||'',
      incoterms: incoterms||'', price: price||'', purity: purity||'',
      moisture: moisture||'', odor_taste: odor_taste||'', appearance: appearance||'',
      oil_content: oil_content||'', packaging_size: packaging_size||'',
      delivery_schedule: delivery_schedule||'', notes: notes||'',
      buyer_city: buyer_city||'', buyer_country: buyer_country||''
    }

    try { await sendOrderEmails(orderData) } catch (e: any) {
      console.error('[ORDER] Email failed:', e.message)
    }
    try { await sendWhatsAppNotification(orderData) } catch (e: any) {
      console.error('[ORDER] WhatsApp failed:', e.message)
    }

    const adminWANumber = process.env.ADMIN_WHATSAPP || ''
    const waLink = adminWANumber ? buildWhatsAppLink(adminWANumber, buildWhatsAppMessage(orderData)) : null

    return NextResponse.json({ success: true, id, whatsappLink: waLink })
  } catch (err: any) {
    console.error('Order POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
