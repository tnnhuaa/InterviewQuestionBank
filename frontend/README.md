# Frontend PrepVI

Package này triển khai giao diện React/TypeScript có routing và đã được wiring với API PrepVI qua đường dẫn tương đối `/api/v1`. Server state được quản lý bằng TanStack Query; form, lỗi và recovery dùng các thành phần dùng chung thay vì lặp logic theo từng trang.

## Chạy local

Từ thư mục gốc của repository:

```bash
npm install
npm run dev --workspace frontend
```

Các bước kiểm tra chất lượng không bao gồm triển khai automated tests trong phạm vi R1:

```bash
npm run typecheck --workspace frontend
npm run lint --workspace frontend
npm run build --workspace frontend
```

Frontend cần API chạy tại `http://localhost:3000` theo cấu hình Vite proxy hiện tại. Để walkthrough các job trích xuất, email hoặc Gemini, cần chạy thêm backend worker.

## Cấu trúc

- `src/app`: route, route guard, session context và trạng thái loading/error cấp ứng dụng.
- `src/features`: các trang theo bề mặt public, Student, Mentor, Admin và trạng thái hệ thống.
- `src/shared/api`: client cùng-origin, error contract, idempotency key và resource adapter.
- `src/shared/components`: navigation shell, `ErrorPanel` và các thành phần miền có thể tái sử dụng.
- `src/shared/styles/index.css`: nguồn chân lý cho design token semantic; component không hard-code bảng màu riêng.

## Luồng tích hợp chính

1. Student upload/dán JD tại `/job-descriptions/new`, kiểm tra corrected text và xác nhận.
2. Backend tạo AI analysis job nếu feature bật; UI polling trạng thái, hiển thị evidence/confidence và cho Student accept/edit/unmapped.
3. Question matching và Mentor eligibility vẫn deterministic; Gemini chỉ diễn giải candidate đã hợp lệ.
4. Preparation Plan giữ ID/version thật xuyên suốt Mentor detail, slot và booking.
5. Mentor có thể yêu cầu agenda/feedback draft, nhưng phải đọc, sửa và xác nhận trước khi sử dụng hoặc gửi feedback chính thức.
6. AI failure luôn để lại luồng rule-based/manual và mã hỗ trợ an toàn; không lưu JD, token, meeting link hoặc ghi chú feedback vào `localStorage`.

Không cấu hình `VITE_GEMINI_API_KEY` hoặc bất kỳ Gemini credential nào ở frontend. Trạng thái feature được đọc từ `GET /api/v1/ai/capabilities`; API key chỉ tồn tại ở backend.

DemoBar chỉ hiển thị khi cờ development tương ứng được bật. Không sử dụng role switcher hoặc dữ liệu demo làm cơ chế phân quyền production.
