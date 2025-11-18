import { useEffect, useRef, useState } from 'react'

// Compute AntD Table scroll.y to make the table body fill its container
// without creating page-level vertical scrollbars.
export default function useTableScrollY(options?: {
  // Extra bottom padding space inside container
  bottomPadding?: number
  // Fallback heights when DOM not ready
  fallbackHeader?: number
  fallbackPagination?: number
  minBody?: number
}) {
  const { bottomPadding = 8, fallbackHeader = 56, fallbackPagination = 56, minBody = 120 } = options || {}

  const ref = useRef<HTMLDivElement | null>(null)
  const [scrollY, setScrollY] = useState<number>(minBody)

  useEffect(() => {
    const calc = () => {
      const el = ref.current
      if (!el) return

      const thead = el.querySelector('.ant-table-thead') as HTMLElement | null
      const pagination = el.querySelector('.ant-table-pagination, .ant-pagination') as HTMLElement | null

      const headerH = thead?.offsetHeight ?? fallbackHeader
      const pagerH = pagination?.offsetHeight ?? fallbackPagination

      const avail = el.clientHeight - bottomPadding
      const bodyH = Math.max(minBody, avail - headerH - pagerH)

      if (Number.isFinite(bodyH) && bodyH !== scrollY) setScrollY(bodyH)
    }

    calc()
    const ro = new ResizeObserver(calc)
    const mo = new MutationObserver(calc)
    if (ref.current) {
      ro.observe(ref.current)
      mo.observe(ref.current, { childList: true, subtree: true, attributes: true })
    }
    window.addEventListener('resize', calc)
    return () => {
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('resize', calc)
    }
  }, [bottomPadding, fallbackHeader, fallbackPagination, minBody, scrollY])

  return { ref, scrollY }
}

