# Câu 01 — Đề xuất dự án (Project Proposal)

## 1. Yêu cầu của câu hỏi

Trình bày **quá trình hình thành** và **phương pháp đánh giá** tài liệu Đề xuất dự án (Project Proposal) của nhóm; giải thích việc sử dụng, cập nhật tài liệu và các khái niệm dự án liên quan. Bản in bắt buộc là tài liệu [Đề xuất dự án — Nền tảng luyện phỏng vấn](../../Project_Proposal/Project_Proposal.md).

## 2. Dàn ý viết trên A4 trong 10 phút

1. **CÁI GÌ (WHAT) – TẠI SAO (WHY) – KHI NÀO (WHEN):** Đề xuất dự án (Project Proposal) mô tả vấn đề, giải pháp, giá trị, phạm vi sơ bộ và điều kiện để quyết định có đầu tư hoặc khởi động dự án hay không. Tài liệu được lập trước khi cam kết nguồn lực chi tiết; Đề xuất dự án đề nghị một dự án, còn Ủy nhiệm dự án (Project Charter) mới chính thức ủy nhiệm dự án.
2. **Đề xuất của nhóm:** xây dựng nền tảng web cho ứng viên Việt Nam, lấy một Mô tả công việc (Job Description – JD) cụ thể làm điểm bắt đầu; nối `JD → kế hoạch chuẩn bị → tự luyện/cố vấn → phản hồi → luyện lại`.
3. **Đầu vào:** vấn đề thực tế và quy trình dùng nhiều công cụ rời; phân tích sáu đối thủ hoặc giải pháp thay thế; bài giảng; Viễn cảnh và phạm vi dự án (Project Vision and Scope), Danh sách công việc sản phẩm (Product Backlog), Ủy nhiệm dự án (Project Charter), Kế hoạch nguồn lực (Resource Plan) và Báo cáo tính khả thi (Feasibility Study Report).
4. **Quá trình:** nhóm bắt đầu từ khó khăn của ứng viên → khảo sát cách làm hiện tại và đối thủ → xác định người dùng, vấn đề và giá trị đề xuất → giới hạn MVP → review chéo với phạm vi, nguồn lực và tính khả thi → điều chỉnh thành hướng JD-first.
5. **Đánh giá:** kiểm tra đủ nội dung theo bài giảng; so sánh công cụ và đối thủ; kiểm tra tính khả thi về phạm vi–thời gian–chi phí–nguồn lực; truy vết sang Danh sách công việc sản phẩm và kiến trúc; kiểm soát phiên bản bằng Git.
6. **Kết quả đánh giá:** đổi từ “Ngân hàng câu hỏi (Question Bank) + Sàn kết nối cố vấn (Mentor Marketplace)” chung chung sang hướng **bắt đầu từ JD (JD-first)**; thêm trích xuất, Nhận dạng ký tự quang học (Optical Character Recognition – OCR), bước hiệu chỉnh, ánh xạ có giải thích, Chỉ số đo lường hiệu quả (Key Performance Indicator – KPI) và điều kiện Tiếp tục/Điều chỉnh/Dừng (Go/Pivot/Stop); loại thanh toán khỏi Sản phẩm khả dụng tối thiểu (Minimum Viable Product – MVP).
7. **Sử dụng và cập nhật:** Đề xuất dự án được dùng làm định hướng chung cho Vision & Scope, Backlog, Prototype, Architecture và việc triển khai. Khi nhóm làm rõ hơn giá trị sản phẩm, đề xuất được cập nhật từ mô hình Question Bank + Mentor Marketplace chung sang quy trình JD-first; các thay đổi kỹ thuật chi tiết được quản lý bằng ADR.
8. **Lý thuyết chốt:** Dự án (Project) là tạm thời và tạo kết quả duy nhất; Hoạt động (Operation) là liên tục, lặp lại; Chương trình (Program) quản lý các dự án liên quan; Danh mục đầu tư (Portfolio) chọn dự án hoặc chương trình theo mục tiêu chiến lược. Phạm vi, thời gian, chi phí, nguồn lực và chất lượng là các ràng buộc phải cân bằng.

## 3. Tài liệu là gì, trả lời câu hỏi nào và tại sao cần tạo?

### 3.1 CÁI GÌ (WHAT) — Đề xuất dự án là gì?

Đề xuất dự án (Project Proposal) là tài liệu ở giai đoạn hình thành ý tưởng, trình bày ngắn gọn **vấn đề đáng giải quyết, giải pháp đề xuất, giá trị, phạm vi sơ bộ, đối thủ, ràng buộc và kết quả mong đợi** để người có thẩm quyền quyết định tiếp tục, điều chỉnh hay dừng ý tưởng. Nó chưa phải kế hoạch thực hiện chi tiết và cũng chưa tự ủy nhiệm dự án.

Các câu hỏi chính mà Đề xuất dự án cần trả lời là:

- Nhóm nào đề xuất, tên dự án là gì?
- Người dùng gặp **điểm khó khăn (Pain Point)** nào; bằng chứng hoặc dữ liệu nào cho thấy vấn đề tồn tại?
- Người dùng hiện giải quyết vấn đề ra sao và còn hạn chế gì?
- Quy trình nghiệp vụ cốt lõi (Core Business Workflow) của giải pháp là gì?
- Tại sao đáng làm; giá trị khác biệt là gì?
- Đối thủ trực tiếp và giải pháp thay thế là ai?
- Sản phẩm khả dụng tối thiểu (MVP) làm gì, không làm gì; tạo sản phẩm, dịch vụ hoặc kết quả nào?
- Ràng buộc, tiêu chí thành công và điều kiện Tiếp tục/Điều chỉnh/Dừng là gì?

### 3.2 TẠI SAO (WHY) và KHI NÀO (WHEN)

- **Tại sao:** Đề xuất dự án giúp nhóm không bắt đầu bằng danh sách tính năng; buộc nhóm chứng minh vấn đề, so sánh lựa chọn, giới hạn phạm vi và kiểm tra dự án có phù hợp nguồn lực hay không. Đây là căn cứ ban đầu để thống nhất các bên liên quan (Stakeholder) và quyết định có tiếp tục đầu tư vào Ủy nhiệm dự án, Viễn cảnh và phạm vi, Danh sách công việc sản phẩm, Chứng minh ý tưởng (Proof of Concept – PoC) và kế hoạch hay không.
- **Khi nào:** lập ở giai đoạn khởi tạo, trước khi dự án được ủy nhiệm và trước khi cam kết lịch hoặc chi phí chi tiết; cập nhật khi giả thuyết vấn đề, giá trị, phạm vi cấp cao hoặc điều kiện phê duyệt thay đổi đáng kể.

## 4. Nội dung đề xuất của nhóm

### 4.1 Vấn đề và người dùng

Ứng viên Việt Nam chuẩn bị cho kỳ thực tập hoặc công việc đầu tiên phải đọc một Mô tả công việc (JD) rồi tự suy luận vị trí, cấp độ, kỹ năng và câu hỏi cần ôn. JD, nguồn câu hỏi, việc tìm cố vấn (Mentor), đặt lịch và phản hồi (Feedback) nằm ở nhiều công cụ, nên không truy vết được yêu cầu nào đã được bao phủ và phản hồi phải quay lại kế hoạch luyện như thế nào.

### 4.2 Giải pháp và điểm khác biệt

Sản phẩm khả dụng tối thiểu (MVP) là ứng dụng web có ba năng lực liên kết:

1. Nhập JD, trích xuất trực tiếp hoặc OCR dự phòng, cho người dùng sửa và xác nhận, phân tích yêu cầu và ánh xạ câu hỏi có nguồn–chủ đề–lý do.
2. Ngân hàng câu hỏi (Question Bank) để tìm, lưu và theo dõi trạng thái tự luyện.
3. Hồ sơ, xác minh và lịch của cố vấn; việc đặt lịch (Booking) mang theo ngữ cảnh JD hoặc kế hoạch; phỏng vấn thử (Mock Interview) bằng liên kết họp ngoài; phản hồi theo bộ tiêu chí (Rubric) có hành động tiếp theo.

Điểm khác biệt cần kiểm chứng là quy trình **bắt đầu từ JD (JD-first)** cho phân khúc Thực tập sinh/Lập trình viên giao diện người dùng mới vào nghề (Front-end Intern/Junior) tại Việt Nam. Trong quy trình này, Kế hoạch chuẩn bị (Preparation Plan) giữ truy vết về JD và nối tiếp sang đặt lịch và phản hồi. Đề xuất dự án không tuyên bố đây đã là lợi thế thị trường được chứng minh.

### 4.3 Phạm vi và kết quả mong đợi

- **Trong MVP:** ba vai trò Sinh viên (Student), Cố vấn (Mentor) và Quản trị viên (Administrator); tiếp nhận và ánh xạ JD; Ngân hàng câu hỏi; xác minh và quản lý lịch cố vấn; vòng đời đặt lịch; liên kết họp ngoài; thông báo; phản hồi và đánh giá; chức năng quản trị.
- **Ngoài MVP:** người phỏng vấn bằng Trí tuệ nhân tạo (Artificial Intelligence – AI) hoặc tự động chấm câu trả lời; cuộc gọi hình ảnh/âm thanh tích hợp (Video/Audio Call); ghi âm hoặc phiên âm; thanh toán, ký quỹ và chi trả; ứng dụng di động thuần (Native Mobile Application); Hệ thống theo dõi ứng viên (Applicant Tracking System – ATS); đề xuất bằng Học máy (Machine Learning).
- **Đường cơ sở tại thời điểm bản 0.2:** 6 thành viên, 8 tuần, khoảng 653 giờ sau dự phòng, trần tiền mặt 1.125.000 VNĐ; thử nghiệm giới hạn (Pilot) dự kiến 20 JD, 12 Sinh viên, 4 Cố vấn và 12 lượt đặt lịch hợp lệ.
- **Kết quả cần đo:** chất lượng nhận diện và ánh xạ trên tập JD kiểm chứng mù; mức bắt đầu tự luyện hoặc đặt lịch từ kế hoạch; ít nhất 10 lượt đặt lịch ở trạng thái `CONFIRMED`, 8 lượt ở trạng thái `COMPLETED`; phản hồi có điểm mạnh–điểm yếu–hành động tiếp theo.

Các con số trên là **đường cơ sở lập kế hoạch và mục tiêu**, không phải kết quả thử nghiệm đã đạt.

## 5. Quá trình hình thành thực tế

### 5.1 Đầu vào và dữ liệu đã dùng

| Đầu vào                             | Nhóm đã dùng như thế nào                                                                                                                                                                     | Bằng chứng                                                                                                                                                                                                                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vấn đề thực tế và cách làm hiện tại | Mô tả chuỗi công cụ rời: trang tuyển dụng và LinkedIn; Google, trang bài viết, YouTube và ChatGPT; LeetCode; ghi chú và bảng tính; trò chuyện và lịch; Google Meet hoặc Zoom; phản hồi tự do | [Phân tích công cụ hiện có (Existing Tools Analysis)](../../Project_Proposal/Existing_Tools_Analysis.md)                                                                                                                                                                                                          |
| Dữ liệu cạnh tranh                  | So sánh 6 giải pháp theo Ngân hàng câu hỏi, cố vấn, đặt lịch, phản hồi và nhóm người dùng mục tiêu                                                                                           | [Phân tích đối thủ cạnh tranh (Competitor Analysis)](../../Project_Proposal/Competitor_Analysis.md)                                                                                                                                                                                                               |
| Kiến thức môn học                   | Ý tưởng đến từ vấn đề thực tế; Đề xuất dự án phải nêu nhóm và tên, vấn đề, trường hợp sử dụng cốt lõi, lý do, ít nhất 3 đối thủ và điểm khác biệt                                            | [Dự án phần mềm (Software Project), trang chiếu 028–032](../../refs/02-software-project.md)                                                                                                                                                                                                                       |
| Đường cơ sở dự án                   | Vai trò, 8 tuần, nguồn lực, ngân sách, phạm vi bắt đầu từ JD và các cổng đánh giá tính khả thi                                                                                               | [Ủy nhiệm dự án (Project Charter)](<../../Project_Governance & Stakeholder/Project_Charter.md>), [Báo cáo tính khả thi (Feasibility Study Report)](../../Project_Feasibility/feasibility.md), [Viễn cảnh và phạm vi dự án (Project Vision and Scope)](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md) |
| Yêu cầu chi tiết                    | Dùng để kiểm tra Đề xuất dự án có thể phân rã thành Câu chuyện người dùng (User Story), Tiêu chí chấp nhận (Acceptance Criteria) và quyết định sản phẩm hay không                            | [Danh sách công việc sản phẩm và tiêu chí chấp nhận (Product Backlog and Acceptance Criteria)](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md)                                                                                                                                         |

Dữ liệu ở giai đoạn đề xuất chủ yếu là phân tích định tính, thông tin công khai về đối thủ và các baseline nội bộ. Vì vậy, nhóm dùng chúng để hình thành giả thuyết ban đầu; việc xác nhận nhu cầu và mức sẵn lòng chi trả được đưa sang hoạt động Khám phá khách hàng (Customer Discovery) và pilot.

### 5.2 Các bước nhóm thực hiện

1. **Nhận diện vấn đề:** nhóm mô tả hành trình hiện tại của ứng viên từ lúc đọc JD đến lúc tự luyện, tìm Mentor và nhận feedback; từ đó xác định các điểm đứt gãy do dùng nhiều công cụ rời.
2. **Khảo sát giải pháp hiện có:** nhóm so sánh các nền tảng luyện phỏng vấn, mentoring và coding practice theo cùng một nhóm tiêu chí để tìm phần đã được giải quyết và khoảng trống cần kiểm chứng.
3. **Xây dựng đề xuất ban đầu:** nhóm xác định người dùng mục tiêu, giá trị, quy trình nghiệp vụ chính, phạm vi sơ bộ và kết quả mong đợi.
4. **Review chéo:** PO/BA kiểm tra vấn đề và giá trị; PM kiểm tra thời gian, nguồn lực và chi phí; UI/UX kiểm tra hành trình người dùng; phụ trách kỹ thuật và PoC kiểm tra khả năng triển khai.
5. **Điều chỉnh:** sau khi đối chiếu với Vision & Scope, Backlog, Feasibility và Resource Plan, nhóm thu hẹp pilot và chuyển trọng tâm sang quy trình JD-first.

Theo Ủy nhiệm dự án, Hưng phụ trách sản phẩm và yêu cầu; Gia Thành phụ trách khởi tạo, ước lượng và điều phối; Tuấn Anh phụ trách quản trị; Hùng phụ trách UI/UX; Trí phụ trách PoC/E2E; Luân phụ trách kiến trúc. Việc review được thực hiện theo góc nhìn của các vai trò này để tránh một người tự quyết toàn bộ đề xuất.

Quy trình tạo tài liệu có thể tóm tắt bằng `Đầu vào → Xử lý → Đầu ra`:

```text
Điểm khó khăn + quy trình hiện tại + dữ liệu đối thủ + bài giảng
→ phát biểu vấn đề và người dùng mục tiêu
→ mô tả quy trình cốt lõi và giá trị khác biệt
→ giới hạn phần trong/ngoài MVP
→ đối chiếu Ủy nhiệm, Phạm vi, Danh sách công việc, nguồn lực và tính khả thi
→ sửa sai lệch, đặt chỉ số đo lường và cổng đánh giá
→ Đề xuất dự án JD-first đã thống nhất trong nhóm
```

## 6. Phân tích sản phẩm cạnh tranh

| Nhóm cạnh tranh                              | Sản phẩm                      | Quan hệ với đề xuất                                                                                                       |
| -------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Phỏng vấn thử và huấn luyện trực tuyến       | interviewing.io, MentorCruise | Có cố vấn hoặc huấn luyện viên và phản hồi; cạnh tranh trực tiếp ở nhu cầu luyện với người có kinh nghiệm                 |
| Phỏng vấn thử đồng cấp (Peer Mock Interview) | Pramp / Exponent Practice     | Có ghép cặp, đặt lịch và phản hồi; trực tiếp ở quy trình luyện phỏng vấn nhưng mô hình nguồn cung khác cố vấn đã xác minh |
| Cố vấn nghề nghiệp tại Việt Nam              | Mentori Vietnam, Mentora      | Gần trực tiếp ở thị trường, người dùng và việc kết nối cố vấn; phạm vi dịch vụ rộng hơn                                   |
| Giải pháp thay thế                           | LeetCode Study Plans          | Mạnh về lập trình và chấm tự động nhưng không thay thế toàn bộ vòng JD → kế hoạch → cố vấn                                |

Kết luận cạnh tranh của nhóm là: các sản phẩm hiện có giải quyết tốt từng phần, nhưng nhóm muốn kiểm chứng một quy trình JD-first dành cho ứng viên mới vào nghề tại Việt Nam. Đây là giả thuyết định vị cần kiểm chứng bằng pilot, không phải tuyên bố đối thủ không có tính năng tương tự.

## 7. Phương pháp đánh giá và kết quả thực tế

### 7.1 Nhóm đã đánh giá theo những lớp nào?

| Lớp đánh giá                                              | Cách đánh giá                                                                                                                                     | Kết quả nhìn thấy trong kho mã nguồn                                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Độ đầy đủ của Đề xuất dự án                               | Đối chiếu danh sách kiểm tra của môn học: vấn đề, trường hợp sử dụng cốt lõi, lý do, ít nhất 3 đối thủ, điểm khác biệt                            | Bản 0.2 có đủ các mục chính, thêm phạm vi, kết quả mong đợi và điều kiện phê duyệt                                                    |
| Mức phù hợp vấn đề–giải pháp (Problem–Solution Fit) sơ bộ | Vẽ quy trình hiện tại, chỉ ra bước chuyển thủ công và so sánh với quy trình tương lai                                                             | Xác định cơ hội nối JD, câu hỏi, đặt lịch và phản hồi; vẫn thiếu hoạt động khám phá khách hàng                                        |
| Cạnh tranh và định vị                                     | So sánh sáu giải pháp theo cùng nhóm năng lực                                                                                                     | Thu hẹp thử nghiệm về Thực tập sinh/Lập trình viên giao diện người dùng mới vào nghề tại Việt Nam và xác định lợi thế phải chứng minh |
| Khả thi và ràng buộc                                      | Đối chiếu phạm vi với Ủy nhiệm dự án, Kế hoạch nguồn lực, Báo cáo tính khả thi và các cổng đánh giá                                               | Kết luận “khả thi có điều kiện”; thanh toán, gọi hình tích hợp và người phỏng vấn AI bị loại khỏi MVP                                 |
| Nhất quán và truy vết                                     | Đối chiếu Đề xuất dự án với Viễn cảnh và phạm vi, Danh sách công việc sản phẩm, Bản mẫu (Prototype) và Kiến trúc phần mềm (Software Architecture) | Luồng bắt đầu từ JD được phân rã thành yêu cầu, giao diện và thành phần kỹ thuật                                                      |
| Kiểm soát thay đổi                                        | So sánh bản đề xuất ban đầu với bản JD-first; kiểm tra lại các tài liệu liên quan                                                                 | Nội dung thay đổi được đồng bộ với Vision & Scope, Backlog, Feasibility và Architecture                                               |

### 7.2 Sau đánh giá đã chỉnh gì?

Sau vòng review, nhóm thực hiện các thay đổi chính:

- Bổ sung đủ sáu thành viên và vai trò theo Ủy nhiệm dự án.
- Đổi phát biểu vấn đề từ quy trình luyện chung sang vấn đề bắt đầu từ **một JD cụ thể**.
- Đổi giải pháp từ hai phân hệ chung thành ba năng lực: JD → kế hoạch, tự luyện và vòng luyện tập với cố vấn.
- Thêm trích xuất trực tiếp/OCR, bước hiệu chỉnh, hệ thống phân loại (taxonomy), ánh xạ có nguồn/chủ đề/lý do.
- Giới hạn thử nghiệm ở Thực tập sinh/Lập trình viên giao diện người dùng mới vào nghề và loại thanh toán khỏi MVP.
- Thay giả thuyết thu hoa hồng (Commission) bằng thử nghiệm miễn phí với cố vấn tự nguyện.
- Đổi kết quả mơ hồ thành chỉ số/cổng đánh giá có thể đo và bổ sung đường cơ sở 6 người–8 tuần–653 giờ–1.125.000 VNĐ.

### 7.3 Ai đánh giá và đánh giá như thế nào?

Nhóm review chéo theo vai trò:

- PO/BA kiểm tra người dùng, vấn đề, giá trị và phạm vi sản phẩm;
- PM/Scrum Master kiểm tra nguồn lực, thời gian, chi phí và các cổng quyết định;
- UI/UX kiểm tra hành trình JD → plan → practice;
- Architecture/PoC kiểm tra khả năng thực hiện các phần extraction, mapping, booking và notification;
- Team Lead kiểm tra sự thống nhất giữa các workstream.

Kết quả review là bản đề xuất JD-first hiện tại. Tài liệu được xem là baseline nội bộ của nhóm; việc ủy nhiệm chính thức vẫn thuộc Project Charter và quyết định của Sponsor.

## 8. Tài liệu đã được dùng và cập nhật thế nào?

### 8.1 Sử dụng

Đề xuất dự án đóng vai trò bản tóm tắt cấp cao để nhóm giữ cùng một hướng sản phẩm. Luồng và giới hạn trong tài liệu được cụ thể hóa tại:

- Viễn cảnh và phạm vi dự án cùng Danh sách công việc sản phẩm: mục tiêu, yêu cầu, Câu chuyện người dùng, Tiêu chí chấp nhận, chỉ số đo lường và quyết định sản phẩm.
- Báo cáo tính khả thi và Kế hoạch nguồn lực: kiểm tra phạm vi với 8 tuần, khả năng nguồn lực và trần tiền mặt.
- Bản mẫu và Kiến trúc phần mềm: thiết kế luồng tiếp nhận JD–hiệu chỉnh–ánh xạ–kế hoạch, Ngân hàng câu hỏi, đặt lịch cố vấn và phản hồi.
- Mã nguồn: phần giao diện người dùng (Frontend) và phần máy chủ ứng dụng (Backend) hiện có các luồng JD, câu hỏi, xác minh và lịch cố vấn, đặt lịch và phản hồi; đây là kết quả triển khai phù hợp với ba năng lực cấp cao trong Đề xuất dự án.

### 8.2 Cập nhật

- **Bản đầu:** tập trung vào Question Bank và Mentor Marketplace.
- **Bản cập nhật:** chuyển sang JD-first, bổ sung extraction/OCR, correction, explainable mapping, chỉ số và scope exclusions.
- **Nguyên tắc cập nhật:** chỉ sửa Proposal khi vấn đề, giá trị, người dùng hoặc phạm vi cấp cao thay đổi. Các thay đổi triển khai chi tiết như cách dùng Gemini được quản lý bằng ADR nếu không làm đổi giá trị và ranh giới MVP.

## 9. Các câu hỏi lý thuyết thường gặp

### 9.1 Dự án phần mềm là gì?

- **CÁI GÌ (WHAT):** dự án là nỗ lực **tạm thời**, có ngày bắt đầu và kết thúc, dùng nguồn lực để tạo **sản phẩm, dịch vụ hoặc kết quả duy nhất**. Dự án phần mềm tạo mới hoặc thay đổi sản phẩm, hệ thống hay dịch vụ có thành phần phần mềm.
- **TẠI SAO (WHY):** phải quản lý vì mục tiêu là duy nhất nhưng nguồn lực hữu hạn, yêu cầu và rủi ro có thể thay đổi.
- **KHI NÀO KẾT THÚC (WHEN):** khi đạt mục tiêu, bị dừng vì không còn khả thi hoặc cần thiết, hoặc được chuyển giao sang vận hành.

### 9.2 Phân biệt Dự án, Hoạt động, Chương trình và Danh mục đầu tư

| Khái niệm                       | Đặc trưng                                                                                                               | Ví dụ liên hệ                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Dự án (Project)**             | Tạm thời; tạo kết quả duy nhất; quản lý để đạt mục tiêu và phạm vi                                                      | Xây dựng MVP Nền tảng luyện phỏng vấn trong 8 tuần                                           |
| **Hoạt động (Operation)**       | Liên tục, lặp lại cùng quy trình để duy trì hoạt động                                                                   | Duyệt cố vấn, hỗ trợ đặt lịch và vận hành hệ thống hằng ngày sau bàn giao                    |
| **Chương trình (Program)**      | Nhóm các dự án liên quan được điều phối chung để có lợi ích không đạt được nếu quản lý riêng                            | Chương trình “Sẵn sàng nghề nghiệp” gồm dự án nền tảng, dự án nội dung và dự án tuyển cố vấn |
| **Danh mục đầu tư (Portfolio)** | Tập hợp dự án hoặc chương trình, có thể không phụ thuộc nhau, được chọn và ưu tiên theo mục tiêu chiến lược hoặc đầu tư | Danh mục các dự án số của khoa hoặc doanh nghiệp và quyết định phân bổ ngân sách             |

Dự án có thể phát sinh từ nhu cầu cải tiến hoạt động; sản phẩm dự án sau bàn giao có thể trở thành đối tượng vận hành.

### 9.3 Dự án phần mềm đến từ đâu?

- Yêu cầu mời thầu (Request for Proposal – RFP) của cơ quan, tổ chức hoặc nhu cầu từ Nhà tài trợ và khách hàng.
- Nhu cầu cải tiến hoạt động: tự động hóa quy trình, sửa lỗi, đáp ứng yêu cầu mới.
- Nghiên cứu hoặc sản phẩm dựa trên tài liệu chuyên ngành, cơ hội kinh doanh hay công nghệ.
- Vấn đề thực tiễn và ý tưởng của cá nhân hoặc nhóm, chịu ảnh hưởng bởi kinh nghiệm, văn hóa và giáo dục.

Dự án của nhóm thuộc nguồn **vấn đề thực tiễn và ý tưởng sản phẩm**: quy trình chuẩn bị phỏng vấn hiện bị chia cắt giữa nhiều công cụ. Đây mới là giả thuyết vấn đề có tài liệu phân tích, chưa phải nhu cầu đã được xác nhận bằng khảo sát khách hàng.

### 9.4 Phạm vi dự án là gì?

- **Phạm vi sản phẩm (Product Scope):** các chức năng và đặc tính của sản phẩm, ví dụ JD → kế hoạch, Ngân hàng câu hỏi và vòng luyện tập với cố vấn.
- **Phạm vi dự án (Project Scope):** toàn bộ công việc phải làm để tạo và bàn giao sản phẩm đó, như phân tích, thiết kế, lập trình, kiểm thử, viết tài liệu và triển khai thử nghiệm.

Phạm vi cho biết nội dung nào **trong phạm vi (in-scope)** và **ngoài phạm vi (out-of-scope)**, là cơ sở để ước lượng, phân công, nghiệm thu và chống Phát sinh phạm vi (Scope Creep). Khi muốn thêm thanh toán hoặc người phỏng vấn AI, nhóm phải phân tích tác động và phê duyệt Yêu cầu thay đổi (Change Request), không tự đưa vào Chu kỳ phát triển (Sprint).

### 9.5 Các vai trò thường tham gia dự án phần mềm

- **Nhà tài trợ (Sponsor):** cấp quyền và nguồn lực, phê duyệt mục tiêu và thay đổi lớn.
- **Khách hàng, người dùng và bên liên quan (Stakeholder):** nêu nhu cầu, cung cấp phản hồi, chịu ảnh hưởng bởi kết quả.
- **Quản lý dự án/Điều phối viên Scrum (Project Manager/Scrum Master):** điều phối phạm vi, lịch, nguồn lực, rủi ro và giao tiếp.
- **Chủ sở hữu sản phẩm/Chuyên viên phân tích nghiệp vụ (Product Owner/Business Analyst):** làm rõ giá trị và yêu cầu, ưu tiên Danh sách công việc sản phẩm và chấp nhận kết quả.
- **Thiết kế trải nghiệm/giao diện người dùng, Kiến trúc sư/Trưởng kỹ thuật, Lập trình viên, Kiểm thử viên/Đảm bảo chất lượng, Phát triển và vận hành (UX/UI, Architect/Technical Lead, Developer, Tester/Quality Assurance, DevOps):** thiết kế trải nghiệm, quyết định kỹ thuật, xây dựng, kiểm thử, triển khai và vận hành.

Một người có thể kiêm nhiều vai trò trong nhóm nhỏ, nhưng trách nhiệm và quyền quyết định phải rõ.

### 9.6 Phân biệt các loại kết quả của dự án

- **Sản phẩm (Product):** sản phẩm hoặc hạng mục hữu hình và kiểm chứng được, ví dụ ứng dụng web, mã nguồn, tài liệu.
- **Dịch vụ hoặc năng lực (Service/Capability):** năng lực cung cấp một dịch vụ, ví dụ khả năng vận hành quy trình đặt lịch phỏng vấn thử.
- **Kết quả hoặc hiệu quả (Result/Outcome):** kết quả hoặc tri thức thu được, ví dụ dữ liệu thử nghiệm, quyết định Tiếp tục/Điều chỉnh/Dừng, bài học kinh nghiệm.

**Sản phẩm bàn giao (Deliverable)** là đầu ra phải bàn giao và có thể kiểm tra; **hiệu quả (Outcome)** là giá trị sau khi sử dụng đầu ra. Có phần mềm chạy được chưa đồng nghĩa người dùng đã chuẩn bị phỏng vấn tốt hơn; hiệu quả phải được đo bằng chỉ số.

### 9.7 Vì sao dự án phần mềm thất bại?

Các nguyên nhân chính có thể nhóm thành:

1. **Mục tiêu và yêu cầu:** mục tiêu không rõ hoặc phi thực tế, yêu cầu định nghĩa kém, thay đổi liên tục.
2. **Con người và giao tiếp:** khách hàng–người dùng–lập trình viên trao đổi kém, thiếu người ra quyết định, xung đột bên liên quan hoặc chính trị nội bộ.
3. **Quản lý:** ước lượng sai nguồn lực, báo cáo tình trạng kém, quản lý dự án, rủi ro hoặc thay đổi yếu, áp lực thương mại.
4. **Kỹ thuật và quy trình:** công nghệ chưa trưởng thành, không xử lý được độ phức tạp, thực hành phát triển cẩu thả.

Đề xuất dự án giúp giảm rủi ro nhóm 1 bằng phát biểu vấn đề, phạm vi và cổng đánh giá rõ, nhưng không tự bảo đảm thành công. Nhóm vẫn cần khám phá khách hàng, ước lượng, Chứng minh ý tưởng, kiểm thử, theo dõi và quản lý thay đổi trong suốt dự án.

### 9.8 Các ràng buộc của dự án có ý nghĩa gì?

Ràng buộc là các giới hạn mà dự án phải tuân theo: **phạm vi, thời gian, chi phí, nguồn lực hoặc công sức, chất lượng**, cùng các giới hạn kỹ thuật, pháp lý và rủi ro. Chúng liên hệ nhau: tăng phạm vi trong khi giữ 8 tuần và 653 giờ có thể buộc tăng chi phí hoặc nguồn lực, lùi lịch hay cắt phần khác; không được âm thầm hạ chất lượng.

Với nhóm, các ràng buộc 8 tuần, khoảng 653 giờ và 1.125.000 VNĐ giải thích vì sao MVP dùng liên kết họp ngoài và loại thanh toán, gọi hình tích hợp, ứng dụng di động thuần và người phỏng vấn AI. Ý nghĩa quản lý của ràng buộc là tạo căn cứ để ưu tiên, đánh đổi, ước lượng và ra quyết định Tiếp tục/Điều chỉnh/Dừng.

## 10. Thứ tự trình bày miệng trong 5–10 phút

1. **Khoảng 1 phút:** định nghĩa Đề xuất dự án, mục đích và thời điểm tạo.
2. **Khoảng 2 phút:** vấn đề, người dùng, quy trình bắt đầu từ JD, điểm khác biệt và phạm vi MVP.
3. **Khoảng 2 phút:** đầu vào và năm bước hình thành từ vấn đề đến bản JD-first.
4. **Khoảng 2 phút:** phương pháp đánh giá, thay đổi sau đánh giá và cách nhóm kiểm tra tính khả thi.
5. **Khoảng 1 phút:** cách tài liệu được dùng, cập nhật và quản lý thay đổi kỹ thuật bằng ADR.
6. **Thời gian còn lại:** trả lời ngắn các khái niệm Dự án, Hoạt động, Chương trình, Danh mục đầu tư, phạm vi, vai trò, kết quả, thất bại và ràng buộc.

## 11. Bản in và bằng chứng cần mang

- [ ] **Bắt buộc:** [Đề xuất dự án chính thức (Project Proposal)](../../Project_Proposal/Project_Proposal.md).
- [ ] Phụ lục hỗ trợ: [Phân tích công cụ hiện có (Existing Tools Analysis)](../../Project_Proposal/Existing_Tools_Analysis.md) và [Phân tích đối thủ cạnh tranh (Competitor Analysis)](../../Project_Proposal/Competitor_Analysis.md).
- [ ] Một trang tóm tắt thay đổi từ đề xuất Question Bank + Mentor Marketplace sang đề xuất JD-first.
- [ ] Các trang liên quan của [Project Charter](<../../Project_Governance & Stakeholder/Project_Charter.md>) thể hiện 8 tuần, 653 giờ, 1.125.000 VNĐ và trạng thái chờ Sponsor phê duyệt. Chỉ in thêm Feasibility Study sau khi phần đem nộp đã được chuẩn hóa hoàn toàn bằng tiếng Anh.
- [ ] Nếu nhóm đã có thêm chữ ký, nhận xét đánh giá, biên bản hoặc kết quả khám phá khách hàng sau thời điểm tài liệu này được soạn, chỉ in và trình bày sau khi đối chiếu đúng với lịch sử thật.

## 12. Nguồn kiểm chứng

- [Đề xuất dự án chính thức (Project Proposal)](../../Project_Proposal/Project_Proposal.md).
- [Phân tích công cụ hiện có (Existing Tools Analysis)](../../Project_Proposal/Existing_Tools_Analysis.md).
- [Phân tích đối thủ cạnh tranh (Competitor Analysis)](../../Project_Proposal/Competitor_Analysis.md).
- [Ủy nhiệm dự án (Project Charter)](<../../Project_Governance & Stakeholder/Project_Charter.md>).
- [Viễn cảnh và phạm vi dự án (Project Vision and Scope)](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md).
- [Danh sách công việc sản phẩm và tiêu chí chấp nhận (Product Backlog and Acceptance Criteria)](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md).
- [Báo cáo tính khả thi (Feasibility Study Report)](../../Project_Feasibility/feasibility.md).
- [Bài giảng Dự án phần mềm (Software Project)](../../refs/02-software-project.md), nhất là trang chiếu 008–032.
- [Bài giảng Khởi tạo dự án phần mềm (Software Project Initiation)](../../refs/03-software-project-initiation.md), nhất là trang chiếu 007–015.
- Lịch sử Git: `0743a685195a3396511a59c83515860c9f11bfdd`, `7ca1f6ede1a0d71b3541cb2c15d06f03323a9135`.
