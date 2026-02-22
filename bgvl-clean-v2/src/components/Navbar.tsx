'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/contexts/LangContext'
import { LANGUAGES, LangCode } from '@/lib/translations'

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: '#about', label: t('nav_about') },
    { href: '#products', label: t('nav_products') },
    { href: '#certifications', label: t('nav_certs') },
    { href: '#order', label: t('nav_order') },
    { href: '#contact', label: t('nav_contact') },
  ]

  return (
    <>
      {/* Language Bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '7px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase' }}>
          {t('site_tagline')}
        </span>
        <select
          value={lang}
          onChange={e => setLang(e.target.value as LangCode)}
          style={{
            background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--gold)',
            padding: '4px 12px', fontFamily: 'Montserrat,sans-serif', fontSize: 11, cursor: 'pointer',
            outline: 'none',
          }}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
          ))}
        </select>
      </div>

      {/* Main Nav */}
      <nav style={{
        position: 'fixed', top: 36, left: 0, right: 0, zIndex: 999,
        background: scrolled ? 'rgba(3,3,3,0.98)' : 'rgba(3,3,3,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.8)' : 'none',
        padding: '0 40px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', height: 70, transition: 'all 0.3s',
      }}>
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
          <Image src="/logo.png" alt="BGVL" width={46} height={46} style={{ objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: 13, fontWeight: 700, color: 'var(--gold)', letterSpacing: 2, lineHeight: 1.2 }}>BALLON GLOBAL</span>
            <span style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase' }}>VENTURES LIMITED</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <ul style={{ display: 'flex', gap: 32, alignItems: 'center', listStyle: 'none' }} className="hidden md:flex">
          {navLinks.map(l => (
            <li key={l.href}>
              <a href={l.href} style={{
                color: 'var(--white2)', textDecoration: 'none', fontSize: 11,
                letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500,
                transition: 'color 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--white2)')}
              >{l.label}</a>
            </li>
          ))}
          <li>
            <Link href="/admin" style={{
              color: 'var(--text-muted)', textDecoration: 'none', fontSize: 11,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>Admin</Link>
          </li>
        </ul>

        <a href="#order" className="btn-primary" style={{ display: 'none' }} id="nav-cta">{t('nav_cta')}</a>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="#order" style={{
            background: 'var(--gold)', color: 'var(--black)', padding: '10px 24px',
            fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-light)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
          >{t('nav_cta')}</a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}
            className="md:hidden"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ width: 24, height: 1.5, background: 'var(--gold)', display: 'block', transition: 'all 0.3s' }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 106, left: 0, right: 0, zIndex: 998,
          background: 'rgba(3,3,3,0.98)', borderBottom: '1px solid var(--border)',
          padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              color: 'var(--white2)', textDecoration: 'none', fontSize: 12,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>{l.label}</a>
          ))}
          <Link href="/admin" onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase' }}>Admin</Link>
        </div>
      )}
    </>
  )
}
