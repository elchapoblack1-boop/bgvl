'use client'
import { useState, useEffect } from 'react'

export default function DiagnosticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState('')

  const run = async (params = '') => {
    setLoading(true)
    setAction(params)
    try {
      const res = await fetch('/api/test-comms?' + params)
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setData({ error: e.message })
    }
    setLoading(false)
  }

  useEffect(() => { run('') }, [])

  const S = {
    ok: { background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.4)', color: '#27ae60' },
    fail: { background: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.4)', color: '#e74c3c' },
    warn: { background: 'rgba(243,156,18,0.15)', border: '1px solid rgba(243,156,18,0.4)', color: '#f39c12' },
    card: { background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.2)', padding: 24, marginBottom: 16 },
    btn: { background: '#C9A84C', color: '#000', border: 'none', padding: '10px 24px', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, cursor: 'pointer', textTransform: 'uppercase' as const, marginRight: 10, marginBottom: 10 },
    btnSecondary: { background: 'transparent', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)', padding: '10px 24px', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, cursor: 'pointer', textTransform: 'uppercase' as const, marginRight: 10, marginBottom: 10 },
    label: { fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase' as const, marginBottom: 6, display: 'block' },
    val: { fontFamily: 'monospace', fontSize: 13, color: '#EDE8DC' },
  }

  const statusStyle = (s: string) =>
    s?.includes('✅') || s?.includes('OK') ? S.ok :
    s?.includes('❌') || s?.includes('FAIL') ? S.fail : S.warn

  return (
    <div style={{ background: '#030303', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Montserrat,sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 6, color: '#C9A84C', marginBottom: 12 }}>BGVL SYSTEM</div>
          <h1 style={{ fontFamily: 'Cinzel,serif', fontSize: 28, color: '#C9A84C', letterSpacing: 3, marginBottom: 8 }}>Communications Diagnostic</h1>
          <p style={{ color: '#888', fontSize: 13 }}>Check your email and WhatsApp configuration live</p>
        </div>

        {/* Action buttons */}
        <div style={{ ...S.card, textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>Run tests against your live environment:</p>
          <button style={S.btn} onClick={() => run('')} disabled={loading}>
            {loading && action === '' ? 'Checking...' : '🔍 Check Config'}
          </button>
          <button style={S.btn} onClick={() => run('send=1')} disabled={loading}>
            {loading && action === 'send=1' ? 'Sending...' : '📧 Send Test Email'}
          </button>
          <button style={S.btn} onClick={() => run('wa=1')} disabled={loading}>
            {loading && action === 'wa=1' ? 'Sending...' : '💬 Send Test WhatsApp'}
          </button>
          <button style={S.btnSecondary} onClick={() => run('send=1&wa=1')} disabled={loading}>
            {loading && action === 'send=1&wa=1' ? 'Testing All...' : '⚡ Test Both'}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 30, color: '#C9A84C', fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 3 }}>
            RUNNING TESTS...
          </div>
        )}

        {data && !loading && (
          <>
            {/* ENV VARS */}
            <div style={S.card}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#C9A84C', letterSpacing: 2, marginBottom: 16 }}>
                📋 Environment Variables
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {data.env && Object.entries(data.env).map(([k, v]: any) => (
                  <div key={k} style={{ background: '#111', padding: '10px 14px', borderLeft: `2px solid ${v === 'MISSING' ? '#e74c3c' : '#27ae60'}` }}>
                    <span style={S.label}>{k}</span>
                    <span style={{ ...S.val, color: v === 'MISSING' ? '#e74c3c' : '#EDE8DC' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SMTP CONNECTION */}
            {data.smtp_connection && (
              <div style={S.card}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#C9A84C', letterSpacing: 2, marginBottom: 16 }}>
                  📡 SMTP Connection Test
                </div>
                <div style={{ ...statusStyle(data.smtp_connection.status), padding: '14px 18px', marginBottom: 12 }}>
                  <strong style={{ fontFamily: 'Cinzel,serif', fontSize: 13 }}>{data.smtp_connection.status}</strong>
                  {data.smtp_connection.message && <p style={{ marginTop: 6, fontSize: 13 }}>{data.smtp_connection.message}</p>}
                  {data.smtp_connection.error && <p style={{ marginTop: 6, fontSize: 13 }}>Error: {data.smtp_connection.error}</p>}
                  {data.smtp_connection.code && <p style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>Code: {data.smtp_connection.code}</p>}
                </div>
                {data.smtp_connection.fix && (
                  <div style={{ background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', padding: '12px 16px', fontSize: 13, color: '#f39c12' }}>
                    🔧 Fix: {data.smtp_connection.fix}
                  </div>
                )}
              </div>
            )}

            {/* EMAIL SEND RESULT */}
            {data.email_send && (
              <div style={S.card}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#C9A84C', letterSpacing: 2, marginBottom: 16 }}>
                  📧 Test Email Send
                </div>
                <div style={{ ...statusStyle(data.email_send.status), padding: '14px 18px' }}>
                  <strong style={{ fontFamily: 'Cinzel,serif', fontSize: 13 }}>{data.email_send.status}</strong>
                  {data.email_send.to && <p style={{ marginTop: 6, fontSize: 13 }}>Sent to: {data.email_send.to}</p>}
                  {data.email_send.error && <p style={{ marginTop: 6, fontSize: 13 }}>Error: {data.email_send.error}</p>}
                  {data.email_send.status?.includes('SENT') && (
                    <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                      ✉️ Check your Gmail inbox (and Spam/Promotions folder!)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* WHATSAPP RESULT */}
            {data.whatsapp_send && (
              <div style={S.card}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#C9A84C', letterSpacing: 2, marginBottom: 16 }}>
                  💬 WhatsApp Test Send
                </div>
                <div style={{ ...statusStyle(data.whatsapp_send.status), padding: '14px 18px', marginBottom: 12 }}>
                  <strong style={{ fontFamily: 'Cinzel,serif', fontSize: 13 }}>{data.whatsapp_send.status}</strong>
                  {data.whatsapp_send.message && <p style={{ marginTop: 6, fontSize: 13 }}>{data.whatsapp_send.message}</p>}
                  {data.whatsapp_send.error && <p style={{ marginTop: 6, fontSize: 13 }}>Error: {data.whatsapp_send.error}</p>}
                  {data.whatsapp_send.response && (
                    <pre style={{ marginTop: 8, fontSize: 11, opacity: 0.7, whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(data.whatsapp_send.response, null, 2)}
                    </pre>
                  )}
                </div>
                {data.whatsapp_send.fix && (
                  <div style={{ background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', padding: '12px 16px', fontSize: 13, color: '#f39c12' }}>
                    🔧 Fix: {data.whatsapp_send.fix}
                  </div>
                )}
              </div>
            )}

            {/* QUICK REFERENCE */}
            <div style={{ ...S.card, background: 'rgba(201,168,76,0.04)' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#C9A84C', letterSpacing: 2, marginBottom: 16 }}>
                📖 How To Fix Common Issues
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  ['EAUTH — Gmail Auth Fail', '1. Go to myaccount.google.com → Security → 2-Step Verification (turn ON if not already)\n2. Then go to myaccount.google.com/apppasswords\n3. Create App: Mail + Windows Computer\n4. Copy the 16-char password (no spaces)\n5. Paste into Railway: SMTP_PASS'],
                  ['ETIMEDOUT — Port blocked', 'Some hosts block port 587. Try:\n• Set SMTP_PORT = 465 in Railway env vars\n• Or contact your host to unblock outbound SMTP'],
                  ['WhatsApp: not authorized', '1. Log in to app.ultramsg.com\n2. Check your Instance ID (ULTRAMSG_INSTANCE)\n3. Copy your Token (ULTRAMSG_TOKEN)\n4. Make sure QR code is scanned and connected'],
                  ['WhatsApp: wrong number', 'ULTRAMSG_TO must be digits only, no + no spaces\nExample: 2348012345678\nNOT: +234 801 234 5678'],
                ].map(([title, text]) => (
                  <details key={title} style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', padding: '12px 16px' }}>
                    <summary style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, color: '#C9A84C', cursor: 'pointer', textTransform: 'uppercase' }}>
                      {title}
                    </summary>
                    <pre style={{ marginTop: 12, fontSize: 12, color: '#AAA', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{text}</pre>
                  </details>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: 20 }}>
              <a href="/admin" style={{ color: '#C9A84C', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase' }}>
                ← Back to Admin Panel
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
