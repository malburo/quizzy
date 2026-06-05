// Browser-only Web Audio engine. Lazily creates an AudioContext (autoplay policy
// requires a user gesture), decodes each WAV once into a buffer, and plays via a
// fresh BufferSource so clips overlap cleanly on rapid taps. Every failure path is
// caught → silent no-op; this never throws into the UI.

export type SoundName = 'pick' | 'correct' | 'wrong' | 'complete' | 'incomplete'

const FILES: Record<SoundName, string> = {
  pick: '/sounds/pick.wav',
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
  complete: '/sounds/complete.wav',
  incomplete: '/sounds/incomplete.wav',
}

// Per-sound playback gain (1 = file level). `pick` is mixed quietest.
const VOLUME: Partial<Record<SoundName, number>> = {
  pick: 0.4,
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
const buffers = new Map<SoundName, AudioBuffer>()
let loadPromise: Promise<void> | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  try {
    ctx = new Ctor()
    master = ctx.createGain()
    master.connect(ctx.destination)
  } catch {
    ctx = null
    master = null
  }
  return ctx
}

/** Fetch + decode all buffers once. Idempotent; safe to call repeatedly. */
export function loadSounds(): Promise<void> {
  if (loadPromise) return loadPromise
  const context = getContext()
  if (!context) return Promise.resolve()
  loadPromise = (async () => {
    await Promise.all(
      (Object.keys(FILES) as SoundName[]).map(async (name) => {
        try {
          const res = await fetch(FILES[name])
          const arr = await res.arrayBuffer()
          buffers.set(name, await context.decodeAudioData(arr))
        } catch {
          // Leave this sound undecoded — it just won't play.
        }
      })
    )
  })()
  return loadPromise
}

function playBuffer(context: AudioContext, name: SoundName): void {
  const buf = buffers.get(name)
  if (!buf || !master) return
  try {
    const src = context.createBufferSource()
    src.buffer = buf
    const vol = VOLUME[name]
    if (vol != null) {
      const g = context.createGain()
      g.gain.value = vol
      src.connect(g).connect(master)
    } else {
      src.connect(master)
    }
    src.start(0)
  } catch {
    // ignore
  }
}

/** Play a sound. Lazily inits the context + decode on first call. No-op on failure. */
export function playSound(name: SoundName): void {
  const context = getContext()
  if (!context) return
  if (context.state === 'suspended') void context.resume()
  if (buffers.has(name)) {
    playBuffer(context, name)
    return
  }
  void loadSounds().then(() => playBuffer(context, name))
}
