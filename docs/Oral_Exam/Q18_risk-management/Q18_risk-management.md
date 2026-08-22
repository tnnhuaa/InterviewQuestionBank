# Câu 18 — Kế hoạch quản lý rủi ro

Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Kế hoạch quản lý rủi ro (Software Risk Management Plan) của nhóm. (Sinh viên nộp kèm bản in tài liệu Kế hoạch quản lý rủi ro của nhóm.)

Sau khi xác định **mục tiêu, phạm vi MVP, nguồn lực, tiến độ và các giả định của dự án**, nhóm tiến hành xây dựng **Software Risk Management Plan** nhằm nhận diện sớm những yếu tố có thể ảnh hưởng đến tiến độ, chất lượng, phạm vi và khả năng vận hành của hệ thống.

Đầu tiên, nhóm xem lại các tài liệu như **Project Proposal, Feasibility Study, MVP Scope, requirement, WBS/estimate và kế hoạch Scrum** để xác định các nguồn bất định. Từ đó, nhóm phân loại rủi ro theo các nhóm như **business/market, technical, schedule, resource, operational, quality, security/privacy và external dependency**.

Mỗi rủi ro sau đó được đưa vào **Risk Register** với các thông tin gồm: mô tả rủi ro, **Probability**, **Impact**, dấu hiệu cảnh báo sớm, phương án **Mitigation** và phương án **Contingency**.

Về phương pháp đánh giá, nhóm sử dụng phương pháp định tính **Probability × Impact**. Probability và Impact được chia thành các mức **Low, Medium và High**. Những rủi ro có xác suất và ảnh hưởng cao được ưu tiên xử lý trước. Ngoài ra, nhóm còn sử dụng **transition indicator** để theo dõi xem rủi ro có đang bắt đầu xảy ra hay không.

Ví dụ, nhóm xác định **scope creep sang AI, video call và payment** là rủi ro có Probability và Impact cao. Vì vậy, nhóm áp dụng chiến lược **Avoid** bằng cách đưa các chức năng này ra khỏi MVP. Với rủi ro ước lượng effort thấp hơn thực tế, nhóm sử dụng **WBS, Planning Poker, capacity reserve và theo dõi velocity** để giảm rủi ro; nếu rủi ro xảy ra thì nhóm sẽ re-estimate và giảm các chức năng ít ưu tiên.

Tài liệu này không được tạo một lần rồi giữ nguyên mà được xem là một **living document**. Trong quá trình thực hiện dự án, nhóm theo dõi các dấu hiệu như velocity thấp, story carry-over, blocker, số mentor hoặc user tuyển được, booking conversion, defect hay sự cố dịch vụ bên ngoài. Khi có evidence mới, nhóm cập nhật lại Probability, Impact và phương án xử lý tương ứng.

Nhờ đó, Risk Management Plan giúp nhóm chuyển từ cách xử lý bị động khi sự cố xảy ra sang **chủ động nhận diện, đánh giá, phòng ngừa và chuẩn bị phương án dự phòng**, đồng thời hỗ trợ nhóm bảo vệ phạm vi MVP và tăng khả năng hoàn thành dự án trong giới hạn thời gian và nguồn lực.


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
- Khả năng xảy ra và mức ảnh hưởng của từng rủi ro là bao nhiêu?
- Rủi ro nào cần ưu tiên xử lý trước?
- Dấu hiệu nào cho thấy rủi ro đang bắt đầu xảy ra?
- Nhóm làm gì để giảm khả năng hoặc ảnh hưởng của rủi ro?
- Nếu rủi ro thực sự xảy ra thì nhóm sẽ xử lý thế nào?
- Risk Register được theo dõi, cập nhật và review khi nào?

## Câu 2. Đầu vào và quá trình hình thành tài liệu

Các đầu vào chính gồm Project Proposal, MVP Scope, Feasibility Study, stakeholder và requirement, WBS/estimate, kế hoạch Scrum, các dependency bên ngoài và các giả định cần xác thực.

Quá trình nhóm thực hiện:

1. Xem lại mục tiêu và phạm vi MVP để xác định điều gì có thể làm dự án thất bại hoặc lệch mục tiêu.
2. Phân tích các nhóm risk về business/market, people/resource, schedule, technical, operational, quality/content, security/privacy và external dependency.
3. Ghi từng risk vào Risk Register.
4. Đánh giá Probability và Impact theo Low/Medium/High.
5. Xác định transition indicator để có thể phát hiện risk sớm.
6. Chuẩn bị mitigation và contingency cho từng risk.
7. Ưu tiên các risk có P/I cao và đưa hành động phòng ngừa vào backlog hoặc kế hoạch dự án.
8. Review và cập nhật Risk Register trong quá trình thực hiện dự án.

## Câu 3. Tài liệu được đánh giá như thế nào?

Nhóm không đánh giá Risk Management Plan chỉ dựa trên việc “có đủ bảng risk”, mà xem nó có hỗ trợ quyết định dự án hay không. Một risk được xem là mô tả tốt khi có nguyên nhân/tình huống cụ thể, có dấu hiệu theo dõi được, có Probability và Impact hợp lý, đồng thời mitigation và contingency khả thi với nguồn lực của nhóm.

Trong quá trình Scrum, risk được kiểm tra lại dựa trên evidence thực tế như velocity, story carry-over, blocker, số mentor/user tuyển được, booking conversion, complaint, defect, outage hoặc quota của dịch vụ ngoài. Khi evidence thay đổi, Probability, Impact hoặc response tương ứng cũng phải được cập nhật.

## Câu 4. Tại sao cần Risk Management Plan?

Nếu chỉ xử lý khi sự cố đã xảy ra, nhóm sẽ chuyển từ quản lý chủ động sang chữa cháy. Risk Management Plan giúp nhóm phát hiện bất định sớm, ưu tiên nguồn lực cho những vấn đề có ảnh hưởng lớn, bảo vệ MVP scope và Sprint Goal, chuẩn bị phương án dự phòng và tăng khả năng hoàn thành dự án trong giới hạn thời gian/nguồn lực.

## Câu 5. Tài liệu được sử dụng và cập nhật thế nào trong dự án?

Risk Register được dùng như một tài liệu sống. Nhóm theo dõi các transition indicator trong sprint; nếu một risk tăng xác suất hoặc bắt đầu xuất hiện thì mitigation được kích hoạt, và nếu risk đã xảy ra thì chuyển sang contingency. Những risk liên quan trực tiếp tới backlog, scope hoặc release plan được phản ánh vào quyết định ưu tiên công việc.

Ví dụ: nếu velocity thấp và story liên tục carry-over, R9 được xem lại, nhóm re-estimate và giảm scope. Nếu story AI/video/payment bắt đầu đi vào sprint, R5 được kích hoạt và nhóm đưa chúng trở lại future backlog để bảo vệ MVP. Nếu số mentor pilot thấp hơn mục tiêu, nhóm kích hoạt outreach sớm hoặc chuyển sang concierge pilot theo R1.

