// Official colored brand logos (SVG in /public/logos), keyed by quiz id.
const LOGO: Record<string, string> = {
  'html-basics': '/logos/html5.svg',
  'css-basics': '/logos/css3.svg',
  'javascript-essentials': '/logos/javascript.svg',
  'js-quirks': '/logos/javascript.svg',
  'in-js-we-trust': '/logos/javascript.svg',
  'typescript-essentials': '/logos/typescript.svg',
  'ts-basics': '/logos/typescript.svg',
  'react-basics': '/logos/react.svg',
  'nextjs-basics': '/logos/nextjs.svg',
  'expressjs-basics': '/logos/express.svg',
  'mongodb-basics': '/logos/mongodb.svg',
  'socketio-basics': '/logos/socketio.svg',
}

export function getQuizLogo(id: string): string | null {
  return LOGO[id] ?? null
}
