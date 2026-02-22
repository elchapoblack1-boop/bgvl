'use client'
import { useLang } from '@/contexts/LangContext'

export default function HeroSection() {
  const { t } = useLang()
  const certs = ['CAC', 'NEPC', 'SCUML', 'OGISP', 'NMDPRA', 'Trademark ®']

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', paddingTop: 106,
      background: 'radial-gradient(ellipse at 30% 50%,rgba(201,168,76,0.04) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(0,180,216,0.03) 0%,transparent 50%),var(--black)',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div style={{ textAlign: 'center', zIndex: 2, padding: '60px 40px', maxWidth: 900 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          border: '1px solid var(--border-bright)', padding: '8px 20px', marginBottom: 40,
          animation: 'fadeInDown 1s ease',
        }}>
          <span style={{ width: 20, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase' }}>
            {t('hero_badge')}
          </span>
          <span style={{ width: 20, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(36px,6vw,80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: 2, marginBottom: 20, animation: 'fadeInUp 1s ease 0.2s both' }}>
          <span style={{ display: 'block' }}>{t('hero_title1')}</span>
          <span style={{ display: 'block', color: 'var(--gold)' }}>{t('hero_title2')}</span>
          <span style={{ display: 'block', fontSize: 'clamp(13px,2vw,20px)', fontWeight: 300, letterSpacing: 4, color: 'var(--cyan)' }}>
            {t('hero_tagline')}
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(15px,2vw,21px)',
          fontWeight: 300, color: 'var(--text-muted)', letterSpacing: 1,
          marginBottom: 50, animation: 'fadeInUp 1s ease 0.4s both', fontStyle: 'italic',
        }}>
          {t('hero_sub')}
        </p>

        {/* Certs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 50, animation: 'fadeInUp 1s ease 0.6s both' }}>
          {certs.map(c => <span key={c} className="cert-badge">{c}</span>)}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 1s ease 0.8s both' }}>
          <a href="#order" className="btn-primary">{t('hero_btn1')}</a>
          <a href="#products" className="btn-secondary">{t('hero_btn2')}</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'bounce 2s infinite',
      }}>
        <span style={{ fontSize: 9, letterSpacing: 4, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('scroll')}</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,var(--gold),transparent)' }} />
      </div>
    </section>
  )
}
