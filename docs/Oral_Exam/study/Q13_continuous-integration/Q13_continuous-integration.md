# Câu 13 — Tích hợp liên tục (Continuous Integration)

## 1. Câu hỏi chính

**Câu hỏi:** Vẽ và giải thích mô hình tích hợp liên tục của nhóm, ghi công cụ dùng cho từng thành phần và giải thích tại sao dự án cần CI.

**Câu trả lời viết tay trong không quá 10 phút:**

Continuous Integration là việc tôi thường xuyên tích hợp mã nguồn vào repository chung và tự động kiểm tra thay đổi. PrepVI dùng GitHub làm kho mã và GitHub Actions làm build server; workflow `.github/workflows/ci.yml` chạy khi push hoặc có Pull Request.

~~~mermaid
flowchart LR
    A[Developer: Git push / Pull Request] --> B[GitHub Repository]
    B -->|push / pull_request| C[GitHub Actions]
    C --> D[Quality job: Node.js 24, npm ci,<br/>ESLint, TypeScript, OpenAPI,<br/>PostgreSQL 17, migration, seed, build]
    C --> E[Secret-scan job:<br/>Gitleaks + full Git history]
    D --> F[Notify job:<br/>needs both jobs + always]
    E --> F
    F --> G["action-send-mail@v3"]
    G --> H[SMTP via GitHub Secrets]
    H --> I[Result email + Actions run link]
    D --> J[GitHub Actions status + logs]
    E --> J
    F --> J
~~~

Input là commit hoặc Pull Request. Job `quality` trên Ubuntu dùng Node.js 24 và `npm ci`, rồi chạy ESLint, TypeScript, OpenAPI drift, migration, reference seed trên PostgreSQL 17-alpine và build. Song song, `secret-scan` dùng Gitleaks quét Git history.

Job `notify` có `needs: [quality, secret-scan]` và `if: always()`, nên chạy sau hai job trên kể cả khi có lỗi. Nó dùng `dawidd6/action-send-mail@v3` gửi email qua SMTP được cấu hình bằng GitHub Secrets. Email ghi SUCCESS khi hai job kiểm tra đều đạt, ngược lại ghi FAILURE; kèm kết quả và link tới đúng Actions run. GitHub Actions lưu trạng thái và log. Nếu một job, kể cả `notify`, thất bại thì toàn workflow không thành công.

CI giúp tôi phát hiện sớm lỗi giữa frontend, backend, API contract, database và build; tạo môi trường kiểm tra chung; giảm nguy cơ commit secret; và chủ động báo kết quả. Workflow chưa chạy `npm run test` và chưa deploy, nên đây là CI, chưa phải Continuous Delivery.

## 2. Tài liệu đi kèm

- [x] [Continuous Integration — printed attachment](../../print/Q13_continuous-integration/Continuous_Integration_Attachment_EN.md).
