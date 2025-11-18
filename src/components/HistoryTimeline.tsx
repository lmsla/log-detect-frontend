import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Tooltip } from 'antd'

export type TimelinePoint = {
  name: string // device name
  time: string // HH:mm
  lost: 'true' | 'false' | 'none' | string
}

export type HistoryTimelineProps = {
  data: TimelinePoint[]
  heightPerRow?: number
  cellWidth?: number
  cellGap?: number
  showTooltip?: boolean
  tooltipFormatter?: (p: { name: string; time: string; lost: string }) => React.ReactNode
  // 刻度設定
  majorTickMinutes?: number // 主要刻度間距（分鐘），預設 60（整點）
  minorTickMinutes?: number // 次要刻度間距（分鐘），預設 30
  showTickLines?: boolean // 是否在每列畫出刻度線
  // 自動適配寬度
  autoFit?: boolean // 依容器寬度自動縮放每個時間切片寬度
  minCellWidth?: number // 自動縮放下限（預設 4）
  maxCellWidth?: number // 自動縮放上限（預設 14）
  leftLabelWidth?: number // 左側設備欄寬（預設 160）
}

function hhmmToMinutes(t: string): number {
  const [hh, mm] = t.split(':').map((x) => parseInt(x, 10))
  if (Number.isFinite(hh) && Number.isFinite(mm)) return hh * 60 + mm
  return NaN
}

export default function HistoryTimeline({
  data,
  heightPerRow = 28,
  cellWidth = 8,
  cellGap = 2,
  showTooltip = true,
  tooltipFormatter,
  majorTickMinutes = 60,
  minorTickMinutes = 30,
  showTickLines = true,
  autoFit = false,
  minCellWidth = 4,
  maxCellWidth = 14,
  leftLabelWidth = 160
}: HistoryTimelineProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [fittedCellWidth, setFittedCellWidth] = useState<number>(cellWidth)
  const [needsScroll, setNeedsScroll] = useState<boolean>(false)
  // 標準化資料與軸
  const { devices, times, matrix } = useMemo(() => {
    const names = Array.from(new Set(data.map((d) => d.name))).sort()
    const timeSet = new Set<string>()
    data.forEach((d) => timeSet.add(d.time))
    const timeList = Array.from(timeSet).sort((a, b) => hhmmToMinutes(a) - hhmmToMinutes(b))

    // 建立矩陣：device -> time -> lost
    const mat: Record<string, Record<string, string>> = {}
    names.forEach((n) => (mat[n] = {}))
    data.forEach((d) => {
      mat[d.name][d.time] = d.lost
    })

    return { devices: names, times: timeList, matrix: mat }
  }, [data])

  // 自動適配：依容器寬度計算每個時間切片寬度
  useEffect(() => {
    if (!autoFit) {
      setFittedCellWidth(cellWidth)
      return
    }
    const el = wrapRef.current
    if (!el || times.length === 0) return

    const calc = () => {
      const containerWidth = el.clientWidth
      // 可用寬度 = 容器 - 左欄 - 內距（估 16px）
      const avail = Math.max(0, containerWidth - leftLabelWidth - 16)
      const totalGap = Math.max(0, (times.length - 1) * cellGap)
      const cwRaw = (avail - totalGap) / Math.max(1, times.length)
      const clamped = Math.max(minCellWidth, Math.min(maxCellWidth, Math.floor(cwRaw)))
      setFittedCellWidth(Number.isFinite(clamped) ? clamped : cellWidth)
      const totalNeeded = clamped * times.length + totalGap
      setNeedsScroll(totalNeeded > avail + 1) // +1 抵消捲動條/四捨五入誤差
    }

    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [autoFit, cellGap, cellWidth, leftLabelWidth, maxCellWidth, minCellWidth, times.length])

  const colorOf = (lost: string | undefined) => {
    if (lost === 'true') return '#cf1322' // red (offline)
    if (lost === 'false') return '#8c8c8c' // gray (online)
    return '#d9d9d9' // none
  }

  const textOf = (lost: string | undefined) => {
    if (lost === 'true') return '異常'
    if (lost === 'false') return '正常'
    return '無資料'
  }

  return (
    <div ref={wrapRef} style={{ width: '100%', overflowX: autoFit ? (needsScroll ? 'auto' : 'hidden') : 'auto', border: '1px solid #f0f0f0', borderRadius: 6, padding: 8 }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* 左側設備名欄 */}
        <div style={{ flex: `0 0 ${leftLabelWidth}px` }}>
          <div style={{ height: heightPerRow, display: 'flex', alignItems: 'center', fontSize: 12, color: '#999' }}>設備</div>
          {devices.map((name) => (
            <div key={name} style={{ height: heightPerRow, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 12 }}>{name}</span>
            </div>
          ))}
        </div>

        {/* 右側時間格子區域 */}
        <div style={{ flex: '1 1 auto', overflowX: autoFit ? (needsScroll ? 'auto' : 'hidden') : 'auto' }}>
          {/* time header 顯示主要刻度（預設整點） */}
          <div style={{ height: heightPerRow, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: `${autoFit ? fittedCellWidth : cellWidth}px`, columnGap: cellGap }}>
              {times.map((t) => {
                const m = hhmmToMinutes(t)
                const show = majorTickMinutes > 0 && m % majorTickMinutes === 0
                return (
                  <div key={`h-${t}`} title={t} style={{ width: autoFit ? fittedCellWidth : cellWidth, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {show ? <span style={{ fontSize: 10, color: '#999' }}>{t}</span> : null}
                  </div>
                )
              })}
            </div>
          </div>

          {devices.map((name) => {
            const cw = autoFit ? fittedCellWidth : cellWidth
            const totalWidth = times.length * cw + Math.max(0, times.length - 1) * cellGap
            const colStep = cw + cellGap
            return (
              <div key={name} style={{ height: heightPerRow, display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: totalWidth }}>
                  {/* cells */}
                  <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: `${cw}px`, columnGap: cellGap }}>
                    {times.map((t) => {
                      const lost = matrix[name]?.[t]
                      const cell = (
                        <div
                          key={`${name}-${t}`}
                          style={{
                            width: cw,
                            height: heightPerRow - 10,
                            borderRadius: 4,
                            background: colorOf(lost)
                          }}
                        />
                      )
                      if (!showTooltip) return cell
                      const title = tooltipFormatter
                        ? tooltipFormatter({ name, time: t, lost: lost ?? 'none' })
                        : (
                            <div>
                              <div>設備：{name}</div>
                              <div>時間：{t}</div>
                              <div>狀態：{textOf(lost)}</div>
                            </div>
                          )
                      return (
                        <Tooltip title={title} key={`${name}-${t}`} placement="top">
                          {cell}
                        </Tooltip>
                      )
                    })}
                  </div>

                  {/* overlay vertical tick lines across the whole row */}
                  {showTickLines && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
                      {times.map((t, idx) => {
                        const m = hhmmToMinutes(t)
                        const isMajor = majorTickMinutes > 0 && m % majorTickMinutes === 0
                        const isMinor = !isMajor && minorTickMinutes > 0 && m % minorTickMinutes === 0
                        if (!isMajor && !isMinor) return null
                        const left = idx * colStep
                        return (
                          <div
                            key={`tick-${name}-${t}`}
                            style={{
                              position: 'absolute',
                              left,
                              top: 2,
                              bottom: 2,
                              width: 0,
                              borderLeft: isMajor ? '2px solid #8c8c8c' : '1px solid #d9d9d9'
                            }}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
