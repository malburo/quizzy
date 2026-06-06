import 'server-only'
import { unified } from 'unified'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { h, s } from 'hastscript'
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

// Copy button (Next.js-docs style). Clicks are handled by the useCodeCopy hook's
// delegated listener, which reads the sibling <pre> text.
function copyButton(): Element {
  return h('button.cq-code-copy', { type: 'button', 'data-cq-copy': '', 'aria-label': 'Sao chép code', title: 'Sao chép' }, [
    s('svg', { className: ['cq-copy-i'], viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      s('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2 }),
      s('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
    ]),
    s('svg', { className: ['cq-check-i'], viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      s('path', { d: 'M20 6 9 17l-5-5' }),
    ]),
  ])
}

// Wrap shiki-highlighted code in the `.cq-code` frame (Next.js-docs style: file-type
// badge + copy button header, light body). Styled in globals.css.
function codeFrame(node: Code, hl: Highlighter): Element {
  const lang = (node.lang ?? 'ts').toLowerCase()
  const shikiLang = KNOWN_LANGS.has(lang) ? lang : 'ts'
  const root = hl.codeToHast(node.value.replace(/\n+$/, ''), { lang: shikiLang, theme: 'github-light' })
  const pre = root.children.find((n): n is Element => n.type === 'element' && n.tagName === 'pre')
  const code = pre?.children.find((n): n is Element => n.type === 'element' && n.tagName === 'code')

  return h('div.cq-code', [
    h('div.cq-code-head', [
      h('span', { className: ['cq-code-badge', lang] }, lang.toUpperCase()),
      copyButton(),
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
