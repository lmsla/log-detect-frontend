import { ConfigProvider, theme as antdTheme } from 'antd'
import zhTW from 'antd/locale/zh_TW'
import { ThemeProvider as ModeProvider, useThemeMode } from './ThemeContext'
import { getThemeTokens } from './tokens'

function InnerProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeMode()
  return (
    <ConfigProvider
      locale={zhTW}
      theme={{
        ...getThemeTokens(isDark),
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <InnerProvider>{children}</InnerProvider>
    </ModeProvider>
  )
}
