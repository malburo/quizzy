import { RuntimeLoader } from '@rive-app/react-webgl2'

// Load the Rive WASM from our own origin instead of the default CDNs
// (unpkg for the primary, jsdelivr for the fallback). The files are copied into
// public/ by scripts/copy-rive-wasm.mjs before dev/build. Import this module for
// its side effect before any `useRive` runs.
RuntimeLoader.setWasmUrl('/rive.wasm')
RuntimeLoader.setWasmFallbackUrl('/rive_fallback.wasm')
