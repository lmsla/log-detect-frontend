import { useEffect, useRef, useState } from 'react'

export default function useAutoRowsPerTab(options?: {
  rowHeight?: number
  fallbackHeader?: number
  bottomPadding?: number
  min?: number
  max?: number
}) {
  const {
    rowHeight = 26,
    fallbackHeader = 44,
    bottomPadding = 8,
    min = 10,
    max = 200,
  } = options || {}

  const containerRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const [rows, setRows] = useState<number>(min)

  useEffect(() => {
    const calcOnce = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportAvail = Math.max(0, window.innerHeight - rect.top - bottomPadding)
      const containerAvail = Math.max(0, el.clientHeight - bottomPadding)
      // 以可視視窗為主，避免抓到內容高度導致行數暴增
      const avail = Math.min(viewportAvail || 0, containerAvail || Number.POSITIVE_INFINITY) || viewportAvail
      const headerH = headerRef.current?.offsetHeight ?? fallbackHeader
      const r = Math.floor((avail - headerH) / rowHeight)
      const clamped = Math.max(min, Math.min(max, r))
      if (Number.isFinite(clamped) && clamped !== rows) setRows(clamped)
    }

    // 兩階段量測，避免在版面重排瞬間取得不穩定高度
    const calc = () => requestAnimationFrame(() => requestAnimationFrame(calcOnce))

    calc()
    const ro = new ResizeObserver(() => calc())
    const mo = new MutationObserver(() => calc())
    if (containerRef.current) {
      ro.observe(containerRef.current)
      mo.observe(containerRef.current, { childList: true, subtree: true, attributes: true })
    }
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener('resize', calc)
    return () => {
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('resize', calc)
    }
  }, [rowHeight, fallbackHeader, bottomPadding, min, max, rows])

  return { containerRef, headerRef, rows }
}
