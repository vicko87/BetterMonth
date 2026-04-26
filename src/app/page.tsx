'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const STEPS = [
  {
    message: "Hi! I'm BetterBot! I'm here to show you how BetterMonth works. Ready?",
    feature: null,
  },
  {
    message: "BetterMonth helps you build habits over 30 days. Pick something you want to improve and commit to it every single day.",
    feature: { emoji: '📅', title: '30-day challenges', description: 'Choose a habit, check in every day, build real momentum.' },
  },
  {
    message: "You can rate 8 areas of your life — health, work, relationships, finances — and see exactly where to focus.",
    feature: { emoji: '🎯', title: 'Life Wheel', description: 'A visual map of your life. Rate each area from 1 to 10.' },
  },
  {
    message: "Every day you complete a habit, your progress grows. Streaks, charts and XP keep you motivated.",
    feature: { emoji: '📊', title: 'Progress tracking', description: 'Visual charts, streaks and XP to keep you motivated.' },
  },
  {
    message: "That's it! Ready to start your best month? It's completely free!",
    feature: null,
  },
]

function speak(text: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  utterance.pitch = 0.8
  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices()
    const male = voices.find(v =>
      v.lang.startsWith('en') && (
        v.name.includes('Daniel') ||
        v.name.includes('David') ||
        v.name.includes('Alex') ||
        v.name.includes('Google UK English Male') ||
        v.name.includes('Microsoft David') ||
        v.name.includes('Microsoft Mark') ||
        v.name.includes('Fred')
      )
    ) || voices.find(v => v.lang.startsWith('en'))
    if (male) utterance.voice = male
    window.speechSynthesis.speak(utterance)
  }
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = trySpeak
  } else {
    trySpeak()
  }
}

function _RobotSVG_UNUSED({ talking }: { talking: boolean }) {
  return (
    <>
      <style>{`
        @keyframes botFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes botArmL  { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(10deg)} }
        @keyframes botArmR  { 0%,100%{transform:rotate(20deg)}  50%{transform:rotate(-10deg)} }
        @keyframes botLegL  { 0%,100%{transform:rotate(-6deg)}  50%{transform:rotate(6deg)} }
        @keyframes botLegR  { 0%,100%{transform:rotate(6deg)}   50%{transform:rotate(-6deg)} }
        @keyframes botBlink { 0%,88%,100%{transform:scaleY(1)} 92%{transform:scaleY(0.05)} }
        @keyframes botMouth { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.15)} }
        @keyframes botScreen { 0%,100%{opacity:0.7} 50%{opacity:1} }
        .b-float  { animation: botFloat   2.6s ease-in-out infinite }
        .b-arm-l  { animation: botArmL    1.1s ease-in-out infinite; transform-origin: 30px 150px }
        .b-arm-r  { animation: botArmR    1.1s ease-in-out infinite; transform-origin: 170px 150px }
        .b-leg-l  { animation: botLegL    1.1s ease-in-out infinite; transform-origin: 72px 218px }
        .b-leg-r  { animation: botLegR    1.1s ease-in-out infinite; transform-origin: 128px 218px }
        .b-eye-l  { animation: botBlink   3.2s ease-in-out infinite; transform-origin: 72px 76px }
        .b-eye-r  { animation: botBlink   3.2s ease-in-out infinite 0.4s; transform-origin: 128px 76px }
        .b-mouth  { animation: botMouth   0.22s ease-in-out infinite; transform-origin: 100px 115px }
        .b-screen { animation: botScreen  1.8s ease-in-out infinite }
      `}</style>
      <svg width="200" height="280" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{filter:'drop-shadow(0 12px 40px #7c3aedbb)'}}>
        <defs>
          <radialGradient id="rg-head" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#ede9fe"/>
            <stop offset="100%" stopColor="#5b21b6"/>
          </radialGradient>
          <radialGradient id="rg-body" cx="38%" cy="25%" r="70%">
            <stop offset="0%" stopColor="#c4b5fd"/>
            <stop offset="100%" stopColor="#4c1d95"/>
          </radialGradient>
          <radialGradient id="rg-limb" cx="30%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#3b0764"/>
          </radialGradient>
          <radialGradient id="rg-eye" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#bfdbfe"/>
            <stop offset="50%" stopColor="#2563eb"/>
            <stop offset="100%" stopColor="#1e3a8a"/>
          </radialGradient>
          <radialGradient id="rg-screen" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#38bdf8"/>
            <stop offset="100%" stopColor="#0c4a6e"/>
          </radialGradient>
          <linearGradient id="lg-shine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="275" rx="48" ry="7" fill="#7c3aed" opacity="0.2"/>

        <g className="b-float">

          {/* ── ANTENNA ── */}
          <rect x="97" y="16" width="6" height="26" rx="3" fill="#a78bfa"/>
          <circle cx="100" cy="12" r="10" fill="#f0abfc" stroke="white" strokeWidth="2.5">
            <animate attributeName="r" values="10;14;10" dur="0.9s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.35;1" dur="0.9s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="12" r="4" fill="white" opacity="0.9"/>

          {/* ── HEAD ── */}
          <rect x="32" y="38" width="136" height="96" rx="34" fill="url(#rg-head)" stroke="white" strokeWidth="3"/>
          {/* Head shine */}
          <rect x="32" y="38" width="136" height="96" rx="34" fill="url(#lg-shine)"/>
          {/* Cheeks */}
          <ellipse cx="50" cy="112" rx="13" ry="9" fill="#f472b6" opacity="0.45"/>
          <ellipse cx="150" cy="112" rx="13" ry="9" fill="#f472b6" opacity="0.45"/>
          {/* Ear panels */}
          <rect x="28" y="64" width="16" height="36" rx="8" fill="#4c1d95" stroke="#c4b5fd" strokeWidth="1.5"/>
          <rect x="156" y="64" width="16" height="36" rx="8" fill="#4c1d95" stroke="#c4b5fd" strokeWidth="1.5"/>
          <circle cx="36" cy="72" r="4" fill="#f0abfc"/>
          <circle cx="164" cy="72" r="4" fill="#f0abfc"/>
          <circle cx="36" cy="82" r="4" fill="#f0abfc"/>
          <circle cx="164" cy="82" r="4" fill="#f0abfc"/>
          <circle cx="36" cy="92" r="4" fill="#f0abfc"/>
          <circle cx="164" cy="92" r="4" fill="#f0abfc"/>

          {/* ── EYES ── */}
          <g className="b-eye-l">
            <circle cx="72" cy="76" r="24" fill="#0a0a1e" stroke="white" strokeWidth="3"/>
            <circle cx="72" cy="76" r="19" fill="url(#rg-eye)"/>
            <circle cx="72" cy="76" r="11" fill="#1e3a8a"/>
            <circle cx="72" cy="76" r="6"  fill="#60a5fa"/>
            <circle cx="72" cy="76" r="2"  fill="#dbeafe"/>
            <circle cx="80" cy="67" r="5"  fill="white" opacity="0.9"/>
            <circle cx="64" cy="84" r="2.5" fill="white" opacity="0.4"/>
          </g>
          <g className="b-eye-r">
            <circle cx="128" cy="76" r="24" fill="#0a0a1e" stroke="white" strokeWidth="3"/>
            <circle cx="128" cy="76" r="19" fill="url(#rg-eye)"/>
            <circle cx="128" cy="76" r="11" fill="#1e3a8a"/>
            <circle cx="128" cy="76" r="6"  fill="#60a5fa"/>
            <circle cx="128" cy="76" r="2"  fill="#dbeafe"/>
            <circle cx="136" cy="67" r="5"  fill="white" opacity="0.9"/>
            <circle cx="120" cy="84" r="2.5" fill="white" opacity="0.4"/>
          </g>

          {/* Eyebrows */}
          <path d="M54 50 Q72 42 88 50" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M112 50 Q128 42 146 50" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

          {/* ── MOUTH ── */}
          {talking ? (
            <g className="b-mouth">
              <ellipse cx="100" cy="115" rx="24" ry="13" fill="#0a0a1e" stroke="white" strokeWidth="2.5"/>
              <ellipse cx="100" cy="119" rx="16" ry="7" fill="#f9a8d4" opacity="0.9"/>
            </g>
          ) : (
            <>
              <path d="M76 118 Q100 136 124 118" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
              <circle cx="76" cy="118" r="3.5" fill="white"/>
              <circle cx="124" cy="118" r="3.5" fill="white"/>
            </>
          )}

          {/* ── NECK ── */}
          <rect x="82" y="134" width="36" height="18" rx="8" fill="#4c1d95" stroke="#c4b5fd" strokeWidth="2"/>
          <rect x="88" y="138" width="10" height="5" rx="2.5" fill="#c4b5fd" opacity="0.5"/>
          <rect x="102" y="138" width="10" height="5" rx="2.5" fill="#c4b5fd" opacity="0.5"/>

          {/* ── BODY ── */}
          <rect x="28" y="152" width="144" height="102" rx="32" fill="url(#rg-body)" stroke="white" strokeWidth="2.5"/>
          <rect x="28" y="152" width="144" height="102" rx="32" fill="url(#lg-shine)"/>
          {/* Body panel line */}
          <path d="M42 186 L158 186" stroke="white" strokeWidth="1" opacity="0.15"/>
          {/* Chest screen */}
          <rect x="52" y="166" width="96" height="62" rx="16" fill="#071030" stroke="#7dd3fc" strokeWidth="2"/>
          <rect x="55" y="169" width="90" height="56" rx="14" fill="#050d20"/>
          <g className="b-screen">
            {talking ? (
              <>
                <rect x="64" y="179" width="72" height="8" rx="4" fill="#38bdf8">
                  <animate attributeName="width" values="72;48;72" dur="0.22s" repeatCount="indefinite"/>
                </rect>
                <rect x="69" y="193" width="62" height="8" rx="4" fill="#7dd3fc">
                  <animate attributeName="width" values="62;82;62" dur="0.22s" repeatCount="indefinite"/>
                </rect>
                <rect x="74" y="207" width="52" height="8" rx="4" fill="#bae6fd">
                  <animate attributeName="width" values="52;38;52" dur="0.22s" repeatCount="indefinite"/>
                </rect>
              </>
            ) : (
              <>
                <circle cx="100" cy="190" r="16" fill="url(#rg-screen)" opacity="0.85"/>
                <circle cx="100" cy="190" r="9"  fill="#38bdf8" opacity="0.9"/>
                <circle cx="106" cy="184" r="4"  fill="white" opacity="0.8"/>
                <rect x="64"  y="212" width="72" height="5" rx="2.5" fill="#0c2d4a"/>
              </>
            )}
          </g>
          {/* Colored buttons */}
          <circle cx="38"  cy="172" r="7" fill="#f472b6" stroke="white" strokeWidth="2"/>
          <circle cx="38"  cy="190" r="7" fill="#fbbf24" stroke="white" strokeWidth="2"/>
          <circle cx="38"  cy="208" r="7" fill="#34d399" stroke="white" strokeWidth="2"/>
          <circle cx="162" cy="172" r="7" fill="#60a5fa" stroke="white" strokeWidth="2"/>
          <circle cx="162" cy="190" r="7" fill="#f0abfc" stroke="white" strokeWidth="2"/>
          <circle cx="162" cy="208" r="7" fill="#fcd34d" stroke="white" strokeWidth="2"/>

          {/* ── ARMS ── */}
          <g className="b-arm-l">
            <circle cx="28" cy="162" r="14" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="4"  y="156" width="28" height="62" rx="14" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="4"  y="156" width="28" height="62" rx="14" fill="url(#lg-shine)"/>
            <circle cx="18" cy="222" r="17" fill="#3b0764" stroke="white" strokeWidth="2.5"/>
            <circle cx="11" cy="215" r="4.5" fill="#c4b5fd"/>
            <circle cx="25" cy="215" r="4.5" fill="#c4b5fd"/>
            <circle cx="18" cy="226" r="4.5" fill="#c4b5fd"/>
          </g>
          <g className="b-arm-r">
            <circle cx="172" cy="162" r="14" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="168" y="156" width="28" height="62" rx="14" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="168" y="156" width="28" height="62" rx="14" fill="url(#lg-shine)"/>
            <circle cx="182" cy="222" r="17" fill="#3b0764" stroke="white" strokeWidth="2.5"/>
            <circle cx="175" cy="215" r="4.5" fill="#c4b5fd"/>
            <circle cx="189" cy="215" r="4.5" fill="#c4b5fd"/>
            <circle cx="182" cy="226" r="4.5" fill="#c4b5fd"/>
          </g>

          {/* ── LEGS ── */}
          <g className="b-leg-l">
            <circle cx="72" cy="252" r="13" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="56" y="250" width="32" height="38" rx="13" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="56" y="250" width="32" height="38" rx="13" fill="url(#lg-shine)"/>
            <rect x="46" y="278" width="52" height="18" rx="9" fill="#3b0764" stroke="white" strokeWidth="2"/>
          </g>
          <g className="b-leg-r">
            <circle cx="128" cy="252" r="13" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="112" y="250" width="32" height="38" rx="13" fill="url(#rg-limb)" stroke="white" strokeWidth="2"/>
            <rect x="112" y="250" width="32" height="38" rx="13" fill="url(#lg-shine)"/>
            <rect x="102" y="278" width="52" height="18" rx="9" fill="#3b0764" stroke="white" strokeWidth="2"/>
          </g>

        </g>
      </svg>
    </>
  )
}

export default function LandingPage() {
  const [step, setStep] = useState(0)
  const [talking, setTalking] = useState(false)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  function startSpeak(msg: string) {
    window.speechSynthesis.cancel()
    setTalking(true)
    speak(msg)
    const timer = setTimeout(() => setTalking(false), msg.length * 60)
    return timer
  }

  function next() {
    const nextStep = step + 1
    setStep(nextStep)
    setTimeout(() => startSpeak(STEPS[nextStep].message), 50)
  }

  function skip() {
    window.speechSynthesis.cancel()
    setTalking(false)
    setStep(STEPS.length - 1)
  }

  function replay() {
    startSpeak(current.message)
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-violet-950/20 to-black flex flex-col items-center justify-center px-6 py-12">

      <DotLottieReact
        src="https://lottie.host/47e51ff0-421c-4d0b-b72d-e85be122f194/ZLHNY2oNRs.lottie"
        loop
        autoplay
        style={{ width: 280, height: 280 }}
      />

      {talking && (
        <div className="flex gap-1.5 mt-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      <div className="relative max-w-sm w-full rounded-2xl border border-violet-500/30 bg-violet-500/10 px-6 py-5 mt-4 mb-5 text-center shadow-lg shadow-violet-900/20">
        <p className="text-white text-sm leading-relaxed">{current.message}</p>
        <button
          onClick={replay}
          className="mt-3 text-violet-400 hover:text-violet-300 transition-colors text-lg"
          title="Listen"
        >
          🔊
        </button>
      </div>

      {current.feature && (
        <div className="max-w-sm w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 mb-5 flex items-start gap-4">
          <span className="text-3xl mt-0.5">{current.feature.emoji}</span>
          <div>
            <p className="text-white font-semibold mb-0.5">{current.feature.title}</p>
            <p className="text-white/50 text-sm">{current.feature.description}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-violet-400 w-5' : 'bg-white/20 w-2'}`} />
        ))}
      </div>

      {!isLast ? (
        <button onClick={next} className="w-full max-w-sm rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
          Next →
        </button>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <Link href="/register" className="w-full rounded-xl bg-violet-600 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-violet-500">
            Get started — it&apos;s free
          </Link>
          <Link href="/login" className="w-full rounded-xl border border-white/10 py-3.5 text-center text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
            I already have an account
          </Link>
        </div>
      )}

      {!isLast && (
        <button onClick={skip} className="mt-4 text-xs text-white/30 hover:text-white/60 transition-colors">
          Skip intro
        </button>
      )}
    </main>
  )
}