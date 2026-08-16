# 🎯 POC Question Bank - AI-Powered Interview Question Generator


## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Bước 1: Cấu hình & Chạy Backend

1. Mở terminal và chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

3. Thiết lập biến môi trường:
   - Tạo file `.env` trong thư mục `backend/` (dựa trên mẫu `.env.example`):
     ```bash
     # Windows PowerShell:
     Copy-Item .env.example .env
     ```
   - Cập nhật các thông số trong file `.env`:
     ```env
     PORT=5000
     DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require
     GEMINI_API_KEY=your_gemini_api_key_here
     ```



4. Khởi động server backend:
   ```bash
   npm run dev
   # hoặc: npm start
   ```
   Server backend sẽ chạy tại: **`http://localhost:5000`**

---

### Bước 2: Cài đặt & Chạy Frontend

1. Mở một cửa sổ terminal mới và chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   ```

3. Khởi động ứng dụng React trên môi trường phát triển (Dev Server):
   ```bash
   npm run dev
   ```

4. Truy cập giao diện trên trình duyệt tại: **`http://localhost:5173`** (hoặc port hiển thị trên terminal Vite).

---

