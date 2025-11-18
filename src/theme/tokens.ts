import type { ThemeConfig } from 'antd'

export function getThemeTokens(isDark: boolean): ThemeConfig {
  if (!isDark) {
    return {
      token: {
        colorPrimary: '#4f46e5',
        borderRadius: 10,
        colorBgLayout: '#f6f7fb',
        colorBgContainer: '#ffffff',
        colorBorderSecondary: '#eef1f5',
      },
      components: {
        Button: { controlHeight: 36, controlOutline: 'none' },
        Card: { paddingLG: 20, boxShadowSecondary: '0 4px 16px rgba(16,24,40,0.06)' },
        Table: {
          headerBg: '#f7f7fb',
          rowHoverBg: '#f9fafb',
          rowSelectedBg: '#eef2ff',
          borderColor: '#eef1f5',
        },
        Tag: { borderRadiusSM: 8 },
      },
    }
  }
  // Dark overrides tuned for sufficient contrast
  return {
    token: {
      colorPrimary: '#818cf8',
      borderRadius: 10,
      colorBgLayout: '#0f1115',
      colorBgContainer: '#141821',
      colorBorderSecondary: '#2a2f3a',
    },
    components: {
      Button: { controlHeight: 36, controlOutline: 'none' },
      Card: { paddingLG: 20, boxShadowSecondary: '0 6px 16px rgba(0,0,0,0.35)' },
      Table: {
        headerBg: '#1b2130',
        rowHoverBg: '#1a1f2b',
        rowSelectedBg: '#232a3a',
        borderColor: '#2a2f3a',
      },
      Tag: { borderRadiusSM: 8 },
    },
  }
}
