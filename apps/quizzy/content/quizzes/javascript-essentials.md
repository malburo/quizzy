---
title: JavaScript thiết yếu
desc: let/const, spread, destructuring, async/await — kit căn bản phải nắm.
category: code
icon: 📜
tint: "#fff8c2"
inkOfTint: "#5a4400"
level: easy
minutes: 13
section: đang học
---

## Biến & Scope

### 1. let vs const vs var

stem: Đoạn nào báo lỗi?

```js
if (true) {
  var a = 1
  let b = 2
  const c = 3
}
console.log(a)
console.log(b)
console.log(c)
```

- A: Cả 3 đều in được
- B: Chỉ `a` in được, `b` và `c` ReferenceError
- C: Chỉ `b` ReferenceError, còn lại OK
- D: SyntaxError, không chạy nổi

<details>
<summary>👉 Đáp án</summary>

**B** — Chỉ `a` in được, `b` và `c` ReferenceError

`var` có function scope (hoặc global) — không bị ràng buộc bởi block `if`. `let`/`const` có block scope — chỉ tồn tại trong `{}` gần nhất. Modern code gần như luôn dùng `const` (default), `let` khi cần reassign, và tránh hẳn `var`.

</details>

### 2. const với object — vẫn mutate được?

stem: Code này chạy được không?

```js
const user = { name: "Bảo" }
user.name = "An"
user.age = 25
console.log(user)
```

- A: TypeError vì gán lại property của const
- B: `{ name: "An", age: 25 }` — chạy bình thường
- C: `{ name: "Bảo" }` — gán bị ignore
- D: SyntaxError

<details>
<summary>👉 Đáp án</summary>

**B** — `{ name: "An", age: 25 }`

`const` chỉ ngăn không cho REASSIGN biến (không thể `user = ...`), nhưng object bên trong vẫn mutate được. Muốn freeze hẳn → `Object.freeze(user)` (shallow). Muốn deep immutable → cấu trúc immutable hoặc dùng library như Immer. Đây là bug hay gặp khi mới học: nghĩ `const` = immutable, hoá ra không phải.

</details>

## Operators

### 3. Spread operator

stem: Kết quả của `merged` là gì?

```js
const a = { x: 1, y: 2 }
const b = { y: 99, z: 3 }
const merged = { ...a, ...b }
console.log(merged)
```

- A: `{ x: 1, y: 2, z: 3 }`
- B: `{ x: 1, y: 99, z: 3 }`
- C: `{ x: 1, y: [2, 99], z: 3 }`
- D: TypeError: cannot spread duplicate key

<details>
<summary>👉 Đáp án</summary>

**B** — `{ x: 1, y: 99, z: 3 }`

Spread copy property theo thứ tự — key trùng sau sẽ ghi đè key trước. Spread là *shallow copy*: nested object vẫn share reference. Pattern hay dùng: `{ ...defaults, ...userConfig }` — userConfig override defaults. Lưu ý: với array dùng `[...a, ...b]` để nối, không phải `[a, b]` (cái này thành nested array).

</details>

### 4. Optional chaining + nullish coalescing

stem: `name` cuối cùng là gì?

```js
const user = { profile: null }
const name = user?.profile?.name ?? "Khách"
console.log(name)
```

- A: `null`
- B: `undefined`
- C: `"Khách"`
- D: TypeError: Cannot read 'name' of null

<details>
<summary>👉 Đáp án</summary>

**C** — `"Khách"`

`?.` dừng chuỗi và trả về `undefined` nếu giá trị trước là `null` hoặc `undefined` → tránh TypeError. `??` chỉ fallback khi giá trị bên trái là `null` hoặc `undefined` (KHÔNG fallback với `0`, `""`, `false` như `||` truyền thống). Combo này thay được rất nhiều check thủ công cồng kềnh.

</details>

## Array

### 5. map vs forEach

stem: Khác biệt chính giữa hai cái này?

```js
[1, 2, 3].forEach(x => x * 2)
[1, 2, 3].map(x => x * 2)
```

- A: Hoàn toàn giống nhau
- B: `forEach` trả về array mới, `map` trả về undefined
- C: `map` trả về array mới với kết quả; `forEach` trả về undefined (chỉ side-effect)
- D: `forEach` chạy song song, `map` chạy tuần tự

<details>
<summary>👉 Đáp án</summary>

**C** — `map` trả về array mới; `forEach` trả về undefined

Dùng `map` khi cần transform → array mới. Dùng `forEach` khi chỉ cần side-effect (gọi function với mỗi item). Anti-pattern hay gặp: dùng `forEach` rồi `push` vào array bên ngoài — chỗ này `map` (hoặc `filter`/`reduce`) sẽ rõ ý hơn nhiều.

</details>

### 6. Array vs Set

stem: Khi nào nên dùng `Set` thay cho array?

- A: Không bao giờ — `Set` chậm hơn
- B: Khi cần lookup nhanh O(1) hoặc đảm bảo unique
- C: Khi muốn sort
- D: Khi cần spread

<details>
<summary>👉 Đáp án</summary>

**B** — Khi cần lookup nhanh O(1) hoặc unique

`Array.includes()` là O(n). `Set.has()` là O(1) — với dataset lớn nhanh hơn đáng kể. `Set` cũng auto-dedupe khi add → trick remove duplicate phổ biến: `[...new Set(arr)]`. Trade-off: `Set` không có index, không sort, không có hầu hết method của array → cần thì convert qua lại bằng spread.

</details>

## Async

### 7. async/await error handling

stem: Cách bắt lỗi đúng nhất với `await`?

```js
async function loadUser() {
  const res = await fetch("/api/user")
  const data = await res.json()
  return data
}
```

- A: `loadUser().catch(...)` ở chỗ gọi, hoặc `try/catch` trong function
- B: Không cần — async tự bắt lỗi
- C: Phải dùng callback `(err, data) => ...`
- D: Wrap trong `Promise.all`

<details>
<summary>👉 Đáp án</summary>

**A** — `try/catch` trong function, hoặc `.catch()` ở caller

`async` function luôn trả về Promise — lỗi `throw` hoặc `reject` bên trong sẽ thành Promise rejection. Bắt được bằng `try/catch` quanh `await`, hoặc `.catch()` ở chỗ gọi. Unhandled rejection sẽ log ra console (Node 15+ thì crash process). Tip: với async hay gọi từ event handler, bắt buộc phải `.catch()` để không leak lỗi.

</details>

### 8. Promise.all vs Promise.race

stem: Hai cái này dừng khi nào?

```js
Promise.all([p1, p2, p3])
Promise.race([p1, p2, p3])
```

- A: `all` đợi tất cả resolve; `race` resolve khi cái đầu tiên xong (resolve hoặc reject)
- B: Cả hai đợi tất cả
- C: `race` đợi tất cả, `all` chỉ đợi cái đầu
- D: Hai cái giống nhau

<details>
<summary>👉 Đáp án</summary>

**A** — `all` đợi tất cả; `race` resolve khi cái đầu tiên settle

`Promise.all`: trả về array kết quả khi TẤT CẢ resolve. Nếu MỘT cái reject → reject ngay, các cái khác vẫn chạy ngầm. `Promise.race`: settle với promise đầu tiên (kể cả reject). Còn có `Promise.allSettled` (đợi tất cả, không reject sớm) và `Promise.any` (resolve với cái đầu tiên thành công, ignore lỗi).

</details>

## Misc

### 9. JSON.parse / stringify

stem: Code này log ra gì?

```js
const obj = { date: new Date(), fn: () => 1, name: "a" }
const json = JSON.stringify(obj)
console.log(json)
```

- A: `{"date":"2026-...","fn":"() => 1","name":"a"}`
- B: `{"date":"2026-...","name":"a"}` — fn bị bỏ
- C: TypeError: cannot stringify function
- D: `{"date":{},"fn":{},"name":"a"}`

<details>
<summary>👉 Đáp án</summary>

**B** — `{"date":"2026-...","name":"a"}`

`JSON.stringify` bỏ qua: function, `undefined`, Symbol. Date thì gọi `.toISOString()` → string. Tương tự `Map`/`Set` cũng thành `{}`. Khi `parse` lại, Date sẽ là string chứ không tự thành Date object — phải tự revive: `JSON.parse(json, (k, v) => k === "date" ? new Date(v) : v)`.

</details>

### 10. Closure căn bản

stem: `counter()` lần thứ 3 gọi trả về gì?

```js
function makeCounter() {
  let count = 0
  return function () {
    count++
    return count
  }
}
const counter = makeCounter()
counter()
counter()
console.log(counter())
```

- A: `0`
- B: `1`
- C: `3`
- D: `undefined` — `count` đã out of scope

<details>
<summary>👉 Đáp án</summary>

**C** — `3`

Inner function "đóng" (close over) biến `count` của outer function — `count` không bị garbage collect dù `makeCounter` đã chạy xong. Mỗi lần gọi `counter()` truy cập đúng `count` đó và tăng lên. Closure là cách JS "lưu state riêng" cho function — nền tảng của module pattern, currying, hook (React).

</details>
