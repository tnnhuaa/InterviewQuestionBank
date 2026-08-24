# INTERVIEWQUESTIONBANK

## BÁO CÁO BÀI HỌC KINH NGHIỆM DỰ ÁN

- **Phiên bản:** 1.0
- **Ngày phát hành:** 23/08/2026
- **Chủ sở hữu:** Tuấn Anh — Project Manager / Team Leader / Timekeeper
**Trạng thái:** Đã review và thống nhất nội bộ

---

## 1. Mục đích và phạm vi

Báo cáo này tổng hợp những kinh nghiệm có thể tái sử dụng từ quá trình thực hiện Splitly và chuyển hướng sang InterviewQuestionBank. Tài liệu chỉ giữ các bài học đã được nhóm xác nhận, có sự kiện thực tế, nguyên nhân, tác động, hành động và người chịu trách nhiệm.

Nhóm không yêu cầu mỗi thành viên phải có một bài học riêng. Các ý trùng nhau được gom thành hai bài học chung: đánh giá tính khả thi ở giai đoạn khởi tạo và kiểm soát secret/dependency trong repository.

## 2. Cơ sở hình thành tài liệu

Tuấn Anh tổng hợp tài liệu từ ngày 20/08/2026 và hoàn thiện ngày 23/08/2026. Các nguồn chính gồm Project Charter, Project Proposal, Project Plan, Product Backlog, Kanban tái dựng, Git/PR/CI, ảnh brainstorm và phản hồi trực tiếp của thầy Biên, thầy Khoa.

Với mỗi bài học, nhóm đối chiếu:

- sự kiện và bằng chứng;
- nguyên nhân và tác động;
- điều cần giữ hoặc thay đổi;
- hành động, owner, thời hạn và cách đo;
- xác nhận của người liên quan.

Tuấn Anh và các thành viên liên quan review từng phần. Nhóm thường chốt qua Messenger ngay khi phần đó hoàn thành, không lập biên bản retrospective riêng. Tất cả thành viên đã đồng ý với nội dung version 1.0; Tuấn Anh là người quyết định cuối cùng.

## 3. Lessons Learned Register

### LL-01 — Đánh giá tính khả thi ngay trong Initiation

**Sự kiện.** Nhóm khởi đầu với Splitly nhưng chưa phân tích đủ sâu tính khả thi, giá trị sử dụng và khả năng phát triển thành sản phẩm. Sau phản hồi giữa kỳ, nhóm quay lại tìm đề tài nhưng đến tuần 7 vẫn chưa chốt được ý tưởng. Quan điểm giữa các thành viên khác nhau, trong khi một số thành viên chưa chủ động đề xuất cách tháo gỡ.

Tuấn Anh tổ chức brainstorm và dùng các câu hỏi đánh giá khách quan: sản phẩm thay thế công cụ hiện tại như thế nào, người dùng có sẵn sàng chuyển sang dùng hay không, giải pháp nào đã tồn tại, rủi ro nào có thể xảy ra, và ý tưởng có phù hợp với thời gian còn lại hay không. Nhóm đồng thời xin phản hồi trực tiếp từ thầy Biên và thầy Khoa, rồi chốt InterviewQuestionBank theo hướng tập trung vào ứng viên.

**Tác động.** Nhóm phải quay lại Initiation và Planning, làm lại Charter, Proposal và Project Plan. Thời gian thực hiện thực tế cho dự án mới chỉ còn từ 10/08 đến 23/08. Tuy nhiên, việc đánh giá lại giúp nhóm hiểu sâu hơn về tính khả thi và xác định được PoC có giá trị rõ: hỗ trợ người học cải thiện cách trả lời phỏng vấn và nhận biết phần cần tập trung để được đánh giá cao.

**Bài học.** Tính khả thi phải được đánh giá trước khi chốt đề tài và baseline kế hoạch. Một ý tưởng không nên được chấp nhận chỉ vì có thể xây dựng về mặt kỹ thuật; nhóm còn phải kiểm tra vấn đề thực, giải pháp thay thế, động lực sử dụng, rủi ro, giá trị và giới hạn thời gian.

**Hành động cho dự án sau.** Bổ sung Feasibility Gate ở cuối Initiation. Trước khi duyệt Charter hoặc Proposal, nhóm phải có bảng tiêu chí so sánh ý tưởng, review nội bộ và xác nhận sớm của stakeholder phù hợp.

- **Owner:** Tuấn Anh.
- **Thời hạn:** Trước khi kết thúc Initiation của dự án sau.
- **Cách đo:** Có decision matrix được review và không phải quay lại Initiation vì giá trị cốt lõi chưa được kiểm chứng.

**Trạng thái:** Accepted; đã áp dụng khi chọn InterviewQuestionBank.

### LL-02 — Không đưa secret và dependency sinh tự động vào repository

**Sự kiện.** Trong pull request của Trí, file `.env` chứa credential và thư mục `node_modules` được đưa lên repository. Tuấn Anh phát hiện trong quá trình review cùng quy trình CI/secret scan. Nguyên nhân là thiếu bước tự kiểm tra trước khi push và ignore rule chưa đầy đủ.

**Tác động.** Credential bị lộ và repository tăng kích thước không cần thiết. Nhóm phải loại file, revoke credential cũ và tạo key mới.

**Bài học.** Secret phải nằm ngoài version control; dependency sinh tự động phải được tái tạo từ manifest và không được commit. Review thủ công cần kết hợp với ignore rule và secret scan tự động.

**Hành động đã hoàn tất.** Nhóm loại `.env` và `node_modules`, revoke key cũ, tạo key mới, bổ sung `.gitignore`, sửa cấu hình Gitleaks và chạy lại CI. Lần chạy sau cho thấy cả `quality` và `secret-scan` thành công, không phát hiện leak. Sự cố không tái diễn.

- **Owner:** Trí.
- **Thời hạn:** Hoàn tất trong giai đoạn 16–20/08/2026.
- **Cách đo:** Không tái diễn; secret scan sau sửa thành công.

**Trạng thái:** Closed.

## 4. Đánh giá và kiểm soát chất lượng

Register được xem là đạt khi mỗi bài học có sự kiện cụ thể, nguồn kiểm tra được, nguyên nhân, tác động, hành động, owner, thời hạn và cách đo. Cách viết tập trung vào hệ thống và hành vi có thể thay đổi, không dùng tài liệu để quy lỗi cá nhân.

Kết quả review nội bộ:

| Tiêu chí | Kết quả |
| --- | --- |
| Sự kiện và nguồn | Đạt |
| Nguyên nhân và tác động | Đạt |
| Hành động, owner, thời hạn | Đạt |
| Bằng chứng đã áp dụng | Đạt |
| Đồng thuận của nhóm | Đạt |
| Biên bản retrospective riêng | Không có; nhóm chốt qua Messenger |
| Số liệu người dùng cho hiệu quả PoC | Chưa có; không đưa ra tuyên bố định lượng |

Nhóm sẽ theo dõi hiệu quả cải tiến trong dự án sau bằng **cycle time trên Kanban**, không dùng sprint hoặc velocity làm chỉ số bắt buộc.

## 5. Phụ lục minh chứng

### 5.1 Brainstorm và đánh giá ý tưởng

![Brainstorm và đánh giá ý tưởng](img/Q21-01-brainstorm-idea-evaluation.png)

*Hình 1 — Minh chứng review/brainstorm cuối để chọn ý tưởng dựa trên góp ý của giảng viên và kinh nghiệm nhóm.*

### 5.2 Sự cố secret và kết quả kiểm soát

![PR có env và node_modules](../Q16_team-management/img/Q16-02-pr3-env-node-modules-redacted.png)

*Hình 2 — Pull request chứa `.env` và `node_modules`; dữ liệu nhạy cảm trong bản lưu đã được che.*

![CI thành công và không phát hiện leak](../Q17_monitoring-and-control/img/Q17-06-ci-success-no-leaks.png)

*Hình 3 — CI sau sửa: quality và secret-scan thành công, không phát hiện leak.*

## 6. Lịch sử phiên bản

| Phiên bản | Ngày | Nội dung | Người cập nhật/review |
| --- | --- | --- | --- |
| 0.1 | 20/08/2026 | Tổng hợp bản nháp từ tài liệu, Git, PR và CI. | Tuấn Anh |
| 1.0 | 23/08/2026 | Chốt hai bài học; bổ sung action, owner, tiêu chí đo và minh chứng. | Tuấn Anh và người liên quan; Tuấn Anh chốt cuối |

## 7. Nguồn kiểm chứng

- Project Proposal và Project Plan version đã chốt.
- Product Backlog và Kanban tái dựng.
- GitHub pull request, `.github/workflows/ci.yml` và ảnh CI.
- Commit `7b51d07` cùng regression test cho practice-progress 500 và duplicate-content 409.
- Phản hồi trực tiếp của thầy Biên, thầy Khoa và xác nhận của các thành viên.
