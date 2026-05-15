'use client'

import { useEffect, useMemo, useState } from 'react'
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-webgl2'
import { cn } from '@/lib/utils'

const STATE_MACHINES = ['SMAvatar', 'SMButtons']
const TARGET_SM = 'SMButtons'

/** Initial look applied once Rive has loaded. */
const INITIAL_LOOK: Record<string, number> = {
  SkinTone: 0,
  Body: 6,
  Expression: 8,
  EyeColor: 0,
  MainHair: 21,
  MainHairColor: 13,
  Piercings: 0,
  'Nose Piercing': 0,
  FacialHair: 0,
  FacialHairColor: 0,
  Glasses: 0,
  GlassesColor: 0,
  Headwear: 0,
  HeadwearColor: 0,
  ClothingColor: 0,
  BackgroundColor: 0,
  ENG_ONLY_Zoom: 5,
  ENG_ONLY_Animation: 0,
  ENG_ONLY_XPBoost: 0,
}

const INITIAL_LOOK_BOOL: Record<string, boolean> = {
  ENG_ONLY_HeadFlip: false,
}

/**
 * Some number inputs don't drive the state machine — their animations must be
 * triggered via `rive.play()` directly. Map: input name → value → animation name.
 */
const PLAY_ON_VALUE: Record<string, Record<number, string | null>> = {
  ENG_ONLY_Animation: {
    0: null,
    1: 'Animation_Idle_STANDARD',
    2: 'Animation_Idle_TRANSITION',
  },
  ENG_ONLY_XPBoost: {
    0: null,
    1: 'XPBoost_01_ON',
  },
}

type ColorSection = { type: 'color'; label: string; input: string; prefix: string }
type ShapeSection = { type: 'shape'; label: string; input: string; max: number }
type BoolSection = { type: 'bool'; label: string; input: string }
type Section = ColorSection | ShapeSection | BoolSection

type Category = {
  id: string
  label: string
  icon: string
  sections: Section[]
}

const CATEGORIES: Category[] = [
  {
    id: 'body',
    label: 'Người',
    icon: '👤',
    sections: [
      { type: 'shape', label: 'Khuôn mặt', input: 'Headshape', max: 6 },
      { type: 'color', label: 'Màu da', input: 'SkinTone', prefix: 'ST' },
      { type: 'shape', label: 'Dáng người', input: 'Body', max: 6 },
    ],
  },
  {
    id: 'face',
    label: 'Mặt',
    icon: '😀',
    sections: [
      { type: 'shape', label: 'Biểu cảm', input: 'Expression', max: 21 },
      { type: 'color', label: 'Màu mắt', input: 'EyeColor', prefix: 'EC' },
      { type: 'shape', label: 'Nếp nhăn', input: 'Wrinkles', max: 1 },
    ],
  },
  {
    id: 'hair',
    label: 'Tóc',
    icon: '💇',
    sections: [
      { type: 'shape', label: 'Kiểu tóc', input: 'MainHair', max: 73 },
      { type: 'color', label: 'Màu tóc', input: 'MainHairColor', prefix: 'MHC' },
    ],
  },
  {
    id: 'details',
    label: 'Chi tiết',
    icon: '✨',
    sections: [
      { type: 'shape', label: 'Khuyên tai', input: 'Piercings', max: 6 },
      { type: 'shape', label: 'Khuyên mũi', input: 'Nose Piercing', max: 3 },
    ],
  },
  {
    id: 'facial-hair',
    label: 'Râu',
    icon: '🧔',
    sections: [
      { type: 'shape', label: 'Kiểu râu', input: 'FacialHair', max: 6 },
      { type: 'color', label: 'Màu râu', input: 'FacialHairColor', prefix: 'FHC' },
    ],
  },
  {
    id: 'glasses',
    label: 'Kính',
    icon: '🕶️',
    sections: [
      { type: 'shape', label: 'Kiểu kính', input: 'Glasses', max: 6 },
      { type: 'color', label: 'Màu kính', input: 'GlassesColor', prefix: 'GC' },
    ],
  },
  {
    id: 'headwear',
    label: 'Mũ',
    icon: '🎩',
    sections: [
      { type: 'shape', label: 'Kiểu mũ', input: 'Headwear', max: 12 },
      { type: 'color', label: 'Màu mũ', input: 'HeadwearColor', prefix: 'HWC' },
      { type: 'shape', label: 'Tai nghe', input: 'Headphones', max: 1 },
      { type: 'shape', label: 'Màu tai nghe', input: 'HeadphonesColour', max: 9 },
    ],
  },
  {
    id: 'clothing',
    label: 'Áo',
    icon: '👕',
    sections: [
      { type: 'color', label: 'Màu áo', input: 'ClothingColor', prefix: 'CC' },
    ],
  },
  {
    id: 'background',
    label: 'Nền',
    icon: '🎨',
    sections: [
      { type: 'color', label: 'Màu nền', input: 'BackgroundColor', prefix: 'BGC' },
    ],
  },
  {
    id: 'effects',
    label: 'Hiệu ứng',
    icon: '✨',
    sections: [
      // Zoom_00_ButtonHead, _01_Avatar, _02_Hair_CENTER, _03_Hair_UP, _04_Hair_DOWN, _FullBody → 0–5
      { type: 'shape', label: 'Zoom', input: 'ENG_ONLY_Zoom', max: 5 },
      // Anim_00_NONE, Animation_Idle_STANDARD, Animation_Idle_TRANSITION → 0–2
      { type: 'shape', label: 'Animation', input: 'ENG_ONLY_Animation', max: 2 },
      // XPBoost_00_OFF / XPBoost_01_ON
      { type: 'shape', label: 'XP Boost', input: 'ENG_ONLY_XPBoost', max: 1 },
      // HeadFlipped_00_OFF / HeadFlipped_01_ON (bool input)
      { type: 'bool', label: 'Lật đầu', input: 'ENG_ONLY_HeadFlip' },
    ],
  },
]

type PaletteEntry = { hex: string; label?: string; gradient?: string }

/**
 * Parse palette from animation names.
 * - `ST_00_E18E70` → index 0, hex `#E18E70`
 * - `BGC_FFFFFF`, `BGC_Duocon` (named, no index) → assigned indices after max numeric
 *   in the order they appear in `animations`.
 */
function extractPalette(animations: string[], prefix: string): Map<number, PaletteEntry> {
  const map = new Map<number, PaletteEntry>()
  const indexed = new RegExp(`^${prefix}_(\\d+)(?:_([0-9A-Fa-f]{6}))?`)
  const named = new RegExp(`^${prefix}_(.+)$`)
  const namedNames: string[] = []
  let maxIdx = -1
  for (const name of animations) {
    const m = indexed.exec(name)
    if (m) {
      const idx = Number(m[1])
      map.set(idx, { hex: m[2] ? `#${m[2]}` : '' })
      if (idx > maxIdx) maxIdx = idx
      continue
    }
    const n = named.exec(name)
    if (n && !/^\d/.test(n[1])) namedNames.push(n[1])
  }
  // Named entries: try pure-hex name first (e.g. `FFFFFF` → `#FFFFFF`), otherwise label only.
  // Reverse so the order from `animationNames` (top → bottom) maps to lowest → highest index.
  namedNames.reverse().forEach((raw, i) => {
    const idx = maxIdx + 1 + i
    if (/^[0-9A-Fa-f]{6}$/.test(raw)) {
      map.set(idx, { hex: `#${raw}` })
    } else {
      map.set(idx, {
        hex: '',
        label: raw.length > 4 ? raw.slice(0, 3) : raw,
        gradient: 'conic-gradient(from 0deg, #ffb2b2, #b8f28b, #84d7ff, #ddb1f9, #ffb2b2)',
      })
    }
  })
  return map
}

export function AvatarPlayground({ className }: { className?: string }) {
  const { rive, RiveComponent } = useRive({
    src: '/avatar_builder_25_sept2025.riv',
    stateMachines: STATE_MACHINES,
    autoplay: true,
    // Cover = artboard fills canvas (may crop) — chống nhân vật bé tẹo trong khoảng trống.
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  })

  const bounce = useStateMachineInput(rive, 'SMAvatar', 'bounce_trig')

  const [, setTick] = useState(0)
  const bump = () => setTick((t) => t + 1)

  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id)
  const [copied, setCopied] = useState(false)

  // Turn off "default avatar mode" and apply the initial look once Rive is loaded.
  useEffect(() => {
    if (!rive) return
    for (const sm of STATE_MACHINES) {
      const inputs = rive.stateMachineInputs(sm) ?? []
      const defaultBool = inputs.find((i) => i.name === 'default_avatar_bool')
      if (defaultBool && typeof defaultBool.value === 'boolean') {
        defaultBool.value = false
      }
    }

    const targetInputs = rive.stateMachineInputs(TARGET_SM) ?? []
    for (const [name, value] of Object.entries(INITIAL_LOOK)) {
      const input = targetInputs.find((i) => i.name === name)
      if (input && typeof (input as { value?: number }).value === 'number') {
        ;(input as { value: number }).value = value
      }
    }
    for (const [name, value] of Object.entries(INITIAL_LOOK_BOOL)) {
      const input = targetInputs.find((i) => i.name === name)
      if (input && typeof (input as { value?: boolean }).value === 'boolean') {
        ;(input as { value: boolean }).value = value
      }
    }
    bump()
  }, [rive])

  // Pre-build all color palettes from animation names.
  const palettes = useMemo(() => {
    const out = new Map<string, Map<number, PaletteEntry>>()
    if (!rive) return out
    const anims = rive.animationNames
    for (const cat of CATEGORIES) {
      for (const s of cat.sections) {
        if (s.type === 'color') out.set(s.prefix, extractPalette(anims, s.prefix))
      }
    }
    return out
  }, [rive])

  const inputs = rive?.stateMachineInputs(TARGET_SM) ?? []
  const findInput = (name: string) => inputs.find((i) => i.name === name)
  const getValue = (name: string): number => {
    const input = findInput(name)
    const v = (input as { value?: number } | undefined)?.value
    return typeof v === 'number' ? v : 0
  }
  const setValue = (name: string, value: number) => {
    const input = findInput(name)
    if (input && typeof (input as { value?: number }).value === 'number') {
      ;(input as { value: number }).value = value
      bump()
    }
    // Some inputs (Animation, XPBoost) don't drive the state machine — play
    // their animations directly. They layer on top of the SM and auto-return.
    if (rive && PLAY_ON_VALUE[name]) {
      const anim = PLAY_ON_VALUE[name][value]
      if (anim) rive.play(anim)
    }
  }
  const getBool = (name: string): boolean => {
    const input = findInput(name)
    const v = (input as { value?: boolean } | undefined)?.value
    return typeof v === 'boolean' ? v : false
  }
  const setBool = (name: string, value: boolean) => {
    const input = findInput(name)
    if (input && typeof (input as { value?: boolean }).value === 'boolean') {
      ;(input as { value: boolean }).value = value
      bump()
    }
  }

  const exportConfig = async () => {
    const config: Record<string, number> = {}
    for (const cat of CATEGORIES) {
      for (const s of cat.sections) {
        config[s.input] = getValue(s.input)
      }
    }
    const json = JSON.stringify(config, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback for environments without clipboard API.
      window.prompt('Copy avatar config:', json)
    }
  }

  const active = CATEGORIES.find((c) => c.id === activeCategoryId) ?? CATEGORIES[0]

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <RiveComponent
        onClick={() => bounce?.fire()}
        className={cn(className, 'size-75')}
        style={{ cursor: bounce ? 'pointer' : undefined }}
      />

      <div className="flex flex-1 gap-3">
        {/* Category strip */}
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategoryId
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-xl border-2 text-[22px] transition-[transform,background,border-color]',
                  isActive
                    ? 'border-purple bg-purple-soft shadow-[0_2px_0_var(--purple-deep)]'
                    : 'border-line-2 bg-paper hover:bg-paper-2 hover:scale-[1.03]'
                )}
                aria-label={cat.label}
                aria-pressed={isActive}
                title={cat.label}
              >
                {cat.icon}
              </button>
            )
          })}
        </div>

        {/* Active category panel */}
        <div className="flex-1 space-y-5 overflow-y-auto rounded-xl border-2 border-line-2 bg-paper p-4 shadow-[0_2px_0_var(--line-2)] max-h-130">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="font-display text-[15px] font-extrabold tracking-tight text-ink">
              {active.label}
            </span>
            <button
              type="button"
              onClick={exportConfig}
              className={cn(
                'rounded-md border-2 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider shadow-[0_2px_0_var(--line-2)] transition-[background,border-color] active:translate-y-0.5 active:shadow-[0_1px_0_var(--line-2)]',
                copied
                  ? 'border-correct bg-correct-soft text-correct-deep'
                  : 'border-line-2 bg-paper text-ink hover:bg-paper-2'
              )}
            >
              {copied ? '✓ Đã copy' : '📋 Export JSON'}
            </button>
          </div>

          {active.sections.map((section) => {
            if (section.type === 'color') {
              return (
                <ColorPicker
                  key={section.input}
                  section={section}
                  palette={palettes.get(section.prefix) ?? new Map()}
                  value={getValue(section.input)}
                  onChange={(v) => setValue(section.input, v)}
                />
              )
            }
            if (section.type === 'shape') {
              return (
                <ShapePicker
                  key={section.input}
                  section={section}
                  value={getValue(section.input)}
                  onChange={(v) => setValue(section.input, v)}
                />
              )
            }
            return (
              <BoolPicker
                key={section.input}
                section={section}
                value={getBool(section.input)}
                onChange={(v) => setBool(section.input, v)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-2 font-display text-[13px] font-extrabold tracking-tight text-ink">
      {children}
    </div>
  )
}

function ColorPicker({
  section,
  palette,
  value,
  onChange,
}: {
  section: ColorSection
  palette: Map<number, PaletteEntry>
  value: number
  onChange: (v: number) => void
}) {
  const indexes = Array.from(palette.keys()).sort((a, b) => a - b)
  return (
    <div>
      <SectionLabel>{section.label}</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {indexes.map((i) => {
          const entry = palette.get(i) ?? { hex: '' }
          const selected = value === i
          const bg = entry.hex || entry.gradient
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              className={cn(
                'grid size-8 place-items-center rounded-full border-2 transition-transform',
                selected
                  ? 'border-purple-deep scale-110 shadow-[0_2px_0_var(--purple-deep)]'
                  : 'border-line-2 hover:scale-105'
              )}
              style={bg ? { background: bg } : undefined}
              title={entry.label || entry.hex || `#${i} (none)`}
              aria-label={`${section.label} ${entry.label || i}`}
              aria-pressed={selected}
            >
              {!bg ? (
                <span className="text-[14px] text-ink-3">∅</span>
              ) : entry.label ? (
                <span className="font-mono text-[9px] font-bold text-ink mix-blend-difference">
                  {entry.label}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BoolPicker({
  section,
  value,
  onChange,
}: {
  section: BoolSection
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div>
      <SectionLabel>{section.label}</SectionLabel>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-lg border-2 px-3 font-mono text-[12px] font-bold uppercase tracking-wider transition-colors',
          value
            ? 'border-correct bg-correct-soft text-correct-deep'
            : 'border-line-2 bg-paper text-ink-2 hover:bg-paper-2'
        )}
        aria-pressed={value}
      >
        <span
          className={cn(
            'inline-block size-3 rounded-full',
            value ? 'bg-correct' : 'bg-paper-2 border-2 border-line-2'
          )}
        />
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

function ShapePicker({
  section,
  value,
  onChange,
}: {
  section: ShapeSection
  value: number
  onChange: (v: number) => void
}) {
  const count = section.max + 1
  return (
    <div>
      <SectionLabel>{section.label}</SectionLabel>
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: count }, (_, i) => i).map((i) => {
          const selected = value === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              className={cn(
                'grid h-10 place-items-center rounded-lg border-2 font-mono text-[12px] font-bold transition-[transform,background,border-color]',
                selected
                  ? 'border-purple-deep bg-purple-soft text-purple-deep shadow-[0_2px_0_var(--purple-deep)]'
                  : 'border-line-2 bg-paper text-ink-2 hover:bg-paper-2'
              )}
              aria-label={`${section.label} ${i}`}
              aria-pressed={selected}
            >
              {String(i).padStart(2, '0')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
