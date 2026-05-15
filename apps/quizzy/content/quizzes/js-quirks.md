---
title: JavaScript kỳ quặc
desc: this, hoisting, closure, == vs === — những đoạn code khiến bạn bối rối.
category: code
icon: JS
iconMono: true
tint: "#fff1c2"
inkOfTint: "#7d5c00"
level: easy
minutes: 12
section: đang học
---

## Coercion

### 1. typeof null

stem: Code này in ra cái gì? Cẩn thận có cái bẫy lịch sử nhé 🪤

```js
console.log(typeof null)
console.log(typeof undefined)
console.log(typeof NaN)
```

- A: `"null"`, `"undefined"`, `"number"`
- B: `"object"`, `"undefined"`, `"number"`
- C: `"object"`, `"undefined"`, `"NaN"`
- D: `"null"`, `"undefined"`, `"NaN"`

<details>
<summary>👉 Đáp án</summary>

**B** — `"object"`, `"undefined"`, `"number"`

`typeof null === "object"` là bug từ JS engine đầu tiên (1995) — sửa thì sẽ phá web hiện có nên giữ luôn. `NaN` ironically thuộc kiểu `number` (chính nó là viết tắt của *Not a Number*). Check `null` thì dùng `value === null`, check `NaN` thì dùng `Number.isNaN(value)`.

</details>

### 2. NaN equality

stem: NaN có bằng chính nó không?

```js
console.log(NaN === NaN)
console.log(NaN === Number.NaN)
console.log([NaN].includes(NaN))
```

- A: `true`, `true`, `true`
- B: `false`, `false`, `true`
- C: `false`, `false`, `false`
- D: `true`, `true`, `false`

<details>
<summary>👉 Đáp án</summary>

**B** — `false`, `false`, `true`

Theo IEEE 754, `NaN` không bằng bất cứ gì kể cả chính nó → `===` luôn cho `false`. Nhưng `Array.prototype.includes` dùng thuật toán *SameValueZero* coi `NaN` bằng `NaN` — tương tự `Object.is(NaN, NaN) === true`. Cách check chuẩn: `Number.isNaN(x)`, không phải `isNaN(x)` global (cái đó coerce trước nên `isNaN("abc") === true` 😱).

</details>

## Scope & Hoisting

### 3. Hoisting + TDZ

stem: var và let hoist khác nhau như thế nào?

```js
console.log(a)
console.log(b)
var a = 1
let b = 2
```

Code in ra gì?

- A: `undefined`, `2`
- B: `1`, `2`
- C: `undefined` rồi ReferenceError ở dòng `console.log(b)`
- D: ReferenceError ngay dòng `console.log(a)`

<details>
<summary>👉 Đáp án</summary>

**C** — `undefined` rồi `ReferenceError: Cannot access 'b' before initialization`

`var` được hoist *kèm khởi tạo* `undefined` nên đọc được trước khai báo. `let`/`const` cũng hoist nhưng nằm trong **Temporal Dead Zone** — đụng vào trước dòng khai báo là ReferenceError. Đây là lý do nên luôn dùng `let`/`const` thay vì `var`.

</details>

### 4. this trong arrow vs method

stem: Arrow function bind `this` khác hẳn method thường

```js
const obj = {
  name: "Debby",
  regular() { return this.name },
  arrow: () => this.name,
}

console.log(obj.regular())
console.log(obj.arrow())
```

(Chạy ở module scope của browser/Node modern)

- A: `"Debby"`, `"Debby"`
- B: `"Debby"`, `undefined`
- C: `undefined`, `"Debby"`
- D: TypeError ở `obj.arrow()`

<details>
<summary>👉 Đáp án</summary>

**B** — `"Debby"`, `undefined`

Method thường (`regular()`) lấy `this` = object đứng trước dấu `.` → `obj`. Arrow function **không có `this` riêng** — nó kế thừa `this` từ scope bao quanh lúc *định nghĩa*. Ở module scope strict, `this === undefined` → `this.name` cũng undefined. Trên browser script tag thường thì `this === window`, kết quả có thể khác.

</details>

## Async

### 5. Microtask vs macrotask

stem: setTimeout(0) có thực sự "chạy ngay" không?

```js
console.log("A")
setTimeout(() => console.log("B"), 0)
Promise.resolve().then(() => console.log("C"))
console.log("D")
```

Thứ tự in ra là gì?

- A: `A B C D`
- B: `A D B C`
- C: `A D C B`
- D: `A C D B`

<details>
<summary>👉 Đáp án</summary>

**C** — `A`, `D`, `C`, `B`

Event loop chạy theo thứ tự: (1) **sync code** hết trước → `A`, `D`; (2) **microtask queue** drain (Promise.then, queueMicrotask) → `C`; (3) **macrotask queue** mới đến lượt (setTimeout, setInterval, I/O) → `B`. Microtask LUÔN ưu tiên hơn macrotask, dù `setTimeout` có delay = 0. Đây là lý do `await` trong async function (vốn là microtask) thường "nhanh hơn" `setTimeout`.

</details>
