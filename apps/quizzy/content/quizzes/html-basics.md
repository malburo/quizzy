---
title: HTML căn bản
desc: Semantic tag, form, accessibility — mấy thứ bạn gõ mỗi ngày mà lâu lâu vẫn nhầm.
category: code
icon: HTML
iconMono: true
tint: "#ffd6a8"
inkOfTint: "#7a3000"
level: easy
minutes: 12
section: đang học
---

## Cấu trúc & Semantic

### 1. Block vs inline

stem: Phần tử nào sau đây mặc định KHÔNG phải block-level?

- A: `<div>`
- B: `<p>`
- C: `<span>`
- D: `<section>`

<details>
<summary>👉 Đáp án</summary>

**C** — `<span>`

`<span>` là inline element, nằm trong dòng text và không xuống dòng. `<div>`, `<p>`, `<section>` đều là block — chiếm hết chiều ngang và xuống dòng mới. Quy tắc đơn giản: thẻ dùng để chia khối thì block, thẻ dùng để wrap inline content thì inline.

</details>

### 2. `<section>` vs `<div>`

stem: Khi nào nên dùng `<section>` thay cho `<div>`?

- A: Khi muốn margin/padding tự động
- B: Khi block đó là một phần có heading rõ ràng trong tài liệu
- C: Khi cần background màu khác
- D: Không có khác biệt, dùng cái nào cũng được

<details>
<summary>👉 Đáp án</summary>

**B** — Khi block đó là một phần có heading rõ ràng trong tài liệu

`<section>` mang ý nghĩa semantic — "đây là một section của document, thường có heading". Nếu chỉ cần wrap để style thôi thì dùng `<div>`. Screen reader và search engine dùng semantic tag để hiểu cấu trúc nội dung, nên đừng lạm dụng `<section>` cho mọi thứ.

</details>

### 3. `<button>` vs `<a>`

stem: Khi nào dùng `<button>`, khi nào dùng `<a>`?

- A: `<button>` cho mọi click, `<a>` chỉ cho navigation
- B: `<button>` cho action (submit, toggle...), `<a>` cho navigation tới URL
- C: Hai cái thay thế cho nhau được
- D: `<a>` nhanh hơn `<button>` về performance

<details>
<summary>👉 Đáp án</summary>

**B** — `<button>` cho action, `<a>` cho navigation

Quy tắc: nếu click sẽ điều hướng (đổi URL, mở trang khác) → `<a href>`. Nếu click chỉ thực thi action trên trang (mở modal, submit form, toggle...) → `<button>`. Dùng đúng giúp middle-click mở tab mới hoạt động, screen reader đọc đúng vai trò, và SEO crawler theo được link.

</details>

## Form

### 4. Form method GET vs POST

stem: Khi nào dùng `method="GET"`, khi nào `method="POST"`?

- A: GET cho form ngắn, POST cho form dài
- B: GET cho việc đọc/tìm kiếm, POST cho việc gửi/thay đổi dữ liệu
- C: GET không có giới hạn, POST giới hạn 2KB
- D: POST mã hoá tự động, GET thì không

<details>
<summary>👉 Đáp án</summary>

**B** — GET cho đọc/tìm kiếm, POST cho gửi/thay đổi dữ liệu

GET đưa data vào URL (`?key=value`) — phù hợp khi muốn bookmark, share link, hoặc cache (ví dụ form search). POST đưa data vào body — phù hợp khi tạo/sửa/xoá dữ liệu, không nên cache, không hiện trong URL. POST cũng không bị giới hạn độ dài URL như GET.

</details>

### 5. `<input type="number">`

stem: `<input type="number">` chấp nhận giá trị gì?

```html
<input type="number" min="0" max="100" step="0.5">
```

- A: Chỉ số nguyên dương từ 0 tới 100
- B: Số bất kỳ trong khoảng 0-100, nhảy bước 0.5
- C: Bất kỳ ký tự nào, browser tự lọc lúc submit
- D: Số nguyên từ 0 tới 100, không quan tâm step

<details>
<summary>👉 Đáp án</summary>

**B** — Số bất kỳ trong khoảng 0-100, nhảy bước 0.5

`min`/`max` định khoảng, `step` định bước nhảy của arrow up/down (và validation). Nhưng coi chừng: user vẫn có thể gõ số ngoài range, validation chỉ check khi submit form hoặc gọi `checkValidity()`. Với input chuẩn cho số tiền hay phone, nhiều dev prefer `<input type="text" inputmode="numeric">` để control kỹ hơn.

</details>

## Performance & Misc

### 6. `data-*` attribute

stem: `data-*` attribute dùng để làm gì?

```html
<button data-user-id="42" data-action="delete">Xoá</button>
```

- A: Custom attribute để lưu metadata, truy cập qua `element.dataset`
- B: Tự động bind vào React state
- C: Chỉ để CSS styling
- D: Không hợp lệ HTML, browser bỏ qua

<details>
<summary>👉 Đáp án</summary>

**A** — Custom attribute để lưu metadata, truy cập qua `element.dataset`

`data-*` là cách HTML cho phép gắn dữ liệu tuỳ ý lên element mà không bị validator phàn nàn. Truy cập trong JS qua `element.dataset` (camelCase): `data-user-id` → `dataset.userId`. CSS cũng select được bằng `[data-action="delete"]`. Hữu ích khi cần gắn id, state, hay config vào DOM mà không cần biến global.

</details>

### 7. `defer` vs `async`

stem: `<script defer>` và `<script async>` khác nhau thế nào?

```html
<script src="a.js" defer></script>
<script src="b.js" async></script>
```

- A: Cả hai đều chạy ngay khi tải xong, không khác gì
- B: `defer` đợi DOM parse xong rồi chạy theo thứ tự; `async` chạy ngay khi tải xong, không theo thứ tự
- C: `defer` chỉ chạy nếu user scroll xuống; `async` chạy ngay
- D: `async` chỉ dùng cho module, `defer` cho script thường

<details>
<summary>👉 Đáp án</summary>

**B** — `defer` đợi DOM, theo thứ tự; `async` chạy khi tải xong, không thứ tự

`defer`: download song song với HTML parsing, chạy sau khi DOM parse xong, đúng thứ tự trong HTML. Tốt cho script phụ thuộc DOM. `async`: download song song, chạy ngay khi tải xong (có thể trước cả DOMContentLoaded), không quan tâm thứ tự. Tốt cho analytics, ads — script độc lập. Không có flag nào → script block parsing.

</details>

### 8. `<meta charset>` vị trí

stem: Tại sao `<meta charset="utf-8">` phải đặt sớm trong `<head>`?

- A: SEO ranking
- B: Browser cần biết charset trước khi parse các byte tiếp theo của HTML
- C: Để hiển thị favicon
- D: HTML5 yêu cầu nó là tag đầu tiên, không liên quan gì khác

<details>
<summary>👉 Đáp án</summary>

**B** — Browser cần biết charset trước khi parse các byte tiếp theo

Trước khi `<meta charset>` được parse, browser đoán encoding dựa vào first bytes — nếu sai có thể parse nhầm các ký tự non-ASCII (ví dụ tiếng Việt thành ký tự lạ). Spec yêu cầu charset phải nằm trong 1024 byte đầu của file. Trên thực tế: đặt nó là tag đầu tiên trong `<head>` cho chắc.

</details>

## Accessibility

### 9. `aria-label` vs `aria-labelledby`

stem: Hai attribute này khác nhau thế nào?

- A: `aria-label` lấy text từ chính nó; `aria-labelledby` reference id của element khác
- B: Hoàn toàn giống nhau
- C: `aria-label` cho desktop, `aria-labelledby` cho mobile
- D: `aria-labelledby` thay thế cho `<label>` HTML

<details>
<summary>👉 Đáp án</summary>

**A** — `aria-label` tự chứa text; `aria-labelledby` reference id element khác

```html
<!-- aria-label: tự chứa text -->
<button aria-label="Đóng modal">×</button>

<!-- aria-labelledby: trỏ tới element khác -->
<h2 id="modal-title">Xác nhận xoá</h2>
<div role="dialog" aria-labelledby="modal-title">...</div>
```

Dùng `aria-label` khi label không hiện trên màn hình (icon button). Dùng `aria-labelledby` khi label đã có sẵn dưới dạng heading hoặc text khác. Tránh dùng cả hai cùng lúc trên một element.

</details>

### 10. `<picture>` vs `<img srcset>`

stem: Khi nào dùng `<picture>`, khi nào dùng `<img srcset>`?

- A: `<picture>` cho responsive art direction (đổi crop), `<img srcset>` cho responsive resolution
- B: Hai cái giống nhau, `<picture>` chỉ là syntactic sugar
- C: `<picture>` không support trên Safari
- D: `<img srcset>` chỉ cho retina display

<details>
<summary>👉 Đáp án</summary>

**A** — `<picture>` cho art direction; `<img srcset>` cho resolution switching

`<img srcset>`: browser chọn file phù hợp với DPR/viewport, nội dung ảnh giống nhau. Tốt cho retina, ảnh cùng tỷ lệ. `<picture>` với `<source media="...">`: cho phép đổi hẳn ảnh khác (crop khác, format khác như WebP/AVIF fallback) tuỳ điều kiện. Tốt khi mobile cần ảnh portrait, desktop cần ảnh landscape.

</details>
