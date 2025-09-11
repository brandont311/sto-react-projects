
import { create } from 'zustand'
import { useEffect } from 'react'

type Point = { t: string; luck: number }
type Params = { practice: number; network: number; risk: number; reflection: number; sigma: number; latency: number }

type Store = {
  running: boolean
  timeframe: number
  series: Point[]
  metrics: { luck: number; streak: number; opportunities: number; insights: number }
  params: Params
  setParam: (k: keyof Params, v: number) => void
  setTimeframe: (t: number) => void
  toggleRunning: () => void
  tick: () => void
  takeAction: () => void
  logInsight: () => void
  reset: () => void
}

const fmtTime = () => new Date().toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})

export const useLuckStore = create<Store>((set, get) => ({
  running: true,
  timeframe: 300,
  series: [{ t: fmtTime(), luck: 50 }],
  metrics: { luck: 50, streak: 0, opportunities: 0, insights: 0 },
  params: { practice: 0.5, network: 0.5, risk: 0.5, reflection: 0.5, sigma: 0.6, latency: 160 },

  setParam: (k, v) => set(s => ({ params: { ...s.params, [k]: v }})),
  setTimeframe: (t) => set(() => ({ timeframe: t })),
  toggleRunning: () => set(s => ({ running: !s.running })),

  tick: () => {
    const s = get()
    const { practice, network, risk, reflection, sigma } = s.params

    // Core idea: "surface area of luck" boosted by deliberate practice, network exposure,
    // taking small calculated risks, and reflection that compounds small edges.
    const base = (practice * 0.35 + network * 0.25 + risk * 0.2 + reflection * 0.2) * 2 - 1 // [-1,1]
    const random = (Math.random() * 2 - 1) * sigma * 0.7

    // Update luck with gentle mean reversion around 50
    const prev = s.metrics.luck
    let next = prev + (base * 2.5 + random)
    next += (50 - prev) * 0.02 // mean-revert a bit
    next = Math.max(0, Math.min(100, next))

    const streak = next > prev ? s.metrics.streak + 1 : 0

    const pt: Point = { t: fmtTime(), luck: parseFloat(next.toFixed(2)) }
    const series = [...s.series, pt].slice(-s.timeframe)

    set({ metrics: { ...s.metrics, luck: next, streak }, series })
  },

  takeAction: () => {
    const s = get()
    // An "action" creates exposure to an opportunity; chance scaled by practice & network.
    const p = 0.2 + 0.6 * ((s.params.practice + s.params.network) / 2) // [0.2, 0.8]
    if (Math.random() < p){
      const bump = 2 + 6 * (s.params.reflection * 0.5 + s.params.risk * 0.5) // 2..8
      const next = Math.min(100, s.metrics.luck + bump)
      set({ metrics: { ...s.metrics, luck: next, opportunities: s.metrics.opportunities + 1 } })
    } else {
      // small miss; slight drawdown unless reflection is high
      const drag = 1 - s.params.reflection * 0.8
      const next = Math.max(0, s.metrics.luck - drag)
      set({ metrics: { ...s.metrics, luck: next } })
    }
  },

  logInsight: () => {
    const s = get()
    const next = Math.min(100, s.metrics.luck + 1.5 + s.params.reflection * 1.5)
    set({ metrics: { ...s.metrics, luck: next, insights: s.metrics.insights + 1 } })
  },

  reset: () => set({
    running: false,
    timeframe: 300,
    series: [{ t: fmtTime(), luck: 50 }],
    metrics: { luck: 50, streak: 0, opportunities: 0, insights: 0 },
    params: { practice: 0.5, network: 0.5, risk: 0.5, reflection: 0.5, sigma: 0.6, latency: 160 }
  })
}))

// Animation loop with latency throttle
export function useLuckLoop(){
  const { running, tick, params } = useLuckStore.getState()
  useEffect(() => {
    let raf: number
    let last = performance.now()
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (!useLuckStore.getState().running) return
      const latency = useLuckStore.getState().params.latency
      if (t - last > latency){
        useLuckStore.getState().tick()
        last = t
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running, params && params.latency, tick])
}
