---
title: In JS we trust
desc: Bộ thử thách JavaScript từ open-source repo của thầy — closure, hoisting, IIFE, event loop.
category: code
icon: 🎯
tint: "#ffe0bd"
inkOfTint: "#7a3f00"
level: hard
minutes: 15
section: khám phá
isNew: true
---

## Event loop

### 1. setTimeout vs sync code

stem: Thứ tự in ra là gì?

```js
console.log("hello")
setTimeout(() => console.log("world"), 0)
console.log("hi")
```

- A: hello → world → hi
- B: hello → hi → world
- C: hi → world → hello
- D: hi → hello → world

<details>
<summary>👉 Đáp án</summary>

**B** — `hello` → `hi` → `world`

`setTimeout(..., 0)` không chạy ngay — nó được đẩy vào **task queue** (macrotask), chờ đến khi call stack rỗng. Hai dòng `console.log` đồng bộ chạy trước theo thứ tự khai báo. Dù `delay = 0`, callback vẫn xếp hàng sau toàn bộ code đồng bộ. Đây là nền tảng của event loop trong JS.

</details>

## Hoisting & IIFE

### 2. var hoisting che mất biến global

stem: Code này in ra gì?

```js
var tip = 100

;(function () {
  console.log("I have $" + husband())

  function wife() {
    return tip * 2
  }

  function husband() {
    return wife() / 2
  }

  var tip = 10
})()
```

- A: `"I have $10"`
- B: `"I have $100"`
- C: `"I have $50"`
- D: `"I have $NaN"`

<details>
<summary>👉 Đáp án</summary>

**D** — `"I have $NaN"`

Bên trong IIFE có `var tip = 10` ở cuối — `var` được hoisted lên đầu function với giá trị `undefined`. Khi `husband()` gọi `wife()`, biến `tip` trong scope hiện tại đã tồn tại (nhưng đang `undefined`) → che mất `tip = 100` ở ngoài. `undefined * 2 = NaN`, rồi `NaN / 2 = NaN`. Nếu xoá dòng `var tip = 10` cuối, kết quả sẽ là `100`. Bài học: dùng `let`/`const` để tránh trap kiểu này.

</details>

### 3. Function declaration được hoisted hoàn toàn

stem: IIFE này in ra số bao nhiêu?

```js
(function js(x) {
  const y = (j) => j * x

  console.log(y(s()))

  function s() {
    return j()
  }

  function j() {
    return x ** x
  }
})(3)
```

- A: `undefined`
- B: 18
- C: 81
- D: 12

<details>
<summary>👉 Đáp án</summary>

**C** — `81`

IIFE tự chạy ngay khi định nghĩa, truyền `x = 3`. `function s()` và `function j()` là **function declaration** → được hoisted toàn bộ lên đầu scope, gọi trước lúc khai báo vẫn OK. Trình tự: `j()` trả `3 ** 3 = 27`, `s()` trả `j() = 27`, cuối cùng `y(27) = 27 * 3 = 81`. Nếu `j` viết dạng `const j = () => ...` (expression), bài này sẽ throw ReferenceError vì TDZ.

</details>

### 4. IIFE arithmetic sequence

stem: Sau chuỗi IIFE này, `x` bằng bao nhiêu?

```js
var x = 1

;(() => {
  x += 1
  ++x
})()
;((y) => {
  x += y
  x = x % y
})(2)
;(() => (x += x))()
;(() => (x *= x))()

console.log(x)
```

- A: 4
- B: 50
- C: 2
- D: 10

<details>
<summary>👉 Đáp án</summary>

**A** — `4`

Lần lượt qua từng IIFE:
1. `x = 1` → `x += 1` (= 2) → `++x` (= 3)
2. `x += 2` (= 5) → `x = 5 % 2` (= 1)
3. `x += x` (= 2)
4. `x *= x` (= 4)

Mỗi IIFE chạy tuần tự, không có closure trap — chỉ là phép gán liên tiếp lên biến `x` ở scope ngoài.

</details>

## Closure

### 5. Closure stateful vs gọi lại

stem: Hai cách dùng function khác nhau thế nào?

```js
function a(x) {
  x++
  return function () {
    console.log(++x)
  }
}

a(1)()
a(1)()
a(1)()

const x = a(1)
x()
x()
x()
```

- A: `1, 2, 3` và `1, 2, 3`
- B: `3, 3, 3` và `3, 4, 5`
- C: `3, 3, 3` và `1, 2, 3`
- D: `1, 2, 3` và `3, 3, 3`

<details>
<summary>👉 Đáp án</summary>

**B** — `3, 3, 3` và `3, 4, 5`

`a(x)` tăng `x` lên 1 (→ 2) rồi trả về một closure capture biến `x` đó. Mỗi lần gọi `a(1)()` là **một closure mới**: `x` reset về 2, inner function in `++x = 3`. Lặp 3 lần → `3, 3, 3`.

Khi gán `const x = a(1)`, ta giữ lại **một** closure persistent. Mỗi lần `x()` chạy, biến `x` bên trong closure vẫn sống — tăng dần qua mỗi lần gọi: `3, 4, 5`. Đây là pattern "stateful function" của closure — tương tự biến `static` trong PHP/C.

</details>

## Operators

### 6. delete trên object reference

stem: Code này in ra gì?

```js
String.prototype.lengthy = () => {
  console.log("hello")
}

let x = { name: "Vuong" }

delete x

x.name.lengthy()
```

- A: `"Vuong"`
- B: `"hello"`
- C: `undefined`
- D: ReferenceError

<details>
<summary>👉 Đáp án</summary>

**B** — `"hello"`

`delete x` **không xoá được biến** khai báo bằng `let`/`const`/`var` — `delete` chỉ xoá **property** của object (vd `delete x.name` mới hợp lệ). Câu lệnh `delete x` ở đây không làm gì cả (silent fail trong non-strict mode, throw trong strict).

Object vẫn nguyên → `x.name` là `"Vuong"` → `.lengthy()` là method được patch vào `String.prototype` → in `"hello"`.

</details>
