# Câu 13 — Tích hợp liên tục (Continuous Integration)

## 1. Câu hỏi chính

**Câu hỏi:** Vẽ và giải thích mô hình tích hợp liên tục của nhóm, ghi công cụ dùng cho từng thành phần và giải thích tại sao dự án cần CI.

**Câu trả lời viết tay trong không quá 10 phút:**

Continuous Integration là cách tôi thường xuyên tích hợp mã nguồn vào repository chung và tự động kiểm tra mỗi thay đổi. PrepVI dùng GitHub làm kho mã, GitHub Actions làm build server; workflow trong .github/workflows/ci.yml chạy khi push hoặc có Pull Request.

~~~mermaid
flowchart LR
    A[Developer: Git push / Pull Request] --> B[GitHub Repository]
    B --> C[GitHub Actions]
    C --> D[Quality job: Ubuntu]
    D --> E[Node.js 24 + npm ci]
    E --> F[ESLint]
    F --> G[TypeScript check]
    G --> H[OpenAPI drift check]
    H --> I[PostgreSQL 17: migration + seed]
    I --> J[Vite + backend build validation]
    C --> K[Gitleaks secret scan]
    J --> L[GitHub Check: Pass / Fail]
    K --> L
    L --> M[GitHub notification / Email]
~~~

Input là commit/PR. Runner checkout source, cài Node.js 24 và chạy npm ci. Job quality lần lượt chạy ESLint, TypeScript check, OpenAPI drift check, migration replay, reference seed verification và build. PostgreSQL 17-alpine là database tạm của CI. Song song, Gitleaks quét Git history. Một step trả exit code khác 0 làm job fail; tất cả đạt thì workflow pass. Kết quả hiện trên Pull Request/Actions và được GitHub gửi notification/email. Ruleset của main đang hoạt động và yêu cầu thay đổi đi qua Pull Request; tuy nhiên ảnh cấu hình cho thấy chưa chọn required CI check cụ thể.

Tôi dùng CI để phát hiện sớm lỗi giữa frontend, backend, API contract, migration và build; tạo môi trường chung thay vì phụ thuộc máy cá nhân; đồng thời giảm nguy cơ commit secret. Workflow hiện chưa gọi npm run test, chưa deploy và không có email action riêng; email đến từ GitHub notification. Vì vậy đây là CI, chưa phải Continuous Delivery.

Tôi đã có run thành công và sẽ bổ sung ảnh sau. Nhóm chưa lưu một lỗi CI cụ thể làm case study. Khi fail, tôi đọc log, chạy lại lệnh tương ứng ở local, sửa source/config rồi push commit mới để kiểm tra lại.

## 2. Tài liệu đi kèm

- [ ] [Continuous Integration — printed attachment](Continuous_Integration_Attachment_EN.md).
