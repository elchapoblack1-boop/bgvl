'use client'
import { useLang } from '@/contexts/LangContext'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

// ── STATS ──────────────────────────────────────────────
export function StatsSection() {
  const { t } = useLang()
  const stats = [
    { num: '50+', label: t('stat_countries') },
    { num: '10+', label: t('stat_products') },
    { num: '6', label: t('stat_certs') },
    { num: '100%', label: t('stat_quality') },
  ]
  return (
    <section style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="grid-4" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '40px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: 'var(--gold)', display: 'block', lineHeight: 1 }}>{s.num}</span>
            <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 10, display: 'block' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── ABOUT ──────────────────────────────────────────────
export function AboutSection() {
  const { t } = useLang()
  return (
    <section id="about" style={{ padding: 'clamp(50px,8vw,100px) 20px', background: 'var(--black)' }}>
      <div className="grid-2" style={{ maxWidth: 1200, margin: '0 auto', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'var(--dark3)', border: '1px solid var(--border)',
            padding: 'clamp(30px,5vw,60px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            aspectRatio: '1', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50%,rgba(201,168,76,0.08),transparent 70%)' }} />
            <Image src="/logo.png" alt="BGVL" width={220} height={220} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.3))', maxWidth: '80%', height: 'auto' }} />
          </div>
        </div>
        <div>
          <div className="section-label">{t('about_label')}</div>
          <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(22px,3vw,40px)', fontWeight: 700, marginBottom: 16 }}>{t('about_title')}</h2>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 24 }}>{t('about_sub')}</p>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 16 }}>{t('about_p1')}</p>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, lineHeight: 1.8, color: 'var(--text-muted)' }}>{t('about_p2')}</p>
          <ul style={{ listStyle: 'none', marginTop: 24 }}>
            {[t('about_li1'), t('about_li2'), t('about_li3'), t('about_li4')].map((li, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 13, letterSpacing: 1 }}>
                <span style={{ color: 'var(--gold)', fontSize: 8, flexShrink: 0 }}>◆</span> {li}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ── PRODUCTS ──────────────────────────────────────────────
const AGRI_PRODUCTS_DATA = [
  { icon: '🌾', key: 'sesame', name: 'Sesame Seeds', desc: 'Premium hulled and natural sesame seeds, sun-dried with high oil content. Used in food, pharmaceuticals, and cosmetics globally.', specs: [['Purity','99.5% min'],['Moisture','≤ 6%'],['Oil Content','48–52%'],['Packaging','25kg / 50kg Bags']] },
  { icon: '🥜', key: 'sheanuts', name: 'Shea Nuts', desc: 'Whole dried shea nuts sourced from Northern Nigeria. Rich in fatty acids, prized for cosmetic and food manufacturing.', specs: [['Purity','98% min'],['Moisture','≤ 8%'],['Fat Content','45–50%'],['Packaging','50kg / 100kg Bags']] },
  { icon: '🫘', key: 'cashew', name: 'Cashew Nuts', desc: 'Raw and processed cashew nuts (RCN) and W180-W450 kernels. Premium grade meeting international food safety standards.', specs: [['Purity','99% min'],['Moisture','≤ 9%'],['KOR','48–52 lbs'],['Packaging','80kg Bags']] },
  { icon: '🧈', key: 'sheabutter', name: 'Shea Butter', desc: 'Unrefined and refined shea butter from high-quality nuts. Widely used in cosmetics, pharma, and food industries.', specs: [['Grade','A / B'],['Moisture','≤ 1%'],['Free Fatty Acid','≤ 5%'],['Packaging','25kg Drums']] },
  { icon: '🌺', key: 'hibiscus', name: 'Hibiscus Flower', desc: 'Dried hibiscus calyces (Roselle), vibrant in color and rich in antioxidants. Highly demanded for beverages and herbal products.', specs: [['Purity','99% min'],['Moisture','≤ 12%'],['Color','Deep Red'],['Packaging','25kg / 50kg']] },
]
const PETRO_PRODUCTS_DATA = [
  { icon: '🔵', key: 'gas', name: 'Natural Gas', desc: 'Liquefied Natural Gas (LNG) and Compressed Natural Gas (CNG) for industrial and commercial use.', specs: [['Methane','≥ 95%'],['H₂S','< 4ppm'],['Water','< 7 lb/mmscf'],['Term','Spot / Long-term']] },
  { icon: '⛽', key: 'fuel', name: 'Fuel (PMS)', desc: 'Premium Motor Spirit meeting international standards. Supplied in bulk for commercial, industrial and government buyers.', specs: [['Octane','91 / 95 RON'],['Sulphur','≤ 50 ppm'],['Density','725–780 kg/m³'],['Min Order','1,000 MT']] },
  { icon: '🕯️', key: 'kero', name: 'Kerosene (DPK)', desc: 'Dual Purpose Kerosene for domestic and aviation use. Clean-burning, low-sulphur grade.', specs: [['Flash Point','≥ 38°C'],['Sulphur','≤ 50 ppm'],['Density','780–820 kg/m³'],['Min Order','500 MT']] },
  { icon: '🚢', key: 'diesel', name: 'AGO (Diesel)', desc: 'Automotive Gas Oil meeting EN590 standard. For shipping, power generation, manufacturing and transportation.', specs: [['Cetane','≥ 51'],['Sulphur','≤ 10 ppm'],['Density','820–845 kg/m³'],['Min Order','1,000 MT']] },
  { icon: '🏗️', key: 'bitumen', name: 'Bitumen', desc: 'Penetration grade bitumen (60/70, 80/100) for road construction and waterproofing.', specs: [['Grade','60/70 | 80/100'],['Penetration','60–80 dmm'],['Softening Pt','46–54°C'],['Packaging','180kg Drums']] },
]

export function ProductsSection() {
  const { t } = useLang()
  const [tab, setTab] = useState<'agri' | 'petro'>('agri')
  const products = tab === 'agri' ? AGRI_PRODUCTS_DATA : PETRO_PRODUCTS_DATA

  return (
    <section id="products" style={{ padding: 'clamp(50px,8vw,100px) 20px', background: 'var(--dark2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-label">{t('products_label')}</div>
        <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(24px,4vw,48px)', fontWeight: 700, marginBottom: 16 }}>{t('products_title')}</h2>
        <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 40 }}>{t('products_sub')}</p>

        <div style={{ display: 'flex', border: '1px solid var(--border)', marginBottom: 40, maxWidth: 500 }}>
          {([['agri', t('tab_agri')], ['petro', t('tab_petro')]] as const).map(([key, label], i) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '14px 0', background: tab === key ? 'var(--gold)' : 'transparent',
              color: tab === key ? 'var(--black)' : 'var(--text-muted)', border: 'none',
              borderRight: i === 0 ? '1px solid var(--border)' : 'none',
              fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s',
            }}>{label}</button>
          ))}
        </div>

        <div className="grid-3">
          {products.map(p => (
            <div key={p.key} style={{ background: 'var(--dark3)', padding: '32px 24px', border: '1px solid transparent', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              <span style={{ fontSize: 34, marginBottom: 14, display: 'block' }}>{p.icon}</span>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginBottom: 10 }}>{p.name}</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 16 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none' }}>
                {p.specs.map(([k, v]) => (
                  <li key={k} style={{ fontSize: 11, letterSpacing: 1, padding: '5px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    {k} <span style={{ color: 'var(--gold)' }}>{v}</span>
                  </li>
                ))}
              </ul>
              <Link href="/order" style={{
                display: 'block', marginTop: 18, width: '100%', padding: 10, textAlign: 'center',
                background: 'transparent', border: '1px solid var(--border)', color: 'var(--gold)',
                fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, cursor: 'pointer',
                textDecoration: 'none', transition: 'all 0.3s', textTransform: 'uppercase',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--black)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
              >{t('order_now')}</Link>
            </div>
          ))}
          <div style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid var(--border)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: 40, marginBottom: 16 }}>{tab === 'agri' ? '➕' : '⚡'}</span>
            <p style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: tab === 'agri' ? 'var(--gold)' : 'var(--cyan)', letterSpacing: 2, marginBottom: 8 }}>{tab === 'agri' ? t('more_products') : t('custom_order')}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>{tab === 'agri' ? t('contact_us_products') : t('custom_order_sub')}</p>
            <Link href="/contact" style={{ padding: '10px 24px', border: `1px solid ${tab === 'agri' ? 'var(--border)' : 'var(--cyan)'}`, color: tab === 'agri' ? 'var(--gold)' : 'var(--cyan)', fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase' }}>
              {tab === 'agri' ? t('contact_us') : t('inquire')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── CERTIFICATIONS ──────────────────────────────────────────────
const CERTS = [
  { icon: '🏛️', name: 'CAC', full: 'Corporate Affairs Commission — Business Registration' },
  { icon: '🌍', name: 'NEPC', full: 'Nigerian Export Promotion Council — Export License' },
  { icon: '🛡️', name: 'SCUML', full: 'Special Control Unit Against Money Laundering' },
  { icon: '🛢️', name: 'OGISP', full: 'Oil & Gas Intermediary Scheme — Petroleum Trade' },
  { icon: '⚖️', name: 'NMDPRA', full: 'Nigerian Midstream & Downstream Petroleum Regulatory Authority' },
  { icon: '®️', name: 'Trademark', full: 'Registered Trademark — Brand Protection & Authenticity' },
]

export function CertificationsSection() {
  const { t } = useLang()
  return (
    <section id="certifications" style={{ padding: 'clamp(50px,8vw,100px) 20px', background: 'var(--black)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-label">{t('certs_label')}</div>
        <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(24px,4vw,48px)', fontWeight: 700, marginBottom: 16 }}>{t('certs_title')}</h2>
        <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 50 }}>{t('certs_sub')}</p>
        <div className="grid-6">
          {CERTS.map(c => (
            <div key={c.name} style={{ background: 'var(--dark3)', border: '1px solid var(--border)', padding: '28px 14px', textAlign: 'center', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              <span style={{ fontSize: 28, marginBottom: 10, display: 'block' }}>{c.icon}</span>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{c.full}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CONTACT ──────────────────────────────────────────────
export function ContactSection() {
  const { t } = useLang()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data: Record<string, string> = {}
    new FormData(e.currentTarget).forEach((v, k) => data[k] = v.toString())
    try {
      const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { toast.success('Message sent! We will reply within 24 hours.'); (e.target as HTMLFormElement).reset() }
      else toast.error('Failed to send message. Please try again.')
    } catch { toast.error('Network error.') }
    finally { setLoading(false) }
  }

  const inp = {
    style: { background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--white)', padding: '13px 16px', fontFamily: 'Montserrat,sans-serif', fontSize: 13, outline: 'none', width: '100%', marginBottom: 16 },
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.style.borderColor = 'var(--gold)',
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.style.borderColor = 'rgba(201,168,76,0.2)',
  }

  return (
    <section id="contact" style={{ padding: 'clamp(50px,8vw,100px) 20px', background: 'var(--black)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-label">{t('contact_label')}</div>
        <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(24px,4vw,48px)', fontWeight: 700, marginBottom: 40 }}>{t('contact_title')}</h2>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            {[
              { icon: '📧', title: t('contact_email'), val: 'ballonholdingsltd@gmail.com', href: 'mailto:ballonholdingsltd@gmail.com' },
              { icon: '🌍', title: t('contact_operations'), val: t('contact_ops_val') },
              { icon: '⏰', title: t('contact_hours'), val: t('contact_hours_val') },
              { icon: '✈️', title: t('contact_shipping'), val: t('contact_shipping_val') },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'start', marginBottom: 28 }}>
                <div style={{ width: 46, height: 46, background: 'var(--dark3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', marginBottom: 6, textTransform: 'uppercase' }}>{item.title}</h4>
                  {item.href ? <a href={item.href} style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}>{item.val}</a>
                    : <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.val}</p>}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <p style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', marginBottom: 12 }}>{t('certified_by')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['CAC','NEPC','SCUML','OGISP','NMDPRA','™'].map(c => <span key={c} className="cert-badge">{c}</span>)}
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', padding: 'clamp(24px,4vw,50px)' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 24 }}>{t('send_message')}</div>
            <form onSubmit={handleSubmit}>
              <label style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{t('full_name')}</label>
              <input name="name" required placeholder="Your name" {...inp} />
              <label style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{t('email_label')}</label>
              <input name="email" type="email" required placeholder="your@email.com" {...inp} />
              <label style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{t('subject_label')}</label>
              <input name="subject" placeholder="Subject" {...inp} />
              <label style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{t('message_label')}</label>
              <textarea name="message" rows={5} required placeholder="Your message..." style={{ ...inp.style, resize: 'vertical' }} onFocus={inp.onFocus} onBlur={inp.onBlur} />
              <button type="submit" disabled={loading} style={{ background: 'var(--gold)', color: 'var(--black)', border: 'none', padding: '16px 40px', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', marginTop: 8, width: '100%' }}>
                {loading ? 'Sending...' : t('send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── FOOTER ──────────────────────────────────────────────
export function Footer() {
  const { t } = useLang()
  return (
    <footer style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', padding: 'clamp(40px,6vw,60px) 20px 30px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid-footer" style={{ marginBottom: 40 }}>
          <div>
            <Image src="/logo.png" alt="BGVL" width={56} height={56} style={{ objectFit: 'contain', marginBottom: 16 }} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 280 }}>{t('footer_desc')}</p>
            <p style={{ marginTop: 14, fontSize: 12, color: 'var(--gold)' }}>📧 ballonholdingsltd@gmail.com</p>
          </div>
          {[
            { title: t('quick_links'), links: [['/about',t('nav_about')],['/products',t('nav_products')],['/certifications',t('nav_certs')],['/order',t('nav_order')],['/contact',t('nav_contact')]] },
            { title: t('agri_products'), links: [['/order','Sesame Seeds'],['/order','Shea Nuts'],['/order','Cashew Nuts'],['/order','Shea Butter'],['/order','Hibiscus Flower']] },
            { title: t('petro_products'), links: [['/order','Natural Gas'],['/order','Fuel (PMS)'],['/order','Kerosene'],['/order','Diesel (AGO)'],['/order','Bitumen']] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 18 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {col.links.map(([href, label]) => (
                  <li key={label} style={{ marginBottom: 10 }}>
                    <Link href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, transition: 'color 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>© {new Date().getFullYear()} Ballon Global Ventures Limited. {t('rights')}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['CAC','NEPC','NMDPRA'].map(c => (
              <span key={c} style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: 2, color: 'var(--gold)', border: '1px solid var(--border)', padding: '4px 8px' }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
