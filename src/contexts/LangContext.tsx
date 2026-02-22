'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { LangCode, Translations, BASE_TRANSLATIONS, LANGUAGES } from '@/lib/translations'

interface LangContextType {
  lang: LangCode
  setLang: (lang: LangCode) => void
  t: (key: string) => string
  isRTL: boolean
  customTranslations: Partial<Record<LangCode, Translations>>
  setCustomTranslations: (t: Partial<Record<LangCode, Translations>>) => void
}

const LangContext = createContext<LangContextType>({
  lang: 'en', setLang: () => {}, t: (k) => k, isRTL: false,
  customTranslations: {}, setCustomTranslations: () => {},
})

export function LangProvider({ children, serverTranslations = {} }: {
  children: React.ReactNode
  serverTranslations?: Partial<Record<LangCode, Translations>>
}) {
  const [lang, setLangState] = useState<LangCode>('en')
  const [customTranslations, setCustomTranslations] = useState<Partial<Record<LangCode, Translations>>>(serverTranslations)

  useEffect(() => {
    const saved = localStorage.getItem('bgv_lang') as LangCode
    if (saved && LANGUAGES.find(l => l.code === saved)) setLangState(saved)
  }, [])

  const setLang = useCallback((l: LangCode) => {
    setLangState(l)
    localStorage.setItem('bgv_lang', l)
  }, [])

  const t = useCallback((key: string): string => {
    const custom = customTranslations[lang] || {}
    if (custom[key]) return custom[key]
    const base = BASE_TRANSLATIONS[lang] || {}
    if (base[key]) return base[key]
    return BASE_TRANSLATIONS.en[key] || key
  }, [lang, customTranslations])

  const isRTL = lang === 'ar'

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL, customTranslations, setCustomTranslations }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
