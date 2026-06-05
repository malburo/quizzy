// Reproducible SFX generator — pure Node, no deps, no external downloads.
// Run: node scripts/generate-sounds.mjs   (from apps/quizzy)
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SR = 44100
const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public/sounds')

const sine = (f, t) => Math.sin(2 * Math.PI * f * t)
const expEnv = (t, tau) => Math.exp(-t / tau)

/** Render `dur` seconds from fn(t) → sample, with 5ms anti-click fades at both ends. */
function render(dur, fn) {
  const n = Math.floor(SR * dur)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = Math.max(-1, Math.min(1, fn(i / SR)))
  const fade = Math.floor(SR * 0.005)
  for (let i = 0; i < fade && i < n; i++) {
    const g = i / fade
    out[i] *= g
    out[n - 1 - i] *= g
  }
  return out
}

/** Float32 [-1,1] → 16-bit mono PCM WAV Buffer. */
function toWav(samples) {
  const n = samples.length
  const buf = Buffer.alloc(44 + n * 2)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + n * 2, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20) // PCM
  buf.writeUInt16LE(1, 22) // mono
  buf.writeUInt32LE(SR, 24)
  buf.writeUInt32LE(SR * 2, 28)
  buf.writeUInt16LE(2, 32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(n * 2, 40)
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2)
  }
  return buf
}

const sounds = {
  // Soft, quiet "pop" on select — short sine dropping in pitch.
  pick: render(0.09, (t) => {
    const f = 660 - (120 * t) / 0.09
    return 0.45 * sine(f, t) * expEnv(t, 0.03)
  }),
  // Warm bell "ding" on correct — fundamental + fifth + octave partials.
  correct: render(0.45, (t) => {
    const env = expEnv(t, 0.16)
    return env * (0.5 * sine(880, t) + 0.28 * sine(1320, t) + 0.14 * sine(1760, t))
  }),
  // Gentle low "thunk" on wrong — slightly detuned low tone, quick decay. Not harsh.
  wrong: render(0.3, (t) => {
    const f = 200 - 60 * (t / 0.3)
    return 0.55 * (0.7 * sine(f, t) + 0.3 * sine(f * 1.01, t)) * expEnv(t, 0.1)
  }),
  // Celebratory ascending major arpeggio C5-E5-G5-C6.
  complete: (() => {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    const step = 0.1
    const dur = step * notes.length + 0.35
    return render(dur, (t) => {
      let s = 0
      for (let i = 0; i < notes.length; i++) {
        const start = i * step
        if (t >= start) {
          const lt = t - start
          s += (0.38 * sine(notes[i], lt) + 0.16 * sine(2 * notes[i], lt)) * expEnv(lt, 0.18)
        }
      }
      return s
    })
  })(),
  // Soft, encouraging two-note descent (A4 → F#4).
  incomplete: render(0.5, (t) => {
    const down = t >= 0.18
    const f = down ? 370 : 440
    const lt = down ? t - 0.18 : t
    return 0.45 * (sine(f, lt) + 0.2 * sine(2 * f, lt)) * expEnv(lt, 0.22)
  }),
}

mkdirSync(OUT_DIR, { recursive: true })
for (const [name, samples] of Object.entries(sounds)) {
  writeFileSync(resolve(OUT_DIR, `${name}.wav`), toWav(samples))
  console.log('wrote', `${name}.wav`)
}
