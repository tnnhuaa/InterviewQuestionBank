# Câu 08 — Báo cáo tính khả thi (Feasibility Study Report)

### Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Báo cáo tính khả thi (Feasibility Study Report) của nhóm. (Sinh viên nộp kèm bản in tài liệu Báo cáo tính khả thi của nhóm.)

Sau khi xác định được vấn đề và phạm vi MVP, nhóm tiến hành xây dựng **Báo cáo tính khả thi (Feasibility Study Report)** nhằm đánh giá xem dự án có thực sự đáng thực hiện và có thể hoàn thành với nguồn lực hiện có hay không.

Đầu vào của báo cáo gồm **Project Proposal, phạm vi MVP, backlog chức năng, prototype, kế hoạch nguồn lực, thời gian thực hiện, chi phí dự kiến và các rủi ro của hệ thống**. Từ các đầu vào này, nhóm lần lượt đánh giá các khía cạnh gồm **Technology/System, Resource, Schedule, Market, Operational, Economic, Legal và Cultural Feasibility**. Với mỗi khía cạnh, nhóm xác định các rủi ro, bằng chứng cần kiểm chứng và điều kiện để kết luận khả thi. Một số rủi ro quan trọng như xử lý JD, mapping câu hỏi, phân quyền, double booking và notification được đưa thành các PoC bắt buộc trước khi phát hành.

Sau khi hoàn thành bản đầu tiên, nhóm đối chiếu báo cáo với tài liệu tham khảo của môn học. Qua đánh giá, nhóm nhận thấy bản đầu còn thiếu Cultural Feasibility, phần Economic mới chủ yếu tập trung vào chi phí, Market và Operational còn bị gộp chung, đồng thời cấu trúc báo cáo chưa hoàn toàn bám theo tài liệu tham khảo.

Nhóm sau đó chỉnh sửa thành phiên bản mới theo cấu trúc **Purpose → Reason → Background → Evaluation Criteria → Study Findings → Recommendations**, bổ sung **Cost–Benefit, Cultural Feasibility**, tách riêng Market và Operational, đồng thời sử dụng các **Go/No-Go gates** để xác định điều kiện tiếp tục, giảm phạm vi hoặc dừng dự án.

Nhờ quá trình này, Báo cáo tính khả thi không chỉ là tài liệu mô tả mà còn được sử dụng như một cơ sở để nhóm **kiểm soát phạm vi, đánh giá rủi ro và ra quyết định trong quá trình phát triển dự án**.

### 1. Các câu hỏi chính cần trả lời trong Báo cáo tính khả thi là gì?

Báo cáo tính khả thi cần trả lời các câu hỏi:

* Dự án **có nhu cầu và giá trị thực tế hay không**?
* Dự án **có khả thi về kỹ thuật** không?
* Nhóm **có đủ nhân lực và nguồn lực** không?
* Dự án **có thể hoàn thành trong thời gian dự kiến** không?
* Dự án **có thể vận hành thực tế** không?
* Có **thị trường/người dùng và mentor supply** phù hợp không?
* Chi phí thực hiện có hợp lý so với lợi ích thu được không?
* Dự án có đáp ứng các vấn đề về **pháp lý, quyền riêng tư và văn hóa người dùng** không?

Cuối cùng, báo cáo phải đưa ra kết luận **Go, No-Go hoặc Proceed with conditions**.

### 2. Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo Báo cáo tính khả thi là gì?

Các đầu vào chính gồm:

* Project Proposal và problem statement.
* Phạm vi MVP và các chức năng Must-have.
* Prototype/core workflow của hệ thống.
* Kế hoạch nguồn lực: số thành viên, thời gian làm việc, capacity.
* Backlog và Story Point.
* Chi phí dự kiến.
* Các rủi ro kỹ thuật và vận hành.
* Dữ liệu pilot dự kiến như số Student, Mentor và JD.

Quy trình nhóm thực hiện là:

**Xác định phạm vi MVP → phân tích từng loại feasibility → xác định risk và điều kiện kiểm chứng → tính resource/schedule/cost baseline → xây PoC và validation criteria → đặt Go/No-Go gates → đưa ra kết luận.**

### 3. Báo cáo tính khả thi của nhóm đã được đánh giá thế nào?

Báo cáo được đối chiếu với tài liệu reference của môn học.

Ban đầu, báo cáo đã có ở các phần:

* Technical feasibility
* Resource feasibility
* Schedule feasibility
* Operational feasibility

Nhưng còn thiếu hoặc yếu ở:

* Cultural feasibility
* Cost–Benefit
* Tách Market và Operational ra làm 2 phần riêng
* Cấu trúc report chưa bám hoàn toàn theo reference

Sau đó nhóm đã cập nhật thành `feasibility-v2.md`, bổ sung đầy đủ các phần trên và tổ chức lại theo:

**Purpose → Reason → Background → Evaluation Criteria → Study Findings → Recommendations.**

Vì vậy bản v2 có mức độ phù hợp với reference tốt hơn bản đầu.

### 4. Tại sao cần tạo Báo cáo tính khả thi?

Mục đích chính là để tránh việc nhóm đầu tư thời gian và nguồn lực vào một dự án **không thể thực hiện hoặc không có giá trị đủ lớn**.

Báo cáo giúp nhóm:

* xác nhận project có đáng làm hay không;
* phát hiện rủi ro sớm;
* kiểm tra scope có phù hợp với nguồn lực;
* đánh giá chi phí và lợi ích;
* xác định các điều kiện cần đạt trước khi release;
* hỗ trợ quyết định Go/No-Go.

Nói ngắn gọn:


### 5. Báo cáo tính khả thi của nhóm đã được sử dụng trong quá trình thực hiện dự án như thế nào?

Nhóm sử dụng báo cáo như một **công cụ ra quyết định và kiểm soát scope**.

Cụ thể:

* Dùng Technical Feasibility để xác định các PoC bắt buộc như OCR, mapping, concurrency và authorization.
* Dùng Resource và Schedule Feasibility để kiểm tra liệu Must backlog có phù hợp với 6 thành viên và timeline 8 tuần hay không.
* Dùng Economic Feasibility để giới hạn chi phí pilot.
* Dùng Market và Cultural Feasibility để thiết kế pilot với Student và Mentor.
* Dùng Operational Feasibility để xác định các policy như booking, cancellation, feedback và moderation.
* Dùng Go/No-Go gates để quyết định khi nào được tiếp tục, khi nào phải giảm scope hoặc pivot.

