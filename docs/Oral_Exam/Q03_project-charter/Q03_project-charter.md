# Câu 03 — Ủy nhiệm dự án (Project Charter)

## 1. Đề bài

Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Ủy nhiệm dự án (Project Charter) của nhóm; giải thích mục đích, sử dụng và cập nhật. Bản in bắt buộc là [Project Charter](<../../Project_Governance & Stakeholder/Project_Charter.md>), hoàn toàn bằng tiếng Anh.

## 2. Dàn ý viết A4 trong 10 phút

1. Charter là văn bản cấp cao **chính thức ủy nhiệm dự án và trao quyền cho PM** khi Sponsor phê duyệt; khác Proposal là đề nghị đầu tư và khác Project Plan là cách thực hiện chi tiết.
2. Charter của nhóm nêu bối cảnh JD-first, mục tiêu/gates, high-level scope, tổ chức/quyền quyết định, giả định/ràng buộc, 6 milestone và phê duyệt.
3. Đầu vào: Project Proposal, Vision & Scope, feasibility, resource/cost baseline, stakeholder analysis, backlog và bài giảng initiation.
4. Quá trình: tổng hợp Proposal, Vision & Scope và Stakeholder Analysis → xác định mục tiêu và quyền hạn → ghép baseline nguồn lực/chi phí/thời gian → đặt milestone và Go/No-Go gates → review tính khả thi và sự thống nhất → hoàn thiện bản trình Sponsor.
5. Đánh giá: completeness; strategic alignment; scope–time–cost–capacity; vai trò/quyền hạn; SMART/measurable gates; risk/assumption; consistency và approval readiness.
6. Kết quả: JD-first, 6 người/8 tuần/~653 giờ/1.125.000 VNĐ, scope exclusions, milestone và Go/No-Go rõ.
7. Kết quả: Charter tạo baseline chung để nhóm bắt đầu và kiểm soát dự án; Sponsor là người phê duyệt chính thức. Phần CI/CD trong milestone là yêu cầu bàn giao và phải được kiểm chứng riêng.

## 3. WHAT–WHY–WHEN

- **WHAT:** Project Charter là tài liệu cấp cao mô tả lý do, mục tiêu, phạm vi, governance, nguồn lực, milestone, giả định, ràng buộc và quyền hạn; sau phê duyệt nó chính thức ủy nhiệm dự án/PM.
- **WHY:** tạo một điểm tham chiếu chung, tránh khởi động dự án khi chưa rõ mục tiêu/quyền quyết định, giúp giải quyết ưu tiên và thay đổi cấp cao.
- **WHEN:** soạn trong giai đoạn khởi tạo, sau Proposal sơ bộ và trước khi cam kết kế hoạch chi tiết; cập nhật/re-charter khi mục tiêu, quyền hạn, baseline hoặc tính khả thi thay đổi lớn.

Các câu hỏi Charter phải trả lời:

- Tại sao dự án tồn tại và giá trị mong đợi là gì?
- Mục tiêu, success criteria và high-level scope là gì?
- Sponsor, PM, PO, team và quyền quyết định của họ là gì?
- Nguồn lực, ngân sách, thời gian và milestone cấp cao là gì?
- Giả định, ràng buộc, rủi ro và Go/No-Go gates là gì?
- Ai phải phê duyệt để dự án được ủy nhiệm?

## 4. Charter của nhóm

| Nội dung    | Baseline                                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Mục đích    | Pilot-ready web MVP nối JD → plan → practice/mentor → feedback                                                                            |
| Người dùng  | Student, Mentor, Administrator                                                                                                            |
| Thời gian   | 29/06–23/08/2026, 8 tuần                                                                                                                  |
| Nguồn lực   | 6 người; trung bình 16 giờ/người/tuần; khoảng 653 giờ sau dự phòng 15%                                                                    |
| Tiền mặt    | Trần nội bộ 1.125.000 VNĐ                                                                                                                 |
| Scope chính | JD intake/extract/OCR/correct; requirements/mapping/plan; Question Bank; Mentor/booking/feedback/admin                                    |
| Ngoài scope | AI interviewer/scoring, integrated calls/recording, payment, mobile, ATS, ML recommendation                                               |
| Governance  | Sponsor phê duyệt Charter/baseline/thay đổi lớn; PO ưu tiên/chấp nhận story; PM điều phối; Team Lead hỗ trợ governance; kỹ thuật theo ADR |
| Milestone   | M1 Discovery/Charter đến M6 UAT/Release                                                                                                   |
| Trạng thái  | Awaiting Sponsor approval                                                                                                                 |

Các chỉ số 70%, 80%, 90% và “zero Critical/High” là **criteria**, không phải thành tích đã đạt.

## 5. Quá trình hình thành thực tế

| Đầu vào                | Dùng để làm gì                                                                     | Bằng chứng                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Project Proposal       | Bối cảnh, vấn đề, giải pháp, high-level MVP                                        | [Project Proposal](../../Project_Proposal/Project_Proposal_Draft.md)                                                                    |
| Vision & Scope         | Người dùng, mục tiêu, in/out scope, assumptions                                    | [Project Vision and Scope](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md)                                                  |
| Resource/cost baseline | 6 người, 8 tuần, 653 giờ, cash ceiling                                             | [Resource Plan](../../Project_Resource_Plan/ResourcePlan.md), [Cost-Time-Resources](../../Project_Resource_Plan/Cost_Time_Resources.md) |
| Feasibility            | Go/No-Go gates và rủi ro kỹ thuật/nguồn cung                                       | [Feasibility Study](../../Project_Feasibility/feasibility.md)                                                                           |
| Stakeholders           | Sponsor, users, providers và cách tham gia                                         | [Stakeholder Analysis](<../../Project_Governance & Stakeholder/Stakeholder_Analysis.md>)                                                |
| Bài giảng              | Checklist context, governance, resource, milestones, impact, assumptions, approval | [Software Project Initiation](../../refs/03-software-project-initiation.md)                                                             |

```text
Proposal + Vision/Scope + Stakeholders
→ phát biểu purpose và objectives
→ xác định governance/decision rights
→ ghép resource, cost, duration và milestones
→ thêm assumptions, constraints và gates
→ kiểm tra chéo feasibility/backlog/architecture
→ hoàn thiện Charter để nhóm thống nhất và trình Sponsor
```

Quá trình review được chia theo trách nhiệm:

- PM/Scrum Master tổng hợp Charter, resource, schedule và các gates;
- Product Owner kiểm tra mục tiêu, giá trị và high-level scope;
- Team Lead kiểm tra governance, trách nhiệm và khả năng cam kết;
- Architecture/PoC kiểm tra rủi ro kỹ thuật và milestone foundation;
- các thành viên xác nhận vai trò, đầu ra và giới hạn nguồn lực của mình;
- Sponsor xem xét mục tiêu, baseline và các thay đổi lớn để quyết định ủy nhiệm.

## 6. Phương pháp đánh giá và kết quả

| Lớp đánh giá       | Cách làm                                               | Kết quả                                                                        |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Completeness       | Checklist của bài giảng                                | Có context, objectives, governance, resource, milestone, assumptions, approval |
| Alignment          | So Proposal và Vision & Scope                          | Charter dùng cùng JD-first value loop và ba vai trò                            |
| Feasibility        | Cân scope với 8 tuần, 653 giờ, cash ceiling            | Loại payment, integrated calls và AI interviewer                               |
| Governance         | Rà trách nhiệm và quyền quyết định                     | Tách Sponsor, PO, PM/SM, Team Lead và technical decisions                      |
| Measurability      | Kiểm tra success criteria/gates                        | G1–G6 và threshold được nêu; trạng thái chưa đo được ghi rõ                    |
| Consistency        | So Resource Plan, Feasibility, Backlog và Architecture | Milestones/gates liên kết với artefact phía sau                                |
| Approval readiness | Kiểm chữ ký/quyết định Sponsor                         | Chưa có; Charter chưa chính thức ủy nhiệm dự án                                |

Các thay đổi sau đánh giá:

- làm rõ mục đích JD-first và vòng giá trị;
- thêm baseline 6 người, 8 tuần, ~653 giờ, 1.125.000 VNĐ;
- xác định trách nhiệm từng thành viên và quyền quyết định;
- thêm 6 milestone và 6 Go/No-Go gates;
- thu hẹp MVP và nêu rõ out-of-scope;
- bổ sung bảng approval để không nhầm planning baseline với bản đã ký.

Sau review, nhóm có một Charter thống nhất về mục tiêu, phạm vi, nguồn lực, vai trò và các cổng quyết định. Trạng thái phê duyệt chính thức được thể hiện trong bảng Approval của tài liệu in.

## 7. Sử dụng và cập nhật

- PM dùng Charter làm căn cứ điều phối baseline, resource, milestone, risk và escalation.
- PO dùng high-level scope để ưu tiên backlog và kiểm soát change request.
- Team dùng vai trò/quyền hạn để biết ai quyết định nội dung, quản lý và kỹ thuật.
- Feasibility, Resource Plan, Project Plan, Architecture và release gates tham chiếu các giới hạn trong Charter.

Charter được cập nhật khi baseline JD-first được làm rõ: nhóm bổ sung nguồn lực, cash limit, milestone, decision gates và scope exclusions. Sau đó, các quyết định kỹ thuật có kiểm soát được quản lý bằng ADR. Chỉ khi thay đổi mục tiêu, quyền hạn, ngân sách, thời gian hoặc high-level scope thì nhóm mới cần cập nhật Charter hoặc tạo change request.

## 8. Phân biệt nhanh

| Tài liệu                 | Câu hỏi chính                                                         | Quyền hạn                        |
| ------------------------ | --------------------------------------------------------------------- | -------------------------------- |
| Project Proposal         | Có nên đầu tư/tiếp tục ý tưởng không?                                 | Đề nghị, chưa ủy nhiệm           |
| Project Charter          | Dự án nào được ủy nhiệm, vì sao, ai có quyền, baseline cấp cao là gì? | Chính thức khi Sponsor phê duyệt |
| Project Vision and Scope | Sản phẩm tạo giá trị gì và ranh giới sản phẩm/dự án ở đâu?            | Nguồn định hướng phạm vi         |
| Project Plan             | Nhóm sẽ thực hiện, theo dõi và kiểm soát công việc như thế nào?       | Kế hoạch vận hành chi tiết       |

## 9. Thứ tự trình bày miệng

1. Định nghĩa và phân biệt Proposal/Charter/Plan.
2. Nêu purpose, baseline và high-level scope của nhóm.
3. Trình bày đầu vào, sáu bước hình thành và trách nhiệm review.
4. Giải thích 7 lớp đánh giá và thay đổi sau đánh giá.
5. Nêu cách sử dụng/cập nhật; kết luận về quyền phê duyệt của Sponsor và nguyên tắc change control.

## 10. Bản in và bằng chứng

- [ ] **Bắt buộc:** [Project Charter](<../../Project_Governance & Stakeholder/Project_Charter.md>) — hoàn toàn bằng tiếng Anh.
- [ ] Trang liên quan của Resource Plan/Feasibility chỉ in sau khi bảo đảm phần in hoàn toàn bằng tiếng Anh.
- [ ] Bảng vai trò/quyền hạn, milestone, Go/No-Go gates và Approval trong Charter.
- [ ] Chữ ký hoặc quyết định Sponsor nếu nhóm đã hoàn tất bước phê duyệt.

## 11. Nguồn kiểm chứng

- [Project Charter](<../../Project_Governance & Stakeholder/Project_Charter.md>)
- [Project Proposal](../../Project_Proposal/Project_Proposal_Draft.md)
- [Project Vision and Scope](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md)
- [Resource Plan](../../Project_Resource_Plan/ResourcePlan.md)
- [Feasibility Study](../../Project_Feasibility/feasibility.md)
- Git: `0743a68`, `dfdaf1c`, `7ca1f6e`.
