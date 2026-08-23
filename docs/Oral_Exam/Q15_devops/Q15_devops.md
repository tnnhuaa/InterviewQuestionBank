# Câu 15 - DevOps

## 1. Phạm vi câu hỏi

Câu này cần giải thích DevOps là gì, nhóm đã áp dụng công cụ và luồng nào, kết quả thực tế ra sao, phần nào còn thủ công và minh chứng nằm ở đâu. Không được dùng sơ đồ mục tiêu để tuyên bố hệ thống production đã hoàn thiện.

## 2. Thuật ngữ cốt lõi

- **DevOps:** cách phối hợp con người, quy trình và công cụ để đưa thay đổi từ mã nguồn đến môi trường chạy một cách lặp lại, có kiểm soát và quan sát được.
- **Tích hợp liên tục (Continuous Integration - CI):** tự động kiểm tra thay đổi khi push hoặc mở Pull Request.
- **Chuyển giao liên tục (Continuous Delivery - CD):** giữ bản phát hành ở trạng thái có thể triển khai; production thường còn bước phê duyệt.
- **Triển khai liên tục (Continuous Deployment):** tự động đưa mọi thay đổi đạt cổng chất lượng lên production.
- **Hạ tầng dưới dạng mã (Infrastructure as Code - IaC):** mô tả hạ tầng bằng tệp có version thay vì cấu hình thủ công không truy vết được.

## 3. Câu trả lời theo WHAT - HOW - WHY - WHEN - EVIDENCE

### WHAT - Nhóm đang có gì?

- Git và GitHub để quản lý phiên bản/Pull Request.
- GitHub Actions CI với hai công việc tự động `quality` và `secret-scan`.
- Terraform trong `infra/` mô tả hai dịch vụ Render đã tồn tại: API và frontend tĩnh.
- Render tự build/deploy từ nhánh `main` qua tích hợp Git.
- Supabase PostgreSQL là cơ sở dữ liệu dùng chung, nằm ngoài Terraform state hiện tại.
- Mã nguồn tiến trình nền (background worker) có trong repository nhưng tiến trình này chưa được triển khai trên Render.

### HOW - Luồng thực tế

1. Thành viên tạo nhánh, commit và push lên GitHub.
2. GitHub Actions cài thư viện phụ thuộc, lint, kiểm tra kiểu, kiểm tra độ lệch OpenAPI, chạy lại chuyển đổi cơ sở dữ liệu, seed tham chiếu, build và quét thông tin bí mật.
3. Khi thay đổi được merge/push vào `main`, Render tự build API và frontend từ Git.
4. Terraform dùng để import và mô tả hai dịch vụ Render hiện hữu; `plan` phải được xem xét trước khi `apply`.
5. API cung cấp health endpoint; frontend sử dụng rewrite `/api/*` về backend.
6. Các tác vụ OCR nền, hộp thư chờ/email, nhắc lịch và dọn dữ liệu phụ thuộc tiến trình nền nên chưa đầy đủ trên môi trường trực tuyến.

### WHY - Vì sao áp dụng?

- Tạo cùng một chuỗi kiểm tra cho mọi thay đổi.
- Phát hiện lỗi kiểu dữ liệu, hợp đồng API, chuyển đổi cơ sở dữ liệu, seed và thông tin bí mật trước khi hợp nhất mã.
- Giảm cấu hình hạ tầng chỉ tồn tại trong tài khoản cá nhân.
- Gắn commit với thay đổi hạ tầng và deployment.
- Tách rõ phần tự động với các bước còn cần vận hành thủ công.

### WHEN - Các mốc có bằng chứng

- `7872fba` ngày 16/08/2026: foundation skeleton và CI ban đầu.
- `6a0e6b3` ngày 18/08/2026: PrepVI v1.0.0 và luồng hệ thống mở rộng.
- Lần chạy GitHub Actions `32390206781` ngày 20/08/2026: hai công việc `quality` và `secret-scan` thành công sau khi sửa quyền Gitleaks.
- `dce33d7` ngày 23/08/2026, PR #26: thêm Terraform IaC cho Render API/frontend.
- Ngày 23/08/2026: frontend công khai hoạt động và API health trả HTTP `200` trong lần rà soát tài liệu.

### EVIDENCE - Minh chứng

- `.github/workflows/ci.yml`.
- `infra/main.tf`, `providers.tf`, `variables.tf`, `outputs.tf` và lock file.
- `iaac_tutorial.md` và Terraform plan đã che giá trị nhạy cảm.
- Ảnh GitHub Actions thành công.
- Ảnh frontend công khai và phản hồi API health.

## 4. CI hiện tại

Job `quality` chạy:

1. checkout;
2. Node.js 24 và npm cache;
3. `npm ci`;
4. lint;
5. typecheck;
6. OpenAPI generated-type drift;
7. chạy lặp migration trên PostgreSQL 17;
8. reference seed chạy lặp và verify;
9. build.

Công việc `secret-scan` dùng Gitleaks, lấy toàn bộ lịch sử Git và nhận `GITHUB_TOKEN` với quyền đọc nội dung/Pull Request.

**Giới hạn:** luồng tự động hiện không chạy `npm test`, không tạo gói phát hành có phiên bản, không triển khai môi trường staging và không kiểm tra nhanh URL sau triển khai.

## 5. Tự động triển khai và IaC hiện tại

Render hiện tự động dựng và triển khai khi thay đổi tới `main`; đây là cơ chế tự động triển khai dựa trên Git. Tuy nhiên, do chưa có `npm test` trong CI, môi trường tiền sản xuất (staging), cổng phê duyệt, gói phát hành bất biến và kiểm tra sau triển khai, nhóm không gọi đây là một quy trình Triển khai liên tục (Continuous Deployment) hoàn chỉnh.

| Thành phần | Hiện trạng | Giới hạn |
|---|---|---|
| Frontend | Trang tĩnh Render, tự triển khai từ `main`, xuất bản `frontend/dist` | Gói miễn phí; cần theo dõi nhật ký build/triển khai |
| API | Render Node web service, root `backend`, health check `/api/v1/health` | Cold start và không có production SLA |
| Cơ sở dữ liệu | Supabase PostgreSQL qua biến nhạy cảm | Không nằm trong Terraform state; Render/Terraform không điều phối migration |
| Tiến trình nền | Mã nguồn và lệnh chạy có trong backend | Chưa triển khai; công việc nền không đầy đủ trên môi trường trực tuyến |
| Terraform | Import/mô tả hai dịch vụ thật | Không tự chạy trong GitHub Actions; apply vẫn là thao tác được kiểm soát |

Terraform không lưu thông tin bí mật thật. `terraform.tfvars` bị bỏ khỏi Git; biến khóa truy cập, URL cơ sở dữ liệu và bí mật phiên đăng nhập được đánh dấu `sensitive`.

## 6. Kết quả rà soát môi trường đang chạy

- Frontend `https://prepvi.tinthanh.id.vn/` tải được trang chủ.
- API `https://interviewquestionbank.onrender.com/api/v1/health` trả HTTP `200` với body `{"status":"ok",...}`.
- Header tại thời điểm chụp vẫn trả `access-control-allow-origin: http://localhost:5173`. Frontend dùng same-origin rewrite nên trang công khai vẫn hoạt động, nhưng biến môi trường production cần được kiểm tra.
- Health check chỉ chứng minh tiến trình API phản hồi; không chứng minh cơ sở dữ liệu sẵn sàng, tiến trình nền, mọi trường hợp sử dụng hoặc SLA.

## 7. Khoảng trống và xử lý thủ công

- Chưa triển khai tiến trình nền do giới hạn gói Render; OCR nền, hộp thư chờ/email, nhắc lịch và dọn dữ liệu cần tiến trình này hoặc thao tác dự phòng.
- Chưa có test step trong CI.
- Chưa có immutable release artifact, protected staging gate, rollback drill hoặc deployment-result email trong repository.
- Terraform plan phải được xem xét; không `apply` khi plan nâng gói trả phí hoặc thay đổi/xóa ngoài dự kiến.
- Cần xác nhận lại `FRONTEND_ORIGIN`/CORS trên môi trường deployed.
- Khi nhà cung cấp lỗi, người vận hành phải dựa vào health/readiness, nhật ký đã che dữ liệu, mã tương quan và hướng dẫn phục hồi; không sửa trực tiếp dữ liệu như thao tác bình thường.

## 8. Minh chứng hình ảnh

**Hình Q15-01 - Frontend công khai đang hoạt động.**

![Live PrepVI frontend](img/Q15-01-live-frontend.png)

**Hình Q15-02 - Cửa sổ GitHub Actions của repository.**

![GitHub Actions workflow runs](img/Q15-02-github-actions.png)

**Hình Q15-03 - Cấu hình Terraform được mở trực tiếp trên GitHub.**

![Terraform configuration on GitHub](img/Q15-03-terraform-github.png)

**Hình Q15-04 - Cửa sổ Windows Terminal thật hiển thị phản hồi health của API, correlation ID, CORS và mã thoát 0.**

![Public API health response in Windows Terminal](img/Q15-04-api-health-terminal.png)

Ảnh GitHub Actions chứng minh repository có lịch sử workflow run. Cần mở từng run để kiểm tra step cụ thể; trạng thái xanh không tự chứng minh `npm test` đã chạy vì workflow hiện không có test step. Ảnh health chỉ chứng minh API phản hồi tại thời điểm chụp, không chứng minh database readiness hoặc tiến trình nền.

## 9. Tài liệu in kèm

- [DevOps Report](DevOps_Report.md).
- [GitHub Actions CI](../../../.github/workflows/ci.yml).
- [Terraform main configuration](../../../infra/main.tf).
- Các hình Q15-01 đến Q15-04 trong mục minh chứng hình ảnh.

## 10. Checklist tự học

- [ ] Phân biệt CI, Continuous Delivery và Continuous Deployment.
- [ ] Mô tả đúng GitHub Actions -> Render tự triển khai từ Git -> health check.
- [ ] Nêu đúng Supabase ngoài Terraform và tiến trình nền chưa triển khai.
- [ ] Không tuyên bố CI chạy unit test.
- [ ] Nêu được CORS localhost là cấu hình cần kiểm tra.
- [ ] Giải thích cách bảo vệ thông tin bí mật và xem xét Terraform plan.
