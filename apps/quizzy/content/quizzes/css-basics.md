---
title: CSS căn bản
desc: Specificity, box model, flexbox, grid — mấy thứ Google hoài mà vẫn quên.
category: code
icon: CSS
iconMono: true
tint: "#c7e0ff"
inkOfTint: "#0a3b7a"
level: easy
minutes: 13
section: đang học
---

## Specificity & Selectors

### 1. Specificity ai thắng?

stem: Cuối cùng `<p id="hi" class="big">` có màu gì?

```css
p { color: red; }
.big { color: blue; }
#hi { color: green; }
p.big { color: orange; }
```

- A: red
- B: blue
- C: green
- D: orange

<details>
<summary>👉 Đáp án</summary>

**C** — green

Specificity tính theo (inline, id, class, element): `p` = 0,0,0,1 · `.big` = 0,0,1,0 · `#hi` = 0,1,0,0 · `p.big` = 0,0,1,1. ID thắng tuyệt đối các selector chỉ có class + element. Khi cùng specificity thì rule ghi sau thắng. Trick để debug: dùng DevTools, panel "Styles" liệt kê theo thứ tự ưu tiên, cái nào bị gạch là bị override.

</details>

### 2. Pseudo-class vs pseudo-element

stem: `:hover` và `::before` khác nhau gì về syntax?

- A: Cả hai đều một dấu `:`, double `::` chỉ là tuỳ chọn
- B: `:hover` là pseudo-class (state); `::before` là pseudo-element (tạo element ảo)
- C: `::` là CSS3, `:` là CSS2 — chỉ khác version
- D: `:hover` chỉ chạy trên link, `::before` chạy mọi element

<details>
<summary>👉 Đáp án</summary>

**B** — `:hover` là pseudo-class, `::before` là pseudo-element

Pseudo-class (`:hover`, `:focus`, `:nth-child`) match state hoặc vị trí của element thật. Pseudo-element (`::before`, `::after`, `::placeholder`) tạo ra một element ảo trong DOM. CSS3 đổi syntax sang `::` cho pseudo-element để phân biệt rõ — nhưng vẫn accept `:before` cho backwards compat. Best practice: dùng `::` cho pseudo-element.

</details>

## Box Model & Layout

### 3. `box-sizing: border-box`

stem: Với `width: 200px; padding: 20px; border: 2px`, element rộng bao nhiêu pixel?

```css
.a { box-sizing: content-box; width: 200px; padding: 20px; border: 2px solid; }
.b { box-sizing: border-box;  width: 200px; padding: 20px; border: 2px solid; }
```

- A: `.a` = 244px, `.b` = 200px
- B: `.a` = 200px, `.b` = 244px
- C: Cả hai đều 200px
- D: Cả hai đều 244px

<details>
<summary>👉 Đáp án</summary>

**A** — `.a` = 244px, `.b` = 200px

`content-box` (default): `width` là kích thước CONTENT, padding + border cộng thêm vào. `border-box`: `width` là kích thước TỔNG (gồm padding + border), content tự co lại. Hầu hết dự án modern đều set `*, *::before, *::after { box-sizing: border-box; }` ở reset — nghĩ thẳng theo kích thước tổng dễ hơn nhiều.

</details>

### 4. Position: relative vs absolute vs fixed vs sticky

stem: Element nào sẽ chạy theo scroll của trang?

- A: `relative` — vẫn chạy theo flow
- B: `absolute` — bị tách khỏi flow nhưng vẫn theo viewport
- C: `fixed` — luôn ở cùng vị trí trên viewport, kể cả scroll
- D: `sticky` — chạy theo flow, đến ngưỡng thì dính

<details>
<summary>👉 Đáp án</summary>

**A** — `relative` chạy theo flow document

Tóm tắt nhanh: `static` (default) — theo flow, không offset. `relative` — theo flow nhưng offset được bằng `top/left`. `absolute` — tách khỏi flow, anchor vào ancestor gần nhất có `position != static`. `fixed` — tách khỏi flow, anchor vào viewport (không chạy theo scroll). `sticky` — theo flow tới khi đụng ngưỡng (`top: 0`), từ đó dính lại.

</details>

## Flexbox & Grid

### 5. Flexbox `justify-content` vs `align-items`

stem: Với `flex-direction: row`, hai property này control trục nào?

```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
```

- A: `justify-content` căn dọc, `align-items` căn ngang
- B: `justify-content` căn theo main axis (ngang ở row), `align-items` căn theo cross axis (dọc)
- C: Hai cái giống nhau, dùng cái nào cũng được
- D: `justify-content` chỉ cho grid, `align-items` cho flex

<details>
<summary>👉 Đáp án</summary>

**B** — `justify-content` theo main axis, `align-items` theo cross axis

Flex luôn có main axis + cross axis. Với `row`: main = ngang, cross = dọc → `justify-content` căn ngang, `align-items` căn dọc. Đảo lại với `column`: main = dọc, cross = ngang. Mẹo nhớ: "justify đi theo direction". Nếu cần căn cả con riêng lẻ, dùng `align-self` trên child.

</details>

### 6. Grid `auto-fit` vs `auto-fill`

stem: Hai cái này khác nhau gì khi container thừa chỗ?

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

- A: Giống hệt nhau
- B: `auto-fit` cho item giãn lấp đầy container; `auto-fill` giữ slot trống
- C: `auto-fill` cho item giãn; `auto-fit` giữ slot trống
- D: Chỉ `auto-fit` hỗ trợ `1fr`

<details>
<summary>👉 Đáp án</summary>

**B** — `auto-fit` giãn item lấp đầy; `auto-fill` giữ slot trống

Cùng một số item, container rộng: `auto-fill` tạo các "slot rỗng" để giữ chỗ → item không giãn quá. `auto-fit` collapse các slot rỗng → item có thể giãn ra full width. Trên thực tế: muốn item luôn lấp đầy chiều ngang → `auto-fit`. Muốn giữ kích thước cố định, để khoảng trống → `auto-fill`.

</details>

## Stacking & Variables

### 7. `z-index` chỉ chạy khi nào?

stem: Code này thì element B có thực sự nằm trên A không?

```css
.a { z-index: 999; }
.b { z-index: 1; position: relative; }
```

- A: Có, B trên A vì B có position
- B: A trên B vì z-index cao hơn
- C: A không có position nên `z-index` bị ignore, B trên A
- D: Cả hai đều ignore vì thiếu `position: absolute`

<details>
<summary>👉 Đáp án</summary>

**C** — A không có position nên `z-index` bị ignore, B trên A

`z-index` chỉ hoạt động trên element có `position != static`, hoặc trên flex/grid child. Nếu thiếu `position`, browser ignore. Cũng cần biết về *stacking context* — `transform`, `opacity < 1`, `filter`... đều tạo stacking context mới, làm `z-index` từ ngoài không "xuyên" vào trong được. Hay gặp nhất là modal có `transform` ở ancestor → tabs bên ngoài đè modal.

</details>

### 8. CSS variables vs SCSS variables

stem: `--brand` và `$brand` khác nhau thế nào?

```css
:root { --brand: blue; }
```
```scss
$brand: blue;
```

- A: Giống hệt, chỉ khác syntax
- B: SCSS var resolve lúc compile (static); CSS var resolve lúc render (dynamic, đổi theo media/class được)
- C: CSS var nhanh hơn vì native
- D: SCSS var thay đổi runtime được

<details>
<summary>👉 Đáp án</summary>

**B** — SCSS resolve lúc compile; CSS resolve lúc runtime

SCSS `$brand` bị replace thành `blue` ngay khi compile → CSS output không còn dấu `$`. CSS `--brand` thì giữ lại ở runtime → có thể thay đổi bằng JS, media query, dark mode class (`[data-theme="dark"] { --brand: red; }`). Vì vậy theme toggle, dark mode, dynamic color đều phải dùng CSS variables, không phải SCSS.

</details>

## Misc

### 9. `:hover` trên touch

stem: Tại sao `:hover` đôi khi "dính" trên mobile?

```css
.btn:hover { background: red; }
```

- A: Browser bug
- B: Sau khi tap, một số mobile browser giữ `:hover` state cho đến khi tap chỗ khác
- C: `:hover` không chạy được trên touch
- D: Phải dùng `:active` cho mobile

<details>
<summary>👉 Đáp án</summary>

**B** — Một số mobile browser giữ `:hover` sau khi tap

Trên touch device không có khái niệm "hover" thật, browser fake bằng cách trigger `:hover` lúc tap rồi giữ đến khi tap chỗ khác → state dính kẹt khó chịu. Workaround: gói style hover trong `@media (hover: hover)` — chỉ apply trên thiết bị có hover thật (mouse, trackpad).

```css
@media (hover: hover) {
  .btn:hover { background: red; }
}
```

</details>

### 10. `margin: 0 auto`

stem: Khi nào `margin: 0 auto` căn giữa element?

- A: Luôn căn giữa được mọi element
- B: Chỉ khi element là block-level và có `width` (hoặc `max-width`) nhỏ hơn parent
- C: Chỉ khi parent là flexbox
- D: Chỉ trong table layout

<details>
<summary>👉 Đáp án</summary>

**B** — Element phải là block-level và có width nhỏ hơn parent

`auto` margin chỉ chia phần thừa của parent cho hai bên trái-phải. Nếu element là inline → không có width khái niệm này. Nếu element width = 100% parent → không còn phần thừa để chia → không căn được. Trên flex/grid container thì căn giữa dễ hơn bằng `justify-content: center` hoặc `place-items: center`.

</details>
