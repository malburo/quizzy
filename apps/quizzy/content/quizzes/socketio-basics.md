---
title: Socket.IO căn bản
desc: Realtime với WebSocket, room, namespace, ACK — chat, game, live update.
category: code
icon: 🔌
tint: "#e0d4f0"
inkOfTint: "#4a1a7a"
level: mid
minutes: 13
section: đang học
---

## Foundation

### 1. WebSocket vs Socket.IO

stem: Khác biệt chính giữa hai cái?

- A: Giống hệt
- B: Socket.IO là wrapper trên WebSocket, thêm room/namespace/auto-reconnect/fallback/ACK
- C: WebSocket nhanh hơn 10 lần
- D: Socket.IO không dùng được trên browser

<details>
<summary>👉 Đáp án</summary>

**B** — Socket.IO build trên WebSocket, thêm tính năng

WebSocket là protocol thô — chỉ có `send`, `onmessage`. Socket.IO trên đó thêm: room (broadcast subset), namespace (multiplexing), auto-reconnect, message ACK, fallback sang HTTP long-polling khi WebSocket bị firewall block, binary support, event-based API. Đánh đổi: payload format riêng → server và client phải đều dùng Socket.IO.

</details>

### 2. emit vs broadcast

stem: Lệnh này gửi tới ai?

```js
io.on("connection", (socket) => {
  socket.broadcast.emit("hello")
})
```

- A: Tất cả client kể cả socket vừa connect
- B: Tất cả client TRỪ socket vừa connect
- C: Chỉ socket vừa connect
- D: Không ai nhận

<details>
<summary>👉 Đáp án</summary>

**B** — Tất cả client TRỪ socket gửi

`socket.broadcast.emit("ev")` → tất cả socket khác. `socket.emit("ev")` → chỉ socket đó (server gửi xuống chính client này). `io.emit("ev")` → tất cả socket bao gồm sender. `socket.to(room).emit(...)` → room cụ thể trừ sender. `io.to(room).emit(...)` → room cụ thể bao gồm sender.

</details>

## Rooms & Namespaces

### 3. Room

stem: Room dùng để làm gì?

- A: Một WebSocket connection riêng
- B: Group ảo các socket lại để broadcast subset — vd chat room, game table
- C: Không gian lưu trữ
- D: Authentication boundary

<details>
<summary>👉 Đáp án</summary>

**B** — Group ảo các socket để broadcast subset

Room là string identifier — socket join/leave room: `socket.join("room1")`, `socket.leave("room1")`. Một socket có thể ở nhiều room. Server gửi tới room: `io.to("room1").emit("ev", data)`. Mỗi socket mặc định đã ở room riêng = `socket.id` → cách gửi private message: `io.to(targetSocketId).emit(...)`.

</details>

### 4. Namespace

stem: Namespace khác Room thế nào?

```js
const adminNs = io.of("/admin")
adminNs.on("connection", socket => { ... })
```

- A: Giống Room nhưng tên dài hơn
- B: Namespace là channel tách biệt với event/middleware riêng (URL path); Room là group bên trong namespace
- C: Namespace là alias cho database connection
- D: Một namespace = một WebSocket connection

<details>
<summary>👉 Đáp án</summary>

**B** — Namespace = channel tách biệt; Room = group trong namespace

Namespace tách logic giữa các feature trên CÙNG một connection (chỉ 1 WebSocket thật). Client kết nối với path: `io("/admin")`. Mỗi namespace có handler/middleware riêng. Room nằm bên trong namespace — `io.of("/chat").to("room1").emit(...)`. Default namespace là `/`.

</details>

## Messaging

### 5. ACK callback

stem: `cb` ở đây làm gì?

```js
// client
socket.emit("ping", { msg: "hi" }, (response) => {
  console.log(response)
})

// server
socket.on("ping", (data, cb) => {
  cb({ ok: true })
})
```

- A: Lỗi cú pháp
- B: Acknowledgment — server gửi response back, client nhận qua callback
- C: Lưu vào local
- D: Retry tự động

<details>
<summary>👉 Đáp án</summary>

**B** — ACK callback, request-response trên Socket.IO

Tham số cuối của `emit` mà là function → ACK callback. Bên kia nhận event sẽ có thêm `cb` để gọi → callback gốc bên gửi nhận response. Pattern này giúp request-response style (giống HTTP) trên socket. Có timeout: `.timeout(5000).emit(...)` để fail nếu không ACK trong 5s.

</details>

### 6. Lifecycle event

stem: Event nào sau đây KHÔNG phải lifecycle event mặc định của socket?

- A: `connection`
- B: `disconnect`
- C: `message`
- D: `connect_error`

<details>
<summary>👉 Đáp án</summary>

**C** — `message` không phải lifecycle event (custom event)

Lifecycle: `connection` (server-side khi socket mới connect), `disconnect` (cả 2 phía khi mất kết nối), `connect_error` (client-side khi connect fail). `message` là tên event custom thông thường. Lưu ý `disconnect` có reason argument: `transport close`, `ping timeout`, `client namespace disconnect`... — giúp phân loại nguyên nhân.

</details>

## Production

### 7. Authentication

stem: Cách auth socket connection?

```js
// client
io({ auth: { token: "abc" } })

// server
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  // verify
  next()
})
```

- A: Truyền token trong `auth`, server verify bằng middleware `io.use`
- B: Đặt header `Authorization`
- C: Socket.IO không hỗ trợ auth
- D: Phải dùng cookie

<details>
<summary>👉 Đáp án</summary>

**A** — `auth` payload + middleware `io.use`

Client gửi token qua option `auth` lúc connect. Server đăng ký middleware bằng `io.use((socket, next) => ...)` — verify token, set `socket.data.userId`, gọi `next()` (hoặc `next(new Error("unauthorized"))` để reject). Khác Express middleware: chỉ chạy 1 lần lúc handshake, không phải mỗi event. Cũng có thể auth ở namespace level.

</details>

### 8. Multi-server adapter

stem: Tại sao cần Redis adapter khi scale Socket.IO?

- A: Để cache message
- B: Khi chạy nhiều server instance, mỗi server chỉ biết socket của nó — adapter (Redis pub/sub) sync emit/room giữa các instance
- C: Replace database
- D: Tăng tốc serialization

<details>
<summary>👉 Đáp án</summary>

**B** — Sync state giữa nhiều server instance qua pub/sub

Setup 2 server A, B sau load balancer: client X kết nối A, client Y kết nối B. Nếu A gọi `io.emit("ev")` → chỉ client của A nhận, Y không thấy. Adapter (Redis, Postgres, MongoDB) dùng pub/sub để broadcast event giữa các instance → emit ở đâu cũng tới đủ. Cài: `npm i @socket.io/redis-adapter` rồi gắn vào `io`.

</details>

### 9. Reconnect logic

stem: Mặc định client làm gì khi mất kết nối?

```js
const socket = io("https://example.com")
```

- A: Reconnect tự động với exponential backoff
- B: Không reconnect — phải tự code
- C: Reconnect đúng 1 lần
- D: Throw error rồi crash

<details>
<summary>👉 Đáp án</summary>

**A** — Auto reconnect với backoff

Default: retry vô hạn, delay tăng dần (1s, 2s, 5s... có jitter). Có thể tinh chỉnh: `io(url, { reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000 })`. Lưu ý: reconnect tạo socket mới → `socket.id` đổi → server không nhận ra client cũ. Pattern: dùng custom userId từ auth, lưu vào `socket.data.userId` để track xuyên qua reconnect.

</details>

### 10. Volatile event

stem: `socket.volatile.emit` khác `emit` ở chỗ nào?

```js
socket.volatile.emit("position", data)
```

- A: Khẩn cấp, gửi trước event khác
- B: Bỏ qua nếu socket đang offline/đang reconnect — không buffer lại
- C: Mã hoá payload
- D: Broadcast tới tất cả

<details>
<summary>👉 Đáp án</summary>

**B** — Bỏ qua nếu không gửi được ngay, không buffer

Default `emit` buffer message khi disconnect, gửi lại khi reconnect. Với data realtime kiểu vị trí con trỏ, frame game — message cũ vô nghĩa, gửi lại tốn băng thông. `volatile.emit` drop message nếu socket không sẵn sàng. Tương tự `socket.compress(true)` để bật compress cho message lớn.

</details>
