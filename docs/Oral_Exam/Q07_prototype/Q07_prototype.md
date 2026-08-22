# Câu 07 — Bản mẫu (Prototype)

###  Trình bày quá trình hình thành và phương pháp đánh giá sản phẩm Bản mẫu (Prototype) của nhóm. (Sinh viên nộp kèm bản in phác thảo giao diện ban đầu cho hệ thống của nhóm.)

Sau khi xác định được vấn đề chính là các ứng viên sau khi ứng tuyển thường không biết nên ôn tập nội dung nào để chuẩn bị cho buổi phỏng vấn, nhóm bắt đầu khảo sát các website và sản phẩm có chức năng tương tự trên thị trường. Nhóm sử dụng ChatGPT như một công cụ hỗ trợ tổng hợp và đối chiếu các sản phẩm dựa trên Project Proposal, sau đó các thành viên trực tiếp trải nghiệm các website, phân tích user flow và thảo luận để xác định cách các sản phẩm hiện có hỗ trợ người dùng luyện phỏng vấn.

Qua quá trình khảo sát, nhóm nhận thấy một user flow phổ biến là:

**Chọn chủ đề phỏng vấn → Website cung cấp bộ câu hỏi theo chủ đề → Người dùng tiến hành luyện tập.**

Tuy nhiên, nhóm nhận thấy hạn chế của cách tiếp cận này là người dùng vẫn phải tự đọc Job Description (JD), tự xác định các kỹ năng hoặc chủ đề cần ôn và tiếp tục tự tìm các câu hỏi phù hợp. Quá trình này có thể mất nhiều thời gian, đặc biệt đối với các ứng viên chưa có nhiều kinh nghiệm chuẩn bị phỏng vấn.

Từ vấn đề đó, nhóm đặt ra giả thuyết rằng nếu hệ thống có thể hỗ trợ chuyển trực tiếp nội dung của JD thành các chủ đề và câu hỏi cần luyện tập thì người dùng sẽ dễ xác định nội dung cần chuẩn bị hơn. Từ giả thuyết này, nhóm xây dựng Core Prototype theo luồng:

**Upload JD → Kiểm tra nội dung JD → Mapping yêu cầu trong JD → Đề xuất các câu hỏi phù hợp → Người dùng bắt đầu luyện tập.**

Sau khi xác định được Core Prototype, nhóm tiến hành xác định các màn hình và trạng thái cần thiết cho từng bước trong luồng. Nhóm xây dựng bản phác thảo ban đầu, mô tả nội dung, hành động chính, trạng thái và mối liên kết giữa các màn hình. Đồng thời, nhóm thống nhất các quy tắc giao diện như màu sắc, font chữ, cách bố trí và thư viện icon. Các thông tin này được sử dụng làm đầu vào cho AI hỗ trợ tạo prompt giao diện, sau đó nhóm sử dụng Figma Make để xây dựng prototype tương tác. Kết quả được chia sẻ cho toàn bộ thành viên để cùng review và chỉnh sửa.

Prototype của nhóm được đánh giá theo ba nhóm tiêu chí chính. Thứ nhất là **tính đầy đủ**, tức là prototype có đủ các màn hình và trạng thái cần thiết để người dùng hoàn thành Core Flow hay không. Thứ hai là **tính dễ sử dụng**, tức là một thành viên khi sử dụng prototype lần đầu có thể tự hoàn thành các bước từ upload JD đến bắt đầu luyện tập mà không cần hướng dẫn hay không. Thứ ba là **tính dễ hiểu**, tức là người dùng có hiểu hệ thống đang diễn giải JD như thế nào, hiểu các mapping được tạo ra và hiểu vì sao một câu hỏi được đề xuất hay không.

Trong quá trình đánh giá, các thành viên được giao các task cụ thể như upload một JD, kiểm tra nội dung được trích xuất, xem và sửa một mapping chưa phù hợp, chọn một câu hỏi được đề xuất và bắt đầu luyện tập. Nhóm ghi nhận các bước gây nhầm lẫn, thao tác sai, thời điểm người dùng cần trợ giúp và các phản hồi định tính. Từ những kết quả đó, nhóm tiếp tục chỉnh sửa prototype và thực hiện lại việc đánh giá cho đến khi luồng sử dụng trở nên rõ ràng và nhất quán hơn.

Như vậy, Prototype không chỉ được sử dụng để minh họa giao diện của hệ thống mà còn là công cụ giúp nhóm kiểm chứng giả thuyết sản phẩm, làm rõ yêu cầu, phát hiện sớm các vấn đề về luồng sử dụng và giảm rủi ro trước khi tiến hành implementation.

### 1. Sản phẩm Bản mẫu là gì?

Bản mẫu (Prototype) là phiên bản mô phỏng sớm của một phần hoặc một luồng quan trọng trong hệ thống, được tạo ra để kiểm tra xem người dùng có hiểu, sử dụng được và thấy giải pháp phù hợp với nhu cầu hay không trước khi hệ thống thật được hoàn thiện.

### 2. Khác nhau giữa bản mẫu hệ thống và tập hợp các màn hình giao diện hệ thống là gì?

Một tập hợp màn hình chỉ cho biết “giao diện trông như thế nào”. Còn prototype phải thể hiện được luồng tương tác, trạng thái, quyết định và phản hồi của hệ thống.

Ví dụ, nếu chỉ có các ảnh S11, S12, S13, S14 thì đó mới chỉ là screen set. Nhưng khi chúng được nối thành:

S11 Upload → S12 Confirm/Edit → S13 Correct Mapping → S14 Choose Recommendation → S03 Practice

và có các state như validation error, no taxonomy match, no recommendation.

### 3. Các đầu vào cần thiết để tạo Prototype là gì?

- Business requirements và user requirements.
- User stories, acceptance criteria và business rules.
- Các screen/state cần mô phỏng.
- Các tiêu chí đánh giá prototype.

### 4. Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo sản phẩm Bản mẫu là gì?

**Đầu vào** gồm: vấn đề của người dùng, Project Proposal, requirements/user stories, kết quả khảo sát các website tương tự và các quy tắc UI như màu sắc, font, icon.

**Các bước thực hiện:**

**Xác định vấn đề → Khảo sát sản phẩm tương tự → Xác định Core Prototype → Xác định các màn hình cần thiết → Thiết kế trên Figma Make → Liên kết thành flow tương tác → Cả nhóm review và chỉnh sửa.**

Với nhóm, Core Prototype được xác định là:

**Upload JD → Kiểm tra nội dung → Mapping yêu cầu → Đề xuất câu hỏi → Luyện tập.**

### 5. Sản phẩm Bản mẫu của nhóm đã được đánh giá thế nào?

Nhóm đánh giá Prototype theo ba tiêu chí:

Đầy đủ: có đủ màn hình để hoàn thành flow chính.
Dễ sử dụng: người dùng lần đầu có thể hoàn thành flow mà không cần hướng dẫn.
Dễ hiểu: người dùng hiểu hệ thống mapping JD như thế nào và vì sao câu hỏi được đề xuất.

Nhóm cho các thành viên thực hiện các task trên Prototype, ghi nhận lỗi, điểm gây nhầm lẫn và phản hồi, sau đó chỉnh sửa lại.

### 6. Tại sao cần tạo sản phẩm Bản mẫu?

Prototype giúp nhóm kiểm chứng ý tưởng và làm rõ yêu cầu trước khi lập trình. Nhóm có thể phát hiện sớm các vấn đề về giao diện, luồng sử dụng hoặc requirement và sửa chúng với chi phí thấp hơn so với khi hệ thống đã được implement.

Với nhóm, Prototype dùng để kiểm chứng flow:

Upload JD → Mapping → Đề xuất câu hỏi → Luyện tập.

### 7. Sản phẩm Bản mẫu được sử dụng trong quá trình thực hiện dự án như thế nào?

Prototype được sử dụng làm cầu nối giữa Requirement và Implementation:

Requirement → Prototype → Đánh giá → Chỉnh sửa → Implementation → Testing

Nhóm dùng Prototype để thống nhất cách hiểu feature, làm tài liệu tham chiếu khi lập trình, bổ sung các requirement còn thiếu và đối chiếu hệ thống thực tế với flow đã được thiết kế.