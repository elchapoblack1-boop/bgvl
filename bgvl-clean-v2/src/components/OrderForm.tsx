'use client'
import { useState } from 'react'
import { useLang } from '@/contexts/LangContext'
import toast from 'react-hot-toast'

const INCOTERMS = ['FOB — Free On Board', 'CIF — Cost Insurance Freight', 'CFR — Cost and Freight', 'EXW — Ex Works', 'DDP — Delivered Duty Paid', 'DAP — Delivered At Place', 'FCA — Free Carrier']
const AGRI_PRODUCTS = ['Sesame Seeds', 'Shea Nuts', 'Cashew Nuts', 'Shea Butter', 'Hibiscus Flower', 'Other']
const PETRO_PRODUCTS = ['Natural Gas (LNG/CNG)', 'Fuel (PMS) — Premium Motor Spirit', 'Kerosene (DPK)', 'Diesel (AGO)', 'Bitumen 60/70', 'Bitumen 80/100', 'Other']

const inputStyle = {
  background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--white)',
  padding: '13px 16px', fontFamily: 'Montserrat,sans-serif', fontSize: 13,
  outline: 'none', width: '100%', transition: 'border-color 0.3s',
}
const labelStyle = {
  fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3,
  color: 'var(--gold)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8,
}

function FG({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export default function OrderForm() {
  const { t } = useLang()
  const [tab, setTab] = useState<'agricultural' | 'petroleum'>('agricultural')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data: Record<string, string> = { type: tab }
    new FormData(form).forEach((v, k) => data[k] = v.toString())

    // Capture client location via IP geolocation
    try {
      const geo = await fetch('https://ipapi.co/json/').then(r => r.json())
      data.buyer_city = geo.city || ''
      data.buyer_country = geo.country_name || ''
      data.buyer_ip = geo.ip || ''
    } catch { /* silent fail */ }

    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) {
        const result = await res.json()
        setSuccess(true)
        form.reset()
        toast.success(t('success_title'))
        setTimeout(() => setSuccess(false), 6000)
        // Auto-open WhatsApp notification if link provided (optional)
        if (result.whatsappLink) {
          // Admin WhatsApp notify - open in background
          const wa = document.createElement('a')
          wa.href = result.whatsappLink
          wa.target = '_blank'
          // wa.click() // uncomment to auto-open WhatsApp
        }
      } else {
        const err = await res.json()
        toast.error(err.error || 'Error submitting order')
      }
    } catch { toast.error('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--gold)'
  }
  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(201,168,76,0.2)'
  }

  const inp = { style: inputStyle, onFocus: focusInput, onBlur: blurInput }
  const sel = { style: { ...inputStyle, cursor: 'pointer' }, onFocus: focusInput, onBlur: blurInput }
  const tex = { style: { ...inputStyle, resize: 'vertical' as const }, onFocus: focusInput, onBlur: blurInput }

  return (
    <section id="order" style={{ padding: '100px 40px', background: 'var(--dark2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-label">{t('order_label')}</div>
        <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, marginBottom: 16 }}>{t('order_title')}</h2>
        <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 50 }}>{t('order_sub')}</p>

        {/* Tabs */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', maxWidth: 500, marginBottom: 50 }}>
          {(['agricultural', 'petroleum'] as const).map((type, i) => (
            <button key={type} onClick={() => { setTab(type); setSuccess(false) }} style={{
              flex: 1, padding: '14px 0',
              background: tab === type ? 'var(--gold)' : 'transparent',
              color: tab === type ? 'var(--black)' : 'var(--text-muted)',
              border: 'none', borderRight: i === 0 ? '1px solid var(--border)' : 'none',
              fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2,
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
            }}>
              {type === 'agricultural' ? t('tab_agri') : t('tab_petro')}
            </button>
          ))}
        </div>

        {success && (
          <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', padding: 30, marginBottom: 30, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: 20, color: '#27ae60', marginBottom: 8 }}>{t('success_title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('success_msg')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: 860 }}>
          {/* Buyer Info */}
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            {t('buyer_info')} <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'inline-block' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <FG label={t('full_name')}><input name="buyer_name" required placeholder="Your full legal name" {...inp} /></FG>
            <FG label={t('whatsapp')}><input name="whatsapp" required type="tel" placeholder="+1 234 567 8900" {...inp} /></FG>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
            <FG label={t('email_label')}><input name="email" required type="email" placeholder="your@email.com" {...inp} /></FG>
            <FG label={t('company')}><input name="company" placeholder="Your company name" {...inp} /></FG>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 24 }} />

          {/* Product Details */}
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            {t('product_details')} <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'inline-block' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <FG label={t('product_name')}>
              <select name="product_name" required {...sel}>
                <option value="">— Select Product —</option>
                {(tab === 'agricultural' ? AGRI_PRODUCTS : PETRO_PRODUCTS).map(p => <option key={p}>{p}</option>)}
              </select>
            </FG>
            <FG label={t('quantity')}><input name="quantity" required placeholder="e.g. 20 MT, 1 container" {...inp} /></FG>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <FG label={t('contract_qty')}><input name="contract_quantity" placeholder="e.g. 240 MT/year (1 year)" {...inp} /></FG>
            <FG label={t('destination')}><input name="destination" required placeholder="e.g. Rotterdam, Netherlands" {...inp} /></FG>
          </div>

          {tab === 'agricultural' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <FG label={t('purity')}><input name="purity" placeholder="e.g. 99.5% minimum" {...inp} /></FG>
                <FG label={t('moisture')}><input name="moisture" placeholder="e.g. ≤ 6%" {...inp} /></FG>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <FG label={t('odor_taste')}><input name="odor_taste" placeholder="e.g. Natural, odourless" {...inp} /></FG>
                <FG label={t('appearance')}><input name="appearance" placeholder="e.g. Clean, free from foreign matter" {...inp} /></FG>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <FG label={t('oil_content')}><input name="oil_content" placeholder="e.g. 48–52%" {...inp} /></FG>
                <FG label={t('packaging_size')}><input name="packaging_size" placeholder="e.g. 25kg or 50kg bags" {...inp} /></FG>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <FG label={t('price')}><input name="price" placeholder="e.g. $500/MT or market price" {...inp} /></FG>
                <FG label={t('incoterms')}>
                  <select name="incoterms" required {...sel}>
                    <option value="">— Select Incoterm —</option>
                    {INCOTERMS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </FG>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <FG label={t('payment_term')}><input name="payment_term" required placeholder="e.g. LC at sight, 30% advance" {...inp} /></FG>
                <FG label={t('preferred_schedule')}><input name="delivery_schedule" placeholder="e.g. Monthly, Q1 2025 onwards" {...inp} /></FG>
              </div>
            </>
          )}

          <FG label={t('additional_notes')}>
            <textarea name="notes" rows={4} placeholder="Any special requirements, certifications, inspection preferences..." {...tex} />
          </FG>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16, marginBottom: 8, lineHeight: 1.6 }}>
            {t('form_note')}
          </p>

          <button type="submit" disabled={loading} style={{
            background: loading ? 'var(--gold-dark)' : 'var(--gold)',
            color: 'var(--black)', border: 'none', padding: '18px 60px',
            fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 3,
            textTransform: 'uppercase', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s', marginTop: 20,
          }}>
            {loading ? 'Submitting...' : t('submit_order')}
          </button>
        </form>
      </div>
    </section>
  )
}
