import 'server-only'
import { unified } from 'unified'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { h } from 'hastscript'
import { createHighlighter, type Highlighter } from 'shiki'
import type { Element } from 'hast'
import type { Code, RootContent } from 'mdast'

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

// Wrap shiki-highlighted code in the chunky `.cq-code` frame (styled in globals.css).
function codeFrame(node: Code, hl: Highlighter): Element {
  const lang = (node.lang ?? 'ts').toLowerCase()
  const shikiLang = KNOWN_LANGS.has(lang) ? lang : 'ts'
  const root = hl.codeToHast(node.value.replace(/\n+$/, ''), { lang: shikiLang, theme: 'github-light' })
  const pre = root.children.find((n): n is Element => n.type === 'element' && n.tagName === 'pre')
  const code = pre?.children.find((n): n is Element => n.type === 'element' && n.tagName === 'code')

  return h('div.cq-code', [
    h('div.cq-code-head', [
      h('span.cq-code-lang', [h('span', { className: ['swatch', lang] }), lang]),
      h('span.cq-code-dots', [h('span'), h('span'), h('span')]),
    ]),
    h('pre', code ? [code] : []),
  ])
}

/**
 * Render a list of mdast nodes to HTML through one unified pipeline:
 * remark-rehype (with a shiki code handler) → rehype-stringify.
 * This is the single markdown→HTML path for both question bodies and explanations.
 */
export async function renderNodes(nodes: RootContent[]): Promise<string> {
  if (nodes.length === 0) return ''
  const hl = await getHighlighter()
  const processor = unified()
    .use(remarkRehype, { handlers: { code: (_state, node: Code) => codeFrame(node, hl) } })
    .use(rehypeStringify)
  const hast = await processor.run({ type: 'root', children: nodes })
  return processor.stringify(hast).trim()
}
