import { useId, useMemo, useState } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'
import { useLanguage } from '../../contexts/LanguageContext'

// Lightweight hand-rolled SVG area chart — replaces recharts here.
// recharts (+ its lodash/d3 dependencies) cost ~110KB gzip just for this
// single 6-point revenue chart, which was one of the biggest contributors
// to a slow dashboard load. This does the same visual job in <2KB.
const WIDTH = 600
const HEIGHT = 220
const PAD_LEFT = 40
const PAD_RIGHT = 10
const PAD_TOP = 10
const PAD_BOTTOM = 24

export default function RevenueChart({ data, currency = 'USD' }) {
  const { t } = useLanguage()
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState(null)

  const { points, areaPath, linePath, maxValue, yTicks } = useMemo(() => {
    if (!data || data.length === 0) return { points: [] }

    const max = Math.max(1, ...data.map((d) => d.revenue))
    const plotW = WIDTH - PAD_LEFT - PAD_RIGHT
    const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM
    const stepX = data.length > 1 ? plotW / (data.length - 1) : 0

    const pts = data.map((d, i) => {
      const x = PAD_LEFT + stepX * i
      const y = PAD_TOP + plotH - (d.revenue / max) * plotH
      return { x, y, ...d }
    })

    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const area = `${line} L ${pts[pts.length - 1].x} ${PAD_TOP + plotH} L ${pts[0].x} ${PAD_TOP + plotH} Z`

    const ticks = [0, 0.5, 1].map((f) => ({
      y: PAD_TOP + plotH - f * plotH,
      value: max * f,
    }))

    return { points: pts, areaPath: area, linePath: line, maxValue: max, yTicks: ticks }
  }, [data])

  if (!points || points.length === 0) {
    return <div className="h-64 flex items-center justify-center text-sm text-slate-400">{t('dashboard.noRevenueData')}</div>
  }

  const active = hoverIndex != null ? points[hoverIndex] : null

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-[260px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>

        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={tick.y} y2={tick.y} stroke="#eef1f6" strokeDasharray="3 3" />
            <text x={4} y={tick.y + 3} fontSize="9" fill="#94a3b8">
              {tick.value >= 1000 ? `${Math.round(tick.value / 1000)}k` : Math.round(tick.value)}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={i}>
            <text x={p.x} y={HEIGHT - 6} fontSize="9" fill="#94a3b8" textAnchor="middle">{p.label}</text>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 4 : 0}
              fill="#6366f1"
              stroke="white"
              strokeWidth="1.5"
            />
            <rect
              x={p.x - (WIDTH / points.length) / 2}
              y={PAD_TOP}
              width={WIDTH / points.length}
              height={HEIGHT - PAD_TOP - PAD_BOTTOM}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          </g>
        ))}
      </svg>

      {active && (
        <div
          className="absolute pointer-events-none bg-white border border-slate-100 rounded-xl shadow-sm px-3 py-1.5 text-xs -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(active.x / WIDTH) * 100}%`,
            top: `${(active.y / HEIGHT) * 100}%`,
          }}
        >
          <div className="font-medium text-slate-700">{active.label}</div>
          <div className="text-slate-500">{formatCurrency(active.revenue, currency)}</div>
        </div>
      )}
    </div>
  )
}
