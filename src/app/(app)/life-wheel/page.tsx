'use client'

import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { LIFE_AREAS } from "@/lib/constants"
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts"
import { useLifeWheel } from "@/hooks/useLifeWheel"
import { LifeArea } from "@/types"

export default function LifeWheelPage() {
  const { values, autoAreas, loading, saving, updateValue, save } = useLifeWheel()

  const chartData = LIFE_AREAS.map((area) => ({
    area: area.emoji + ' ' + area.label,
    value: values[area.key as LifeArea],
  }))

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Life Wheel</h1>
        <p className="text-white/40">Auto from habits · Manual for the rest</p>
      </div>

      {loading && <p className="text-white/40 text-sm mb-4">Calculating...</p>}

      <Card className="mb-6 bg-[#0f0f1a] border-white/10">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={chartData} outerRadius="65%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="area"
              tick={({ x, y, index }) => {
                const item = LIFE_AREAS[index]
                return (
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#c4b5fd" fontSize={12} fontWeight={600}>
                    <tspan x={x} dy="-0.4em">{item?.emoji}</tspan>
                    <tspan x={x} dy="1.3em" fontSize={10} fill="#a78bfa">{item?.label}</tspan>
                  </text>
                )
              }}
            />
            <Radar
              dataKey="value"
              stroke="#a78bfa"
              fill="#a78bfa"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Set manually</p>
        </div>
        {LIFE_AREAS.filter((area) => !autoAreas.includes(area.key as LifeArea)).map((area) => {
          const val = values[area.key as LifeArea]
          return (
            <Card key={area.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{area.emoji}</span>
                  <p className="text-sm font-medium text-white">{area.label}</p>
                </div>
                <span className="text-lg font-bold" style={{ color: area.color }}>
                  {val}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={val}
                onChange={(e) => updateValue(area.key as LifeArea, Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </Card>
          )
        })}

        <div className="md:col-span-2 mt-2">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Auto from habits</p>
        </div>
        {LIFE_AREAS.filter((area) => autoAreas.includes(area.key as LifeArea)).map((area) => {
          const val = values[area.key as LifeArea]
          return (
            <Card key={area.key} className="opacity-80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{area.emoji}</span>
                  <p className="text-sm font-medium text-white">{area.label}</p>
                  <span className="text-xs text-white/30 border border-white/10 rounded px-1">auto</span>
                </div>
                <span className="text-lg font-bold" style={{ color: area.color }}>
                  {val}/10
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${val * 10}%`, backgroundColor: area.color }}
                />
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-6">
        <Button size="lg" onClick={save} disabled={saving || loading}>
          {saving ? 'Saving...' : 'Save manual values'}
        </Button>
      </div>
    </PageWrapper>
  )
}