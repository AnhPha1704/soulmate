# SoulMate: Ứng dụng Chăm sóc Sức khỏe Tinh thần & Thú ảo 🐎🐎🐎

## 1. GIỚI THIỆU DỰ ÁN
**SoulMate** là một nền tảng hỗ trợ người dùng theo dõi và cải thiện sức khỏe tinh thần thông qua việc kết hợp giữa nhật ký tâm trạng, hệ thống nhiệm vụ cá nhân hóa và tương tác với thú cưng ảo (Pet). Dự án nhằm tạo ra một không gian an toàn để người dùng rèn luyện thói quen tích cực, giảm căng thẳng và kết nối với cộng đồng.

---

## 2. CÔNG NGHỆ SỬ DỤNG (TECH STACK)
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Frontend:** HTML, CSS, JS.
* **Real-time:** Socket.io (cho tính năng Chat ẩn danh).
* **Authentication:** JWT (JSON Web Token) kết hợp cookie-parser.

---

## 3. THIẾT KẾ COLLECTIONS & QUAN HỆ DỮ LIỆU
Dự án được xây dựng theo mô hình **MVC** (Model-View-Controller).

### 3.1 Cấu trúc dữ liệu (5 Collections)
1. **Users:**
   * *Thuộc tính:* `_id`, `username`, `password_hash`, `email`, `avatar`, `created_at`, `updated_at`, `is_deleted`
   * *Mô tả:* Thông tin tài khoản người dùng.
2. **Pets:**
   * *Thuộc tính:* `_id`, `user_id`, `name`, `level`, `exp`, `mood_state`, `last_interaction`, `created_at`, `updated_at`
   * *Mô tả:* Trạng thái thú ảo của mỗi người dùng.
3. **MoodLogs:**
   * *Thuộc tính:* `_id`, `user_id`, `mood_type`, `journal_content`, `tags`, `created_at`, `updated_at`, `is_deleted`
   * *Mô tả:* Bản ghi tâm trạng hàng ngày và nhật ký cảm xúc.
4. **Tasks:**
   * *Thuộc tính:* `_id`, `title`, `description`, `mood_target`, `exp_reward`, `category`, `priority`, `created_at`, `updated_at`
   * *Mô tả:* Danh mục các nhiệm vụ gợi ý theo tâm trạng.
5. **UserTasks:**
   * *Thuộc tính:* `_id`, `user_id`, `task_id`, `status` (pending/doing/done), `assigned_at`, `completed_at`, `is_deleted`
   * *Mô tả:* Theo dõi tiến độ nhiệm vụ của từng người dùng.

### 3.2 Mô tả quan hệ dữ liệu
* **Users → Pets:** Quan hệ 1-1. Mỗi User sở hữu đúng 1 Pet.
* **Users → MoodLogs:** Quan hệ 1-N. Mỗi User có nhiều bản ghi tâm trạng.
* **Users → UserTasks:** Quan hệ 1-N. Mỗi User được giao nhiều nhiệm vụ.
* **Tasks → UserTasks:** Quan hệ 1-N. Mỗi Task có thể được giao cho nhiều User.

---

## 4. TÍNH NĂNG CHI TIẾT & CHỨC NĂNG YÊU CẦU

### a. Authentication
* Đăng ký tài khoản mới và Đăng nhập bằng JWT.
* Bảo vệ các route yêu cầu đăng nhập bằng Middleware.
* Sử dụng cookie-parser để quản lý token bảo mật hơn.

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
* Kết nối thời gian thực (Socket.io) giữa những người dùng có cùng tâm trạng.

---

## 5. DANH SÁCH API (ENDPOINTS)

### a. Auth (Xác thực)
- `POST /api/auth/register` — Đăng ký tài khoản mới.
- `POST /api/auth/login` — Đăng nhập và nhận JWT token.

### b. Users (Người dùng)
- `GET /api/users/:id` — Lấy thông tin chi tiết người dùng.
- `PUT /api/users/:id` — Cập nhật thông tin cá nhân (email, avatar, ...).
- `DELETE /api/users/:id` — Xóa mềm (soft delete) tài khoản.

### c. Pets (Thú ảo)
- `GET /api/pets/:userId` — Lấy trạng thái Pet của người dùng cụ thể.
- `PUT /api/pets/:id` — Cập nhật tên hoặc trạng thái (mood_state) của Pet.

### d. MoodLogs (Nhật ký tâm trạng)
- `POST /api/mood-logs` — Tạo bản ghi tâm trạng và nhật ký mới.
- `GET /api/mood-logs?user_id=...` — Lấy danh sách nhật ký (có hỗ trợ lọc/sắp xếp).
- `GET /api/mood-logs/search?keyword=...` — Tìm kiếm nội dung nhật ký theo từ khóa.
- `PUT /api/mood-logs/:id` — Chỉnh sửa nội dung hoặc tags của nhật ký.
- `DELETE /api/mood-logs/:id` — Xóa mềm bản ghi tâm trạng.

### e. Tasks (Danh mục nhiệm vụ)
- `POST /api/tasks` — Tạo nhiệm vụ mới (Quyền Admin).
- `GET /api/tasks` — Lấy danh sách tất cả nhiệm vụ.
- `GET /api/tasks?mood_target=...&category=...` — Lọc nhiệm vụ theo tâm trạng hoặc danh mục.
- `PUT /api/tasks/:id` — Cập nhật nội dung/điểm thưởng của nhiệm vụ.
- `DELETE /api/tasks/:id` — Xóa nhiệm vụ khỏi hệ thống.

### f. UserTasks (Tiến độ nhiệm vụ của User)
- `POST /api/user-tasks` — Giao nhiệm vụ cho người dùng (tự động hoặc thủ công).
- `GET /api/user-tasks?user_id=...&status=...` — Xem danh sách nhiệm vụ của User.
- `PUT /api/user-tasks/:id` — Cập nhật trạng thái nhiệm vụ (pending → doing → done).
- `DELETE /api/user-tasks/:id` — Hủy bỏ/Xóa mềm nhiệm vụ đã giao.

### g. Thống kê & Báo cáo (Stats)
- `GET /api/stats/mood-summary?user_id=...` — Thống kê xu hướng tâm trạng tuần/tháng.
- `GET /api/stats/leaderboard` — Bảng xếp hạng thú cưng có cấp độ cao nhất.
- `GET /api/stats/task-completion?user_id=...` — Báo cáo tỷ lệ hoàn thành nhiệm vụ.

---

## 6. DANH SÁCH CÂU TRUY VẤN MONGODB (20 CÂU)

### 6.1 Truy vấn cơ bản (CRUD & Lọc)

1. **Lấy tất cả nhật ký tâm trạng của user A:**
   `db.mood_logs.find({ user_id: "USER_A_ID", is_deleted: false })`

2. **Tìm các nhiệm vụ dành cho tâm trạng "Căng thẳng" (Stress):**
   `db.tasks.find({ mood_target: "Stress" })`

3. **Lấy danh sách nhiệm vụ chưa hoàn thành của user A:**
   `db.user_tasks.find({ user_id: "USER_A_ID", status: { $ne: "done" } })`

4. **Lấy nhật ký của user A theo tâm trạng "Buồn":**
   `db.mood_logs.find({ user_id: "A", mood_type: "Buồn", is_deleted: false })`

5. **Sắp xếp các bản ghi tâm trạng của user A (mới nhất lên đầu):**
   `db.mood_logs.find({ user_id: "USER_A_ID" }).sort({ created_at: -1 })`

6. **Lọc các nhiệm vụ có độ ưu tiên cao (priority):**
   `db.tasks.find({ priority: "high" })`

7. **Tìm các User tham gia hệ thống trước một ngày cụ thể:**
   `db.users.find({ created_at: { $lt: ISODate("2024-01-01T00:00:00Z") } })`

8. **Lấy các nhiệm vụ thuộc danh mục "Thiền định" (category):**
   `db.tasks.find({ category: "Meditation" })`

9. **Tìm thú cưng (Pet) đã đạt cấp độ (level) cao (từ 5 trở lên):**
   `db.pets.find({ level: { $gte: 5 } })`

10. **Lọc nhật ký theo thẻ (Tags) "Công việc":**
    `db.mood_logs.find({ tags: "congviec" })`

### 6.2 Truy vấn nâng cao (Aggregate & Lookup)

1. **Tính tổng EXP người dùng A tích lũy cho Pet:**
   ```js
   db.user_tasks.aggregate([
     { $match: { user_id: "A", status: "done" } },
     { $lookup: { from: "tasks", localField: "task_id", foreignField: "_id", as: "t" } },
     { $unwind: "$t" },
     { $group: { _id: "$user_id", total_exp: { $sum: "$t.exp_reward" } } }
   ])
   ```

2. **Thống kê số lần từng loại tâm trạng xuất hiện của user A:**
   ```js
   db.mood_logs.aggregate([
     { $match: { user_id: "A" } },
     { $group: { _id: "$mood_type", count: { $sum: 1 } } },
     { $sort: { count: -1 } }
   ])
   ```

3. **Tìm Top 3 người dùng có Pet cấp độ cao nhất (kèm tên User):**
   ```js
   db.pets.aggregate([
     { $sort: { level: -1, exp: -1 } },
     { $limit: 3 },
     { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "owner" } },
     { $project: { "owner.username": 1, name: 1, level: 1 } }
   ])
   ```

4. **Thống kê tâm trạng phổ biến nhất theo từng tháng:**
   ```js
   db.mood_logs.aggregate([
     { $group: { _id: { month: { $month: "$created_at" }, mood: "$mood_type" }, count: { $sum: 1 } } },
     { $sort: { "_id.month": 1, count: -1 } }
   ])
   ```

5. **Tính tỷ lệ (%) hoàn thành nhiệm vụ của User A:**
   ```js
   db.user_tasks.aggregate([
     { $match: { user_id: "A" } },
     { $group: {
         _id: "$user_id",
         done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
         total: { $sum: 1 }
     }},
     { $project: { ratio: { $multiply: [{ $divide: ["$done", "$total"] }, 100] } } }
   ])
   ```

6. **Hiển thị nhật ký kèm tên người dùng và tên Pet:**
   ```js
   db.mood_logs.aggregate([
     { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "u" } },
     { $lookup: { from: "pets", localField: "user_id", foreignField: "user_id", as: "p" } },
     { $unwind: "$u" }, { $unwind: "$p" },
     { $project: { journal_content: 1, "u.username": 1, "p.name": 1 } }
   ])
   ```

7. **Tính thời gian trung bình (phút) hoàn thành một nhiệm vụ:**
   ```js
   db.user_tasks.aggregate([
     { $match: { status: "done" } },
     { $project: { duration: { $subtract: ["$completed_at", "$assigned_at"] } } },
     { $group: { _id: null, avg_min: { $avg: { $divide: ["$duration", 60000] } } } }
   ])
   ```

8. **Tìm các nhiệm vụ hoàn thành sau 24 giờ kể từ khi được giao:**
   ```js
   db.user_tasks.aggregate([
     { $match: { status: "done" } },
     { $project: { time: { $subtract: ["$completed_at", "$assigned_at"] } } },
     { $match: { time: { $gt: 86400000 } } }
   ])
   ```

9. **Lọc nhiệm vụ thuộc category "Thiền định" và priority "high":**
   ```js
   db.tasks.aggregate([
     { $match: { category: "Thiền định", priority: "high" } }
   ])
   ```

10. **Xuất danh sách Pet không tương tác trong vòng 7 ngày qua:**
    ```js
    db.pets.aggregate([
      { $match: { last_interaction: { $lt: new Date(Date.now() - 7*24*60*60*1000) } } },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "owner" } }
    ])
    ```

---

## 7. LỘ TRÌNH PHÁT TRIỂN CHI TIẾT (DETAILED ROADMAP)

### Giai đoạn 1: Nền tảng & MVP (Tuần 1-2) - [ĐANG THỰC HIỆN]
*   **1.1 Khởi tạo dự án:**
    *   [x] Thiết lập Express Server & Cấu trúc thư mục MVC.
    *   [x] Kết nối MongoDB & Cấu hình Docker Compose.
*   **1.2 Hệ thống Xác thực (Auth):**
    *   [x] Model User (Hỗ trợ băm mật khẩu).
    *   [x] Middleware xác thực JWT & Cookie Parser.
    *   [x] API Đăng ký, Đăng nhập, Đăng xuất.
*   **1.3 Xây dựng Models & CRUD cơ bản:**
    *   [x] Hoàn thiện Models: `Pet`, `MoodLog`, `Task`, `UserTask`.
    *   [ ] API CRUD cho **Users**: Cập nhật Profile, Xóa mềm.
    *   [ ] API CRUD cho **Pets**: Tạo Pet khi đăng ký, Xem trạng thái.
    *   [ ] API CRUD cho **MoodLogs**: Viết nhật ký, xem lịch sử (Lọc theo thời gian).
    *   [ ] API CRUD cho **Tasks**: Quản lý dành cho Admin.

### Giai đoạn 2: Hệ thống Logic lõi (Tuần 3)
*   **2.1 Logic gợi ý nhiệm vụ:**
    *   [ ] Phát triển thuật toán `RecommendTask`: Tự động giao nhiệm vụ dựa trên `mood_type` trong nhật ký mới nhất.
*   **2.2 Gamification (Pet System):**
    *   [ ] Viết logic cập nhật trạng thái `UserTask` (Doing -> Done).
    *   [ ] Logic cộng EXP cho Pet & Tự động thăng cấp (Level up) khi đủ điểm.
*   **2.3 Tìm kiếm & Sắp xếp nâng cao:**
    *   [ ] Tích hợp tìm kiếm Full-text search cho nội dung nhật ký.

### Giai đoạn 4: Social, Thống kê & Real-time (Tuần 4)
*   **4.1 Soul Connect (Real-time Chat):**
    *   [ ] Tích hợp Socket.io: Tạo phòng chat ẩn danh dựa trên nhóm tâm trạng chung.
*   **4.2 Báo cáo & Phân tích (Stats API):**
    *   [ ] Triển khai 10 câu truy vấn Aggregate nâng cao đã thiết kế ở mục 6.2.
    *   [ ] API thống kê xu hướng tâm trạng theo tuần/tháng.

### Giai đoạn 5: Hoàn thiện & Giao diện (Tuần 5)
*   **5.1 Frontend Integration:**
    *   [ ] Xây dựng giao diện Web (HTML/CSS/JS) tối ưu cho Mobile.
    *   [ ] Tích hợp các API đã viết vào giao diện.
*   **5.2 Tối ưu & Deployment:**
    *   [ ] Viết Unit Test cho các logic quan trọng.
    *   [ ] Deploy ứng dụng lên VPS (Dockerized).

