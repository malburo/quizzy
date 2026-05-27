---
title: Next.js căn bản
desc: App Router, Server Component, metadata, streaming — Next.js modern flow.
category: code
icon: ▲
iconMono: true
tint: "#e0e0e0"
inkOfTint: "#1a1a1a"
level: mid
minutes: 14
section: đang học
---

## Routing

### 1. App Router vs Pages Router

stem: App Router (Next 13+) khác Pages Router thế nào?

- A: Giống hệt, chỉ đổi thư mục
- B: App Router default là Server Component, hỗ trợ layout lồng, streaming, file-based metadata
- C: App Router không hỗ trợ API routes
- D: Pages Router không hỗ trợ TypeScript

<details>
<summary>👉 Đáp án</summary>

**B** — App Router: RSC default, nested layouts, streaming, file metadata

App Router (folder `app/`) là kiến trúc mới: mỗi route là folder, `page.tsx` là UI, `layout.tsx` wrap subtree, `loading.tsx` cho Suspense, `error.tsx` cho error boundary, `metadata` thay cho `next/head`. RSC default — chỉ component đánh dấu `'use client'` mới chạy ở browser. Pages Router vẫn được hỗ trợ song song nhưng project mới nên dùng App Router.

</details>

### 2. Dynamic route

stem: `app/blog/[slug]/page.tsx` so với `app/blog/[...slug]/page.tsx`?

- A: Hai cái giống nhau
- B: `[slug]` match một segment; `[...slug]` match nhiều segment (catch-all)
- C: `[...slug]` chỉ chạy được trên Pages Router
- D: `[slug]` chỉ accept số

<details>
<summary>👉 Đáp án</summary>

**B** — `[slug]` một segment; `[...slug]` catch-all nhiều segment

`[slug]` → `/blog/hello` match, `slug = "hello"`. `[...slug]` → match `/blog/a/b/c`, `slug = ["a", "b", "c"]`. `[[...slug]]` → optional catch-all, kể cả `/blog` (không có segment) cũng match. Hữu ích cho docs với cấu trúc folder không xác định trước.

</details>

### 3. generateStaticParams

stem: Function này dùng để làm gì?

```ts
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}
```

- A: Gọi API lúc runtime cho mỗi request
- B: Tạo trước (prerender) các route động lúc build — tương đương `getStaticPaths` của Pages Router
- C: Validate params lúc nhận request
- D: Tạo sitemap

<details>
<summary>👉 Đáp án</summary>

**B** — Prerender các route động lúc build

`generateStaticParams` chạy lúc build, trả về list params → Next prerender các page tương ứng thành static HTML. Path không có trong list (mà route đó là dynamic) sẽ render on-demand lần đầu rồi cache (ISR). Tăng tốc và giảm load server cho content ít thay đổi (blog post, product page).

</details>

## Data & Cache

### 4. Server Action

stem: `'use server'` làm gì?

```ts
'use server'

export async function createPost(formData: FormData) {
  // ...
}
```

- A: Đánh dấu component là server-only
- B: Đánh dấu function là server action — gọi được từ client như RPC, chạy trên server
- C: Tương đương `getServerSideProps`
- D: Bắt buộc cho mọi file trong `app/`

<details>
<summary>👉 Đáp án</summary>

**B** — Server action, gọi từ client như RPC

Function có `'use server'` (top of file hoặc top of function) thành "server action" — Next sinh ra endpoint tự động, client gọi nó như function bình thường nhưng thực thi trên server. Dùng cho form submit, mutation, không cần tự viết API route. Khác `'use client'` (đánh dấu COMPONENT chạy client) — đừng nhầm.

</details>

### 5. metadata API

stem: Cách thêm title cho trang trong App Router?

```ts
// app/about/page.tsx
???
```

- A: `import Head from 'next/head'; <Head><title>...</title></Head>`
- B: `export const metadata = { title: 'About' }`
- C: `<title>About</title>` trong JSX
- D: Edit `_document.tsx`

<details>
<summary>👉 Đáp án</summary>

**B** — `export const metadata = { title: 'About' }`

App Router dùng metadata API: export `metadata` (static) hoặc `generateMetadata` async (dynamic, dùng `params`). Next tự sinh `<head>` thẻ tương ứng — không dùng `next/head` nữa. Hỗ trợ OpenGraph, Twitter, robots, icons, alternate... Layout merge metadata với page (page override layout).

</details>

### 6. loading.tsx và Suspense

stem: `app/blog/loading.tsx` chạy khi nào?

- A: Mỗi lần user navigate vào `/blog/*`
- B: Khi page hoặc nested layout đang đợi async (data fetch) lúc render server
- C: Khi client component fetch dữ liệu
- D: Khi build fail

<details>
<summary>👉 Đáp án</summary>

**B** — Khi page/layout đang đợi async server-side

`loading.tsx` tự động được wrap quanh page/layout cùng level bằng `<Suspense fallback={<Loading />}>`. Trong lúc page async (await getData) đang chạy trên server, Next stream ngay layout + loading fallback xuống client, rồi stream tiếp content thật khi xong. Cảm giác navigate "instant" dù data chưa có.

</details>

### 7. fetch caching

stem: `fetch()` trong RSC default cache như thế nào ở Next 15+?

```ts
const res = await fetch('https://api.example.com/data')
```

- A: Force cache vĩnh viễn
- B: Không cache (default đã đổi từ Next 15)
- C: Cache 60 giây
- D: Chỉ cache trong dev

<details>
<summary>👉 Đáp án</summary>

**B** — Default không cache (Next 15+)

Trước (Next 13/14): fetch trong RSC default `force-cache`. Next 15 đổi default sang `no-store` — quyết định cache là explicit. Muốn cache → `fetch(url, { cache: 'force-cache' })` hoặc dùng directive `'use cache'` cho hàm/component. ISR với revalidate → `fetch(url, { next: { revalidate: 60 } })`.

</details>

## Misc

### 8. Streaming

stem: Streaming trong App Router là gì?

- A: Stream video
- B: Server gửi HTML từng phần ngay khi sẵn sàng thay vì đợi toàn bộ
- C: Tải JS lazy
- D: Tương đương WebSocket

<details>
<summary>👉 Đáp án</summary>

**B** — Server gửi HTML từng phần, sẵn sàng tới đâu gửi tới đó

Trang chứa nhiều phần độc lập (hero, sidebar, comments...). Thay vì đợi tất cả data xong rồi render → wrap phần chậm trong `<Suspense fallback={...}>`. Next gửi shell xuống ngay, fallback hiển thị tạm, content thật stream xuống khi xong. User thấy nội dung sớm hơn, FCP và TTI tốt hơn.

</details>

### 9. Image optimization

stem: Tại sao nên dùng `next/image` thay vì `<img>`?

```tsx
import Image from 'next/image'
<Image src="/photo.jpg" width={400} height={300} alt="" />
```

- A: Image thấp dpr hơn
- B: Tự lazy load, auto sinh nhiều size, format hiện đại (WebP/AVIF), cache CDN, layout shift = 0
- C: Bắt buộc dùng vì spec
- D: Chỉ khác về styling

<details>
<summary>👉 Đáp án</summary>

**B** — Optimization tự động: format, size, lazy, no CLS

`next/image` xử lý: chọn format theo browser (AVIF/WebP fallback JPEG), sinh nhiều size (srcset), lazy load (loading="lazy" default), reserve aspect-ratio để chống layout shift, cache ở Vercel/CDN. Bắt buộc khai báo `width`/`height` (hoặc `fill`) để chống CLS. External domain phải khai báo trong `next.config.ts`.

</details>

### 10. typedRoutes

stem: `experimental.typedRoutes: true` làm gì?

```ts
<Link href="/blogss" /> // có lỗi không?
```

- A: Tăng tốc routing
- B: Khi bật, Next sinh ra type cho mọi route có sẵn — `Link.href` sai sẽ lỗi TS lúc compile
- C: Tự generate sitemap
- D: Cho phép route động không khai báo

<details>
<summary>👉 Đáp án</summary>

**B** — Type-safe route ở compile time

Bật `typedRoutes` → Next scan các page và sinh union type cho `Route`. `Link href` chỉ accept route hợp lệ — `"/blogss"` sẽ TS error nếu route đó không tồn tại. Hỗ trợ cả dynamic route với params. Hữu ích cho project lớn, refactor đỡ sợ gãy link. Cần `as Route` cast khi href là string từ data.

</details>
