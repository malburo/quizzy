---
title: React căn bản
desc: useState, useEffect, key, controlled input — viết React đúng cách.
category: code
icon: ⚛️
tint: "#b8eff5"
inkOfTint: "#006570"
level: mid
minutes: 14
section: đang học
---

## Hooks

### 1. useState với object

stem: Component re-render không?

```jsx
const [user, setUser] = useState({ name: "Bảo", age: 25 })

function handleClick() {
  user.age = 26
  setUser(user)
}
```

- A: Có — `setUser` luôn re-render
- B: Không — React check tham chiếu, cùng object thì skip
- C: Re-render vô hạn
- D: Lỗi: cannot mutate state

<details>
<summary>👉 Đáp án</summary>

**B** — React check tham chiếu, cùng reference nên skip

`setState` của React so sánh shallow (`Object.is`) giữa value mới và cũ. Mutate object rồi truyền lại chính reference đó → bằng nhau → bail out, không re-render. Cách đúng: tạo object mới `setUser({ ...user, age: 26 })`. Đây là lý do React strongly recommend immutable updates.

</details>

### 2. useEffect dependencies

stem: Code này chạy `console.log` mấy lần?

```jsx
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("effect")
  }, [])

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

- A: Mỗi lần click
- B: Một lần lúc mount, không log sau đó
- C: Vô hạn (infinite loop)
- D: Không bao giờ chạy

<details>
<summary>👉 Đáp án</summary>

**B** — Một lần lúc mount

`[]` empty deps → effect chỉ chạy lần mount (và cleanup khi unmount). Không có deps `useEffect(() => ...)` → chạy mỗi render. `[count]` → chạy khi count đổi. Lưu ý StrictMode trong dev: effect chạy 2 lần lúc mount (mount → unmount → mount lại) để tìm bug cleanup — production chỉ 1 lần.

</details>

### 3. Controlled vs uncontrolled input

stem: Input nào là controlled?

```jsx
// A
<input defaultValue="x" />

// B
<input value={state} onChange={e => setState(e.target.value)} />

// C
<input ref={ref} />

// D
<input value="x" />
```

- A: A
- B: B
- C: C
- D: Cả A và D

<details>
<summary>👉 Đáp án</summary>

**B** — `value` + `onChange` được React kiểm soát hoàn toàn

Controlled: React state là source of truth, `value` prop bind tới state, `onChange` cập nhật state. Uncontrolled: DOM tự giữ value, dùng `ref` để đọc khi cần. Trường hợp D (`value="x"` không có onChange) → React sẽ warning vì input "đóng băng" — không gõ được. `defaultValue` chỉ set initial, sau đó DOM tự quản → uncontrolled.

</details>

### 4. key prop

stem: Pattern nào KHÔNG nên dùng cho `key`?

```jsx
{items.map((item, i) => <li key={???}>{item.name}</li>)}
```

- A: `item.id` (id từ database)
- B: `i` (index)
- C: `item.uuid`
- D: `crypto.randomUUID()`

<details>
<summary>👉 Đáp án</summary>

**D** — `crypto.randomUUID()` (random mỗi render)

Random mỗi render → key luôn đổi → React unmount + remount tất cả item → mất state, lag, sai animation. Index (B) cũng có vấn đề khi list reorder/insert ở giữa, nhưng list tĩnh thì OK. Tốt nhất: id ổn định từ data (`item.id`, `item.uuid`). Quy tắc: key phải UNIQUE giữa siblings và STABLE giữa các render.

</details>

## Patterns

### 5. useContext vs prop drilling

stem: Khi nào nên dùng Context?

- A: Mọi khi cần truyền data — context luôn tốt hơn prop
- B: Khi data thay đổi rất thường xuyên — Context tốt hơn prop drilling
- C: Khi data cần chia sẻ qua nhiều cấp component, ít thay đổi (theme, locale, auth user)
- D: Không bao giờ — dùng Redux thay

<details>
<summary>👉 Đáp án</summary>

**C** — Data chia sẻ sâu, ít thay đổi

Context KHÔNG phải state manager — mỗi lần Provider value đổi, MỌI consumer re-render. Với data đổi nhiều (counter, form), prop hoặc state lib (Zustand, Redux) thì tốt hơn. Sweet spot của Context: theme, user, locale, dependency injection (router, query client). Tip: tách thành nhiều Context nhỏ thay vì một Context to để giảm re-render.

</details>

### 6. useMemo vs useCallback

stem: Khi nào cần `useMemo`?

```jsx
function List({ items, filter }) {
  const filtered = useMemo(
    () => items.filter(i => i.name.includes(filter)),
    [items, filter]
  )
  return <Rows data={filtered} />
}
```

- A: Khi tính toán đắt, hoặc khi cần stable reference truyền xuống child memo
- B: Mỗi lần có array là phải memo
- C: useMemo chỉ là syntactic sugar cho useState
- D: Không cần — React Compiler tự lo

<details>
<summary>👉 Đáp án</summary>

**A** — Tính toán đắt, hoặc cần stable ref cho child memo

`useMemo` cache value giữa các render. Hai use case chính: (1) tính toán nặng (filter array nghìn item, parse JSON lớn); (2) tạo object/array làm prop cho child đã memo — nếu không memo, ref đổi mỗi render → child re-render vô ích. Lưu ý: bản thân memo có cost. Nếu React Compiler đang bật, không nên hand-write useMemo cho perf nữa.

</details>

### 7. forwardRef

stem: Khi nào cần `forwardRef`?

```jsx
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />)
```

- A: Mọi component bắt buộc dùng forwardRef
- B: Khi muốn caller truyền `ref` xuyên qua custom component để tới DOM node bên trong
- C: Chỉ cho server component
- D: forwardRef đã bị deprecate ở React 19

<details>
<summary>👉 Đáp án</summary>

**B** — Cho phép ref đi xuyên qua wrapper xuống DOM node

Default `ref` không tự chuyển qua custom component — chỉ tới function component thì là `undefined`. `forwardRef` cho phép forward `ref` xuống element con (thường là DOM node) — cần thiết khi parent muốn focus/scroll/measure element bên trong wrapper. **React 19**: bỏ luôn forwardRef — `ref` thành prop thường, truyền thẳng được, đơn giản hơn nhiều.

</details>

## Performance & Loading

### 8. React.lazy + Suspense

stem: Mục đích chính của `React.lazy`?

```jsx
const Modal = React.lazy(() => import("./Modal"))

<Suspense fallback={<Spinner />}>
  <Modal />
</Suspense>
```

- A: Tự memoize component
- B: Code-split — Modal chỉ tải khi cần, giảm initial bundle
- C: Lazy hydration cho SSR
- D: Tự catch error

<details>
<summary>👉 Đáp án</summary>

**B** — Code-split, chỉ tải khi render lần đầu

`lazy` + dynamic `import()` → bundler tách Modal thành chunk riêng, chỉ tải khi component thực sự được render. Cặp đôi với `Suspense` để show fallback trong lúc chờ tải. Tốt cho modal, route, feature ít dùng. Lưu ý: chỉ work với default export — named export phải re-export thành default.

</details>

### 9. Render trigger nào?

stem: Cái gì KHÔNG trigger re-render?

- A: `setState` với value khác
- B: Parent re-render → child cũng re-render (mặc dù props không đổi)
- C: Context provider value đổi
- D: Mutate object trong state rồi gọi `setState(sameRef)`

<details>
<summary>👉 Đáp án</summary>

**D** — Mutate rồi setState với cùng reference

`setState` với cùng tham chiếu → React bail out. Mutate object trong state → React không phát hiện được. Đây là lý do hay nghe "đừng mutate state". Còn (B) đúng — child re-render theo parent là default; muốn skip thì wrap `memo()` và đảm bảo props không đổi.

</details>

### 10. React Server Component

stem: RSC khác Client Component thế nào?

- A: Hoàn toàn giống nhau, chỉ khác tên
- B: RSC render trên server, không có state/effect, không gửi JS xuống client
- C: RSC chỉ chạy trên Node, không hỗ trợ Deno
- D: RSC đã bị Vercel deprecate

<details>
<summary>👉 Đáp án</summary>

**B** — Render trên server, không state/effect, không ship JS

RSC chạy server-only: fetch data trực tiếp (await ngay trong component), render ra payload đặc biệt rồi stream xuống client. Không có `useState`, `useEffect`, không có event handler — vì code không ship xuống browser. Giúp giảm bundle size đáng kể. Khi nào cần interactivity → đánh dấu `'use client'` cho component đó (và toàn bộ subtree từ đó xuống).

</details>
