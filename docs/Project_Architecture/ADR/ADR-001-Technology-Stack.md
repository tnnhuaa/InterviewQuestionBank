# ADR-001 — Technology Stack

| Thuộc tính | Giá trị |
|---|---|
| Trạng thái | Accepted for PoC; Proposed for MVP |
| Ngày quyết định | 14/08/2026 |
| Người chịu trách nhiệm | Luân — Architecture/Technology Stack |
| Người cần xác nhận bằng PoC | Trí — End-to-End PoC |
| Phạm vi | Frontend, backend, database, test và deployment |

## 1. Bối cảnh

MVP cần hỗ trợ Question Bank, mentor discovery, availability, booking, meeting-link handoff, feedback và notification. Hai thuộc tính kỹ thuật quan trọng nhất là kiểm soát quyền truy cập theo đối tượng và chống double booking dưới concurrent request.

Thông tin nhóm đã xác nhận:

- Frontend: React và Tailwind CSS.
- Backend: Node.js và Express.
- Database: PostgreSQL.
- Frontend và backend tách thành hai ứng dụng, build và deployment độc lập.
- Không có ràng buộc nhà cung cấp triển khai.
- PoC chưa có kết quả tại thời điểm ra quyết định.

Vì chưa có skill matrix chi tiết cho từng thành viên, quyết định ưu tiên công nghệ nhóm đã nêu rõ và giới hạn số công nghệ mới. JavaScript được dùng xuyên suốt; TypeScript chỉ được xem xét qua change/ADR mới nếu nhóm xác nhận đủ năng lực và capacity.

## 2. Tiêu chí quyết định

Mỗi phương án được chấm 1–5, trong đó 5 là phù hợp nhất.

| Tiêu chí | Trọng số | Ý nghĩa |
|---|---:|---|
| Phù hợp năng lực nhóm | 30% | Công nghệ nhóm đã biết, ít thời gian học mới |
| Tốc độ phát triển | 20% | Setup, feedback loop và lượng boilerplate |
| Khả năng kiểm thử | 20% | Unit, integration, E2E và concurrency test |
| Deployment/operations | 15% | Build tách biệt, container, CI/CD và observability |
| Chi phí pilot | 10% | Có thể chạy trên free/low-cost tier, không khóa nhà cung cấp |
| Data consistency | 5% | Transaction, constraint, lock và migration |

## 3. Các phương án đã xem xét

| Phương án | Team fit | Dev speed | Test | Deploy | Cost | Consistency | Điểm có trọng số |
|---|---:|---:|---:|---:|---:|---:|---:|
| **A. React/Vite + Express + PostgreSQL** | 5 | 5 | 5 | 5 | 5 | 5 | **5.00** |
| B. Next.js full-stack + PostgreSQL | 3 | 4 | 4 | 4 | 4 | 5 | 3.70 |
| C. React + Spring Boot + PostgreSQL | 2 | 2 | 5 | 3 | 4 | 5 | 3.00 |

### Phương án A — React/Vite + Express + PostgreSQL

Ưu điểm: khớp năng lực đã xác nhận, JavaScript xuyên suốt, frontend/backend tách rõ, Vite có feedback loop nhanh, Express dễ tạo API và PostgreSQL cung cấp transaction/constraint cần cho booking.

Nhược điểm: Express không áp đặt module structure; nhóm phải tuân boundary, validation và error contract. Raw SQL cần review và migration discipline.

### Phương án B — Next.js full-stack + PostgreSQL

Ưu điểm: routing, data loading và deployment được tích hợp; có thể giảm số quyết định frontend.

Không chọn vì: yêu cầu hiện tại là frontend/backend độc lập; MVP không cần SSR/React Server Components; chuyển sang full-stack framework tạo thêm kiến thức và coupling không cần cho PoC.

### Phương án C — React + Spring Boot + PostgreSQL

Ưu điểm: ecosystem backend trưởng thành, typing mạnh và test/transaction support tốt.

Không chọn vì: Java/Spring không nằm trong năng lực nhóm đã cung cấp; chi phí học và setup làm giảm tốc độ PoC mà không tạo lợi ích cần thiết cho quy mô pilot.

### 3.1 Architectural styles đã xem xét

Slide môn học yêu cầu trả lời cả “vì sao chọn architectural style”, không chỉ framework. Ba style được đánh giá như sau:

| Style | Transaction booking | Testability | Operations/cost | Team fit | Kết luận |
|---|---|---|---|---|---|
| **Modular monolith backend** | Một transaction/DB boundary | Module và integration test rõ | Một API deployable; chi phí thấp | Phù hợp Express | **Chọn** |
| Microservices | Cần distributed consistency/saga | Service test tốt nhưng E2E phức tạp | Nhiều service, network và observability | Quá sức pilot | Không chọn |
| Serverless functions theo route | Transaction ngắn khả thi | Dễ test đơn vị, khó worker/lifecycle | Scale-to-zero nhưng có cold start/connection pressure | Thêm platform coupling | Không chọn làm baseline |

Modular monolith không có nghĩa mọi module được phép sửa chung dữ liệu tùy ý. Modules giao tiếp qua application contracts; Booking giữ state machine, Notification chỉ nhận outbox event và frontend không truy cập database.

## 4. Quyết định

Chọn phương án A với baseline sau:

| Layer | Quyết định |
|---|---|
| Frontend runtime | React SPA, JavaScript modules |
| Frontend build | Vite; không dùng Create React App |
| UI | Tailwind CSS; component accessibility được kiểm tra bằng semantic HTML và automated test |
| Routing/data | React Router; `fetch` wrapper và server-state hooks theo feature |
| Backend runtime | Node.js 24 LTS |
| HTTP API | Express 5, REST/JSON dưới `/api/v1` |
| Validation | Schema validation ở API boundary; không tin dữ liệu/role từ client |
| Database | PostgreSQL, dùng `pg` và versioned SQL migrations |
| Architecture style | Modular monolith backend; frontend là deployable riêng |
| Background work | Transactional outbox trong PostgreSQL; worker logic tách khỏi request path |
| Authentication | Server-side session qua same-origin `/api` reverse proxy; `__Host-` cookie `Secure`, `HttpOnly`, `SameSite=Lax` |
| Unit/integration test | Vitest; React Testing Library; Supertest; PostgreSQL thật cho integration/concurrency test |
| E2E test | Playwright cho critical workflow |
| Quality/CI | ESLint, formatter, dependency audit, migration check, test và build trong CI |
| Packaging | `package-lock.json` được commit; API có Dockerfile; frontend build thành static assets |

Không pin phiên bản thư viện giao diện ngay trong ADR. Mỗi ứng dụng phải pin dependency bằng lockfile và chỉ dùng release đang được hỗ trợ tại lúc scaffold. Node.js được pin theo major LTS trong runtime/container.

## 5. Source organization và deployment boundary

Frontend và backend là hai project độc lập:

```text
frontend/
  src/
    features/
    routes/
    shared/
  tests/

backend/
  src/
    modules/
    platform/
    worker/
  database/migrations/
  tests/
```

Trong bài nộp PoC, hai project có thể nằm dưới `poc/mentor-booking-feedback/` để đúng cây thư mục Task W10, nhưng không dùng chung runtime build và không cho frontend truy cập database trực tiếp.

Deployment pilot đề xuất:

- Frontend static: Vercel Hobby hoặc static host tương đương; cấu hình same-origin `/api/*` rewrite đến backend.
- Backend API: Render Free cho demo/PoC; chuyển sang paid instance khi pilot cần uptime ổn định.
- Database: Neon Free cho PoC/pilot nhỏ; dùng pooled connection và theo dõi quota.
- Worker: chạy cùng backend process chỉ trong PoC một-instance; tách thành worker process ở staging/production khi nền tảng hỗ trợ.

Đây là deployment profile mặc định, không phải vendor lock-in. API, worker và database được cấu hình qua environment variables; schema và migration không phụ thuộc extension độc quyền.

## 6. Hệ quả

### Tích cực

- Nhóm dùng đúng công nghệ đã biết và chia việc frontend/backend độc lập.
- Một ngôn ngữ giúp giảm chi phí chuyển ngữ cảnh.
- PostgreSQL trực tiếp kiểm soát booking consistency thay vì phụ thuộc memory lock.
- Static frontend và containerized API có nhiều lựa chọn triển khai chi phí thấp.

### Đánh đổi

- Nhóm phải tự duy trì module conventions cho Express.
- JavaScript cần schema validation và test tốt để bù thiếu compile-time type checking.
- Free tier có cold start, quota và không phải production SLA.
- Chạy worker cùng API chỉ phù hợp PoC; không được giả định an toàn khi scale nhiều instance.

## 7. PoC gates trước khi Accepted cho MVP

Trí cần ghi Pass/Fail và evidence cho:

1. Ít nhất 20 request concurrent cố xác nhận cùng slot; chỉ một booking chiếm slot.
2. Student/Mentor không thuộc booking không đọc được meeting link hoặc feedback.
3. Mọi booking transition hợp lệ có audit record; transition sai trả lỗi ổn định.
4. Multi-tag question filter không duplicate và không lộ Draft.
5. Notification provider lỗi không rollback booking; retry không gửi trùng theo event key.
6. Frontend build, backend test và migration chạy được độc lập trong CI.
7. Deployed frontend đăng nhập và gọi protected `/api/v1` qua same-origin proxy; cookie không phụ thuộc third-party access và CSRF negative test pass.

Nếu một gate thất bại do giới hạn stack thay vì lỗi triển khai, ADR này chuyển thành `Superseded` hoặc `Rejected` bằng ADR mới; không sửa lịch sử quyết định.

## 8. Nguồn kiểm chứng

Kiểm tra ngày 14/08/2026:

- React — Creating a React App: https://react.dev/learn/creating-a-react-app
- Vite — Getting Started: https://vite.dev/guide/
- Tailwind CSS — Using Vite: https://tailwindcss.com/docs/installation/using-vite
- Express 5 — Installing/TypeScript/Node requirements: https://expressjs.com/en/5x/starter/installing/
- Node.js release status: https://nodejs.org/en/about/previous-releases
- PostgreSQL locking: https://www.postgresql.org/docs/current/explicit-locking.html
- Playwright: https://playwright.dev/docs/intro
- Vercel pricing: https://vercel.com/pricing
- Vercel external-origin rewrites: https://vercel.com/docs/routing/rewrites
- Render free services: https://render.com/docs/free
- Neon pricing: https://neon.com/pricing
