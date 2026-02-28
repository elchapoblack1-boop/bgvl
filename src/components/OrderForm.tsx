'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LangContext'
import toast from 'react-hot-toast'

const AGRI_PRODUCTS = ['Sesame Seeds (Natural)','Sesame Seeds (Hulled)','Shea Nuts','Shea Butter (Unrefined)','Shea Butter (Refined)','Cashew Nuts (RCN)','Cashew Kernels (W180–W450)','Hibiscus Flower (Roselle)','Soya Beans','Palm Kernel Nuts','Palm Kernel Oil','Groundnuts','Ginger','Turmeric','Other Agricultural']
const PETRO_PRODUCTS = ['Crude Oil','Natural Gas (LNG/CNG)','Fuel (PMS / Petrol)','Kerosene (DPK)','Diesel (AGO)','Jet Fuel (ATK)','Bitumen (60/70)','Bitumen (80/100)','Base Oil','Lubricants','LPG (Cooking Gas)','Other Petroleum']
const INCOTERMS = ['FOB (Free on Board)','CIF (Cost, Insurance & Freight)','CFR (Cost & Freight)','EXW (Ex Works)','DAP (Delivered at Place)','DDP (Delivered Duty Paid)','FCA (Free Carrier)']

const DESTINATION_PORTS: Record<string, string[]> = {
  '🌍 West Africa': [
    'Lagos (Apapa), Nigeria','Tin Can Island, Nigeria','Warri, Nigeria','Port Harcourt, Nigeria',
    'Tema, Ghana','Abidjan, Côte d\'Ivoire','Dakar, Senegal','Cotonou, Benin',
    'Lomé, Togo','Douala, Cameroon','Libreville, Gabon',
  ],
  '🌍 East & Southern Africa': [
    'Mombasa, Kenya','Dar es Salaam, Tanzania','Durban, South Africa','Cape Town, South Africa',
    'Port Elizabeth, South Africa','Maputo, Mozambique','Djibouti, Djibouti','Beira, Mozambique',
  ],
  '🌍 North Africa & Middle East': [
    'Port Said, Egypt','Alexandria, Egypt','Casablanca, Morocco','Tunis, Tunisia',
    'Jebel Ali (Dubai), UAE','Sharjah, UAE','Abu Dhabi, UAE','Salalah, Oman',
    'Jeddah, Saudi Arabia','Dammam, Saudi Arabia','Karachi, Pakistan',
  ],
  '🌍 Asia & Far East': [
    'Shanghai, China','Ningbo, China','Qingdao, China','Tianjin, China','Guangzhou, China',
    'Shenzhen (Yantian), China','Singapore','Port Klang, Malaysia',
    'Bangkok (Laem Chabang), Thailand','Ho Chi Minh City, Vietnam','Jakarta, Indonesia',
    'Mumbai (JNPT), India','Chennai, India','Kolkata, India','Colombo, Sri Lanka',
    'Tokyo, Japan','Busan, South Korea',
  ],
  '🌍 Europe': [
    'Rotterdam, Netherlands','Antwerp, Belgium','Hamburg, Germany','Bremen, Germany',
    'Felixstowe, United Kingdom','Southampton, United Kingdom','Le Havre, France',
    'Barcelona, Spain','Valencia, Spain','Genoa, Italy','Trieste, Italy',
    'Piraeus, Greece','Istanbul, Turkey','Gdansk, Poland',
  ],
  '🌍 Americas': [
    'Houston, USA','New York / New Jersey, USA','Los Angeles, USA','Miami, USA',
    'Savannah, USA','New Orleans, USA','Vancouver, Canada','Santos, Brazil',
    'Buenos Aires, Argentina','Cartagena, Colombia','Callao, Peru','Veracruz, Mexico',
  ],
  '🌍 Other': ['Other / Custom Port'],
}

export default function OrderForm() {
  const { t } = useLang()
  const [tab, setTab] = useState<'agricultural' | 'petroleum'>('agricultural')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [waLink, setWaLink] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [destPort, setDestPort] = useState('')
  const [customDest, setCustomDest] = useState('')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data: Record<string, string> = { type: tab }
    new FormData(e.currentTarget).forEach((v, k) => data[k] = v.toString())
    // if "Other / Custom Port" selected, use the typed custom value as destination
    if (data.destination === 'Other / Custom Port' && data.destination_custom) {
      data.destination = data.destination_custom
    }
    delete data.destination_custom
    try {
      const geoRes = await fetch('https://ipapi.co/json/').catch(() => null)
      if (geoRes?.ok) {
        const geo = await geoRes.json()
        data.buyer_city = geo.city || ''; data.buyer_country = geo.country_name || ''; data.buyer_ip = geo.ip || ''
      }
    } catch {}
    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { const json = await res.json(); setSuccess(true); setWaLink(json.whatsappLink || null); (e.target as HTMLFormElement).reset(); setTimeout(() => { setSuccess(false); setWaLink(null) }, 15000) }
      else toast.error('Submission failed. Please try again.')
    } catch { toast.error('Network error.') }
    finally { setLoading(false) }
  }

  const inpStyle = { background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--white)', padding: '13px 16px', fontFamily: 'Montserrat,sans-serif', fontSize: 13, outline: 'none', width: '100%' }
  const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }
  const FG = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
  const inp = { style: inpStyle, onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'var(--gold)', onBlur: (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'rgba(201,168,76,0.2)' }
  const sel = { style: { ...inpStyle, cursor: 'pointer' } }
  const tex = { style: { ...inpStyle, resize: 'vertical' as const }, onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => e.target.style.borderColor = 'var(--gold)', onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => e.target.style.borderColor = 'rgba(201,168,76,0.2)' }

  const twoCol = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }

  return (
    <section id="order" style={{ padding: 'clamp(50px,8vw,100px) 20px', background: 'var(--dark2)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-label">{t('order_label')}</div>
        <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(24px,4vw,48px)', fontWeight: 700, marginBottom: 16 }}>{t('order_title')}</h2>
        <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 40 }}>{t('order_sub')}</p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', marginBottom: 40, maxWidth: 480, flexWrap: 'wrap' }}>
          {(['agricultural', 'petroleum'] as const).map((type, i) => (
            <button key={type} onClick={() => setTab(type)} style={{
              flex: 1, minWidth: 140, padding: '14px 10px',
              background: tab === type ? 'var(--gold)' : 'transparent',
              color: tab === type ? 'var(--black)' : 'var(--text-muted)',
              border: 'none', borderRight: i === 0 ? '1px solid var(--border)' : 'none',
              fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
            }}>{type === 'agricultural' ? t('tab_agri') : t('tab_petro')}</button>
          ))}
        </div>

        {success && (
          <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', padding: 30, marginBottom: 30, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: 18, color: '#27ae60', marginBottom: 8 }}>{t('success_title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: waLink ? 20 : 0 }}>{t('success_msg')}</p>
            {waLink && (
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#25d366', color: '#fff', padding: '12px 28px',
                fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2,
                textDecoration: 'none', textTransform: 'uppercase', marginTop: 8,
              }}>
                <span style={{ fontSize: 18 }}>💬</span> Notify via WhatsApp
              </a>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Buyer Info */}
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            {t('buyer_info')} <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'inline-block' }} />
          </div>
          <div style={twoCol}>
            <FG label={t('full_name')}><input name="buyer_name" required placeholder="Your full legal name" {...inp} /></FG>
            <FG label={t('whatsapp')}><input name="whatsapp" required type="tel" placeholder="+1 234 567 8900" {...inp} /></FG>
          </div>
          <div style={twoCol}>
            <FG label={t('email_label')}><input name="email" required type="email" placeholder="your@email.com" {...inp} /></FG>
            <FG label={t('company')}><input name="company" placeholder="Your company name" {...inp} /></FG>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 28, marginTop: 8 }} />

          {/* Product Details */}
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            {t('product_details')} <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'inline-block' }} />
          </div>

          <div style={twoCol}>
            <FG label={t('product_name')}>
              <select name="product_name" required {...sel}>
                <option value="">— Select Product —</option>
                {(tab === 'agricultural' ? AGRI_PRODUCTS : PETRO_PRODUCTS).map(p => <option key={p}>{p}</option>)}
              </select>
            </FG>
            <FG label={t('quantity')}><input name="quantity" required placeholder="e.g. 20 MT, 1 container" {...inp} /></FG>
          </div>
          <div style={twoCol}>
            <FG label={t('contract_qty')}><input name="contract_quantity" placeholder="e.g. 240 MT/year" {...inp} /></FG>
            <FG label={t('destination')}>
              <select
                name="destination"
                required
                value={destPort}
                onChange={e => { setDestPort(e.target.value); if (e.target.value !== 'Other / Custom Port') setCustomDest('') }}
                {...sel}
              >
                <option value="">— Select Destination Port —</option>
                {Object.entries(DESTINATION_PORTS).map(([region, ports]) => (
                  <optgroup key={region} label={region}>
                    {ports.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                ))}
              </select>
              {destPort === 'Other / Custom Port' && (
                <input
                  name="destination_custom"
                  required
                  placeholder="Enter your port / city"
                  value={customDest}
                  onChange={e => setCustomDest(e.target.value)}
                  style={{ ...inpStyle, marginTop: 8, borderTop: '1px dashed rgba(201,168,76,0.3)' }}
                />
              )}
            </FG>
          </div>

          {tab === 'agricultural' && (
            <>
              <div style={twoCol}>
                <FG label={t('purity')}><input name="purity" placeholder="e.g. 99.5% minimum" {...inp} /></FG>
                <FG label={t('moisture')}><input name="moisture" placeholder="e.g. ≤ 6%" {...inp} /></FG>
              </div>
              <div style={twoCol}>
                <FG label={t('odor_taste')}><input name="odor_taste" placeholder="e.g. Natural, odourless" {...inp} /></FG>
                <FG label={t('appearance')}><input name="appearance" placeholder="e.g. Clean, free from foreign matter" {...inp} /></FG>
              </div>
              <div style={twoCol}>
                <FG label={t('oil_content')}><input name="oil_content" placeholder="e.g. 48–52%" {...inp} /></FG>
                <FG label={t('packaging_size')}><input name="packaging_size" placeholder="e.g. 25kg or 50kg bags" {...inp} /></FG>
              </div>
              <div style={twoCol}>
                <FG label={t('payment_term')}><input name="payment_term" placeholder="e.g. 30% deposit, 70% before shipment" {...inp} /></FG>
                <FG label={t('shipment_term')}>
                  <select name="shipment_term" {...sel}>
                    <option value="">— Select Incoterm —</option>
                    {INCOTERMS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </FG>
              </div>
            </>
          )}

          {tab === 'petroleum' && (
            <>
              <div style={twoCol}>
                <FG label={t('price')}><input name="price" placeholder="e.g. $500/MT or market price" {...inp} /></FG>
                <FG label={t('incoterms')}>
                  <select name="incoterms" required {...sel}>
                    <option value="">— Select Incoterm —</option>
                    {INCOTERMS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </FG>
              </div>
              <div style={twoCol}>
                <FG label={t('payment_term')}><input name="payment_term" required placeholder="e.g. LC at sight, 30% advance" {...inp} /></FG>
                <FG label={t('preferred_schedule')}><input name="delivery_schedule" placeholder="e.g. Monthly, Q1 2025 onwards" {...inp} /></FG>
              </div>
            </>
          )}

          <FG label={t('additional_notes')}>
            <textarea name="notes" rows={4} placeholder="Any special requirements, certifications, inspection preferences..." {...tex} />
          </FG>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>{t('form_note')}</p>

          <button type="submit" disabled={loading} style={{
            background: loading ? 'var(--gold-dark)' : 'var(--gold)',
            color: 'var(--black)', border: 'none', padding: '18px 40px',
            fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 3,
            textTransform: 'uppercase', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
            width: isMobile ? '100%' : 'auto',
          }}>
            {loading ? 'Submitting...' : t('submit_order')}
          </button>
        </form>
      </div>
    </section>
  )
}
