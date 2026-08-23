# Câu 15 — DevOps

> **Bàn giao (handover):** Phần Implementation/IaC đã được [Tên người cài — PHẦN ĐIỀN] thực hiện đầy đủ
> ngày [00/00/2026] trên nhánh `feat/devops-iaac` (mới merge `main`). Nhiệm vụ của thành viên
> phụ trách **Q15**: đọc tài liệu tham chiếu rồi hoàn thiện các PHẦN ĐIỀN bên dưới và bổ sung
> bằng chứng (screenshot) theo checklist. **Toàn bộ quy trình làm thật nằm ở**
> [`iaac_tutorial.md`](../../../iaac_tutorial.md) — bắt đầu từ mục 0 đến mục 13.

---

## 1. Đề bài

TODO: Chép đúng câu hỏi Q15 — DevOps (mối quan hệ DevOps, IaaC, CI/CD...) và yêu cầu bản in.

**Tham chiếu:** `iaac_tutorial.md` mục 12-13 (bằng chứng nộp bài).

## 2. Trạng thái DevOps hiện tại của dự án (ĐÃ LÀM — chỉ cần viết lại lời của bạn)

| Thành phần | Trạng thái | Vị trí |
|---|---|---|
| CI | ✅ Có từ trước | `.github/workflows/ci.yml` (lint, typecheck, OpenAPI drift, migration replay, build, secret-scan, email notify) |
| CD | ✅ Render tự deploy từ git khi push `main` | Webhook Render (autoDeploy, trigger `checksPass`) — chi tiết `iaac_tutorial.md` mục 1 |
| IaC | ✅ Terraform + provider `render-oss/render` | `infra/` (main.tf, variables.tf, providers.tf, outputs.tf) |
| DB | Supabase chung nhóm (NGOÀI IaC) | — `iaac_tutorial.md` mục 0, 6 |
| Worker | ⏸️ Chưa deploy (lý do mục 6) | `iaac_tutorial.md` mục 10 |

## 3. Hạ tầng được IaC quản lý (ĐÃ CÓ DỮ LIỆU)

- `render_web_service.api` — `InterviewQuestionBank` (id `srv-da402mjtqb8s73fplbcg`): Node, rootDir `backend`, plan **free**, env có `DATABASE_URL`/`SESSION_SECRET`...
- `render_static_site.frontend` — `InterviewQuestionBank-fe` (id `srv-da403pbtqb8s73fpnmig`): build `frontend/dist`, **custom domain `prepvi.tinthanh.id.vn`**, 2 rewrite route (`/api/*` → backend, `/*` → index.html).
- **Không** có background worker, **không** dùng Docker Hub trong cấu hình này.
- Tham chiếu: `iaac_tutorial.md` mục 1 (bảng hạ tầng) + `infra/main.tf`.

## 4. Quy trình thực tế đã làm (từ 0 → Import → Plan)

TODO: Viết lại theo lời của bạn, nhưng trình tự & lệnh chính xác lấy từ `iaac_tutorial.md`:

1. Cài Terraform Windows (mục 2).
2. Lấy Render API Key + Owner ID (mục 3) — lưu vào `infra/terraform.tfvars` (gitignore; **không** commit).
3. Lấy danh sách service thật + ID bằng `/v1/services` (mục 4).
4. Điền `terraform.tfvars`: key, owner, `DATABASE_URL`/`SESSION_SECRET` từ `.env` gốc (mục 5).
5. `terraform init` + `validate` (mục 6).
6. **`terraform import` 2 service** — việc quan trọng: không tạo mới, không đụng Render (mục 7).
7. `terraform plan` → kết quả `0 to add, 2 to change, 0 to destroy` — chứng minh IaC quản lý đúng, **không rủi ro** (mục 8).
8. Commit/push + CI xanh (mục 9).

**Kết quả bằng chứng (đã lưu):**
- `docs/DevOps/03-plan.txt` — output `terraform plan` (text, trong repo).
- Screenshot `01-init-validate.png`, `02-import.png` — **PHẦN ĐIỀN**: thả 2 ảnh vào `docs/DevOps/` (vị trí đã có trong `iaac_tutorial.md` mục 12).
- Screenshot CI xanh trên GitHub Actions — PHẦN ĐIỀN.

## 5. Quyết định kỹ thuật (điểm "đắt" cho điểm nếu thầy hỏi)

1. **Import thay vì Apply** — hạ tầng đã tồn tại; `apply` sẽ tạo service trùng. Import để IaC "nhận nuôi" hạ tầng thật.
2. **Giữ plan `free`** — không quản lý nâng cấp trả phí; thể hiện IaC *điều chỉnh theo nhu cầu* chứ không nổ hạn mức.
3. **Không Docker Hub** — Render build thẳng từ Git (monorepo rootDir/workspaces). Tránh thêm 1 hệ thống khi chưa cần.
4. **Worker nằm ngoài IaC** — Render worker không có gói free; chọn miễn phí, đánh đổi chức năng (xem mục 6).
5. **Env tách vào biến Terraform (`sensitive`)** — secret không lộ trong code/state/CI; chỉ ở `terraform.tfvars` (gitignore) + secrets.

## 6. Giới hạn & đánh đổi (khoan trách đạo đức)

- **Không deploy worker** → mất: extract JD tải lên (OCR), email & in-app notification (verify email, reset password, mời admin, nhắc lịch...), publish review + rating mentor, escalate link phòng họp. **Fallback:** user dán text thủ công; `AI_ENABLED=false` nên AI không đụng. Chi tiết: `iaac_tutorial.md` mục 10.
- **State local** trên máy người cài — chưa dùng remote backend; mở rộng đúng chuẩn: Terraform Cloud/S3 (`iaac_tutorial.md` mục 9 ghi chú).
- Env code khác live ~30 biến — plan báo diff env (chấp nhận; apply phải review trước).

## 7. Ca thực tế (kinh nghiệm chia sẻ — có thể dùng ví dụ)

> Kịch bản "thêm biến env mới" 4 nhân vật (Dev, Ops, Terraform, Render) trong `iaac_tutorial.md` mục 13? — TODO: xem lại, chọn 1 ví dụ kể 1 phút.

## 8. Câu hỏi phụ thường gặp

TODO: trả lời theo WHAT–HOW–WHY–WHEN:
- IaC là gì, khác CI/CD chỗ nào?
- Vì sao dùng Terraform thay vì bấm Dashboard?
- Import vs Apply khác nhau thế nào?
- Nhược điểm/giới hạn của cách tiếp cận này?

## 9. Bản in phải nộp

- [ ] Ảnh `01-init-validate.png`, `02-import.png` (lưu vào `docs/DevOps/`).
- [ ] `03-plan.txt` (đã có) + ảnh CI xanh.
- [ ] Ảnh `terraform state list` (2 resource) — chưa chụp.
- [ ] Ảnh deploy log Render sau merge (Deploys → Live).

## 10. Tài liệu tham khảo khi viết

- [`infra/main.tf`](../../../infra/main.tf) — khai báo 2 resource.
- [`iaac_tutorial.md`](../../../iaac_tutorial.md) — toàn bộ quy trình + giải thích.
- [`docs/DevOps/03-plan.txt`](../../../docs/DevOps/03-plan.txt) — bằng chứng plan.
- Render docs API key — https://api-docs.render.com/reference/authentication (nếu thầy phản biện API).
