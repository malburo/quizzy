---
title: TypeScript thiết yếu
desc: Utility type, generic, conditional, infer — qua khỏi basics rồi.
category: code
icon: 🔷
tint: "#c5d9ff"
inkOfTint: "#1a3e80"
level: mid
minutes: 14
section: đang học
---

## Type system

### 1. unknown vs any vs never

stem: Cái nào đại diện cho "không bao giờ xảy ra"?

```ts
function fail(): ??? {
  throw new Error("nope")
}
```

- A: `any`
- B: `void`
- C: `never`
- D: `unknown`

<details>
<summary>👉 Đáp án</summary>

**C** — `never`

`never`: function không bao giờ return bình thường (throw, infinite loop). Khác `void` (return nhưng không có value). `any`: bỏ check kiểu — dùng được như mọi thứ, nguy hiểm. `unknown`: cũng "không biết" nhưng SAFE — phải narrow (typeof, instanceof, type guard) trước khi xài. Best practice: thay thế `any` bằng `unknown` mọi khi có thể.

</details>

### 2. Utility types — Partial / Required / Readonly

stem: `Partial<User>` làm gì?

```ts
type User = { id: number; name: string; email: string }
type DraftUser = Partial<User>
```

- A: Bỏ tất cả field, chỉ giữ id
- B: Biến tất cả field thành optional (`?`)
- C: Biến tất cả field thành readonly
- D: Lấy union các key thành string literal

<details>
<summary>👉 Đáp án</summary>

**B** — Biến tất cả field thành optional

`Partial<T>`: `{ id?: number; name?: string; email?: string }` — tốt cho update payload. `Required<T>`: ngược lại, ép tất cả thành required. `Readonly<T>`: thêm `readonly` trước mỗi field. Trio này là utility cơ bản phải nắm — TS source code chính thức implement chúng bằng mapped types.

</details>

### 3. Pick vs Omit

stem: Khi nào dùng `Pick`, khi nào dùng `Omit`?

```ts
type User = { id: number; name: string; password: string; email: string }
type PublicUser = Pick<User, "id" | "name" | "email">
type SafeUser   = Omit<User, "password">
```

- A: `Pick` và `Omit` giống nhau, syntactic sugar
- B: `Pick` chọn field giữ lại; `Omit` chọn field bỏ đi
- C: `Omit` chỉ bỏ được 1 field
- D: `Pick` chỉ dùng được với generic

<details>
<summary>👉 Đáp án</summary>

**B** — `Pick` chọn giữ lại; `Omit` chọn bỏ đi

Trong ví dụ trên `PublicUser` và `SafeUser` về kiểu là tương đương. Quy tắc chọn: nếu giữ ít field → `Pick`. Nếu bỏ ít field → `Omit`. Rõ ý nhất với người đọc.

</details>

## Generic

### 4. Generic function

stem: Lỗi gì với code này?

```ts
function first<T>(arr: T[]): T {
  return arr[0]
}

const x = first<number>(["a", "b"])
```

- A: Không lỗi, `x: number`
- B: Lỗi: Type 'string' is not assignable to parameter of type 'number[]'
- C: Lỗi runtime
- D: Lỗi: T must extend any

<details>
<summary>👉 Đáp án</summary>

**B** — Type 'string' is not assignable to parameter of type 'number[]'

Khi explicit `<number>`, TS ép `T = number` → `arr` phải là `number[]`. Đưa `["a", "b"]` (string[]) vào → mismatch. Trên thực tế, nên để TS infer: `first(["a", "b"])` → `T = string` tự động. Chỉ explicit khi infer không ra ý mình muốn.

</details>

### 5. Conditional type

stem: `Result` là kiểu gì?

```ts
type IsString<T> = T extends string ? "yes" : "no"
type Result = IsString<"hello">
```

- A: `string`
- B: `boolean`
- C: `"yes"`
- D: `"yes" | "no"`

<details>
<summary>👉 Đáp án</summary>

**C** — `"yes"`

Conditional type `T extends U ? X : Y` — nếu `T` assignable to `U` thì lấy `X`, không thì `Y`. `"hello"` extends `string` → `"yes"`. Khi `T` là union (vd `string | number`), conditional sẽ *distribute* qua từng member → `"yes" | "no"`. Cách tắt distributive: wrap trong tuple `[T] extends [U]`.

</details>

### 6. infer keyword

stem: `Ret` là kiểu gì?

```ts
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never
type Ret = ReturnTypeOf<() => string[]>
```

- A: `never`
- B: `Function`
- C: `string[]`
- D: `() => string[]`

<details>
<summary>👉 Đáp án</summary>

**C** — `string[]`

`infer R` trong nhánh extends ép TS "đoán" type ở vị trí đó và gán vào biến `R`. Tương đương built-in `ReturnType<T>` của TS. `infer` cực mạnh — đa số utility nâng cao (Parameters, Awaited, ConstructorParameters) đều dùng nó. Cách nhớ: "infer = capture this type into a name".

</details>

## Patterns

### 7. Discriminated union

stem: Sau nhánh `if`, TS biết shape gì?

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }

function area(s: Shape) {
  if (s.kind === "circle") {
    return Math.PI * s.??? ** 2
  }
}
```

Thay `???` bằng gì TS không báo lỗi?

- A: `size`
- B: `radius`
- C: `kind`
- D: Bất kỳ field nào

<details>
<summary>👉 Đáp án</summary>

**B** — `radius`

Discriminated union dùng một field "kind" (tag) để phân biệt các variant. Khi check `s.kind === "circle"`, TS biết chắc `s` là variant đầu tiên → narrow xuống `{ kind: "circle"; radius: number }`. Truy cập `s.size` ngay đó sẽ báo lỗi. Pattern này rất hữu ích cho state machine, redux action, async result.

</details>

### 8. satisfies operator

stem: Khi nào dùng `satisfies` thay vì type annotation?

```ts
const config = {
  mode: "dark",
  size: 14,
} satisfies Config
```

- A: Giống hệt `as Config`
- B: Giống hệt `: Config`
- C: Check shape khớp với `Config` nhưng GIỮ LẠI literal type của value
- D: Chỉ là syntactic sugar, không khác gì

<details>
<summary>👉 Đáp án</summary>

**C** — Check shape khớp với Config nhưng giữ literal type của value

Với `: Config` → `mode: string`, mất literal `"dark"`. Với `as Config` → unsafe cast, không thực sự check. Với `satisfies Config` → vừa check khớp `Config`, vừa giữ `mode: "dark"` và `size: 14` chính xác. Mới có từ TS 4.9 — best of both worlds.

</details>

### 9. Mapped types

stem: `Nullable` biến shape thành gì?

```ts
type Nullable<T> = { [K in keyof T]: T[K] | null }
type X = Nullable<{ a: string; b: number }>
```

- A: `{ a: string; b: number }`
- B: `{ a: string | null; b: number | null }`
- C: `string | number | null`
- D: `Record<string, null>`

<details>
<summary>👉 Đáp án</summary>

**B** — `{ a: string | null; b: number | null }`

Mapped type duyệt qua từng key của `T` và transform value. Đây chính là cách `Partial`, `Required`, `Readonly`, `Pick`, `Record` được implement. Có thể thêm modifier: `readonly` (thêm), `-readonly` (bỏ), `?` (thêm optional), `-?` (bỏ optional). Có thể rename key bằng `as` clause (TS 4.1+).

</details>

### 10. type vs interface về performance

stem: Khi nào nên prefer `interface` thay vì `type`?

- A: Không bao giờ — `type` mạnh hơn
- B: Khi định nghĩa object shape, đặc biệt cho public API — `interface` cho error tốt hơn và compile nhanh hơn ở project lớn
- C: Khi cần union — `interface` mới hỗ trợ union
- D: Hai cái hoàn toàn thay thế cho nhau

<details>
<summary>👉 Đáp án</summary>

**B** — Object shape / public API thì prefer `interface`

`interface` lazy hơn lúc compile → project lớn có thể nhanh hơn 1-2s. Error message của `interface` cũng ngắn gọn hơn. Nhưng `type` mạnh hơn về biểu đạt: union, intersection, conditional, mapped, template literal. Quy tắc thực dụng: dùng `interface` cho shape của object public; dùng `type` khi cần compose/transform type. Đừng trộn — chọn convention rồi giữ.

</details>
