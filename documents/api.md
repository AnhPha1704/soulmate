# SoulMate API Documentation

Tài liệu hướng dẫn sử dụng các Endpoint API của dự án SoulMate.

---

## 1. Xác thực (Authentication)

### 1.1 Đăng ký tài khoản mới
- **Method:** POST
- **URL:** http://localhost:3000/api/auth/register
- **Body (raw JSON):**
```json
{
  "username": "hoang_user",
  "email": "hoang@example.com",
  "password": "mysecretpassword"
}
```

### 1.2 Đăng nhập
- **Method:** POST
- **URL:** http://localhost:3000/api/auth/login
- **Body (raw JSON):**
```json
{
  "email": "hoang@example.com",
  "password": "mysecretpassword"
}
```

### 1.3 Kiểm tra thông tin cá nhân (Profile)
- **Method:** GET
- **URL:** http://localhost:3000/api/users/profile
- **Ghi chú:** Yêu cầu đã đăng nhập (Cookie chứa Token).

### 1.4 Đăng xuất
- **Method:** POST
- **URL:** http://localhost:3000/api/auth/logout

---

## 2. Thú cưng (Pets)

### 2.1 Xem danh sách Thú cưng
- **Method:** GET
- **URL:** http://localhost:3000/api/pets

### 2.2 Tạo Thú cưng mới
- **Method:** POST
- **URL:** http://localhost:3000/api/pets
- **Body (raw JSON):**
```json
{
  "user_id": "ID_USER_CUA_BAN",
  "name": "Mimi",
  "mood_state": "Happy"
}
```

### 2.3 Xóa Thú cưng
- **Method:** DELETE
- **URL:** http://localhost:3000/api/pets/ID_PET_CUA_BAN

---

## 3. Nhật ký tâm trạng (MoodLogs)

### 3.1 Viết Nhật ký mới & Gợi ý nhiệm vụ (Giai đoạn 2.1)
- **Method:** POST
- **URL:** http://localhost:3000/api/mood-logs
- **Ghi chú:** Khi tạo nhật ký, hệ thống sẽ tự động tìm và giao một nhiệm vụ phù hợp với tâm trạng.
- **Body (raw JSON):**
```json
{
  "mood_type": "Vui",
  "journal_content": "Hôm nay tôi rất hạnh phúc vì đạt kết quả tốt!",
  "tags": ["success", "happy"]
}
```
---

## 4. Hệ thống Nhiệm vụ (Tasks)

### 4.1 Xem tất cả Nhiệm vụ gốc
- **Method:** GET
- **URL:** http://localhost:3000/api/tasks

### 4.2 Tạo Nhiệm vụ mới (Admin)
- **Method:** POST
- **URL:** http://localhost:3000/api/tasks
- **Body (raw JSON):**
```json
{
  "title": "Thiền định buổi sáng",
  "mood_target": "Căng thẳng",
  "exp_reward": 20,
  "category": "Meditation"
}
```

---

## 5. Theo dõi tiến độ (UserTasks)

### 5.1 Giao nhiệm vụ cho User
- **Method:** POST
- **URL:** http://localhost:3000/api/user-tasks
- **Body (raw JSON):**
```json
{
  "user_id": "ID_USER_CUA_BAN",
  "task_id": "ID_TASK_CUA_BAN"
}
```

### 5.2 Cập nhật trạng thái nhiệm vụ (Hoàn thành để nhận EXP ở 2.2)
- **Method:** PATCH
- **URL:** http://localhost:3000/api/user-tasks/ID_USERTASK_CUA_BAN
- **Body (raw JSON):**
```json
{
  "status": "done"
}
```

---

## 6. Tìm kiếm & Sắp xếp nâng cao (Phần 2.3)

Hướng dẫn sử dụng các tham số truy vấn (Query Parameters) để tìm kiếm, lọc và sắp xếp dữ liệu.

### 6.1 Tìm kiếm toàn văn (Full-text Search)
Yêu cầu cung cấp từ khóa qua tham số `q` hoặc `keyword`.

- **Tìm nhật ký tâm trạng:**
    - **Method:** GET
    - **URL:** `http://localhost:3000/api/mood-logs/search?q=tuyệt vời`
- **Tìm nhiệm vụ:**
    - **Method:** GET
    - **URL:** `http://localhost:3000/api/tasks/search?keyword=thiền`

### 6.2 Lọc dữ liệu (Filtering)
Lọc theo bất kỳ trường nào có trong Schema (trừ các trường đặc biệt như `sort`, `fields`).

- **Lọc nhật ký theo tâm trạng:**
    - **Method:** GET
    - **URL:** `http://localhost:3000/api/mood-logs?mood_type=Vui`
- **Lọc nhiệm vụ theo danh mục:**
    - **Method:** GET
    - **URL:** `http://localhost:3000/api/tasks?category=Meditation`

### 6.3 Sắp xếp nâng cao (Sorting)
Sử dụng tham số `sort`. Thêm dấu `-` trước tên trường để sắp xếp giảm dần.

- **Sắp xếp nhiệm vụ theo độ ưu tiên (giảm dần) và điểm thưởng (tăng dần):**
    - **Method:** GET
    - **URL:** `http://localhost:3000/api/tasks?sort=-priority,exp_reward`

### 6.4 Giới hạn trường hiển thị (Field Limiting)
Sử dụng tham số `fields` để chỉ lấy các trường cần thiết (phân cách bằng dấu phẩy).

- **Chỉ lấy tiêu đề và cấp độ ưu tiên của nhiệm vụ:**
    - **Method:** GET
    - **URL:** `http://localhost:3000/api/tasks?fields=title,priority`

---

## 7. Soul Connect (Real-time Chat - Socket.io)

Tính năng kết nối thời gian thực dựa trên tâm trạng chung.

### 7.1 Kết nối (Connect)
- **Protocol:** Socket.io
- **URL:** `ws://localhost:3000` (hoặc `http://localhost:3000`)

### 7.2 Các sự kiện (Events)

| Sự kiện | Loại | Dữ liệu (JSON) | Mô tả |
| :--- | :--- | :--- | :--- |
| **`join_room`** | Emit | `{"mood": "Vui"}` | Tham gia vào một phòng chat theo tâm trạng. |
| **`send_msg`** | Emit | `{"mood": "Vui", "message": "Chào bạn!"}` | Gửi tin nhắn ẩn danh tới các thành viên trong phòng. |
| **`receive_msg`** | Listen | `{"message": "...", "sender": "...", "timestamp": "..."}` | Lắng nghe để nhận tin nhắn từ người khác. |
| **`user_joined`** | Listen | `{"message": "..."}` | Nhận thông báo khi có người mới tham gia phòng. |

### 7.3 Hướng dẫn test nhanh trên Postman Desktop
1. Tạo request **Socket.io** mới.
2. Connect tới `http://localhost:3000`.
3. Thêm các sự kiện `receive_msg` và `user_joined` vào tab **Events**.
4. Chuyển qua tab **Message**, dùng `join_room` để vào phòng.
5. Dùng `send_msg` để bắt đầu trò chuyện.
4. **Bước 4: Kiểm tra tính năng chuyển cấp độ của Thú ảo (Gamification - Stage 2.2)**
   - Lấy ID (`progress_id`) mà bước 2 trả về.
   - Gọi `PATCH /api/user-tasks/{progress_id}` với Body:
   ```json
   {
       "status": "done"
   }
   ```
   - **Kỳ vọng:** Response trả về thông báo chúc mừng nhận được EXP hoặc Level Up. Điểm EXP của Pet sẽ tăng đúng bằng `exp_reward` của nhiệm vụ.
   - Gọi tiếp API đó 1 lần nữa để test "Kiểm tra chống gian lận" (hệ thống sẽ báo lỗi và từ chối phát điểm lặp lại).
