# Hướng dẫn IaC với Terraform + Render (PrepVI) - quy trình thực tế

> Tài liệu này ghi lại quy trình Terraform/Render đã thực hiện và các bước vận hành chung
> cần xem xét trước khi áp dụng. Mọi lệnh được mô tả cho Windows PowerShell;
> đường dẫn cài Terraform có thể khác giữa các máy.

---

## 0. Kết quả DevOps của dự án

| Thành phần | Trạng thái |
|---|---|
| CI | ✅ Đã có: `.github/workflows/ci.yml` (lint, kiểm tra kiểu, độ lệch OpenAPI, migration, xác minh seed, build và quét thông tin bí mật). Workflow hiện chưa chạy `npm test` và không gửi email kết quả triển khai. |
| Triển khai từ Git | ✅ Render tự dựng và triển khai khi `main` thay đổi; đây chưa phải quy trình Continuous Deployment hoàn chỉnh. |
| IaC | ✅ Terraform `infra/` - nhập và mô tả hai dịch vụ thật. Plan được lưu cho thấy hai thay đổi tại chỗ, vì vậy chưa được gọi là không có thay đổi/khớp 100%. |
| DB | Supabase chung nhóm (không thuộc IaC) |
| Worker | ⏸️ Chưa triển khai theo quyết định hosting/chi phí hiện tại; chức năng bị giới hạn xem mục 10. |

## 1. Hạ tầng thật (đọc từ Render API `/v1/services`)

| Service | ID | Kiểu | Cách build | Plan |
|---|---|---|---|---|
| `InterviewQuestionBank` | `srv-da402mjtqb8s73fplbcg` | web_service | Git, rootDir=`backend`, `npm ci; npm run build`, start `npm start` | **free** |
| `InterviewQuestionBank-fe` | `srv-da403pbtqb8s73fpnmig` | static_site | Git, `npm ci; npm run build --workspace frontend`, publish `frontend/dist` | — |
| worker | ❌ không có | — | — | — |

→ **Không dùng Docker Hub:** Render dựng trực tiếp từ Git. GitHub Actions hiện không có job triển khai; tích hợp Git của Render là một cơ chế riêng và chưa có đầy đủ cổng kiểm thử, staging hoặc kiểm tra sau triển khai.

## 2. Bước 1 — Cài Terraform trên Windows

1. Tải https://developer.hashicorp.com/terraform/downloads → **Windows 64-bit** → giải nén `terraform.exe` vào `C:\terraform\`
2. Thêm PATH: **Start → tìm "Edit environment variables" → User variables → Path → New → `C:\terraform`** → OK
3. **Mở PowerShell MỚI** (bắt buộc — PATH chỉ nạp khi terminal khởi động) và kiểm tra:
   ```powershell
   terraform version
   ```
   → `Terraform v1.x.x`
   Nếu gõ `terraform` vẫn lỗi: dùng đường dẫn đầy đủ `& "C:\terraform\terraform.exe" ...` cho mọi lệnh sau.

## 3. Bước 2 — Lấy credentials Render

- **API key:** https://dashboard.render.com/u/settings?add-api-key → **Create API Key** (tên `ci`) → copy `rnd_...` (chỉ hiện 1 lần).
- **Owner ID:** chạy, JSON trả về có `"id"` (dạng `usr_...`/`tea_...`):
  ```powershell
  curl.exe -H "Authorization: Bearer rnd_...KEY..." https://api.render.com/v1/owners
  ```
- **Lưu ý bảo mật:** không dán khóa vào chat, tài liệu nộp hoặc ảnh chụp. Chỉ tài khoản vận hành được ủy quyền mới tạo và sử dụng khóa.

## 4. Bước 3 — Lấy danh sách service + ID

```powershell
(Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers @{Authorization="Bearer rnd_...KEY..."}) | Select-Object id, name, type, plan | Format-Table
```
→ Copy 2 ID: API `srv-da402mjtqb8s73fplbcg`, frontend `srv-da403pbtqb8s73fpnmig`.

> Nếu chỉ muốn xem nhanh (không in ra khóa): kết quả JSON trả về **không chứa** key — an toàn khi mình nhìn.

## 5. Bước 4 — Điền `infra/terraform.tfvars`

```powershell
Set-Location <duong-dan-repository>\infra
copy terraform.tfvars.example terraform.tfvars
notepad terraform.tfvars
```
Điền các giá trị mà `infra/variables.tf` thực sự yêu cầu:
```ini
render_api_key   = "rnd_..."              # bước 3 (dán từ bạn cấp)
render_owner_id  = "tea_..."              # bước 3
env_database_url = "postgresql://..."
env_session_secret = "..."
env_gemini_api_key = "..."                # để trống/chỉ điền khi cấu hình AI được phê duyệt
```
> **Nguồn giá trị đúng:** secret manager/nguồn nội bộ đã được nhóm phê duyệt hoặc tab **Environment** của dịch vụ Render. Không lấy secret từ chat, tài liệu nộp, ảnh chụp hoặc một tệp `.env` đã commit. API provider có thể ẩn giá trị nhạy cảm; người không có quyền phải dừng và nhờ người vận hành được ủy quyền.
>
> ⚠️ Nếu service thật đang **thiếu** 2 biến này → app sẽ crash khi khởi động; `terraform plan` sẽ báo "add env" và apply sẽ tự sửa.

## 6. Bước 5 — init + validate

```powershell
& "C:\terraform\terraform.exe" init       # tải provider render-oss/render
& "C:\terraform\terraform.exe" validate   # kỳ vọng "Success! The configuration is valid."
```
(Init lần đầu tạo `.terraform.lock.hcl` — khóa version provider, nên commit.)

## 7. Bước 6 — IMPORT (không tạo mới; state local đã gitignore)

```powershell
& "C:\terraform\terraform.exe" import render_web_service.api srv-da402mjtqb8s73fplbcg
& "C:\terraform\terraform.exe" import render_static_site.frontend srv-da403pbtqb8s73fpnmig
```
- Import **chỉ ghi state**, không sửa gì trên Render.
- **Truyền biến:** nếu thiếu trong `terraform.tfvars`, dùng env `TF_VAR_render_api_key=...` khi chạy lệnh (một số dòng có secret nên ưu tiên file).

## 8. Bước 7 — plan (kiểm tra trước khi apply)

```powershell
& "C:\terraform\terraform.exe" plan
```

**Đọc kết quả:**
- `No changes` cho biết config/state/provider không có khác biệt tại thời điểm plan; không chứng minh ứng dụng khỏe.
- Khác biến môi trường: phải review từng mục và bảo đảm không xóa/thay giá trị đang cần. Không mặc định coi khác biệt là chấp nhận được.
- ⚠️ Nếu báo `plan "free" → "starter"` **hoặc lỗi enum** `invalid plan value "free"`: provider Render ghi danh sách plan là `starter/standard/pro...` — nếu lỗi, **đổi hướng**: không quản lý service free bằng Terraform (giữ quản lý tay), hoặc nâng starter (tốn tiền). Báo nhóm trước.

**Khi muốn đồng bộ thật:**
```powershell
& "C:\terraform\terraform.exe" apply
```
> Ảnh `plan` chỉ là bằng chứng xem trước. Chỉ `apply` sau plan mới, review đầy đủ, phê duyệt và kế hoạch xác minh/khôi phục phù hợp.

## 9. Bước 8 — Push và lưu bằng chứng

```powershell
git add infra iaac_tutorial.md
git commit -m "feat(devops): terraform IaC for prepvi (api + frontend)"
git push
```
Checklist evidence DevOps:
- [x] Terraform configuration and redacted plan are stored in the repository.
- [x] A successful CI/secret-scan screenshot is retained in the oral-exam evidence set.
- [x] Public frontend and API-health captures are retained in the DevOps evidence set.
- [ ] The repository does not retain the two original import-success screenshots; do not claim they are attached.
- [ ] A Render deploy-log screenshot tied to a commit still needs to be retained if required by the examiner.

## 10. Worker — quyết định và giới hạn vận hành

Công việc của worker (`backend/src/worker/index.js`) gồm xử lý trích xuất/OCR, hộp thư chờ email và thông báo trong ứng dụng, AI job khi được bật, dọn tệp/AI input hết hạn, công khai đánh giá và cập nhật xếp hạng đến hạn, cùng chuyển cấp phục hồi liên kết họp.

**Chưa triển khai worker:** không được coi các luồng OCR nền, outbox, lịch nhắc, cleanup, review publication/rating và meeting recovery escalation là đang chạy liên tục trên môi trường hosted. Các đường dán/sửa thủ công và phục hồi trong UI chỉ giảm tác động, không thay thế worker.

**Lý do được lưu trong repository:** cấu hình Terraform hiện chỉ quản lý API/frontend và nhóm chưa phê duyệt phương án hosting/chi phí cho worker. Trước pilot phải chọn, triển khai và lưu bằng chứng readiness/retry/recovery; không dùng tài liệu này để khẳng định một mức giá Render hiện hành.

## 11. Lỗi thường gặp & cách xử lý

| Lỗi | Nguyên nhân | Xử lý |
|---|---|---|
| `env-vars` trả rỗng | API ẩn secret / env trong Group | lấy từ `.env` gốc repo / Dashboard Environment |
| `terraform` not recognized | PATH chưa nạp | mở terminal mới, hoặc `& "C:\terraform\terraform.exe"` |
| `401 Unauthorized` | key sai/thiếu `rnd_` | copy lại toàn chuỗi |
| `import: not found` | sai account key / sai service id | kiểm tra `owner_id` trong `/v1/services` |
| `invalid plan value "free"` | provider enum thiếu free | xem mục 8 — giữ ngoài TF hoặc nâng plan |
| Plan báo đổi env liên tục | tfvars khác giá trị Dashboard | đồng nhất giá trị rồi mới apply |
| `free → starter` trong plan | cấu hình starter nhưng service free | **KHÔNG apply** nếu không muốn tốn tiền |

## 12. Minh chứng được lưu

Repository hiện lưu:

- `docs/DevOps/03-plan.txt`: Terraform plan đã che dữ liệu nhạy cảm, cho biết `0 to add, 2 to change, 0 to destroy`;
- `docs/Oral_Exam/Q15_devops/img/Q15-01-live-frontend.png`: frontend công khai;
- `docs/Oral_Exam/Q15_devops/img/Q15-02-github-actions.png`: cửa sổ GitHub Actions thật;
- `docs/Oral_Exam/Q15_devops/img/Q15-03-terraform-github.png`: cấu hình Terraform trong cửa sổ GitHub thật; và
- `docs/Oral_Exam/Q15_devops/img/Q15-04-api-health-terminal.png`: kiểm tra API health của môi trường production trong Windows Terminal thật.

Ảnh gốc của `terraform init`/`terraform import` được nhắc trong bản nháp cũ không tồn tại. Không liệt kê chúng là minh chứng đính kèm trừ khi nhóm chụp lại và commit.

## 13. Tổng kết tệp

| File | Vai trò |
|---|---|
| `infra/providers.tf` | Khối Terraform và provider Render |
| `infra/variables.tf` | Đầu vào (nhạy cảm: API key, owner, DB URL, session secret...) |
| `infra/main.tf` | Hai tài nguyên: `render_web_service.api` và `render_static_site.frontend` |
| `infra/outputs.tf` | URL/ID |
| `infra/terraform.tfvars.example` | Mẫu điền (không secret) |
| `infra/terraform.tfvars` | (gitignore) giá trị thật |
| `iaac_tutorial.md` | (file này) |
