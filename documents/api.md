1. Đăng ký tài khoản mới (Register)
Method: POST
URL: http://localhost:3000/api/auth/register
Headers: Content-Type: application/json
Body (raw JSON):
json
{
  "username": "hoang_user",
  "email": "hoang@example.com",
  "password": "mysecretpassword"
}
2. Đăng nhập (Login)
Method: POST
URL: http://localhost:3000/api/auth/login
Body (raw JSON):
json
{
  "email": "hoang@example.com",
  "password": "mysecretpassword"
}
3. Kiểm tra thông tin cá nhân (Profile - Route bảo mật)
Method: GET
URL: http://localhost:3000/api/users/profile
4. Đăng xuất (Logout)
Method: POST
URL: http://localhost:3000/api/auth/logout