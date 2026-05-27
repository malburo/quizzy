---
title: Express.js căn bản
desc: Middleware, route, error handling — backend Node thân quen nhất.
category: code
icon: 🚂
tint: "#e6dccc"
inkOfTint: "#4a3b20"
level: easy
minutes: 12
section: đang học
---

## Middleware

### 1. Middleware là gì?

stem: Function nào là middleware Express hợp lệ?

- A: `function (req, res) { res.send("ok") }`
- B: `function (req, res, next) { next() }`
- C: `(req, next) => next()`
- D: `() => "ok"`

<details>
<summary>👉 Đáp án</summary>

**B** — Signature `(req, res, next)`

Middleware Express có 3 (hoặc 4) tham số. `next()` để chuyển sang middleware/handler tiếp theo. Không gọi `next` → request treo. Gọi `next(err)` → chuyển sang error middleware (4 args). Quan trọng: response chỉ gửi 1 lần — sau `res.send` rồi vẫn `next()` thì middleware sau có thể crash vì cố `res.send` lần nữa.

</details>

### 2. app.use vs app.get

stem: Khác biệt giữa hai cái?

- A: Giống hệt nhau
- B: `app.use` match mọi HTTP method và mọi path bắt đầu với prefix; `app.get` chỉ match GET với exact path
- C: `app.use` chỉ cho static
- D: `app.get` không cho middleware

<details>
<summary>👉 Đáp án</summary>

**B** — `use` là any-method + prefix; `get` là GET + exact

`app.use("/api", router)` → mount router cho mọi method, path bắt đầu bằng `/api`. `app.get("/users", handler)` → chỉ GET `/users`. Cũng có `app.all("/users", ...)` cho mọi method nhưng exact path. Thứ tự đăng ký quyết định thứ tự chạy — middleware chung đặt trước, error handler đặt cuối.

</details>

### 3. req.params vs req.query vs req.body

stem: Cho route `/users/:id` và request `GET /users/42?verbose=1`, body `{ "name": "A" }`. Thứ tự đúng?

- A: `id=42, verbose=1, name=A`
- B: `params.id=42, query.verbose="1", body.name="A"`
- C: `query.id=42, params.verbose=1, body.name="A"`
- D: Tất cả ở `req.body`

<details>
<summary>👉 Đáp án</summary>

**B** — params từ URL pattern, query từ `?`, body từ payload

`req.params`: giá trị cho placeholder `:id` trong route — luôn là string. `req.query`: parsed từ querystring `?key=value` — value là string hoặc array string. `req.body`: payload từ JSON/form — cần middleware `express.json()` hoặc `express.urlencoded()` mới có. Phân biệt rõ để validate đúng nguồn.

</details>

## Error handling

### 4. Error middleware

stem: Function nào là error handler?

```js
// A
app.use((req, res, next) => { ... })

// B
app.use((err, req, res, next) => { ... })

// C
app.use(async (req, res) => { try { ... } catch (e) { ... } })

// D
app.get("/", (req, res) => { throw new Error() })
```

- A: A
- B: B (4 args)
- C: C
- D: D

<details>
<summary>👉 Đáp án</summary>

**B** — 4-arg signature

Express phân biệt error middleware bằng số tham số = 4. Phải đặt SAU tất cả route. Trong handler khác, gọi `next(err)` để chuyển vào đây. Pattern phổ biến:

```js
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message })
})
```

</details>

### 5. Async error

stem: Code này hành xử thế nào nếu `getUser` throw?

```js
app.get("/u", async (req, res) => {
  const user = await getUser()
  res.json(user)
})
```

- A: Express tự bắt và chuyển sang error middleware
- B: Express 4: request treo (unhandled promise); Express 5: tự bắt
- C: Crash process
- D: Trả 500 tự động

<details>
<summary>👉 Đáp án</summary>

**B** — Express 4: treo; Express 5: tự bắt

Express 4 không tự bắt promise rejection trong async handler → response không bao giờ gửi, request treo (đến timeout). Fix: wrap với try/catch và `next(err)`, hoặc dùng package `express-async-errors`. Express 5 (stable 2024) đã tự handle async errors → đỡ phiền. Check version trước khi quyết.

</details>

## Patterns

### 6. Router

stem: Mục đích của `express.Router()`?

```js
const router = express.Router()
router.get("/", handler)
router.get("/:id", handler)
app.use("/api/posts", router)
```

- A: Tự sinh OpenAPI doc
- B: Group route theo prefix/feature, tách module cho code sạch
- C: Tăng tốc routing
- D: Bắt buộc với Express 5+

<details>
<summary>👉 Đáp án</summary>

**B** — Group route theo prefix/feature

`Router` là mini-app — gắn middleware, route riêng, rồi mount vào app chính với prefix. Mỗi feature một file: `routes/posts.ts`, `routes/users.ts` → app.ts gọn. Hỗ trợ nested router, middleware riêng cho subset route.

</details>

### 7. Static files

stem: Serve folder `public/` thế nào?

- A: `app.use(express.static("public"))`
- B: `app.serve("public")`
- C: `app.get("/*", () => fs.readFile(...))`
- D: Không serve được file tĩnh

<details>
<summary>👉 Đáp án</summary>

**A** — `express.static`

`express.static` (kế thừa từ serve-static) serve mọi file trong folder với matching URL. Set cache header tự động, hỗ trợ ETag, range request. Trên production thường để CDN/nginx serve static cho rẻ và nhanh hơn. Lưu ý security: đừng serve folder chứa file nhạy cảm (`.env`, `node_modules`).

</details>

### 8. Body parser

stem: Tại sao `req.body` là `undefined`?

```js
const app = express()
app.post("/", (req, res) => {
  console.log(req.body) // undefined
  res.send("ok")
})
```

- A: Express không hỗ trợ body
- B: Thiếu `app.use(express.json())` (hoặc `express.urlencoded()`)
- C: Thiếu header `Content-Type`
- D: Phải dùng `req.payload`

<details>
<summary>👉 Đáp án</summary>

**B** — Thiếu body parser middleware

Express 4.16+ built-in `express.json()` và `express.urlencoded()`. Phải đăng ký TRƯỚC route. `express.json()` chỉ parse khi `Content-Type: application/json`. Multipart form (upload file) cần thêm `multer`. Body parser cũng có option `limit` để tránh payload bom: `express.json({ limit: '10mb' })`.

</details>

### 9. CORS

stem: Browser block fetch sang domain khác — fix thế nào ở Express?

```js
fetch("http://localhost:4000/api") // từ frontend chạy ở :3000
// → CORS error
```

- A: Disable bằng cách thay browser
- B: Server thêm header `Access-Control-Allow-Origin` — Express dùng package `cors`
- C: Fetch dùng `mode: "no-cors"`
- D: Đổi cổng frontend trùng cổng backend

<details>
<summary>👉 Đáp án</summary>

**B** — Server set CORS header, dùng package `cors`

```js
import cors from "cors"
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
```

CORS là spec phía browser — quyết định ở server qua HTTP header. `app.use(cors())` mở cho mọi origin (chỉ dev). Production: whitelist origin cụ thể, set `credentials: true` nếu cần cookie. Preflight (`OPTIONS`) tự xử lý.

</details>

### 10. Helmet

stem: `app.use(helmet())` làm gì?

- A: Compress response
- B: Set một loạt HTTP security header để giảm rủi ro thường gặp (XSS, clickjacking, MIME sniff)
- C: Rate limit
- D: Authenticate request

<details>
<summary>👉 Đáp án</summary>

**B** — Set security header mặc định

Helmet set: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`... mỗi header che một class lỗ hổng. Cấu hình mặc định khá an toàn cho 80% case. Đặt sớm trong chain: `app.use(helmet())` trước route. Không thay thế audit thật, chỉ là baseline.

</details>
