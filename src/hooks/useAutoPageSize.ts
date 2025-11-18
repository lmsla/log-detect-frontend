import { useEffect, useRef, useState } from 'react'

export default function useAutoPageSize(options?: {
  rowHeight?: number
  headerHeight?: number
  paginationHeight?: number
  bottomPadding?: number
  min?: number
  max?: number
}) {
  const {
    rowHeight = 48, // AntD Table middle row ~48px
    headerHeight = 56, // header + padding
    paginationHeight = 64, // paginator height
    bottomPadding = 24, // spacing to viewport bottom
    min = 6,
    max = 50
  } = options || {}

  const ref = useRef<HTMLDivElement | null>(null)
  const [pageSize, setPageSize] = useState<number>(min)

  useEffect(() => {
    const calc = () => {
      const el = ref.current
      if (!el) return

      // Prefer actual DOM sizes inside AntD Table if present
      const thead = el.querySelector('.ant-table-thead') as HTMLElement | null
      const pagination = el.querySelector('.ant-table-pagination, .ant-pagination') as HTMLElement | null
      const sampleRow = el.querySelector('.ant-table-tbody tr') as HTMLElement | null

      const headerH = Math.max(headerHeight, thead?.offsetHeight ?? 0)
      const pagerH = Math.max(paginationHeight, pagination?.offsetHeight ?? 0)
      const rowH = Math.max(rowHeight, sampleRow?.offsetHeight ?? 0)

      const avail = el.clientHeight - bottomPadding
      const rows = Math.floor((avail - headerH - pagerH) / rowH)
      const clamped = Math.max(min, Math.min(max, rows))
      if (Number.isFinite(clamped) && clamped !== pageSize) setPageSize(clamped)
    }

    calc()
    const ro = new ResizeObserver(calc)
    if (ref.current) ro.observe(ref.current)

    // Observe internal DOM changes (header/pagination render, data changes)
    const mo = new MutationObserver(calc)
    if (ref.current) mo.observe(ref.current, { childList: true, subtree: true, attributes: true })
    window.addEventListener('resize', calc)
    return () => {
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('resize', calc)
    }
  }, [rowHeight, headerHeight, paginationHeight, bottomPadding, min, max, pageSize])

  return { ref, pageSize }
}
