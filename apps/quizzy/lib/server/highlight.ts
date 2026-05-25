import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light'],
      langs: ['ts', 'tsx', 'js', 'jsx'],
    })
  }
  return highlighterPromise
}

const KNOWN_LANGS = new Set(['ts', 'tsx', 'js', 'jsx'])

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInline(text: string): string {
  const segments: string[] = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push(escapeHtml(text.slice(last, m.index)))
    const tok = m[0]
    if (tok.startsWith('`')) {
      segments.push(`<code>${escapeHtml(tok.slice(1, -1))}</code>`)
    } else if (tok.startsWith('**')) {
      segments.push(`<strong>${escapeHtml(tok.slice(2, -2))}</strong>`)
    } else if (tok.startsWith('*')) {
      segments.push(`<em>${escapeHtml(tok.slice(1, -1))}</em>`)
    }
    last = m.index + tok.length
  }
  if (last < text.length) segments.push(escapeHtml(text.slice(last)))
  return segments.join('')
}

export async function renderQuestionBody(markdown: string): Promise<string> {
  'use cache'
  const hl = await getHighlighter()
  const lines = markdown.split('\n')
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const fence = lines[i].match(/^```(\w+)?\s*$/)
    if (fence) {
      const lang = (fence[1] || 'ts').toLowerCase()
      const buf: string[] = []
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      i++ // skip closing fence
      const code = buf.join('\n')
      const shikiLang = KNOWN_LANGS.has(lang) ? lang : 'ts'
      const codeHtml = hl.codeToHtml(code, { lang: shikiLang, theme: 'github-light' })
      // strip shiki's outer <pre><code>…</code></pre> wrapper, we provide our own frame
      const innerMatch = codeHtml.match(/<pre[^>]*><code[^>]*>([\s\S]*)<\/code><\/pre>/)
      const inner = innerMatch ? innerMatch[1] : codeHtml
      out.push(
        `<div class="cq-code">` +
          `<div class="cq-code-head">` +
            `<span class="cq-code-lang"><span class="swatch ${escapeHtml(lang)}"></span>${escapeHtml(lang)}</span>` +
            `<span class="cq-code-dots"><span></span><span></span><span></span></span>` +
          `</div>` +
          `<pre><code>${inner}</code></pre>` +
        `</div>`
      )
    } else if (lines[i].trim() === '') {
      i++
    } else {
      const buf: string[] = [lines[i]]
      i++
      while (i < lines.length && lines[i].trim() !== '' && !/^```/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      out.push(`<p>${renderInline(buf.join(' '))}</p>`)
    }
  }
  return out.join('')
}
