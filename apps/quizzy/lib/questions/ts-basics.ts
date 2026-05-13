import type { Question, QuizSet } from '@/lib/types'

const QUESTIONS: Question[] = [
  // 1–8 Basics
  { id: 1, title: 'Khai báo biến với let', section: 'Basics' },
  { id: 2, title: 'const vs let — khác gì?', section: 'Basics' },
  { id: 3, title: 'Kiểu nguyên thủy: string', section: 'Basics' },
  { id: 4, title: 'Kiểu number và NaN', section: 'Basics' },
  { id: 5, title: 'boolean — true/false', section: 'Basics' },
  { id: 6, title: 'any vs unknown', section: 'Basics' },
  {
    id: 7,
    title: 'Type narrowing với typeof',
    section: 'Basics',
    topic: 'TypeScript · Type narrowing',
    stem: 'Đoán xem code này in ra cái gì nhỉ? 🐛',
    body: `Cho hàm \`describe\` nhận tham số có thể là **string** hoặc **string[]**.
Sau khi gọi \`describe(["hello", "world"])\`, output trên console sẽ là gì?

\`\`\`ts
function describe(value: string | string[]): string {
  if (typeof value === "string") {
    return \`single: \${value.toUpperCase()}\`;
  }
  return \`list of \${value.length}: \${value.join(" + ")}\`;
}

console.log(describe(["hello", "world"]));
\`\`\`

Gợi ý: chú ý đến **type guard** \`typeof\` — nó giúp TS thu hẹp kiểu trong nhánh nào? 🤔`,
    choices: [
      { key: 'A', text: 'single: HELLO,WORLD', code: true },
      { key: 'B', text: 'list of 2: hello + world', code: true, correct: true },
      { key: 'C', text: 'list of 2: HELLO + WORLD', code: true },
      { key: 'D', text: 'TypeError: value is not a string', code: true },
    ],
    explanation: {
      correct:
        'Đúng rồi! `typeof value === "string"` chỉ true cho chuỗi đơn — mảng đi vào nhánh dưới và trả về `list of 2: hello + world`.',
      wrong:
        'Chưa chuẩn rồi. `typeof value === "string"` *false* với mảng → code đi vào nhánh `return` thứ hai, dùng `.length` và `.join(" + ")`.',
    },
  },
  { id: 8, title: 'never — khi nào dùng?', section: 'Basics' },
  // 9–16 Functions
  { id: 9, title: 'Khai báo function với return type', section: 'Functions' },
  { id: 10, title: 'Tham số optional với ?', section: 'Functions' },
  { id: 11, title: 'Default parameters', section: 'Functions' },
  { id: 12, title: 'Rest parameters: ...args', section: 'Functions' },
  { id: 13, title: 'Function overloading', section: 'Functions' },
  { id: 14, title: 'Arrow function vs function', section: 'Functions' },
  { id: 15, title: 'void return type', section: 'Functions' },
  { id: 16, title: 'Function type signatures', section: 'Functions' },
  // 17–25 Objects & Interfaces
  { id: 17, title: 'interface User { ... }', section: 'Objects & Interfaces' },
  { id: 18, title: 'type alias vs interface', section: 'Objects & Interfaces' },
  { id: 19, title: 'readonly properties', section: 'Objects & Interfaces' },
  { id: 20, title: 'Optional properties với ?', section: 'Objects & Interfaces' },
  { id: 21, title: 'Index signatures', section: 'Objects & Interfaces' },
  { id: 22, title: 'Extending interface', section: 'Objects & Interfaces' },
  { id: 23, title: 'Intersection types: A & B', section: 'Objects & Interfaces' },
  { id: 24, title: 'Nested objects', section: 'Objects & Interfaces' },
  { id: 25, title: 'Object destructuring với types', section: 'Objects & Interfaces' },
  // 26–32 Arrays & Tuples — Q26 is seeded full
  {
    id: 26,
    title: 'Array<T> vs T[]',
    section: 'Arrays & Tuples',
    topic: 'TypeScript · Arrays',
    stem: 'Hai cách viết kiểu mảng — có khác nhau không?',
    body: `Trong TypeScript bạn có thể viết:

\`\`\`ts
const a: number[] = [1, 2, 3];
const b: Array<number> = [1, 2, 3];
\`\`\`

Câu nào sau đây mô tả đúng nhất về \`number[]\` và \`Array<number>\`?`,
    choices: [
      { key: 'A', text: 'Hoàn toàn tương đương về mặt kiểu', correct: true },
      { key: 'B', text: '`Array<number>` cho phép kiểu hỗn hợp, `number[]` thì không' },
      { key: 'C', text: '`number[]` immutable, `Array<number>` mutable' },
      { key: 'D', text: '`Array<number>` chỉ dùng được trong generic' },
    ],
    explanation: {
      correct:
        'Đúng. Đây là *syntactic sugar* — TypeScript treat hai cách viết hoàn toàn giống nhau. Convention chung là dùng `T[]` cho kiểu đơn giản, `Array<T>` khi `T` phức tạp (union, intersection).',
      wrong:
        'Hai cách viết tương đương về kiểu — cả hai đều mutable, đều không phải union, và không bị giới hạn ở generic. Quy ước style dùng `T[]` cho ngắn gọn, `Array<T>` khi `T` dài.',
    },
  },
  { id: 27, title: 'Tuple [string, number]', section: 'Arrays & Tuples' },
  { id: 28, title: 'Readonly arrays', section: 'Arrays & Tuples' },
  { id: 29, title: 'Array.map kiểu trả về', section: 'Arrays & Tuples' },
  { id: 30, title: 'Array.filter type predicate', section: 'Arrays & Tuples' },
  { id: 31, title: 'Spread vs rest trong tuple', section: 'Arrays & Tuples' },
  { id: 32, title: 'Mảng đa kiểu: (string|number)[]', section: 'Arrays & Tuples' },
  // 33–40 Generics
  { id: 33, title: 'function identity<T>(x: T)', section: 'Generics' },
  { id: 34, title: 'Generic constraint với extends', section: 'Generics' },
  { id: 35, title: 'Generic interface Box<T>', section: 'Generics' },
  { id: 36, title: 'keyof và T[K]', section: 'Generics' },
  { id: 37, title: 'Partial<T>', section: 'Generics' },
  { id: 38, title: 'Pick<T, K>', section: 'Generics' },
  { id: 39, title: 'Omit<T, K>', section: 'Generics' },
  { id: 40, title: 'Record<K, V>', section: 'Generics' },
  // 41–46 Advanced
  { id: 41, title: 'Union types: A | B', section: 'Advanced' },
  { id: 42, title: 'Literal types: "on" | "off"', section: 'Advanced' },
  { id: 43, title: 'Discriminated unions', section: 'Advanced' },
  { id: 44, title: 'as const — readonly literal', section: 'Advanced' },
  { id: 45, title: 'Conditional types: T extends U ? ', section: 'Advanced' },
  { id: 46, title: 'Mapped types', section: 'Advanced' },
  // 47–50 React & DOM
  { id: 47, title: 'React props với TypeScript', section: 'React & DOM' },
  { id: 48, title: 'useState<T>() generic', section: 'React & DOM' },
  { id: 49, title: 'Event handler types', section: 'React & DOM' },
  { id: 50, title: 'tsconfig strict mode', section: 'React & DOM' },
]

export const tsBasics: QuizSet = {
  id: 'ts-basics',
  category: 'code',
  title: 'TypeScript căn bản',
  desc: 'Type, interface, generic, narrowing — những thứ bạn dùng mỗi ngày.',
  icon: 'TS',
  iconMono: true,
  tint: '#dcd5ff',
  inkOfTint: '#3142a8',
  level: 'easy',
  questions: QUESTIONS,
  minutes: 15,
  progress: 0.62,
  section: 'đang học',
}

/** Initial sidebar statuses, hard-coded to show three sidebar states for the demo. */
export const TS_BASICS_INITIAL_STATUS: Record<number, 'correct' | 'wrong'> = {
  1: 'correct',
  2: 'correct',
  3: 'correct',
  4: 'correct',
  5: 'correct',
  6: 'wrong',
}

/** Question id that the quiz page opens on by default. */
export const TS_BASICS_INITIAL_ID = 7
