'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useLang } from '@/contexts/LangContext'
import { LANGUAGES, LangCode, BASE_TRANSLATIONS } from '@/lib/translations'

type Order = Record<string, string>
type Message = { id: string; name: string; email: string; subject: string; message: string; is_read: number; created_at: string }
type Section = 'dashboard' | 'agri' | 'petro' | 'messages' | 'translations' | 'settings'

const TRANS_KEYS: [string, string][] = [
  ['site_tagline','Language Bar Text'],['hero_badge','Hero Badge'],['hero_tagline','Hero Tagline'],
  ['hero_sub','Hero Subtitle'],['hero_btn1','Hero Button 1'],['hero_btn2','Hero Button 2'],
  ['nav_about','Nav: About'],['nav_products','Nav: Products'],['nav_certs','Nav: Certifications'],
  ['nav_order','Nav: Place Order'],['nav_contact','Nav: Contact'],['nav_cta','Nav CTA Button'],
  ['stat_countries','Stat: Countries'],['stat_products','Stat: Products'],
  ['stat_certs','Stat: Certifications'],['stat_quality','Stat: Quality'],
  ['about_title','About: Title'],['about_sub','About: Subtitle'],
  ['about_p1','About: Paragraph 1'],['about_p2','About: Paragraph 2'],
  ['products_title','Products: Title'],['products_sub','Products: Subtitle'],
  ['tab_agri','Tab: Agricultural'],['tab_petro','Tab: Petroleum'],
  ['order_title','Order: Title'],['order_sub','Order: Subtitle'],
  ['submit_order','Form: Submit Button'],
  ['contact_title','Contact: Title'],['send','Contact: Send Button'],
  ['success_title','Success: Title'],['success_msg','Success: Message'],
  ['footer_desc','Footer: Description'],['rights','Footer: Rights'],
]

export default function AdminPage() {
  const { lang, setLang } = useLang()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [section, setSection] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [stats, setStats] = useState({ agriCount: 0, petroCount: 0, msgCount: 0, newCount: 0, recent: [] as Order[] })
  const [agriOrders, setAgriOrders] = useState<Order[]>([])
  const [petroOrders, setPetroOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [transLang, setTransLang] = useState<LangCode>('en')
  const [transValues, setTransValues] = useState<Record<string, string>>({})
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [replyModal, setReplyModal] = useState<Order | null>(null)
  const [replyMsg, setReplyMsg] = useState('')
  const [replyPrice, setReplyPrice] = useState('')
  const [replyValid, setReplyValid] = useState('')
  const [replySending, setReplySending] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const login = async () => {
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) { setAuthed(true); loadStats() }
    else { setLoginError(true); setTimeout(() => setLoginError(false), 3000) }
  }

  const logout = async () => { await fetch('/api/admin/auth', { method: 'DELETE' }); setAuthed(false) }

  const loadStats = async () => {
    const res = await fetch('/api/admin/auth')
    if (res.ok) { const d = await res.json(); setStats(d) }
  }

  const loadOrders = async (type: 'agricultural' | 'petroleum') => {
    const params = new URLSearchParams({ type })
    if (searchQuery) params.set('search', searchQuery)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch('/api/orders?' + params)
    if (res.ok) {
      const { orders } = await res.json()
      type === 'agricultural' ? setAgriOrders(orders) : setPetroOrders(orders)
    }
  }

  const loadMessages = async () => {
    const res = await fetch('/api/messages')
    if (res.ok) { const { messages } = await res.json(); setMessages(messages) }
  }

  const loadTranslations = async () => {
    const res = await fetch('/api/translations')
    if (res.ok) {
      const { translations } = await res.json()
      const base = BASE_TRANSLATIONS[transLang] || {}
      const custom = translations[transLang] || {}
      const merged: Record<string, string> = {}
      TRANS_KEYS.forEach(([k]) => merged[k] = custom[k] !== undefined ? custom[k] : (base[k] || BASE_TRANSLATIONS.en[k] || ''))
      setTransValues(merged)
    }
  }

  const loadSettings = async () => {
    const res = await fetch('/api/admin/settings')
    if (res.ok) { const { settings } = await res.json(); setSettings(settings) }
  }

  const updateStatus = async (type: string, id: string, status: string) => {
    await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    type === 'agricultural' ? loadOrders('agricultural') : loadOrders('petroleum')
    loadStats()
  }

  const deleteOrder = async (type: string, id: string) => {
    if (!confirm('Delete this order?')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    type === 'agricultural' ? loadOrders('agricultural') : loadOrders('petroleum')
    loadStats(); toast.success('Order deleted')
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    loadMessages(); loadStats(); toast.success('Message deleted')
  }

  const markRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: 'PATCH' })
    loadMessages(); loadStats()
  }

  const saveTranslations = async () => {
    const res = await fetch('/api/translations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: transLang, translations: transValues }) })
    if (res.ok) toast.success('Translations saved for: ' + transLang)
    else toast.error('Failed to save')
  }

  const saveSettings = async () => {
    const res = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    if (res.ok) toast.success('Settings saved!')
    else toast.error('Failed to save settings')
  }

  const sendReply = async () => {
    if (!replyModal || !replyMsg.trim()) { toast.error('Please write a message'); return }
    setReplySending(true)
    try {
      const res = await fetch('/api/admin/reply', { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ to: replyModal.email, clientName: replyModal.buyer_name,
          productName: replyModal.product_name, adminMessage: replyMsg,
          quotedPrice: replyPrice || undefined, validUntil: replyValid || undefined }) })
      if (res.ok) { toast.success('Reply sent to ' + replyModal.email); setReplyModal(null); setReplyMsg(''); setReplyPrice(''); setReplyValid('') }
      else toast.error('Failed to send reply')
    } catch { toast.error('Network error') }
    finally { setReplySending(false) }
  }

  const exportCSV = (orders: Order[], filename: string) => {
    if (!orders.length) { toast.error('No orders to export'); return }
    const keys = Object.keys(orders[0])
    const csv = [keys.join(','), ...orders.map(o => keys.map(k => `"${(o[k] || '').replace(/"/g, '""')}`).join(','))].join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = filename; a.click()
  }

  const navSection = (id: Section) => { setSection(id); setSidebarOpen(false) }

  useEffect(() => {
    if (!authed) return
    if (section === 'dashboard') loadStats()
    if (section === 'agri') loadOrders('agricultural')
    if (section === 'petro') loadOrders('petroleum')
    if (section === 'messages') loadMessages()
    if (section === 'translations') loadTranslations()
    if (section === 'settings') loadSettings()
  }, [section, authed, transLang, searchQuery, statusFilter])

  const S = {
    card: { background: 'var(--dark3)', border: '1px solid var(--border)', padding: isMobile ? 16 : 24 } as React.CSSProperties,
    btn: { background: 'var(--gold)', color: 'var(--black)', border: 'none', padding: '8px 20px', fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, cursor: 'pointer', textTransform: 'uppercase' as const },
    btnSecondary: { background: 'transparent', color: 'var(--gold)', border: '1px solid var(--border)', padding: '8px 20px', fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, cursor: 'pointer', textTransform: 'uppercase' as const },
    btnDanger: { background: 'rgba(220,53,69,0.2)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', padding: '6px 14px', fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: 1, cursor: 'pointer', textTransform: 'uppercase' as const },
    inp: { background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--white)', padding: '8px 14px', fontFamily: 'Montserrat,sans-serif', fontSize: 12, outline: 'none' } as React.CSSProperties,
    label: { fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, color: 'var(--gold)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const },
  }

  const SideItem = ({ id, icon, label }: { id: Section; icon: string; label: string }) => (
    <div onClick={() => navSection(id)} style={{
      padding: '14px 24px', fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2,
      color: section === id ? 'var(--gold)' : 'var(--text-muted)', cursor: 'pointer',
      transition: 'all 0.2s', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 10,
      borderLeft: section === id ? '2px solid var(--gold)' : '2px solid transparent',
      background: section === id ? 'rgba(201,168,76,0.05)' : 'transparent',
    }}>{icon} {label}</div>
  )

  // ── LOGIN ──
  if (!authed) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--black)', padding: 20 }}>
      <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', padding: isMobile ? 30 : 60, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Image src="/logo.png" alt="BGVL" width={70} height={70} style={{ objectFit: 'contain', margin: '0 auto 20px' }} />
        <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 18, color: 'var(--gold)', marginBottom: 30, letterSpacing: 3 }}>Admin Login</h2>
        {loginError && <p style={{ color: '#dc3545', fontSize: 12, marginBottom: 16 }}>Incorrect password. Try again.</p>}
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <label style={S.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Enter admin password" style={{ ...S.inp, width: '100%', padding: '13px 16px' }} />
        </div>
        <button onClick={login} style={{ ...S.btn, width: '100%', padding: '16px', fontSize: 12 }}>Login</button>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>Default: <strong style={{ color: 'var(--gold)' }}>ballon2025</strong></p>
      </div>
    </div>
  )

  const sidebarWidth = 220

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* Top Bar */}
      <div style={{
        background: 'var(--dark2)', borderBottom: '1px solid var(--border)',
        padding: '0 16px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', height: 60, position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 4, padding: 4,
            }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 22, height: 2, background: 'var(--gold)', display: 'block' }} />)}
            </button>
          )}
          <span style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 10 : 13, letterSpacing: 2, color: 'var(--gold)' }}>
            {isMobile ? '⚙ BGVL ADMIN' : '⚙ ADMIN — BALLON GLOBAL VENTURES'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isMobile && (
            <select value={lang} onChange={e => setLang(e.target.value as LangCode)} style={{ ...S.inp, fontSize: 11 }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
            </select>
          )}
          <button style={S.btnSecondary} onClick={logout}>✕ {isMobile ? '' : 'Logout'}</button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 260, background: 'var(--dark2)', borderRight: '1px solid var(--border)', paddingTop: 70, overflowY: 'auto', zIndex: 201 }}>
            <SideItem id="dashboard" icon="📊" label="Dashboard" />
            <SideItem id="agri" icon="🌾" label="Agri Orders" />
            <SideItem id="petro" icon="🛢️" label="Petro Orders" />
            <SideItem id="messages" icon="📧" label="Messages" />
            <SideItem id="translations" icon="🌍" label="Translations" />
            <SideItem id="settings" icon="⚙️" label="Settings" />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{ width: sidebarWidth, background: 'var(--dark2)', borderRight: '1px solid var(--border)', position: 'fixed', left: 0, top: 60, bottom: 0, overflowY: 'auto', paddingTop: 16 }}>
          <SideItem id="dashboard" icon="📊" label="Dashboard" />
          <SideItem id="agri" icon="🌾" label="Agri Orders" />
          <SideItem id="petro" icon="🛢️" label="Petro Orders" />
          <SideItem id="messages" icon="📧" label="Messages" />
          <SideItem id="translations" icon="🌍" label="Translations" />
          <SideItem id="settings" icon="⚙️" label="Settings" />
        </div>
      )}

      {/* Main Content */}
      <div style={{ marginLeft: isMobile ? 0 : sidebarWidth, padding: isMobile ? 16 : 36 }}>

        {/* DASHBOARD */}
        {section === 'dashboard' && (
          <div>
            <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 16 : 20, color: 'var(--gold)', marginBottom: 20 }}>📊 Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 12 : 20, marginBottom: 28 }}>
              {[
                { n: stats.agriCount, l: 'Agricultural' }, { n: stats.petroCount, l: 'Petroleum' },
                { n: stats.msgCount, l: 'Messages' }, { n: stats.newCount, l: 'New / Unread' },
              ].map(s => (
                <div key={s.l} style={S.card}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 30 : 40, color: 'var(--gold)', fontWeight: 700 }}>{s.n}</div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: 'var(--gold)', marginBottom: 16 }}>Recent Orders</h3>
              {stats.recent.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p> : stats.recent.map((o: Order) => (
                <div key={o.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--gold)', fontFamily: 'Cinzel,serif', fontSize: 12 }}>{o.product_name || '—'}</span>
                  <br /><span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{o.buyer_name} · {o.created_at}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {(section === 'agri' || section === 'petro') && (() => {
          const type = section === 'agri' ? 'agricultural' : 'petroleum'
          const orders = section === 'agri' ? agriOrders : petroOrders
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 14 : 18, color: 'var(--gold)' }}>{section === 'agri' ? '🌾 Agricultural' : '🛢️ Petroleum'} Orders</h2>
                <button style={S.btn} onClick={() => exportCSV(orders, `bgvl_${type}_orders.csv`)}>⬇ CSV</button>
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <input placeholder="🔍 Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...S.inp, flex: 1, minWidth: 140 }} />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...S.inp, minWidth: 120 }}>
                  <option value="">All Status</option>
                  <option>New</option><option>Reviewed</option><option>Completed</option>
                </select>
              </div>

              {/* Mobile: Cards view */}
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {orders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p> : orders.map((o, i) => (
                    <div key={o.id} style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)', padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: 'var(--gold)', marginBottom: 4 }}>{o.product_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--white2)' }}>{o.buyer_name}</div>
                          {o.company && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{o.company}</div>}
                        </div>
                        <span className={`status-${(o.status || 'new').toLowerCase()}`}>{o.status || 'New'}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span>📦 {o.quantity} → {o.destination}</span>
                        <span>📅 {o.created_at?.split('T')[0]}</span>
                        {o.buyer_country && <span>📍 {[o.buyer_city, o.buyer_country].filter(Boolean).join(', ')}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button style={{ ...S.btnSecondary, fontSize: 9, padding: '5px 10px' }} onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                          {expandedOrder === o.id ? 'Hide' : 'View'}
                        </button>
                        <a href={`https://wa.me/${o.whatsapp?.replace(/\D/g,'')}`} target="_blank" style={{ background: 'rgba(37,211,102,0.2)', color: '#25d366', border: '1px solid rgba(37,211,102,0.3)', padding: '5px 10px', fontSize: 9, fontFamily: 'Cinzel,serif', letterSpacing: 1, textDecoration: 'none', textTransform: 'uppercase' as const }}>WA</a>
                        <button style={{ ...S.btn, fontSize: 9, padding: '5px 10px' }} onClick={() => { setReplyModal(o); setReplyMsg(''); setReplyPrice(''); setReplyValid('') }}>Reply</button>
                        <select value={o.status || 'New'} onChange={e => updateStatus(type, o.id, e.target.value)} style={{ background: 'var(--dark4)', border: '1px solid var(--border)', color: 'var(--gold)', fontFamily: 'Cinzel,serif', fontSize: 9, padding: '4px 8px' }}>
                          <option>New</option><option>Reviewed</option><option>Completed</option>
                        </select>
                        <button style={{ ...S.btnDanger, fontSize: 9, padding: '5px 10px' }} onClick={() => deleteOrder(type, o.id)}>Del</button>
                      </div>
                      {expandedOrder === o.id && (
                        <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          {Object.entries(o).filter(([k]) => !['id','type','status','created_at','updated_at'].includes(k)).map(([k,v]) => (
                            <div key={k}>
                              <div style={{ ...S.label, fontSize: 9 }}>{k.replace(/_/g,' ')}</div>
                              <div style={{ fontSize: 11, color: 'var(--white2)' }}>{v || '—'}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop: Table view */
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Date</th><th>Buyer</th><th>WhatsApp</th><th>Email</th>
                        <th>Product</th><th>Qty</th><th>Destination</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr><td colSpan={10} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No orders yet.</td></tr>
                      ) : orders.map((o, i) => (
                        <>
                          <tr key={o.id}>
                            <td style={{ color: 'var(--gold)', fontFamily: 'Cinzel,serif', fontSize: 10 }}>{i + 1}</td>
                            <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{o.created_at?.split('T')[0]}</td>
                            <td>
                              <strong>{o.buyer_name}</strong>
                              {o.company && <><br /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.company}</span></>}
                              {(o.buyer_city || o.buyer_country) && <><br /><span style={{ fontSize: 10, color: 'var(--cyan)' }}>📍 {[o.buyer_city, o.buyer_country].filter(Boolean).join(', ')}</span></>}
                            </td>
                            <td><a href={`https://wa.me/${o.whatsapp?.replace(/\D/g,'')}`} target="_blank" style={{ color: '#25d366', textDecoration: 'none' }}>{o.whatsapp}</a></td>
                            <td><a href={`mailto:${o.email}`} style={{ color: 'var(--gold)', textDecoration: 'none' }}>{o.email}</a></td>
                            <td>{o.product_name}</td>
                            <td>{o.quantity}</td>
                            <td>{o.destination}</td>
                            <td>
                              <select value={o.status || 'New'} onChange={e => updateStatus(type, o.id, e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontFamily: 'Cinzel,serif', fontSize: 10 }}>
                                <option>New</option><option>Reviewed</option><option>Completed</option>
                              </select>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <button style={{ ...S.btnSecondary, fontSize: 9, padding: '5px 10px', marginRight: 6 }} onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>View</button>
                              <button style={S.btnDanger} onClick={() => deleteOrder(type, o.id)}>Del</button>
                            </td>
                          </tr>
                          {expandedOrder === o.id && (
                            <tr key={`exp-${o.id}`}>
                              <td colSpan={10} style={{ padding: 0 }}>
                                <div style={{ background: 'var(--dark4)', borderLeft: '3px solid var(--gold)', padding: 24 }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
                                    {Object.entries(o).filter(([k]) => !['id','type','status','created_at','updated_at'].includes(k)).map(([k,v]) => (
                                      <div key={k}><div style={S.label}>{k.replace(/_/g,' ')}</div><div style={{ fontSize: 13, color: 'var(--white2)' }}>{v || '—'}</div></div>
                                    ))}
                                  </div>
                                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <button onClick={() => { setReplyModal(o); setReplyMsg(''); setReplyPrice(''); setReplyValid('') }} style={S.btn}>📧 Send Formal Reply</button>
                                    <a href={`mailto:${o.email}?subject=Re: Your Order - ${o.product_name}`} style={{ ...S.btnSecondary, textDecoration: 'none' }}>✉️ Quick Email</a>
                                    <a href={`https://wa.me/${o.whatsapp?.replace(/\D/g,'')}`} target="_blank" style={{ background: 'rgba(37,211,102,0.2)', color: '#25d366', border: '1px solid rgba(37,211,102,0.3)', padding: '8px 20px', fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase' as const }}>💬 WhatsApp</a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })()}

        {/* MESSAGES */}
        {section === 'messages' && (
          <div>
            <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 14 : 18, color: 'var(--gold)', marginBottom: 20 }}>📧 Contact Messages</h2>
            {messages.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No messages yet.</p> : messages.map(m => (
              <div key={m.id} style={{ background: 'var(--dark3)', border: `1px solid ${m.is_read ? 'var(--border)' : 'var(--cyan)'}`, borderLeft: `3px solid ${m.is_read ? 'var(--border)' : 'var(--cyan)'}`, padding: isMobile ? 16 : 24, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <strong style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: m.is_read ? 'var(--white)' : 'var(--cyan)' }}>{m.name}</strong>
                    {!m.is_read && <span style={{ background: 'var(--cyan)', color: 'var(--black)', fontSize: 9, padding: '2px 8px', marginLeft: 8, fontFamily: 'Cinzel,serif' }}>NEW</span>}
                    <br /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.email} · {m.created_at?.split('T')[0]}</span>
                    {m.subject && <><br /><span style={{ fontSize: 12, color: 'var(--gold)' }}>{m.subject}</span></>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {!m.is_read && <button style={{ ...S.btnSecondary, fontSize: 9, padding: '5px 10px' }} onClick={() => markRead(m.id)}>Read</button>}
                    <a href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your Enquiry'}`} style={{ ...S.btn, textDecoration: 'none', fontSize: 9, padding: '5px 10px' }}>Reply</a>
                    <button style={{ ...S.btnDanger, fontSize: 9, padding: '5px 10px' }} onClick={() => deleteMessage(m.id)}>Del</button>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--white2)', lineHeight: 1.6 }}>{m.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* TRANSLATIONS */}
        {section === 'translations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 14 : 18, color: 'var(--gold)' }}>🌍 Translations</h2>
              <button style={S.btn} onClick={saveTranslations}>💾 Save</button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => setTransLang(l.code)} style={{
                  ...S.btnSecondary, fontSize: 9, padding: '5px 10px',
                  background: transLang === l.code ? 'var(--gold)' : 'transparent',
                  color: transLang === l.code ? 'var(--black)' : 'var(--gold)',
                }}>{l.flag} {l.code.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {TRANS_KEYS.map(([key, label]) => (
                <div key={key} style={{ background: 'var(--dark3)', padding: '12px 16px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: isMobile ? 8 : 16, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'Cinzel,serif', letterSpacing: 1 }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'monospace' }}>{key}</div>
                  </div>
                  {(transValues[key] || '').length > 80
                    ? <textarea rows={3} value={transValues[key] || ''} onChange={e => setTransValues(prev => ({ ...prev, [key]: e.target.value }))} style={{ ...S.inp, resize: 'vertical', width: '100%' }} />
                    : <input value={transValues[key] || ''} onChange={e => setTransValues(prev => ({ ...prev, [key]: e.target.value }))} style={{ ...S.inp, width: '100%' }} />
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {section === 'settings' && (
          <div>
            <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 14 : 18, color: 'var(--gold)', marginBottom: 20 }}>⚙️ Settings</h2>
            <div style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
              <div style={S.card}>
                <h4 style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: 'var(--gold)', letterSpacing: 2, marginBottom: 16 }}>📧 Notification Email</h4>
                <label style={S.label}>Admin Email</label>
                <input value={settings.notify_email || ''} onChange={e => setSettings(p => ({ ...p, notify_email: e.target.value }))} style={{ ...S.inp, width: '100%', padding: '13px 16px', marginBottom: 14 }} />
                <button style={S.btn} onClick={saveSettings}>Save</button>
              </div>
              <div style={S.card}>
                <h4 style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: 'var(--gold)', letterSpacing: 2, marginBottom: 16 }}>🌐 Default Language</h4>
                <select value={settings.default_lang || 'en'} onChange={e => setSettings(p => ({ ...p, default_lang: e.target.value }))} style={{ ...S.inp, width: '100%', padding: '13px 16px', marginBottom: 14 }}>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
                <button style={S.btn} onClick={saveSettings}>Save</button>
              </div>
              <div style={S.card}>
                <h4 style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: 'var(--gold)', letterSpacing: 2, marginBottom: 12 }}>📝 Site Name</h4>
                <input value={settings.site_name || ''} onChange={e => setSettings(p => ({ ...p, site_name: e.target.value }))} style={{ ...S.inp, width: '100%', padding: '13px 16px', marginBottom: 14 }} />
                <button style={S.btn} onClick={saveSettings}>Save</button>
              </div>
              <div style={{ ...S.card, borderColor: 'rgba(220,53,69,0.3)' }}>
                <h4 style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#dc3545', letterSpacing: 2, marginBottom: 10 }}>⚠️ Danger Zone</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>Change admin password via environment variable <code style={{ color: 'var(--gold)' }}>ADMIN_PASSWORD</code> in Railway.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', maxWidth: 600, width: '100%', padding: isMobile ? 20 : 40, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: isMobile ? 13 : 16, color: 'var(--gold)', margin: 0 }}>📧 Reply to {replyModal.buyer_name}</h3>
              <button onClick={() => setReplyModal(null)} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
              <strong style={{ color: 'var(--gold)' }}>To:</strong> {replyModal.buyer_name} — <a href={`mailto:${replyModal.email}`} style={{ color: 'var(--cyan)', textDecoration: 'none' }}>{replyModal.email}</a>
              <br /><strong style={{ color: 'var(--gold)' }}>Re:</strong> <span style={{ color: 'var(--text-muted)' }}>{replyModal.product_name}</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Your Message *</label>
              <textarea value={replyMsg} onChange={e => setReplyMsg(e.target.value)} rows={6} placeholder="Write your professional response..." style={{ ...S.inp, width: '100%', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={S.label}>Quoted Price (optional)</label>
                <input value={replyPrice} onChange={e => setReplyPrice(e.target.value)} placeholder="e.g. $450/MT FOB" style={{ ...S.inp, width: '100%' }} />
              </div>
              <div>
                <label style={S.label}>Quote Valid Until (optional)</label>
                <input value={replyValid} onChange={e => setReplyValid(e.target.value)} placeholder="e.g. 30 March 2025" style={{ ...S.inp, width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={sendReply} disabled={replySending} style={{ ...S.btn, padding: '12px 24px' }}>{replySending ? 'Sending...' : '📤 Send Reply'}</button>
              <button onClick={() => setReplyModal(null)} style={{ ...S.btnSecondary, padding: '12px 20px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
