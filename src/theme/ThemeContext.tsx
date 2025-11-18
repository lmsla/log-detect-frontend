import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'ld_theme'

function useSystemDark() {
  const [isDark, setIsDark] = useState<boolean>(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const mm = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    if (mm.addEventListener) mm.addEventListener('change', handler)
    else mm.addListener(handler)
    return () => {
      if (mm.removeEventListener) mm.removeEventListener('change', handler)
      else mm.removeListener(handler)
    }
  }, [])
  return isDark
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemDark = useSystemDark()
  const [mode, setMode] = useState<ThemeMode>(() => (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const isDark = useMemo(() => (mode === 'system' ? systemDark : mode === 'dark'), [mode, systemDark])

  const value = useMemo(() => ({ mode, setMode, isDark }), [mode, setMode, isDark])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider')
  return ctx
}

