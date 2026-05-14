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

topic: JavaScript · typeof
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

✅ Đúng. `typeof null === "object"` là bug từ JS engine đầu tiên (1995) — sửa thì sẽ phá web hiện có nên giữ luôn. `NaN` ironically thuộc kiểu `number` (chính nó là viết tắt của *Not a Number*).

❌ Sai rồi. Để check `null` dùng `value === null` chứ đừng tin `typeof`. Để check `NaN` dùng `Number.isNaN(value)` — *KHÔNG* dùng `value === NaN` (xem câu 2).

</details>

### 2. NaN equality

topic: JavaScript · NaN
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

✅ Đúng. Theo IEEE 754, `NaN` không bằng bất cứ gì kể cả chính nó → `===` luôn cho `false`. Nhưng `Array.prototype.includes` dùng thuật toán *SameValueZero* coi `NaN` bằng `NaN`. Tương tự `Object.is(NaN, NaN) === true`.

❌ Chưa chuẩn. Cách check chuẩn: `Number.isNaN(x)` (không phải `isNaN(x)` global — cái đó coerce trước nên `isNaN("abc") === true` 😱).

</details>

## Scope & Hoisting

### 3. Hoisting + TDZ

topic: JavaScript · Hoisting
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

✅ Đúng. `var` được hoist *kèm khởi tạo* `undefined` nên đọc được trước khai báo. `let`/`const` cũng hoist nhưng nằm trong **Temporal Dead Zone** — đụng vào trước dòng khai báo là ReferenceError. Đây là lý do nên luôn dùng `let`/`const` thay vì `var`.

❌ Sai. Câu A bỏ qua TDZ của `let`. Câu B nhầm rằng hoisting nâng luôn cả giá trị (không, chỉ nâng *khai báo*). Câu D nhầm `var` cũng có TDZ — không, chỉ `let`/`const` mới có.

</details>

### 4. this trong arrow vs method

topic: JavaScript · this
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

✅ Đúng. Method thường (`regular()`) lấy `this` = object đứng trước dấu `.` → `obj`. Arrow function **không có `this` riêng** — nó kế thừa `this` từ scope bao quanh lúc *định nghĩa*. Ở đây scope ngoài là module → `this === undefined` ở strict mode → `this.name` cũng undefined (không error vì optional-chain ngầm... thực ra là đọc property của `undefined`).

❌ Suýt đúng. Đáp án D thì có khi gặp `TypeError: Cannot read properties of undefined`. Phụ thuộc môi trường: ở module scope strict, `this` là `undefined` và đọc `.name` THỰC SỰ ném TypeError. Ở browser script tag thường, `this === window`, code in `""` (window.name mặc định). Nhưng kết quả phổ biến nhất khi chạy module: `undefined`.

</details>

## Async

### 5. Microtask vs macrotask

topic: JavaScript · Event loop
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

✅ Đúng. Event loop chạy theo thứ tự:
1. **Sync code** chạy hết trước → `A`, `D`
2. **Microtask queue** drain hết (Promise.then, queueMicrotask) → `C`
3. **Macrotask queue** mới đến lượt (setTimeout, setInterval, I/O) → `B`

Microtask LUÔN ưu tiên hơn macrotask, dù `setTimeout` có delay = 0.

❌ Chưa nắm event loop. Lưu ý: `setTimeout(fn, 0)` **không** chạy đồng bộ — nó luôn vào macrotask queue, đợi sync + tất cả microtask xong mới được gọi. Đây là lý do tại sao `await` trong async function (vốn là microtask) thường "nhanh hơn" `setTimeout`.

</details>
