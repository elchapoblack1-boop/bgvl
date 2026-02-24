'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLang } from '@/contexts/LangContext'
import { LANGUAGES, LangCode } from '@/lib/translations'

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const navLinks = [
    { href: '/about', label: t('nav_about') },
    { href: '/products', label: t('nav_products') },
    { href: '/certifications', label: t('nav_certs') },
    { href: '/order', label: t('nav_order') },
    { href: '/contact', label: t('nav_contact') },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(3,3,3,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '7px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase' }}>
          {t('site_tagline')}
        </span>
        <select value={lang} onChange={e => setLang(e.target.value as LangCode)} style={{
          background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--gold)',
          padding: '4px 10px', fontFamily: 'Montserrat,sans-serif', fontSize: 11, cursor: 'pointer', outline: 'none',
        }}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
        </select>
      </div>

      <nav style={{
        position: 'fixed', top: 36, left: 0, right: 0, zIndex: 999,
        background: scrolled ? 'rgba(3,3,3,0.98)' : 'rgba(3,3,3,0.92)',
        backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.8)' : 'none',
        padding: '0 20px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', height: 64, transition: 'all 0.3s',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Image src="/logo.png" alt="BGVL" width={40} height={40} style={{ objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 2 }}>BALLON GLOBAL</div>
            <div style={{ fontSize: 8, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase' }}>VENTURES LIMITED</div>
          </div>
        </Link>

        <ul className="nav-desktop" style={{ display: 'flex', gap: 28, alignItems: 'center', listStyle: 'none' }}>
          {navLinks.map(l => (
            <li key={l.href}>
              <Link href={l.href} style={{
                color: isActive(l.href) ? 'var(--gold)' : 'var(--white2)',
                textDecoration: 'none', fontSize: 10, letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.3s',
                borderBottom: isActive(l.href) ? '1px solid var(--gold)' : '1px solid transparent',
                paddingBottom: 2,
              }}>{l.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>Admin</Link>
          </li>
        </ul>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/order" className="nav-cta-btn" style={{
            background: 'var(--gold)', color: 'var(--black)', padding: '9px 20px',
            fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
            textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap',
          }}>{t('nav_cta')}</Link>

          <button onClick={() => setOpen(!open)} className="nav-hamburger" aria-label="Menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'none', flexDirection: 'column', gap: 5 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                width: 24, height: 2, background: 'var(--gold)', display: 'block', transition: 'all 0.3s',
                transform: open ? (i===0 ? 'rotate(45deg) translate(5px,5px)' : i===2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scale(0)') : 'none',
              }} />
            ))}
          </button>
        </div>
      </nav>

      {open && (
        <div style={{
          position: 'fixed', top: 100, left: 0, right: 0, bottom: 0, zIndex: 997,
          background: 'rgba(3,3,3,0.99)', padding: '24px', display: 'flex',
          flexDirection: 'column', overflowY: 'auto',
        }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              color: isActive(l.href) ? 'var(--gold)' : 'var(--white2)',
              textDecoration: 'none', fontSize: 18, letterSpacing: 3,
              textTransform: 'uppercase', fontFamily: 'Cinzel,serif',
              padding: '20px 0', borderBottom: '1px solid var(--border)', display: 'block',
            }}>{l.label}</Link>
          ))}
          <Link href="/admin" onClick={() => setOpen(false)} style={{
            color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14,
            letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Cinzel,serif',
            padding: '20px 0', borderBottom: '1px solid var(--border)', display: 'block',
          }}>Admin</Link>
          <Link href="/order" onClick={() => setOpen(false)} style={{
            marginTop: 24, background: 'var(--gold)', color: 'var(--black)',
            padding: '16px', fontFamily: 'Cinzel,serif', fontSize: 13,
            letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700,
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}>{t('nav_cta')}</Link>
        </div>
      )}
    </>
  )
}
