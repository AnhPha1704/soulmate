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

### 3.1 Viết Nhật ký mới
- **Method:** POST
- **URL:** http://localhost:3000/api/mood-logs
- **Body (raw JSON):**
```json
{
  "user_id": "ID_USER_CUA_BAN",
  "mood_type": "Vui",
  "journal_content": "Hôm nay là một ngày tuyệt vời!",
  "tags": ["work", "happy"]
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

### 5.2 Cập nhật trạng thái nhiệm vụ
- **Method:** PATCH
- **URL:** http://localhost:3000/api/user-tasks/ID_USERTASK_CUA_BAN
- **Body (raw JSON):**
```json
{
  "status": "done"
}
```
