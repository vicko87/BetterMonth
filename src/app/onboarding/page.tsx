'use client'

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { LIFE_AREAS } from "@/lib/constants"
import { LifeArea } from "@/types"
import { cn } from "@/lib/utils"



export default function OnboardingPage() {
  const [selected, setSelected] = useState<LifeArea[]>([])

  function toggleArea(area: LifeArea) {
    setSelected((prev) =>
        prev.includes(area)
     ? prev.filter((a) => a !== area)
      : prev.length < 3
        ? [...prev, area]
        : prev
    )
}

    return (
         <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#080810] via-violet-950/30 to-[#080810] p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">BetterMonth</h1>
          <p className="text-white/50">Choose up to 3 areas to improve in 30 days</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {LIFE_AREAS.map((area) => {
            const isSelected = selected.includes(area.key)
            return (
              <button
                key={area.key}
                onClick={() => toggleArea(area.key)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200',
                  isSelected
                    ? 'border-violet-500 bg-violet-500/20 text-white scale-[1.02]'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white'
                )}
              >
                <span className="text-2xl">{area.emoji}</span>
                <span className="font-medium">{area.label}</span>
                {isSelected && <span className="ml-auto text-violet-400">✓</span>}
              </button>
            )
          })}
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={selected.length === 0}
        >
          Start my 30-day challenge ({selected.length}/3)
        </Button>
      </div>
    </div>
  )
}







