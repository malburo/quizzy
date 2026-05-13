---
title: TypeScript căn bản
desc: Type, interface, generic, narrowing — những thứ bạn dùng mỗi ngày.
category: code
icon: TS
iconMono: true
tint: "#dcd5ff"
inkOfTint: "#3142a8"
level: easy
minutes: 15
progress: 0.62
section: đang học
---

## Basics

### 1. Khai báo biến với let

### 2. const vs let — khác gì?

### 3. Kiểu nguyên thủy: string

### 4. Kiểu number và NaN

### 5. boolean — true/false

### 6. any vs unknown

### 7. Type narrowing với typeof

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

Gợi ý: chú ý đến **type guard** `typeof` — nó giúp TS thu hẹp kiểu trong nhánh nào? 🤔

- [ ] A: `single: HELLO,WORLD`
- [x] B: `list of 2: hello + world`
- [ ] C: `list of 2: HELLO + WORLD`
- [ ] D: `TypeError: value is not a string`

correct: Đúng rồi! `typeof value === "string"` chỉ true cho chuỗi đơn — mảng đi vào nhánh dưới và trả về `list of 2: hello + world`.
wrong: Chưa chuẩn rồi. `typeof value === "string"` *false* với mảng → code đi vào nhánh `return` thứ hai, dùng `.length` và `.join(" + ")`.

### 8. never — khi nào dùng?

## Functions

### 9. Khai báo function với return type

### 10. Tham số optional với ?

### 11. Default parameters

### 12. Rest parameters: ...args

### 13. Function overloading

### 14. Arrow function vs function

### 15. void return type

### 16. Function type signatures

## Objects & Interfaces

### 17. interface User { ... }

### 18. type alias vs interface

### 19. readonly properties

### 20. Optional properties với ?

### 21. Index signatures

### 22. Extending interface

### 23. Intersection types: A & B

### 24. Nested objects

### 25. Object destructuring với types

## Arrays & Tuples

### 26. Array<T> vs T[]

topic: TypeScript · Arrays
stem: Hai cách viết kiểu mảng — có khác nhau không?

Trong TypeScript bạn có thể viết:

```ts
const a: number[] = [1, 2, 3];
const b: Array<number> = [1, 2, 3];
```

Câu nào sau đây mô tả đúng nhất về `number[]` và `Array<number>`?

- [x] A: Hoàn toàn tương đương về mặt kiểu
- [ ] B: `Array<number>` cho phép kiểu hỗn hợp, `number[]` thì không
- [ ] C: `number[]` immutable, `Array<number>` mutable
- [ ] D: `Array<number>` chỉ dùng được trong generic

correct: Đúng. Đây là *syntactic sugar* — TypeScript treat hai cách viết hoàn toàn giống nhau. Convention chung là dùng `T[]` cho kiểu đơn giản, `Array<T>` khi `T` phức tạp (union, intersection).
wrong: Hai cách viết tương đương về kiểu — cả hai đều mutable, đều không phải union, và không bị giới hạn ở generic. Quy ước style dùng `T[]` cho ngắn gọn, `Array<T>` khi `T` dài.

### 27. Tuple [string, number]

### 28. Readonly arrays

### 29. Array.map kiểu trả về

### 30. Array.filter type predicate

### 31. Spread vs rest trong tuple

### 32. Mảng đa kiểu: (string|number)[]

## Generics

### 33. function identity<T>(x: T)

### 34. Generic constraint với extends

### 35. Generic interface Box<T>

### 36. keyof và T[K]

### 37. Partial<T>

### 38. Pick<T, K>

### 39. Omit<T, K>

### 40. Record<K, V>

## Advanced

### 41. Union types: A | B

### 42. Literal types: "on" | "off"

### 43. Discriminated unions

### 44. as const — readonly literal

### 45. Conditional types: T extends U ?

### 46. Mapped types

## React & DOM

### 47. React props với TypeScript

### 48. useState<T>() generic

### 49. Event handler types

### 50. tsconfig strict mode
