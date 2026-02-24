'use client'
import { useState, useEffect } from 'react'

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade after 2.2s, fully remove after 3s
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200)
    const removeTimer = setTimeout(() => setVisible(false), 3000)
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer) }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'var(--black)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.8s ease',
      opacity: fadeOut ? 0 : 1,
      pointerEvents: fadeOut ? 'none' : 'all',
    }}>

      {/* Gold grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 65%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px' }}>

        {/* Spinning ring */}
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 30px' }}>
          <div style={{
            position: 'absolute', inset: 0,
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            border: '2px solid transparent',
            borderTopColor: 'var(--gold)',
            borderRightColor: 'rgba(201,168,76,0.3)',
            borderRadius: '50%',
            animation: 'preloader-spin 1.2s linear infinite',
          }} />
          {/* Inner ring counter-spin */}
          <div style={{
            position: 'absolute', inset: 12,
            border: '1px solid transparent',
            borderBottomColor: 'var(--gold)',
            borderLeftColor: 'rgba(201,168,76,0.3)',
            borderRadius: '50%',
            animation: 'preloader-spin-reverse 1.8s linear infinite',
          }} />
          {/* Center diamond */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%) rotate(45deg)',
            width: 10, height: 10,
            background: 'var(--gold)',
            animation: 'preloader-pulse 1.2s ease-in-out infinite',
          }} />
        </div>

        {/* Logo text */}
        <div style={{
          fontFamily: 'Cinzel,serif', fontSize: 'clamp(18px,4vw,26px)',
          fontWeight: 900, color: 'var(--gold)', letterSpacing: 6,
          animation: 'preloader-fadein 0.8s ease both',
          textTransform: 'uppercase',
        }}>
          BALLON GLOBAL
        </div>
        <div style={{
          fontFamily: 'Cinzel,serif', fontSize: 'clamp(8px,2vw,11px)',
          fontWeight: 400, color: 'rgba(201,168,76,0.5)', letterSpacing: 8,
          marginTop: 6, marginBottom: 32,
          animation: 'preloader-fadein 0.8s ease 0.2s both',
          textTransform: 'uppercase',
        }}>
          VENTURES LIMITED
        </div>

        {/* Progress bar */}
        <div style={{
          width: 'clamp(180px,40vw,260px)', height: 1,
          background: 'rgba(201,168,76,0.15)',
          margin: '0 auto', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            animation: 'preloader-progress 2s ease forwards',
            width: '0%',
          }} />
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 20,
          fontFamily: 'Cormorant Garamond,serif',
          fontSize: 'clamp(11px,2vw,14px)',
          color: 'rgba(201,168,76,0.4)',
          fontStyle: 'italic', letterSpacing: 3,
          animation: 'preloader-fadein 1s ease 0.5s both',
        }}>
          Global Agricultural & Petroleum Export
        </div>

        {/* Bottom cert badges */}
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center',
          marginTop: 28, flexWrap: 'wrap',
          animation: 'preloader-fadein 1s ease 0.8s both',
        }}>
          {['CAC','NEPC','SCUML','NMDPRA'].map(c => (
            <span key={c} style={{
              fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: 2,
              color: 'rgba(201,168,76,0.4)', border: '1px solid rgba(201,168,76,0.15)',
              padding: '3px 8px',
            }}>{c}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes preloader-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes preloader-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes preloader-pulse {
          0%, 100% { opacity: 1; transform: translate(-50%,-50%) rotate(45deg) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%,-50%) rotate(45deg) scale(0.6); }
        }
        @keyframes preloader-fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes preloader-progress {
          0% { width: 0%; }
          30% { width: 40%; }
          70% { width: 75%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
