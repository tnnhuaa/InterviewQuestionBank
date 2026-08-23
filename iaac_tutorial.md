# Hướng dẫn IaC với Terraform + Render (PrepVI) — step-by-step thực tế

> Tài liệu này ghi lại **toàn bộ quy trình đã làm** (từ lấy key đến plan/push) để phục vụ
> Q15 — DevOps. Mọi lệnh đều chạy trên Windows PowerShell, Terraform đặt tại `C:\terraform\`.

---

## 0. Kết quả DevOps của dự án — tóm tắt cho Q15

| Thành phần | Trạng thái |
|---|---|
| CI | ✅ Đã có: `.github/workflows/ci.yml` (lint, typecheck, OpenAPI drift, migration, build, secret-scan, email notify) |
| CD | ✅ Render tự deploy bằng Git khi push `main` (webhook tự động) |
| IaC | ✅ Terraform `infra/` — import 2 service thật vào state |
| DB | Supabase chung nhóm (không thuộc IaC) |
| Worker | ⏸️ Chưa deploy (worker không có gói free, bắt buộc Starter $7/tháng) — chức năng bị giới hạn xem mục 8 |

## 1. Hạ tầng ThẬT (đọc từ Render API `/v1/services`)

| Service | ID | Kiểu | Cách build | Plan |
|---|---|---|---|---|
| `InterviewQuestionBank` | `srv-da402mjtqb8s73fplbcg` | web_service | Git, rootDir=`backend`, `npm ci; npm run build`, start `npm start` | **free** |
| `InterviewQuestionBank-fe` | `srv-da403pbtqb8s73fpnmig` | static_site | Git, `npm ci; npm run build --workspace frontend`, publish `frontend/dist` | — |
| worker | ❌ không có | — | — | — |

→ **Không dùng Docker Hub**: Render build trực tiếp từ Git repo. Không tạo job CD mới trong GitHub Actions (Render Git-deploy là CD hiện tại; thêm job sẽ trùng lặp).

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
- **Lưu ý bảo mật:** không dán key vào chat/group/ảnh chụp. Key cấp cho account đã deploy (`tea-d3kv25b3fgac73a56m4g` — team account).

## 4. Bước 3 — Lấy danh sách service + ID

```powershell
(Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers @{Authorization="Bearer rnd_...KEY..."}) | Select-Object id, name, type, plan | Format-Table
```
→ Copy 2 ID: API `srv-da402mjtqb8s73fplbcg`, frontend `srv-da403pbtqb8s73fpnmig`.

> Nếu chỉ muốn xem nhanh (không in ra khóa): kết quả JSON trả về **không chứa** key — an toàn khi mình nhìn.

## 5. Bước 4 — Điền `infra/terraform.tfvars`

```powershell
cd F:\D\Uni\YEAR_3\SEM_3\QLPM\InterviewQuestionBank\infra
copy terraform.tfvars.example terraform.tfvars
notepad terraform.tfvars
```
Điền **6 giá trị** này:
```ini
render_api_key   = "rnd_..."              # bước 3 (dán từ bạn cấp)
render_owner_id  = "tea_..."              # bước 3
env_database_url = "postgresql://..."     # từ file .env gốc repo (Supabase chung)
env_session_secret = "..."                # từ file .env gốc repo
```
> **Nguồn env nào đúng?** API `/v1/services/{id}/env-vars` thường **trả rỗng/ẩn giá trị secret** — đừng tốn thời gian. Cách chắc chắn gấp đôi:
> 1. **`.env` gốc repo** (`F:\D\...\InterviewQuestionBank\.env`) — nguồn nhóm dùng chung; đã có `DATABASE_URL` + `SESSION_SECRET`.
> 2. **Dashboard Render** → service → tab **Environment** (hoặc Environment Groups) — chỉ check khi cần.
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
- Lý tưởng: `No changes` — IaaC khớp 100%.
- Khác env: plan báo thay đổi env (VD: service đang thiếu `DATABASE_URL` → plan "thêm") — chấp nhận được.
- ⚠️ Nếu báo `plan "free" → "starter"` **hoặc lỗi enum** `invalid plan value "free"`: provider Render ghi danh sách plan là `starter/standard/pro...` — nếu lỗi, **đổi hướng**: không quản lý service free bằng Terraform (giữ quản lý tay), hoặc nâng starter (tốn tiền). Báo nhóm trước.

**Khi muốn đồng bộ thật:**
```powershell
& "C:\terraform\terraform.exe" apply
```
> Với demo/nộp bài: upload screenshot `plan` là đủ bằng chứng — apply chỉ làm khi muốn sửa env thật.

## 9. Bước 8 — Push & bằng chứng nộp Q15

```powershell
git add infra iaac_tutorial.md
git commit -m "feat(devops): terraform IaC for prepvi (api + frontend)"
git push
```
Checklist screenshot Q15-DevOps:
- [ ] `terraform init` + `validate` + `plan` (ảnh)
- [ ] Result import: `Import successful! The resource is now managed by Terraform` (x2)
- [ ] CI workflow xanh (đã có sẵn)
- [ ] Render service tự deploy khi push `main` (ảnh Deploy log / URL hoạt động)

## 10. Worker — quyết định & giới hạn (ghi chú cho Q15)

Công việc của worker (`backend/src/worker/index.js`, poll 2s): extract text JD upload (OCR), gửi email/SMS outbox (verify, reset password, mời admin, booking, feedback, reminder 24h/1h), AI jobs (khi `AI_ENABLED=true`), dọn-dẹp file & AI input, publish review + rating mentor, escalate link phòng họp quá hạn.

**Chưa deploy worker → mất những gì:** upload JD chờ extract (có fallback dán text thủ công), email & in-app notification, review công khai & rating mentor, cleanup storage, escalate link. **Không ảnh hưởng:** app hiện vẫn chạy, đặt lịch/paste text/AI tắt (`AI_ENABLED=false`).

**Lý do:** Render background worker **không có gói free** (Starter $7/tháng). Chọn giữ nguyên free → worker nằm ngoài IaC; muốn đầy đủ: thêm resource `render_background_worker` + đổi plan starter.

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

## 12. Bằng chứng (screenshots thực tế)

Lưu 2 ảnh vào `docs/DevOps/` với đúng tên dưới:

- `docs/DevOps/01-init-validate.png` — `terraform init` + `validate` thành công
- `docs/DevOps/02-import.png` — import 2 service (api + static site) thành công

![](docs/DevOps/01-init-validate.png)

![](docs/DevOps/02-import.png)

(Mục dưới đây được thêm sau khi chạy `plan` — dán tiếp ảnh `03-plan.png`.)

## 13. Tổng kết tệp

| File | Vai trò |
|---|---|
| `infra/providers.tf` | Block terraform + provider render |
| `infra/variables.tf` | Input (sensitive: API key, owner, DB URL, session secret...) |
| `infra/main.tf` | 2 resource: `render_web_service.api` + `render_static_site.frontend` |
| `infra/outputs.tf` | URL/ID |
| `infra/terraform.tfvars.example` | Mẫu điền (không secret) |
| `infra/terraform.tfvars` | (gitignore) giá trị thật |
| `iaac_tutorial.md` | (file này) |
