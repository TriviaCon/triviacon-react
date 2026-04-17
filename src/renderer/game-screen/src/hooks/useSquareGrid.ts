import { useCallback, useEffect, useRef, useState } from 'react'

interface GridLayout {
  cols: number
  tileSize: number
}

/**
 * Given a container ref and tile count, computes the optimal number of columns
 * and square tile size to maximize tile area within the available space.
 */
const MAX_TILE_SIZE = 250

export function useSquareGrid(count: number, gap: number = 12) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<GridLayout>({ cols: 1, tileSize: 0 })

  const compute = useCallback(() => {
    const el = containerRef.current
    if (!el || count === 0) return

    const W = el.clientWidth
    const H = el.clientHeight
    if (W === 0 || H === 0) return

    let bestSize = 0
    let bestCols = 1

    for (let c = 1; c <= count; c++) {
      const r = Math.ceil(count / c)
      const tileW = (W - (c - 1) * gap) / c
      const tileH = (H - (r - 1) * gap) / r
      const s = Math.min(Math.floor(Math.min(tileW, tileH)), MAX_TILE_SIZE)
      if (s > bestSize) {
        bestSize = s
        bestCols = c
      }
    }

    setLayout((prev) => {
      if (prev.cols === bestCols && prev.tileSize === bestSize) return prev
      return { cols: bestCols, tileSize: bestSize }
    })
  }, [count, gap])

  useEffect(() => {
    compute()
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [compute])

  return { containerRef, ...layout }
}
