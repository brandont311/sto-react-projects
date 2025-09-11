
import { create } from 'zustand'
import { useEffect } from 'react'

type SeriesPoint = { t: string; price: number; equity: number }
type Side = 'BUY'|'SELL'

type Store = {
  running: boolean
  timeframe: number
  prices: {
    last: number
    change: number
    volatility: number
    series: SeriesPoint[]
  }
  capital: number
  pnl: number
  positions: { qty: number; avg: number }
  params: { drift: number; sigma: number; size: number; latency: number }
  toggleRunning: () => void
  setTimeframe: (t: number) => void
  setParam: (k: keyof Store['params'], v: number) => void
  tick: () => void
  placeMarketOrder: (side: Side) => void
  reset: () => void
}

const fmtTime = () => new Date().toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})

export const usePrimeTradeStore = create<Store>((set, get) => ({
  running: true,
  timeframe: 240,
  prices: { last: 100, change: 0, volatility: 0, series: [{t: fmtTime(), price: 100, equity: 10000}]},
  capital: 10000,
  pnl: 0,
  positions: { qty: 0, avg: 0 },
  params: { drift: 0.0005, sigma: 0.8, size: 10, latency: 100 },

  toggleRunning: () => set(s => ({ running: !s.running })),
  setTimeframe: (t) => set(() => ({ timeframe: t })),
  setParam: (k, v) => set(s => ({ params: { ...s.params, [k]: v }})),

  tick: () => {
    const s = get()
    const { drift, sigma } = s.params
    // Geometric Brownian Motion-style price path (demo)
    const rnd = (Math.random() * 2 - 1)
    const pct = drift + sigma * rnd * 0.01
    const next = Math.max(1, s.prices.last * (1 + pct))
    const change = next - s.prices.last
    const vol = Math.abs(pct) * 100

    // Mark-to-market
    const equity = s.capital + s.positions.qty * (next - s.positions.avg)
    const pt: SeriesPoint = { t: fmtTime(), price: parseFloat(next.toFixed(2)), equity: parseFloat(equity.toFixed(2)) }

    const series = [...s.prices.series, pt].slice(-s.timeframe)
    const pnl = equity - 10000

    set({
      prices: { last: next, change, volatility: vol, series },
      pnl
    })
  },

  placeMarketOrder: (side) => {
    const s = get()
    const size = s.params.size
    const fillPrice = s.prices.last // simplified market fill
    const qty = side === 'BUY' ? size : -size

    // New position
    const newQty = s.positions.qty + qty
    const cost = qty * fillPrice
    const newCapital = s.capital - cost

    let newAvg = s.positions.avg
    if (newQty === 0){
      newAvg = 0
    } else if ((s.positions.qty >= 0 && qty > 0) || (s.positions.qty <= 0 && qty < 0)){
      // adding to same side position -> weighted average
      newAvg = (s.positions.avg * Math.abs(s.positions.qty) + fillPrice * Math.abs(qty)) / Math.abs(newQty)
    } else {
      // reducing/flip side -> keep avg for remaining qty if sign flips compute fresh
      if (Math.sign(newQty) !== Math.sign(s.positions.qty)){
        newAvg = fillPrice
      }
    }

    set({
      capital: newCapital,
      positions: { qty: newQty, avg: newAvg }
    })
  },

  reset: () => set({
    running: false,
    timeframe: 240,
    prices: { last: 100, change: 0, volatility: 0, series: [{ t: fmtTime(), price: 100, equity: 10000 }]},
    capital: 10000,
    pnl: 0,
    positions: { qty: 0, avg: 0 },
    params: { drift: 0.0005, sigma: 0.8, size: 10, latency: 100 }
  })
}))

// Simple "game loop" driven by requestAnimationFrame with throttling
export function usePriceFeed(){
  const { running, tick, params } = usePrimeTradeStore()
  useEffect(() => {
    let raf: number
    let last = performance.now()
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (!running) return
      if (t - last > params.latency){
        tick()
        last = t
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running, params.latency, tick])
}
