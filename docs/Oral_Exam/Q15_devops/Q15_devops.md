# Câu 15 - DevOps

## 1. Đề chính thức và các ý bắt buộc

> Vẽ và giải thích mô hình DevOps của nhóm. Ghi chú trên mô hình các công cụ nhóm đã dùng cho từng thành phần. Tại sao cần sử dụng quy trình DevOps cho dự án? Giải thích quy trình phát triển, triển khai và vận hành liên tục đồng thời nhiều phiên bản của dự án bằng cách áp dụng DevOps.

**Bản in đề yêu cầu:** kịch bản khởi tạo/cấu hình tài nguyên hạ tầng và hệ thống thư mục/tệp hỗ trợ quản lý hạ tầng triển khai.

Khi trả lời phải bao phủ năm ý:

1. vẽ được mô hình DevOps và chỉ rõ đầu vào - xử lý - đầu ra;
2. ghi đúng công cụ thật của từng thành phần;
3. giải thích vì sao dự án cần DevOps;
4. phân biệt khả năng làm việc đồng thời trên nhiều phiên bản mã với khả năng chạy đồng thời nhiều phiên bản production;
5. chỉ ra kịch bản Terraform, cây thư mục IaC, minh chứng hiện có và khoảng trống chưa triển khai.

## 2. Thuật ngữ cốt lõi

- **DevOps:** cách phối hợp con người, quy trình và công cụ để đưa thay đổi từ mã nguồn đến môi trường chạy một cách lặp lại, có kiểm soát và quan sát được.
- **Tích hợp liên tục (Continuous Integration - CI):** tự động kiểm tra thay đổi khi push hoặc mở Pull Request.
- **Chuyển giao liên tục (Continuous Delivery):** giữ bản phát hành ở trạng thái có thể triển khai; production thường vẫn có quyết định phê duyệt.
- **Triển khai liên tục (Continuous Deployment):** tự động đưa mọi thay đổi đã vượt đầy đủ cổng chất lượng lên production.
- **Hạ tầng dưới dạng mã (Infrastructure as Code - IaC):** khai báo hạ tầng trong tệp có quản lý phiên bản thay vì chỉ cấu hình thủ công trên giao diện nhà cung cấp.
- **Trạng thái Terraform (Terraform state):** dữ liệu ánh xạ tài nguyên trong mã với tài nguyên thật; state có thể chứa dữ liệu nhạy cảm và không được commit.
- **Sai lệch cấu hình (configuration drift):** trạng thái thật khác cấu hình được khai báo hoặc khác state.
- **Cờ tính năng (feature flag):** cấu hình bật/tắt một năng lực mà không phải xóa mã nguồn, ví dụ các biến `AI_*`.
- **Kiểm tra sống/kiểm tra sẵn sàng (health/readiness check):** health cho biết tiến trình có phản hồi; readiness cần kiểm tra thêm các phụ thuộc cần thiết để phục vụ yêu cầu.

## 3. Câu trả lời theo WHAT - HOW - WHY - WHEN - EVIDENCE

### WHAT - Nhóm đang có gì?

- Git và GitHub quản lý phiên bản, nhánh và yêu cầu hợp nhất (Pull Request).
- GitHub Actions chạy hai công việc `quality` và `secret-scan`.
- Render tự động dựng và triển khai API cùng frontend từ nhánh `main` qua tích hợp Git.
- Terraform trong `infra/` mô tả hai dịch vụ Render đã tồn tại: API và frontend tĩnh.
- Supabase PostgreSQL là cơ sở dữ liệu dùng chung nhưng nằm ngoài Terraform state hiện tại.
- Mã nguồn tiến trình nền có trong repository nhưng chưa có tiến trình worker được triển khai trên Render.
- Điểm cuối health, nhật ký nhà cung cấp và mã tương quan (correlation ID) hỗ trợ kiểm tra thủ công; repository chưa có hệ thống giám sát/cảnh báo liên tục hoàn chỉnh.

### HOW - Luồng thực tế diễn ra thế nào?

| Giai đoạn | Đầu vào | Xử lý | Đầu ra |
|---|---|---|---|
| Phát triển | nhánh tính năng và thay đổi mã | commit, push, Pull Request và review | thay đổi có lịch sử và người review |
| CI | commit/Pull Request | cài thư viện phụ thuộc, lint, kiểm tra kiểu, OpenAPI, migration, seed, build và quét thông tin bí mật | kết quả `quality` và `secret-scan` |
| Triển khai | thay đổi được merge/push vào `main` | Render dựng và triển khai từ Git | API và frontend được cập nhật |
| Kiểm tra vận hành | URL, health endpoint và log | kiểm tra phản hồi, cấu hình và lỗi theo thời điểm | bằng chứng hoạt động hoặc hướng xử lý |
| IaC | Terraform config, state và trạng thái Render | `init`, `validate`, `import`, `plan`, review; chỉ `apply` sau khi được chấp thuận | dự báo thay đổi hoặc hạ tầng được đồng bộ có kiểm soát |

CI hiện không chạy `npm test`, không gửi email kết quả triển khai và không thực hiện Terraform. Tích hợp Git của Render là cơ chế tự động triển khai, nhưng thiếu cổng kiểm thử, môi trường tiền sản xuất (staging), gói phát hành bất biến và kiểm tra sau triển khai nên chưa được gọi là quy trình Continuous Deployment hoàn chỉnh.

### WHY - Vì sao dùng quy trình này?

- Mọi thay đổi đi qua cùng một chuỗi kiểm tra có thể lặp lại.
- Git lưu được lịch sử mã ứng dụng và khai báo hạ tầng.
- Terraform giúp phát hiện sai lệch và xem trước tác động trước khi đổi tài nguyên thật.
- Render Git integration phù hợp với quy mô và giới hạn chi phí hiện tại của nhóm.
- Việc ghi rõ phần chưa tự động ngăn nhóm hiểu nhầm health `200` hoặc workflow xanh là toàn hệ thống đã sẵn sàng.

### WHEN - Các mốc có thể truy vết

- `7872fba` ngày 16/08/2026: foundation và CI ban đầu.
- `6a0e6b3` ngày 18/08/2026: PrepVI v1.0.0 và luồng hệ thống mở rộng.
- GitHub Actions run `32390206781` ngày 20/08/2026: `quality` và `secret-scan` thành công sau khi sửa quyền Gitleaks.
- `dce33d7` ngày 23/08/2026, PR #26: thêm Terraform IaC cho Render API/frontend và lưu Terraform plan đã che dữ liệu nhạy cảm.
- Ngày 23/08/2026: frontend công khai tải được và API health trả HTTP `200` trong lần thu thập minh chứng.

### EVIDENCE - Minh chứng nào được dùng?

- `.github/workflows/ci.yml` cho biết chính xác CI chạy và không chạy bước nào.
- `infra/main.tf`, `providers.tf`, `variables.tf`, `outputs.tf` và lock file là cấu hình IaC có quản lý phiên bản.
- `docs/DevOps/03-plan.txt` là plan đã che dữ liệu nhạy cảm: `0 to add, 2 to change, 0 to destroy`.
- GitHub Actions, tệp Terraform trên GitHub, frontend thật và API health trong Windows Terminal là ảnh cửa sổ thật.
- Repository không giữ ảnh gốc của `terraform init`, hai lệnh import, `terraform state list` hoặc Render deploy log; không được tuyên bố các ảnh này đã được đính kèm.

## 4. Quan hệ giữa DevOps, CI, triển khai và IaC

### Mô hình DevOps của PrepVI để vẽ trên giấy

```text
[Lập trình viên: VS Code, Git]
              |
              v
[GitHub: branch -> Pull Request -> review]
              |
              v
[GitHub Actions]
  quality: npm ci -> lint -> typecheck -> OpenAPI -> migration/seed -> build
  secret-scan: Gitleaks
              |
              v
        [nhánh main]
              |
              v
[Render Git integration]
  API: Node/Express        Frontend: React/Vite static site
              |
              v
[Vận hành: health endpoint + Render logs + correlation ID]
              |
              +------ lỗi/feedback ------> issue/nhánh sửa tiếp theo

[Terraform: infra/*.tf + local state]
  init -> validate -> import -> plan -> review -> apply có phê duyệt
              |
              +------ quản lý API và frontend Render

[Supabase PostgreSQL] nằm ngoài Terraform state hiện tại
[Backend worker] có mã nguồn nhưng chưa được host trên Render
```

Mũi tên chính mô tả vòng phản hồi từ phát triển đến vận hành rồi quay lại thay đổi tiếp theo. Nhánh Terraform là luồng quản lý nền hạ tầng, không thay thế CI/build ứng dụng. Mô hình này mô tả hiện trạng có bằng chứng; worker, alerting và nhiều phiên bản production được ghi là khoảng trống, không được vẽ như đã hoạt động.

| Khái niệm | Trách nhiệm trong dự án | Không chứng minh điều gì? |
|---|---|---|
| DevOps | bao trùm phối hợp, quy trình phát hành, cấu hình và vận hành | không đồng nghĩa chỉ cài một công cụ |
| CI | kiểm tra chất lượng tĩnh, contract, database workflow, build và secret | workflow xanh không chứng minh production hoặc UAT khỏe |
| Triển khai từ Git trên Render | dựng/triển khai API và frontend khi `main` thay đổi | chưa phải Continuous Deployment hoàn chỉnh khi thiếu cổng chất lượng cần thiết |
| Terraform IaC | khai báo, import, so sánh và đồng bộ tài nguyên Render | không build mã ứng dụng và không tự chạy trong CI hiện tại |
| Health/log thủ công | cung cấp tín hiệu vận hành tại một thời điểm | health `200` không chứng minh database readiness, worker hoặc SLA |

## 5. Phát triển, triển khai và vận hành đồng thời nhiều phiên bản

### Hiện trạng nhóm đã làm

- Nhiều thành viên có thể phát triển đồng thời trên các branch khác nhau; Git giữ lịch sử và GitHub Actions kiểm tra từng push/Pull Request.
- Chỉ nhánh `main` được cấu hình làm nguồn cho hai dịch vụ Render. Repository không có bằng chứng staging, Pull Request preview, blue-green, canary hoặc hai phiên bản production chạy song song.
- Các cờ `AI_*` cho phép bật/tắt một số năng lực trong cùng một bản triển khai. Đây là quản lý biến thể tính năng, không phải hai phiên bản hệ thống độc lập.
- Đường dẫn `/api/v1` là phiên bản hợp đồng API, không chứng minh có nhiều deployment version cùng hoạt động.

Vì vậy câu trả lời trung thực là: **nhóm đang phát triển đồng thời nhiều phiên bản mã nguồn, nhưng chỉ vận hành một phiên bản hosted từ `main`; quy trình nhiều phiên bản production chưa được triển khai.**

### Quy trình cần bổ sung nếu phải vận hành nhiều phiên bản production

1. Gắn tag và tạo artifact bất biến cho từng release, ví dụ `v1.0.0`, `v1.1.0`.
2. Tạo staging/preview độc lập cho phiên bản ứng viên; không dùng chung secret hoặc dữ liệu production tùy tiện.
3. Giữ API/schema tương thích ngược; migration theo hướng mở rộng -> chuyển dữ liệu -> thu hẹp để phiên bản cũ và mới cùng chạy an toàn.
4. Dùng feature flag cho thay đổi cần mở dần, nhưng flag phải có owner, ngày hết hạn và kế hoạch xóa.
5. Dùng blue-green hoặc canary để định tuyến một phần traffic sang bản mới, theo dõi lỗi/latency theo version rồi mới tăng tỷ lệ.
6. Khi lỗi, chuyển traffic về bản ổn định; với database ưu tiên forward-fix vì rollback schema có thể làm mất dữ liệu.
7. Lưu deployment ID, commit/tag, cấu hình, migration version, health/readiness và quyết định promote/rollback.

Đây là phương án mở rộng, chưa phải thành tích hiện tại. Không được dùng phần này để tuyên bố nhóm đã có blue-green/canary hoặc vận hành đồng thời nhiều bản production.

## 6. Quy trình Terraform áp dụng cho hạ tầng hiện hữu

1. **Khởi tạo và kiểm tra cấu hình:** `terraform init` tải provider đã khóa phiên bản; `terraform validate` kiểm tra cú pháp/cấu trúc.
2. **Import tài nguyên thật:** `terraform import` ánh xạ API và frontend Render đã tồn tại vào state. Import chỉ cập nhật state, không tự sửa dịch vụ Render.
3. **Kiểm tra ánh xạ:** thông thường dùng `terraform state list`. Repository hiện không giữ transcript/ảnh của bước này; plan sau đó đã refresh được cả hai resource ID, chỉ chứng minh state được dùng khi tạo plan.
4. **Xem trước:** `terraform plan` so sánh config, state và trạng thái nhà cung cấp; không thay đổi hạ tầng thật.
5. **Review tác động:** kiểm tra tạo mới, thay đổi tại chỗ, xóa, plan trả phí, custom domain, route và biến môi trường.
6. **Đồng bộ có kiểm soát:** chỉ chạy `terraform apply` sau review/phê duyệt. Repository không giữ bằng chứng một lần apply tương ứng với plan hiện tại.
7. **Xác minh sau thay đổi:** kiểm tra Render deploy, health/readiness, chức năng liên quan và rollback/forward-fix nếu thất bại.

### Import khác apply thế nào?

- `import` nhận diện tài nguyên đã có và ghi ánh xạ vào state; không tạo service mới.
- `plan` dự báo sự khác biệt; không phải cam kết rằng apply chắc chắn an toàn.
- `apply` gửi thay đổi tới nhà cung cấp và có thể ảnh hưởng dịch vụ thật.

Chọn import phù hợp vì hai dịch vụ đã tồn tại. Nếu tạo resource rồi apply mà không import/kiểm tra state, Terraform có thể đề xuất tạo tài nguyên trùng hoặc gặp xung đột tên/cấu hình.

## 7. Đọc đúng Terraform plan đã lưu

Plan trong `docs/DevOps/03-plan.txt` cho kết quả:

```text
Plan: 0 to add, 2 to change, 0 to destroy.
```

Cách diễn giải đúng:

- `0 to add`: không dự kiến tạo resource mới.
- `2 to change`: cả API và frontend có thay đổi tại chỗ cần review.
- `0 to destroy`: không dự kiến xóa toàn bộ resource, nhưng không đồng nghĩa không có rủi ro.
- Plan cho thấy thay đổi liên quan biến môi trường và một số thuộc tính do provider tự tính; áp dụng thiếu thận trọng có thể làm mất cấu hình lúc chạy hoặc thay đổi hành vi dịch vụ.
- Lần chạy không dùng `terraform plan -out=...`; Terraform ghi rõ không bảo đảm một lệnh apply sau đó sẽ thực hiện đúng tập hành động này nếu trạng thái đã đổi.

Vì vậy không được gọi plan này là no-op, “khớp 100%” hoặc “không rủi ro”. Trước apply phải tạo plan mới, kiểm tra thông tin bí mật, biến môi trường, tên miền tùy chỉnh, quy tắc định tuyến, gói dịch vụ và lưu quyết định phê duyệt.

## 8. Ví dụ vận hành: thêm một biến môi trường

1. Thành viên triển khai thêm biến vào `infra/main.tf` hoặc biến đầu vào phù hợp.
2. Pull Request cho phép nhóm review thay đổi mã; CI kiểm tra phần mà workflow hỗ trợ.
3. Người vận hành có quyền Render chạy `terraform plan` bằng thông tin xác thực nằm ngoài Git.
4. Nhóm kiểm tra plan chỉ chứa thay đổi mong muốn, không xóa env/route/domain và không nâng gói ngoài quyết định.
5. Sau phê duyệt, người có quyền chạy `apply`; Render cập nhật cấu hình và triển khai lại nếu cần.
6. Nhóm kiểm tra health/readiness và trường hợp sử dụng liên quan, lưu commit, plan, kết quả apply và nhật ký triển khai đã che thông tin bí mật.

Đây là quy trình mục tiêu được hướng dẫn. Repository hiện chỉ đủ minh chứng cho cấu hình, plan và health; không đủ để khẳng định một ca thêm biến đã hoàn tất đầu-cuối bằng Terraform apply.

## 9. Hạ tầng và ranh giới quản lý hiện tại

| Thành phần | Hiện trạng | Ranh giới/giới hạn |
|---|---|---|
| Frontend | Render static site, tự triển khai từ `main`, publish `frontend/dist` | cần giữ custom domain và hai rewrite route |
| API | Render Node web service, root `backend`, health `/api/v1/health` | gói hiện tại không có SLA được lưu trong repository |
| Database | Supabase PostgreSQL qua biến nhạy cảm | ngoài Terraform state; migration chạy ở CI nhưng không do Render/Terraform điều phối khi deploy |
| Worker | mã nguồn và lệnh chạy có trong backend | chưa triển khai trên Render; các công việc nền trực tuyến không đầy đủ |
| Terraform | mô tả/import hai dịch vụ Render | không tự chạy trong GitHub Actions; state cục bộ không phải backend cộng tác lâu dài |

Không triển khai worker ảnh hưởng OCR nền, xử lý hộp thư chờ thông báo/email, AI job nền, dọn dữ liệu hết hạn, công khai đánh giá/xếp hạng và chuyển cấp sự cố liên kết họp. Các hướng xử lý thủ công trong ứng dụng không biến những công việc này thành đã được vận hành đầy đủ trên môi trường trực tuyến.

## 10. Cấu hình, cờ tính năng và quan sát hệ thống

- `NODE_ENV`, `DATABASE_*`, `SESSION_*`, `FRONTEND_ORIGIN`, `AI_ENABLED` và `GEMINI_API_KEY` được khai báo cho API trong Terraform; tệp plan thực tế cho thấy môi trường chạy còn nhiều biến hơn cấu hình Terraform hiện mô tả.
- Các cờ `AI_*` cho phép bật/tắt từng năng lực AI, nhưng thay đổi cờ vẫn cần quy trình review, rollout và xác minh.
- Health endpoint và correlation ID hỗ trợ chẩn đoán; provider log giúp tìm lỗi triển khai/runtime.
- Chưa có alerting, dashboard quan sát, SLO/SLA hoặc kiểm tra readiness sau deploy được tự động hóa và lưu bằng chứng đầy đủ.

## 11. Bảo mật và thao tác thủ công

- Không đưa Render API key, database URL, session secret, Gemini key hoặc giá trị env vào Git, ảnh chụp và báo cáo.
- `terraform.tfvars` và Terraform state bị bỏ khỏi Git; biến nhạy cảm được đánh dấu `sensitive` nhưng state vẫn phải được bảo vệ.
- State hiện nằm cục bộ; phương án trưởng thành hơn là backend từ xa có mã hóa, khóa đồng thời, phân quyền và lịch sử.
- Không `apply` chỉ vì thấy `0 to destroy`; phải review cả thay đổi tại chỗ.
- Khi provider hoặc deploy lỗi, dùng log đã che dữ liệu, correlation ID, plan đã lưu và hướng forward-fix/rollback được phê duyệt; không sửa trực tiếp production database như thao tác bình thường.

## 12. Câu hỏi phụ thường gặp

### Vì sao dùng Terraform thay vì chỉ bấm Render Dashboard?

Terraform đưa cấu hình vào Git, cho review diff và phát hiện sai lệch. Dashboard vẫn cần cho các thao tác nhà cung cấp chưa được mã hóa hoặc để điều tra, nhưng thay đổi thủ công phải được phản ánh lại vào config/state.

### Workflow xanh có chứng minh triển khai thành công không?

Không. Workflow hiện chứng minh các bước CI đã cấu hình. Render deployment là luồng riêng; cần deploy log và kiểm tra sau triển khai để chứng minh lần phát hành cụ thể.

### Vì sao không gọi hệ thống là Continuous Deployment hoàn chỉnh?

Vì CI chưa chạy kiểm thử; chưa có chiến lược môi trường tiền sản xuất và phê duyệt rõ ràng; chưa có gói phát hành bất biến, triển khai worker và kiểm tra readiness sau triển khai. Render tự triển khai chỉ là một phần của chuỗi đó.

### Health `200` có nghĩa toàn hệ thống khỏe không?

Không. Nó chỉ chứng minh tiến trình API phản hồi tại thời điểm kiểm tra; không chứng minh database, worker, provider phụ thuộc, mọi use case hoặc SLA.

## 13. Minh chứng hình ảnh hiện có

**Hình Q15-01 - Frontend công khai đang hoạt động tại thời điểm chụp.**

![Live PrepVI frontend](img/Q15-01-live-frontend.png)

**Hình Q15-02 - Cửa sổ GitHub Actions thật của repository.**

![GitHub Actions workflow runs](img/Q15-02-github-actions.png)

**Hình Q15-03 - Cấu hình Terraform được mở trực tiếp trên GitHub.**

![Terraform configuration on GitHub](img/Q15-03-terraform-github.png)

**Hình Q15-04 - Windows Terminal thật gọi endpoint Render production và hiển thị HTTP 200, API health, correlation ID, CORS cùng mã thoát 0.**

![Public API health response in Windows Terminal](img/Q15-04-api-health-terminal.png)

Ảnh Actions chứng minh có lịch sử workflow; muốn chứng minh từng step phải mở run cụ thể. Ảnh health chỉ là bằng chứng tại một thời điểm. Không ảnh nào trong bốn ảnh chứng minh Terraform import/apply hoặc Render deployment của một commit cụ thể.

## 14. Minh chứng còn cần tự chụp để đáp ứng đầy đủ yêu cầu bản in

- `terraform init` và `terraform validate` thành công trong Windows Terminal.
- Hai kết quả `terraform import` hoặc `terraform state list` hiển thị đúng hai resource, không lộ biến nhạy cảm.
- `terraform plan` mới, đã review, hiển thị summary và không lộ env value; không dùng plan cũ làm bằng chứng cho trạng thái hiện tại.
- Render Deploys hiển thị commit, trạng thái Live và thời gian triển khai.
- Kiểm tra health/readiness sau chính deployment đó.

Chỉ người có state và thông tin xác thực Render phù hợp mới có thể chụp các ảnh Terraform/Render này. Không tạo ảnh giả, không chụp `terraform.tfvars`, state hoặc màn hình chứa token/secret.

## 15. Bản in và tài liệu nguồn

- **Bản in tiếng Anh:** [DevOps Implementation and Infrastructure Report](DevOps_Report.md). Report đã nhúng mô hình, kịch bản Terraform an toàn, cây thư mục IaC, bốn ảnh minh chứng thật và ghi rõ bằng chứng còn thiếu.
- **Tài liệu nguồn, không phải bản in thay thế:** [IaC operations guide](../../../iaac_tutorial.md), [redacted Terraform plan](../../../docs/DevOps/03-plan.txt), [GitHub Actions CI](../../../.github/workflows/ci.yml) và [Terraform main configuration](../../../infra/main.tf).

## 16. Dàn ý trả lời trong 10 phút trên giấy A4

1. Định nghĩa DevOps và nêu mục tiêu rút ngắn vòng phản hồi nhưng vẫn kiểm soát chất lượng/rủi ro.
2. Vẽ mô hình ở mục 4, ghi Git/GitHub, GitHub Actions, Render, Terraform, Supabase và health/log.
3. Đi theo luồng: branch/PR -> CI -> `main` -> Render -> health/log -> phản hồi về nhánh sửa.
4. Giải thích nhánh IaC: config/state -> init/validate/import/plan -> review -> apply -> xác minh.
5. Nêu lợi ích: lặp lại, truy vết, phát hiện lỗi sớm, phát hiện drift và giảm cấu hình chỉ nằm trong trí nhớ cá nhân.
6. Trả lời nhiều phiên bản: nhiều branch mã nguồn cùng phát triển; production hiện chỉ một bản từ `main`; blue-green/canary là hướng bổ sung chưa triển khai.
7. Nêu giới hạn: CI chưa test/deploy, worker chưa host, state local, thiếu staging/alerting/post-deploy readiness.
8. Chỉ minh chứng: Actions, Terraform GitHub, plan `0/2/0`, frontend/production health; không claim ảnh import/apply/Render Deploys chưa có.

## 17. Checklist tự học

- [ ] Phân biệt DevOps, CI, Continuous Delivery, Continuous Deployment và IaC.
- [ ] Vẽ được mô hình và ghi đúng công cụ tại từng khối.
- [ ] Kể được luồng input - process - output từ nhánh tính năng tới Render.
- [ ] Giải thích đúng hiện trạng/hướng mở rộng của việc chạy nhiều phiên bản.
- [ ] Giải thích `init`, `validate`, `import`, `state`, `plan` và `apply`.
- [ ] Đọc đúng `0 add / 2 change / 0 destroy` và giải thích vì sao vẫn có rủi ro.
- [ ] Nêu đúng Supabase ngoài Terraform và worker chưa triển khai.
- [ ] Không tuyên bố CI chạy test, gửi email deployment hoặc chạy Terraform.
- [ ] Không dùng health `200` để kết luận database/worker/toàn hệ thống khỏe.
- [ ] Nêu được ảnh hiện có và ảnh IaC/Render còn thiếu.
