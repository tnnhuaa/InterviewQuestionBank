# Câu 18 — Kế hoạch quản lý rủi ro

Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Kế hoạch quản lý rủi ro (Software Risk Management Plan) của nhóm. (Sinh viên nộp kèm bản in tài liệu Kế hoạch quản lý rủi ro của nhóm.)

Sau khi xác định **mục tiêu, phạm vi MVP, nguồn lực, tiến độ và các giả định của dự án**, nhóm xây dựng **Software Risk Management Plan** nhằm nhận diện sớm những yếu tố có thể ảnh hưởng đến tiến độ, chất lượng, phạm vi và khả năng vận hành của hệ thống.

Đầu tiên, nhóm xem lại các tài liệu như **Project Proposal, Feasibility Study, MVP Scope, requirement, WBS/estimate**, các dependency bên ngoài và những giả định cần xác thực. Từ đó, nhóm nhận diện và phân loại rủi ro theo các nhóm như **Business/Market, Scope, Technical, Schedule, People/Resource, Operational, Quality/Content, Security/Privacy và External Dependency**.

Mỗi rủi ro được đưa vào **Risk Register** với các thông tin gồm: Category, mô tả risk, **Probability**, **Impact**, **Risk Score/Priority**, **Transition Indicator**, phương án **Mitigation**, phương án **Contingency** và **Risk Owner**.

Về phương pháp đánh giá, nhóm sử dụng **Probability × Impact**. Probability và Impact được chia thành Low = 1, Medium = 2 và High = 3. **Risk Score = P × I**, từ đó nhóm phân loại mức ưu tiên thành Low, Medium, High và Critical. Những risk có score cao được ưu tiên xử lý trước.

Ngoài ra, nhóm xác định **transition indicator có thể quan sát hoặc đo được** để nhận biết risk đang bắt đầu xuất hiện. Ví dụ, risk thiếu mentor được theo dõi bằng tỷ lệ mentor xác nhận trước pilot; risk về booking được theo dõi bằng tỷ lệ no-show/cancel-late; risk về tiến độ được theo dõi bằng **cycle time, throughput, WIP và blocked items** trên Kanban board.

Ví dụ, nhóm xác định **scope creep sang AI, video call và payment** là risk Critical với score 9. Nhóm áp dụng **Avoid** bằng cách giữ các chức năng này ngoài core MVP. Nếu các work item ngoài MVP đã làm WIP vượt giới hạn, contingency là đưa chúng trở lại future backlog, dừng pull item mới và defer item chưa bắt đầu có priority thấp để bảo vệ core MVP.

Với risk effort thực tế cao hơn estimate, nhóm theo dõi **cycle time tăng, throughput giảm hoặc blocked items tích tụ**. Nhóm dùng WBS, relative estimation khi cần, capacity reserve và spike để mitigate. Nếu risk thực sự xảy ra, nhóm re-estimate các work item còn lại, tách item quá lớn và defer các item ngoài core MVP cho đến khi WIP và cycle time trở lại mức kiểm soát.

Risk Management Plan được xem là một **living document**. Trong quá trình vận hành Kanban, Risk Owner theo dõi các transition indicator. Khi có evidence mới, nhóm cập nhật Probability, Impact, Priority và response. Nếu indicator đạt ngưỡng nhưng risk chưa xảy ra thì nhóm tăng mitigation; nếu risk đã xảy ra thì contingency tương ứng được kích hoạt ngay.

Nhờ đó, Risk Management Plan giúp nhóm chuyển từ cách xử lý bị động khi sự cố xảy ra sang **chủ động nhận diện, đánh giá, phòng ngừa và chuẩn bị phương án xử lý**, đồng thời hỗ trợ kiểm soát WIP, bảo vệ core MVP và tăng khả năng hoàn thành dự án trong giới hạn thời gian và nguồn lực.

## Các câu hỏi thường gặp

1. Các câu hỏi chính cần trả lời trong tài liệu Kế hoạch quản lý rủi ro là gì?
2. Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu Kế hoạch quản lý rủi ro là gì?
3. Tài liệu Kế hoạch quản lý rủi ro của nhóm đã được đánh giá thế nào?
4. Tại sao cần tạo tài liệu Kế hoạch quản lý rủi ro?
5. Tài liệu Kế hoạch quản lý rủi ro của nhóm đã được sử dụng và cập nhật trong quá trình thực hiện dự án như thế nào?

---

## Câu 1. Các câu hỏi chính cần trả lời trong Risk Management Plan là gì?

Tài liệu phải trả lời được:

- Dự án có thể gặp những rủi ro nào?
- Mỗi risk thuộc nhóm nào?
- Khả năng xảy ra và mức ảnh hưởng của từng risk là bao nhiêu?
- Risk Score và mức ưu tiên của từng risk là gì?
- Dấu hiệu nào cho thấy risk đang bắt đầu xảy ra?
- Ai chịu trách nhiệm theo dõi risk?
- Nhóm làm gì trước khi risk xảy ra để giảm Probability hoặc Impact?
- Nếu risk thực sự xảy ra thì nhóm phải làm gì ngay?
- Risk Register được theo dõi, review và cập nhật khi nào?

## Câu 2. Đầu vào và quá trình hình thành tài liệu

Các đầu vào chính gồm **Project Proposal, MVP Scope, Feasibility Study, stakeholder và requirement, WBS/estimate, Kanban board, các dependency bên ngoài và các giả định cần xác thực**.

Quá trình nhóm thực hiện:

1. Xem lại mục tiêu và phạm vi MVP để xác định điều gì có thể làm dự án thất bại hoặc lệch mục tiêu.
2. Phân loại risk theo Business/Market, Scope, Technical, Schedule, People/Resource, Operational, Quality/Content, Security/Privacy và External Dependency.
3. Ghi từng risk vào Risk Register.
4. Đánh giá Probability và Impact theo Low/Medium/High.
5. Tính **Risk Score = P × I** và xác định Priority.
6. Xác định **transition indicator có ngưỡng quan sát được** để phát hiện risk sớm.
7. Chuẩn bị **Mitigation** cho giai đoạn risk chưa xảy ra.
8. Chuẩn bị **Contingency cụ thể** cho trường hợp risk đã xảy ra.
9. Gán **Risk Owner** chịu trách nhiệm theo dõi và kích hoạt response.
10. Đưa các hành động phòng ngừa của risk ưu tiên cao vào backlog hoặc luồng công việc Kanban.
11. Review và cập nhật Risk Register dựa trên evidence thực tế trong quá trình thực hiện dự án.

## Câu 3. Tài liệu được đánh giá như thế nào?

Nhóm không đánh giá Risk Management Plan chỉ dựa trên việc “có đủ bảng risk”, mà xem tài liệu có **hỗ trợ ra quyết định thực tế** hay không.

Một risk được xem là mô tả tốt khi:

- tình huống risk cụ thể và có category rõ ràng;
- Probability, Impact và Priority nhất quán;
- transition indicator có thể quan sát hoặc đo được;
- có Risk Owner;
- mitigation khả thi với nguồn lực của nhóm;
- contingency trả lời trực tiếp câu hỏi **“nếu risk đã xảy ra thì nhóm làm gì ngay?”**.

Trong quá trình quản lý bằng **Kanban**, nhóm đánh giá lại risk dựa trên evidence thực tế như **cycle time, throughput, WIP, blocked items, defect, số mentor/user tuyển được, booking conversion, complaint, no-show, UAT participation, outage hoặc quota của dịch vụ ngoài**.

Khi evidence thay đổi, Probability, Impact, Priority hoặc response tương ứng cũng được cập nhật.

## Câu 4. Tại sao cần Risk Management Plan?

Nếu chỉ xử lý sau khi sự cố đã xảy ra, nhóm sẽ rơi vào trạng thái chữa cháy. Risk Management Plan giúp nhóm:

- nhận diện bất định sớm;
- ưu tiên nguồn lực cho các risk có ảnh hưởng lớn;
- chuẩn bị biện pháp phòng ngừa trước khi risk xảy ra;
- có hành động cụ thể nếu risk trở thành issue;
- kiểm soát WIP và tránh work item bị blocked kéo dài;
- bảo vệ core MVP và release plan;
- tăng khả năng hoàn thành dự án trong giới hạn thời gian và nguồn lực.

## Câu 5. Tài liệu được sử dụng và cập nhật thế nào trong dự án?

Risk Register được sử dụng như một **living document** gắn với quá trình quản lý công việc bằng Kanban.

Mỗi Risk Owner theo dõi transition indicator của risk được giao. Nếu indicator tiến gần hoặc đạt ngưỡng nhưng risk chưa xảy ra, nhóm tăng mitigation. Nếu risk đã xảy ra, contingency được kích hoạt ngay. Nếu risk ảnh hưởng backlog, WIP, cycle time, throughput hoặc release plan, Project Lead và Team cập nhật priority và scope tương ứng.

Ví dụ:

- **R5 — Scope creep:** nếu các work item AI/video/payment làm WIP vượt giới hạn, nhóm đưa chúng trở lại future backlog, dừng pull item mới và defer item chưa bắt đầu có priority thấp để bảo vệ core MVP.
- **R9 — Effort cao hơn estimate:** nếu cycle time tăng, throughput giảm hoặc blocked item tích tụ, nhóm re-estimate, tách work item lớn và defer item ngoài core MVP đến khi flow ổn định trở lại.
- **R1 — Thiếu mentor:** nếu trước pilot hai tuần số mentor xác nhận dưới 70% mục tiêu thì nhóm tăng outreach; nếu đến thời điểm pilot vẫn thiếu mentor thì giảm số chủ đề, gom booking vào các khung giờ cố định và chỉ mở booking cho mentor đã xác nhận.

Nhờ vậy, Risk Management Plan không chỉ là tài liệu để nộp mà còn được sử dụng để hỗ trợ quyết định về **priority, WIP, scope, resource và release plan** trong quá trình thực hiện dự án.
