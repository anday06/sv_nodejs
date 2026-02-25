# Assignment 00 – Task Management REST API

REST API đơn giản quản lý danh sách công việc, xây dựng bằng **Node.js** và **Express**.  
Dữ liệu được lưu tạm thời trong bộ nhớ (mảng JavaScript), bao gồm **20 dữ liệu mẫu** sẵn có.

---

## Cài đặt và chạy

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy server
npm start          # production
# hoặc
npm run dev        # development (auto-reload khi thay đổi file)
```

Server sẽ chạy tại **http://localhost:3000**.

---

## Cấu trúc dữ liệu

Mỗi công việc (task) có cấu trúc:

```json
{
  "id": 1,
  "title": "Học Node.js cơ bản",
  "completed": false,
  "createdAt": "2025-02-01T08:00:00.000Z"
}
```

---

## Dữ liệu mẫu

Server khởi động với **20 task mẫu** sẵn có:

- **12 task** đã hoàn thành (`completed: true`) – id 1→12
- **8 task** chưa hoàn thành (`completed: false`) – id 13→20

Các task tiếp theo được tạo mới sẽ bắt đầu từ `id: 21`.

---

## Danh sách Endpoint

### 0. Trang chủ API

```
GET /
```

**Ví dụ request:**

```bash
curl http://localhost:3000/
```

**Response (200 OK):**

```json
{
  "message": "Task Management REST API",
  "endpoints": {
    "GET    /api/tasks": "Lấy tất cả công việc (?completed=true|false)",
    "GET    /api/tasks/:id": "Lấy chi tiết một công việc",
    "POST   /api/tasks": "Tạo công việc mới { \"title\": \"...\" }",
    "PUT    /api/tasks/:id": "Cập nhật toàn bộ { \"title\": \"...\", \"completed\": bool }",
    "PATCH  /api/tasks/:id": "Cập nhật một phần",
    "DELETE /api/tasks/:id": "Xóa công việc"
  }
}
```

---

### 1. Lấy tất cả công việc

```
GET /api/tasks
```

**Query parameters (tuỳ chọn):**

| Param       | Giá trị          | Mô tả                          |
|-------------|------------------|---------------------------------|
| `completed` | `true` / `false` | Lọc theo trạng thái hoàn thành |

**Ví dụ request:**

```bash
curl http://localhost:3000/api/tasks
curl "http://localhost:3000/api/tasks?completed=true"
curl "http://localhost:3000/api/tasks?completed=false"
```

**Ví dụ response (200 OK):**

```json
[
  {
    "id": 20,
    "title": "Nộp bài Assignment 00",
    "completed": false,
    "createdAt": "2025-02-20T08:00:00.000Z"
  },
  {
    "id": 19,
    "title": "Deploy lên server thử nghiệm",
    "completed": false,
    "createdAt": "2025-02-19T16:00:00.000Z"
  }
]
```

> Danh sách được sắp xếp theo `createdAt` giảm dần (mới nhất lên đầu).

---

### 2. Lấy chi tiết một công việc

```
GET /api/tasks/:id
```

**Ví dụ request:**

```bash
curl http://localhost:3000/api/tasks/1
```

**Response thành công (200 OK):**

```json
{
  "id": 1,
  "title": "Học Node.js cơ bản",
  "completed": true,
  "createdAt": "2025-02-01T08:00:00.000Z"
}
```

**Response lỗi (404 Not Found):**

```json
{ "error": "Task not found" }
```

---

### 3. Tạo công việc mới

```
POST /api/tasks
Content-Type: application/json
```

**Body:**

```json
{ "title": "Học Node.js cơ bản" }
```

**Ví dụ request:**

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Học Node.js nâng cao"}'
```

**Response thành công (201 Created):**

```json
{
  "id": 21,
  "title": "Học Node.js nâng cao",
  "completed": false,
  "createdAt": "2025-02-25T10:15:00.000Z"
}
```

**Response lỗi (400 Bad Request):**

```json
{ "error": "Title must be between 3 and 100 characters" }
```

> `title` phải là chuỗi từ **3 đến 100 ký tự**.

---

### 4. Cập nhật toàn bộ công việc

```
PUT /api/tasks/:id
Content-Type: application/json
```

**Body:**

```json
{ "title": "Tiêu đề mới", "completed": true }
```

**Ví dụ request:**

```bash
curl -X PUT http://localhost:3000/api/tasks/13 \
  -H "Content-Type: application/json" \
  -d '{"title": "Sắp xếp task đã xong", "completed": true}'
```

**Response thành công (200 OK):**

```json
{
  "id": 13,
  "title": "Sắp xếp task đã xong",
  "completed": true,
  "createdAt": "2025-02-13T08:45:00.000Z"
}
```

**Response lỗi:** `404 Not Found` nếu không tìm thấy task.

---

### 5. Cập nhật một phần công việc

```
PATCH /api/tasks/:id
Content-Type: application/json
```

**Body** (một hoặc cả hai trường):

```json
{ "completed": true }
```

**Ví dụ request:**

```bash
curl -X PATCH http://localhost:3000/api/tasks/14 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Response thành công (200 OK):**

```json
{
  "id": 14,
  "title": "Viết file README.md",
  "completed": true,
  "createdAt": "2025-02-14T09:30:00.000Z"
}
```

**Response lỗi:** `404 Not Found` nếu không tìm thấy task.

---

### 6. Xóa công việc

```
DELETE /api/tasks/:id
```

**Ví dụ request:**

```bash
curl -X DELETE http://localhost:3000/api/tasks/20
```

**Response thành công:** `204 No Content` (không có body)  
**Response lỗi:** `404 Not Found`

---

## Mã trạng thái HTTP

| Mã  | Ý nghĩa         | Khi nào                                     |
|-----|------------------|----------------------------------------------|
| 200 | OK               | Lấy / cập nhật thành công                    |
| 201 | Created          | Tạo công việc mới thành công                 |
| 204 | No Content       | Xóa thành công                               |
| 400 | Bad Request      | Thiếu `title`, `title` rỗng hoặc không hợp lệ |
| 404 | Not Found        | Không tìm thấy công việc theo `id`           |

---

## Tính năng bổ sung (điểm cộng)

- ✅ **Query filter:** `GET /api/tasks?completed=true|false` – lọc task theo trạng thái
- ✅ **Kiểm tra title:** độ dài từ 3 đến 100 ký tự, nếu không hợp lệ trả về 400
- ✅ **Sắp xếp:** danh sách task sắp xếp theo `createdAt` giảm dần (mới nhất lên đầu)

---

## Công cụ test

- **curl** – command-line (các ví dụ ở trên)
- **Postman** – GUI tool để test API
- **Thunder Client** – Extension trên VS Code

