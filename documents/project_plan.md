# SoulMate: Ứng dụng Chăm sóc Sức khỏe Tinh thần & Thú ảo 🐎🐎🐎

## 1. Giới thiệu dự án
**SoulMate** là một nền tảng hỗ trợ người dùng theo dõi và cải thiện sức khỏe tâm thần thông qua việc kết hợp giữa nhật ký tâm trạng, hệ thống nhiệm vụ cá nhân hóa và tương tác với thú cưng ảo (Pet). Dự án nhằm tạo ra một không gian an toàn để người dùng rèn luyện thói quen tích cực, giảm căng thẳng và kết nối với cộng đồng.

---

## 2. Công nghệ sử dụng (Tech Stack)
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Template Engine (Jade/Pug).
- **Real-time**: Socket.io (cho tính năng Chat Connect).
- **Authentication**: JWT (JSON Web Token) kết hợp cookie-parser.
- **Styling**: Vanilla CSS (Premium & Modern Aesthetics).

---

## 3. Thiết kế Collections & Quan hệ dữ liệu

Dự án được xây dựng theo mô hình **MVC** (Model-View-Controller) để đảm bảo tính mở rộng và dễ bảo trì.

### 3.1 Cấu trúc dữ liệu (5 Collections)

#### Users
- **Thuộc tính:** `_id`, `username`, `password_hash`, `email`, `avatar`, `created_at`, `updated_at`, `is_deleted`
- **Mô tả:** Thông tin tài khoản người dùng.

#### Pets
- **Thuộc tính:** `_id`, `user_id`, `name`, `level`, `exp`, `mood_state`, `last_interaction`, `created_at`, `updated_at`
- **Mô tả:** Trạng thái thú ảo của mỗi người dùng.

#### MoodLogs
- **Thuộc tính:** `_id`, `user_id`, `mood_type`, `journal_content`, `tags`, `created_at`, `updated_at`, `is_deleted`
- **Mô tả:** Bản ghi tâm trạng hàng ngày và nhật ký cảm xúc.

#### Tasks
- **Thuộc tính:** `_id`, `title`, `description`, `mood_target`, `exp_reward`, `category`, `priority`, `created_at`, `updated_at`
- **Mô tả:** Danh mục các nhiệm vụ gợi ý theo tâm trạng (Stress, Buồn, Vui, ...).

#### UserTasks
- **Thuộc tính:** `_id`, `user_id`, `task_id`, `status` (pending/doing/done), `assigned_at`, `completed_at`, `is_deleted`
- **Mô tả:** Theo dõi tiến độ nhiệm vụ của từng người dùng.

### 3.2 Mô tả quan hệ dữ liệu
- **Users → Pets**: Quan hệ 1-1. Mỗi User sở hữu đúng 1 Pet (`Pets.user_id` → `Users._id`).
- **Users → MoodLogs**: Quan hệ 1-N. Mỗi User có nhiều bản ghi tâm trạng (`MoodLogs.user_id` → `Users._id`).
- **Users → UserTasks**: Quan hệ 1-N. Mỗi User được giao nhiều nhiệm vụ (`UserTasks.user_id` → `Users._id`).
- **Tasks → UserTasks**: Quan hệ 1-N. Mỗi Task có thể được giao cho nhiều User (`UserTasks.task_id` → `Tasks._id`).

---

## 4. Tính năng chi tiết & Chức năng yêu cầu

### a. Authentication (Xác thực)
- Đăng ký tài khoản mới.
- Đăng nhập bằng JWT (JSON Web Token).
- Bảo vệ các route yêu cầu đăng nhập (Middleware xác thực).

### b. CRUD đầy đủ cho tất cả Collections
- **Users**: Tạo, xem, cập nhật thông tin cá nhân, xóa tài khoản (soft delete).
- **Pets**: Tạo Pet khi đăng ký, xem trạng thái, cập nhật tên/trạng thái.
- **MoodLogs**: Tạo bản ghi tâm trạng, xem lịch sử, cập nhật nhật ký, xóa (soft delete).
- **Tasks**: Tạo nhiệm vụ mới, xem danh sách, cập nhật nội dung, xóa nhiệm vụ.
- **UserTasks**: Giao nhiệm vụ, cập nhật trạng thái (pending → doing → done), xóa (soft delete).

### c. Tìm kiếm & Sắp xếp
- Tìm kiếm MoodLogs theo từ khóa trong nhật ký.
- Tìm kiếm Tasks theo tên, category hoặc mood_target.
- Sắp xếp MoodLogs theo thời gian (mới nhất / cũ nhất).
- Sắp xếp Tasks theo độ ưu tiên hoặc EXP reward.
- Sắp xếp UserTasks theo hạn hoàn thành gần nhất.

### d. Theo dõi tâm trạng & Nhật ký
- Chọn tâm trạng hàng ngày bằng Emoji tương tác.
- Viết nhật ký cảm xúc với khả năng phân loại theo thẻ (Tags).
- Lưu trữ lịch sử tâm trạng và cho phép cập nhật liên tục trong ngày.

### e. Hệ thống nhiệm vụ & Gamification
- Gợi ý nhiệm vụ thông minh dựa trên tâm trạng hiện tại:
    - *Stress*: Nhiệm vụ thở sâu, thiền định 5 phút.
    - *Vui*: Nhiệm vụ lưu dấu khoảnh khắc đẹp.
- Hoàn thành nhiệm vụ giúp cộng điểm kinh nghiệm (EXP) cho Pet.
- Pet thăng cấp (Level up) khi đủ EXP, phản ánh sự kiên trì của người dùng.

### f. Chat Room ẩn danh (Soul Connect)
- Kết nối người dùng có cùng trạng thái tâm trạng vào phòng chat ẩn danh real-time.
- Tạo không gian chia sẻ không phán xét, tăng tính tương tác cộng đồng.

### g. Tính năng nâng cao (Điểm cộng)
- Soft Delete cho Users, MoodLogs, UserTasks (đánh dấu `is_deleted` thay vì xóa vĩnh viễn).
- Lịch sử chỉnh sửa (Edit History) cho MoodLogs.
- Comment cho từng bản ghi tâm trạng.
- Deploy project lên server (Render, Railway, ...).

---

## 5. Danh sách API (Endpoints)

### Auth
- `POST /api/auth/register` — Đăng ký tài khoản.
- `POST /api/auth/login` — Đăng nhập, trả về JWT token.

### Users
- `GET /api/users/:id` — Lấy thông tin người dùng.
- `PUT /api/users/:id` — Cập nhật thông tin cá nhân.
- `DELETE /api/users/:id` — Soft delete tài khoản.

### Pets
- `GET /api/pets/:userId` — Lấy thông tin Pet của người dùng.
- `PUT /api/pets/:id` — Cập nhật tên/trạng thái Pet.

### MoodLogs
- `POST /api/mood-logs` — Tạo bản ghi tâm trạng mới.
- `GET /api/mood-logs?user_id=...` — Lấy danh sách bản ghi tâm trạng.
- `GET /api/mood-logs/search?keyword=...` — Tìm kiếm nhật ký theo từ khóa.
- `PUT /api/mood-logs/:id` — Cập nhật nhật ký.
- `DELETE /api/mood-logs/:id` — Soft delete bản ghi.

### Tasks
- `POST /api/tasks` — Tạo nhiệm vụ mới.
- `GET /api/tasks` — Lấy danh sách tất cả nhiệm vụ.
- `GET /api/tasks?mood_target=...` — Lọc nhiệm vụ theo tâm trạng.
- `PUT /api/tasks/:id` — Cập nhật nhiệm vụ.
- `DELETE /api/tasks/:id` — Xóa nhiệm vụ.

### UserTasks
- `POST /api/user-tasks` — Giao nhiệm vụ cho người dùng.
- `GET /api/user-tasks?user_id=...` — Lấy danh sách nhiệm vụ của người dùng.
- `PUT /api/user-tasks/:id` — Cập nhật trạng thái (pending → doing → done).
- `DELETE /api/user-tasks/:id` — Soft delete nhiệm vụ đã giao.

### Thống kê & Báo cáo
- `GET /api/stats/mood-summary?user_id=...` — Thống kê tâm trạng theo tuần/tháng.
- `GET /api/stats/leaderboard` — Bảng xếp hạng Pet.
- `GET /api/stats/task-completion?user_id=...` — Tỷ lệ hoàn thành nhiệm vụ.

---

## 6. Câu truy vấn MongoDB (14 câu)

### Truy vấn cơ bản (CRUD & Lọc)

**1. Lấy tất cả nhật ký tâm trạng của user A:**
```js
db.mood_logs.find({ user_id: "A" })
```

**2. Tìm các nhiệm vụ dành cho tâm trạng "Căng thẳng":**
```js
db.tasks.find({ mood_target: "Stress" })
```

**3. Lấy danh sách nhiệm vụ chưa hoàn thành:**
```js
db.user_tasks.find({ user_id: "A", status: { $ne: "done" } })
```

**4. Tìm các đoạn nhật ký có chứa từ khóa "mệt mỏi":**
```js
db.mood_logs.find({ journal_content: /mệt mỏi/i })
```

**5. Sắp xếp các bản ghi tâm trạng mới nhất:**
```js
db.mood_logs.find({ user_id: "A" }).sort({ created_at: -1 })
```

### Truy vấn nâng cao (Aggregate & Lookup)

**6. Lọc nhiệm vụ theo category "Thiền định" và priority "high":**
```js
db.tasks.find({ category: "Thiền định", priority: "high" })
```

**7. Hiển thị nhật ký kèm thông tin chi tiết nhiệm vụ đã làm hôm đó (Lookup/Join):**
```js
db.mood_logs.aggregate([
  { $match: { user_id: "A", created_at: { $gte: ISODate("2026-03-23") } } },
  { $lookup: { from: "user_tasks", localField: "user_id", foreignField: "user_id", as: "tasks_today" } }
])
```

**8. Thống kê số lần từng loại tâm trạng xuất hiện:**
```js
db.mood_logs.aggregate([
  { $match: { user_id: "A" } },
  { $group: { _id: "$mood_type", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

**9. Tính tổng EXP mà người dùng đã tích lũy cho Pet:**
```js
db.user_tasks.aggregate([
  { $match: { user_id: "A", status: "done" } },
  { $lookup: { from: "tasks", localField: "task_id", foreignField: "_id", as: "task_info" } },
  { $unwind: "$task_info" },
  { $group: { _id: "$user_id", total_exp: { $sum: "$task_info.exp_reward" } } }
])
```

**10. Tìm Top 3 người dùng có Pet cấp độ cao nhất:**
```js
db.pets.find().sort({ level: -1, exp: -1 }).limit(3)
```

**11. Tính tỷ lệ hoàn thành nhiệm vụ hàng tuần:**
```js
db.user_tasks.aggregate([
  { $match: { assigned_at: { $gte: ISODate("2026-03-17") } } },
  { $group: { _id: "$user_id", total: { $sum: 1 }, done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } } } },
  { $project: { completion_rate: { $multiply: [{ $divide: ["$done", "$total"] }, 100] } } }
])
```

**12. Thống kê tâm trạng phổ biến nhất theo từng tháng:**
```js
db.mood_logs.aggregate([
  { $group: { _id: { month: { $month: "$created_at" }, mood: "$mood_type" }, count: { $sum: 1 } } },
  { $sort: { "_id.month": 1, count: -1 } }
])
```

**13. Tìm các nhiệm vụ hoàn thành sau deadline (quá hạn):**
```js
db.user_tasks.aggregate([
  { $match: { status: "done" } },
  { $lookup: { from: "tasks", localField: "task_id", foreignField: "_id", as: "task_info" } },
  { $unwind: "$task_info" },
  { $match: { $expr: { $gt: ["$completed_at", "$task_info.deadline"] } } }
])
```

**14. Tính thời gian trung bình từ lúc nhận nhiệm vụ đến lúc hoàn thành:**
```js
db.user_tasks.aggregate([
  { $match: { status: "done" } },
  { $project: { duration: { $subtract: ["$completed_at", "$assigned_at"] } } },
  { $group: { _id: null, avg_duration_ms: { $avg: "$duration" } } }
])
```

---

## 7. Lộ trình phát triển (Roadmap)

### Giai đoạn 1: Xây dựng nền tảng (MVP)
- Thiết lập Server Express, kết nối MongoDB (Mongoose).
- Chức năng Auth: Đăng ký, đăng nhập bằng JWT.
- CRUD cơ bản cho tất cả Collections.
- Kiểm thử API qua Postman/Swagger.

### Giai đoạn 2: Hệ thống Pet & Nhiệm vụ
- Xây dựng logic thăng cấp và quản lý trạng thái Pet.
- Triển khai hệ thống Tasks gợi ý theo tâm trạng.
- Tính năng tìm kiếm, sắp xếp, lọc dữ liệu.
- Hiển thị Dashboard người dùng với thông tin Pet trực quan.

### Giai đoạn 3: Tính năng Cộng đồng & Thống kê
- Tích hợp Socket.io cho Chat Room ẩn danh.
- Phát triển module Báo cáo/Thống kê tâm trạng theo tuần/tháng (Biểu đồ trực quan).
- Soft Delete, lịch sử chỉnh sửa, comment.

### Giai đoạn 4: Tinh chỉnh & Nâng cao
- Tối ưu hóa UI/UX với phong cách Premium (Gradients, Glassmorphism).
- Phân tích cảm xúc nhật ký bằng AI để đưa ra gợi ý chuyên sâu hơn.
- Deploy project lên server.
