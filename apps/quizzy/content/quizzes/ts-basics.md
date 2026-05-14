---
title: TypeScript căn bản
desc: Type, interface, generic, narrowing — những thứ bạn dùng mỗi ngày.
category: code
icon: TS
iconMono: true
tint: "#dcd5ff"
inkOfTint: "#3142a8"
level: easy
minutes: 10
section: đang học
---

## Basics

### 1. Type narrowing với typeof

topic: TypeScript · Type narrowing
stem: Đoán xem code này in ra cái gì nhỉ? 🐛

Cho hàm `describe` nhận tham số có thể là **string** hoặc **string[]**.
Sau khi gọi `describe(["hello", "world"])`, output trên console sẽ là gì?

```ts
function describe(value: string | string[]): string {
  if (typeof value === "string") {
    return `single: ${value.toUpperCase()}`;
  }
  return `list of ${value.length}: ${value.join(" + ")}`;
}

console.log(describe(["hello", "world"]));
```

- A: `single: HELLO,WORLD`
- B: `list of 2: hello + world`
- C: `list of 2: HELLO + WORLD`
- D: `TypeError: value is not a string`

<details>
<summary>👉 Đáp án</summary>

**B** — `list of 2: hello + world`

✅ Đúng rồi! `typeof value === "string"` chỉ true cho chuỗi đơn — mảng đi vào nhánh dưới và trả về `list of 2: hello + world`.

❌ Chưa chuẩn rồi. `typeof value === "string"` *false* với mảng → code đi vào nhánh `return` thứ hai, dùng `.length` và `.join(" + ")`.

</details>

### 2. Array<T> vs T[]

topic: TypeScript · Arrays
stem: Hai cách viết kiểu mảng — có khác nhau không?

Trong TypeScript bạn có thể viết:

```ts
const a: number[] = [1, 2, 3];
const b: Array<number> = [1, 2, 3];
```

Câu nào sau đây mô tả đúng nhất về `number[]` và `Array<number>`?

- A: Hoàn toàn tương đương về mặt kiểu
- B: `Array<number>` cho phép kiểu hỗn hợp, `number[]` thì không
- C: `number[]` immutable, `Array<number>` mutable
- D: `Array<number>` chỉ dùng được trong generic

<details>
<summary>👉 Đáp án</summary>

**A** — Hoàn toàn tương đương về mặt kiểu

✅ Đúng. Đây là *syntactic sugar* — TypeScript treat hai cách viết hoàn toàn giống nhau. Convention chung là dùng `T[]` cho kiểu đơn giản, `Array<T>` khi `T` phức tạp (union, intersection).

❌ Hai cách viết tương đương về kiểu — cả hai đều mutable, đều không phải union, và không bị giới hạn ở generic. Quy ước style dùng `T[]` cho ngắn gọn, `Array<T>` khi `T` dài.

</details>

### 3. interface vs type alias

topic: TypeScript · Type system
stem: Khai báo trùng tên — cái nào hợp lệ? 🤔

Trong cùng một file, bạn viết:

```ts
type Animal = { name: string }
interface Animal { age: number }

const a: Animal = { name: "Mit", age: 3 }
```

Code này biên dịch thế nào?

- A: OK — TS tự merge thành `{ name: string; age: number }`
- B: `interface` ghi đè `type`, chỉ còn field `age`
- C: Lỗi — không thể merge `interface` với `type alias`
- D: Lỗi — `type` ghi đè `interface`, thiếu field `age`

<details>
<summary>👉 Đáp án</summary>

**C** — Lỗi: "Duplicate identifier 'Animal'"

✅ Đúng. `interface` hỗ trợ *declaration merging* nhưng chỉ với `interface` khác cùng tên. Khi đụng phải `type alias` cùng tên, TS báo `Duplicate identifier`.

❌ Sai rồi. `type` và `interface` không bao giờ tự merge với nhau. Chỉ có `interface` + `interface` mới merge (rất hữu ích cho mở rộng `Window`, `Express.Request`...).

</details>

### 4. as const — readonly literal

topic: TypeScript · Const assertion
stem: `as const` thực sự làm gì với type inference?

```ts
const config = {
  mode: "dark",
  size: 14,
} as const

type Mode = typeof config.mode
```

`Mode` sẽ là kiểu gì?

- A: `string`
- B: `"dark"`
- C: `"dark" | "light"`
- D: `readonly string`

<details>
<summary>👉 Đáp án</summary>

**B** — `"dark"`

✅ Đúng. `as const` làm 2 việc: (1) widen các literal value thành literal type (`"dark"` thay vì `string`), (2) đánh dấu mọi field là `readonly`. Không có `as const` thì `mode` infer thành `string`.

❌ Sai. Không có `as const`, mode sẽ là `string`. TS không tự đoán union `"dark" | "light"` — bạn phải khai báo rõ. Có `as const`, type bị **narrow** về đúng giá trị literal.

</details>

### 5. keyof + indexed access

topic: TypeScript · keyof
stem: Lấy union các value type của object — làm thế nào?

```ts
const user = { id: 1, name: "An", isAdmin: false }

type UserKey = keyof typeof user
type UserValue = (typeof user)[UserKey]
```

`UserValue` sẽ là kiểu gì?

- A: `number`
- B: `string | number | boolean`
- C: `unknown`
- D: `any`

<details>
<summary>👉 Đáp án</summary>

**B** — `string | number | boolean`

✅ Đúng. `keyof typeof user` là union `"id" | "name" | "isAdmin"`. Khi index một type bằng *union các key*, TS trả về *union các value type* tương ứng.

❌ Sai. Pattern này chính là cách TS implement `Record`, `Pick`, `Omit`. Nó không trả về `unknown`/`any` — TS biết chính xác value type của từng key vì object là literal `as const`-ish ngay từ đầu.

</details>
