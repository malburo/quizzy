---
title: MongoDB căn bản
desc: Document, index, aggregation, transaction — quen với NoSQL.
category: code
icon: 🍃
tint: "#c8e6c9"
inkOfTint: "#1b5e20"
level: mid
minutes: 13
section: đang học
---

## Document model

### 1. Document vs row

stem: Khác biệt chính giữa document (Mongo) và row (SQL)?

- A: Document là JSON, row là CSV
- B: Document có schema flexible — field tuỳ document; row trong table phải đồng nhất schema
- C: Document không index được
- D: Row hỗ trợ nested, document thì không

<details>
<summary>👉 Đáp án</summary>

**B** — Document schema-flexible; row schema-fixed

Mỗi document trong collection có thể có field khác nhau, nested object, array — không cần `ALTER TABLE` để thêm field. Đánh đổi: ứng dụng phải tự đảm bảo data shape (qua Mongoose, validation). SQL chặt hơn: schema cố định, JOIN dễ, transaction mạnh — phù hợp data quan hệ. Lựa chọn theo nature của data, không phải hype.

</details>

### 2. `_id` mặc định

stem: Nếu insert document không có `_id`, MongoDB làm gì?

```js
db.users.insertOne({ name: "Bảo" })
```

- A: Insert thất bại
- B: MongoDB tự tạo `_id: ObjectId(...)` 12-byte
- C: Dùng số tự tăng giống MySQL auto-increment
- D: Dùng UUID v4

<details>
<summary>👉 Đáp án</summary>

**B** — Tự tạo `ObjectId` 12-byte

`ObjectId` 12-byte = 4-byte timestamp + 5-byte random + 3-byte counter. Tự sort được theo thời gian tạo, gần như unique giữa nhiều client/process. Có thể override bằng cách tự cung cấp `_id` (string, UUID, number — bất kỳ kiểu nào). Nhưng một collection chỉ có một `_id` duy nhất.

</details>

### 3. Find với projection

stem: Query này trả về cái gì?

```js
db.users.find({ active: true }, { name: 1, _id: 0 })
```

- A: Trả về tất cả field
- B: Chỉ trả về `name`, ẩn `_id`
- C: Trả về `name` và `_id`
- D: Trả về `active` field

<details>
<summary>👉 Đáp án</summary>

**B** — Chỉ trả về `name`, ẩn `_id`

Tham số thứ 2 là projection: `1` = include, `0` = exclude. `_id` default include, phải explicit `_id: 0` mới bỏ. Không thể mix include và exclude trong cùng query (trừ `_id`). Projection giảm payload và memory — luôn nên dùng khi không cần full document.

</details>

## Index & Performance

### 4. Khi nào nên tạo index?

stem: Index giúp ích nhất cho field nào?

- A: Field hay query với `$eq`, `$in`, sort, hoặc nằm trong query filter
- B: Mọi field — càng nhiều index càng nhanh
- C: Chỉ `_id`, không cần thêm
- D: Field có giá trị unique mới indexed được

<details>
<summary>👉 Đáp án</summary>

**A** — Field hay query, sort, hoặc filter

Index tăng tốc đọc nhưng làm chậm ghi (mỗi insert/update phải update index). Tạo cho field thường query/sort: `email`, `userId`, `createdAt`. `explain()` cho biết query có dùng index không (`COLLSCAN` = bad, `IXSCAN` = good). Compound index (multi-field) phải khớp left-prefix mới chạy.

</details>

### 5. Aggregation: `$match` vs `$filter`

stem: Hai cái này khác nhau gì?

- A: Giống hệt
- B: `$match` filter document cấp pipeline; `$filter` filter element trong array của document
- C: `$filter` chỉ chạy lúc cuối pipeline
- D: `$match` chỉ accept regex

<details>
<summary>👉 Đáp án</summary>

**B** — `$match` lọc document; `$filter` lọc element trong array

```js
// $match: lọc document
{ $match: { age: { $gt: 18 } } }

// $filter: lọc element trong array của một field
{ $project: {
    activeItems: {
      $filter: { input: "$items", cond: { $eq: ["$$this.active", true] } }
    }
} }
```

`$match` ở đầu pipeline tận dụng được index — nên đặt sớm nhất có thể. `$filter` (cùng với `$map`, `$reduce`) làm việc trên array bên trong document.

</details>

### 6. `$lookup` join

stem: `$lookup` làm được gì?

```js
db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
  } }
])
```

- A: Insert vào collection khác
- B: Left outer join — thêm field array chứa document từ collection khác
- C: Inner join, drop orphan
- D: MongoDB không hỗ trợ join

<details>
<summary>👉 Đáp án</summary>

**B** — Left outer join, kết quả vào field array

`$lookup` thực hiện left outer join giữa collection — kết quả gắn vào field mới (`as: "user"`), luôn là ARRAY (kể cả 1 match). Thường unwrap bằng `$unwind: "$user"`. Performance lưu ý: `$lookup` không tận dụng index tốt như SQL JOIN — với dataset lớn cân nhắc denormalize hoặc dùng SQL.

</details>

## Schema & Writes

### 7. Schema-less nhưng Mongoose

stem: Vai trò của Mongoose là gì khi MongoDB đã schema-less?

- A: Bắt buộc để connect MongoDB
- B: Layer schema/validation/type ở phía ứng dụng — DB vẫn flexible nhưng app code có structure
- C: Tăng tốc query
- D: Tự sinh index

<details>
<summary>👉 Đáp án</summary>

**B** — Schema layer ở application, không ép server

Mongoose define schema trong JS/TS → validate document trước khi insert, sinh TypeScript type, gắn middleware (pre-save, post-find), default value. DB vẫn không enforce — nếu insert qua driver native vẫn được. Trade-off: Mongoose chậm hơn driver native vì có overhead. Project nhỏ/middle dùng Mongoose tiện; project performance-critical dùng driver native + Zod cho validation.

</details>

### 8. updateOne với upsert

stem: `upsert: true` làm gì?

```js
db.users.updateOne(
  { email: "a@b.com" },
  { $set: { name: "A" } },
  { upsert: true }
)
```

- A: Update nhiều document cùng lúc
- B: Nếu document khớp filter có thì update; không có thì insert mới
- C: Update không validate
- D: Báo lỗi nếu không có document khớp

<details>
<summary>👉 Đáp án</summary>

**B** — Update nếu có, insert nếu không

`upsert` = update + insert. Nếu filter không match document nào → tạo document mới với fields từ filter + `$set`. Pattern hay dùng cho idempotent operation (sync data, cache). Lưu ý race: 2 client cùng upsert có thể tạo 2 document → cần unique index trên field filter để chống trùng.

</details>

### 9. Transaction

stem: Transaction trên MongoDB cần điều gì?

- A: Không hỗ trợ — MongoDB không có transaction
- B: Hỗ trợ ACID multi-document từ 4.0+, nhưng yêu cầu chạy trên replica set hoặc sharded cluster
- C: Chỉ trong single document
- D: Phải mua Enterprise license

<details>
<summary>👉 Đáp án</summary>

**B** — Hỗ trợ từ 4.0, cần replica set/sharded

Single-document operation luôn atomic. Multi-document transaction (`session.startTransaction()`) cần ít nhất 1 replica set — standalone instance không chạy được. Hay setup local: `mongod --replSet rs0` rồi `rs.initiate()`. Transaction có cost — đừng dùng để thay thế tốt design schema (embed thay vì join thường tốt hơn).

</details>

### 10. Replica set

stem: Replica set là gì?

- A: Backup file mỗi đêm
- B: Cluster gồm 1 primary + nhiều secondary; secondary replicate dữ liệu từ primary, auto-failover khi primary chết
- C: Read-only mirror
- D: Sharding

<details>
<summary>👉 Đáp án</summary>

**B** — Primary + secondaries, replicate + failover

Primary nhận write, secondary đồng bộ qua oplog. Nếu primary chết → election bầu secondary làm primary mới (vài giây). Client driver tự handle reconnect. Đây là default cho production: data availability + read scaling (đọc từ secondary). Khác với *sharding* — sharding chia data ra nhiều cluster, replica set lưu BẢN SAO của cùng data.

</details>
