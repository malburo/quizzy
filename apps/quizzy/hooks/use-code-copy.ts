'use client'

import { useEffect } from 'react'

/**
 * Delegated copy-to-clipboard for server-rendered `.cq-code` blocks. Attaches one
 * document-level listener for clicks on the `[data-cq-copy]` button injected by the
 * markdown pipeline, copies the sibling <pre> text, and flips a `data-copied` flag
 * for the check-mark state (styled in globals.css). Call once on a page with code.
 */
export function useCodeCopy() {
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const btn = target?.closest<HTMLElement>('[data-cq-copy]')
      if (!btn) return
      const code = btn.closest('.cq-code')?.querySelector('pre')?.textContent
      if (!code) return
      try {
        await navigator.clipboard.writeText(code)
        btn.setAttribute('data-copied', '')
        window.setTimeout(() => btn.removeAttribute('data-copied'), 1500)
      } catch {
        // clipboard unavailable — silently ignore
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
