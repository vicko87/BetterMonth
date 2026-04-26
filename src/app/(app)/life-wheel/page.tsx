'use client'

import { useState } from "react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { LIFE_AREAS } from "@/lib/constants"
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts"




const DEFAULT_VALUES = {
     health: 7, work: 6, family: 8, friends: 5,
  finances: 4, growth: 7, leisure: 6, relationships: 8,
}


export default function LifeWheelPage() {
   const [values, setValues] = useState(DEFAULT_VALUES)

   const chartData = LIFE_AREAS.map((area) => ({
    area: area.emoji + ' ' + area.label,
    areaShort: area.emoji,
    value: values[area.key as keyof typeof values],
  }))

  function updateValue(key: string, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Life Wheel</h1>
        <p className="text-white/40">Rate each area from 1 to 10</p>
      </div>

      <Card className="mb-6 bg-[#0f0f1a] border-white/10">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={chartData} outerRadius="65%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="area"
              tick={({ x, y, payload, index }) => {
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
        {LIFE_AREAS.map((area) => (
          <Card key={area.key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{area.emoji}</span>
                <p className="text-sm font-medium text-white">{area.label}</p>
              </div>
              <span className="text-lg font-bold" style={{ color: area.color }}>
                {values[area.key as keyof typeof values]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={values[area.key as keyof typeof values]}
              onChange={(e) => updateValue(area.key, Number(e.target.value))}
              className="w-full accent-violet-500"
            />
          </Card>
        ))}
      </div>
    </PageWrapper>
  )
}