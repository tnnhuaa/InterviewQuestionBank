# Nền tảng luyện phỏng vấn — Danh sách công việc sản phẩm và tiêu chí chấp nhận

## 1. Mục đích

Tài liệu chuyển phạm vi sản phẩm lấy JD làm điểm bắt đầu và quy trình mục tiêu đã phê duyệt thành Product Backlog có thứ tự và có thể kiểm thử. Theo Project Charter trên `main`, **Hưng là Product Owner / Business Analyst**, chịu trách nhiệm Vision & Scope, Product Backlog, acceptance criteria và Future-State Workflow; Product Owner sắp thứ tự backlog và chấp nhận story. Tài liệu xác định câu chuyện người dùng, độ ưu tiên, phụ thuộc, Điểm câu chuyện (Story Point), tiêu chí chấp nhận, yêu cầu chất lượng, truy vết và kiểm soát phát hành. Backlog phải đầy đủ và Product Owner phải sắp thứ tự ưu tiên theo giá trị.

### 1.1 Vai trò áp dụng cho backlog

Bảng này áp dụng phân công từ Charter, không tạo vai trò mới và không chuyển quyền quyết định giữa các thành viên.

| Thành viên | Vai trò chính theo Charter | Trách nhiệm đối với backlog |
|---|---|---|
| Tuấn Anh | Project Manager / Team Leader / Timekeeper | Điều hành nhóm, quản lý deadline và Kanban, xử lý blocker/escalation, review/merge và xác nhận Done |
| Gia Thành | Project Planning & Estimation Analyst / Full-stack Developer | Chuẩn bị dữ liệu refinement/Planning Poker, cập nhật estimate và tác động baseline; tham gia implementation Full-stack |
| Hưng | Product Owner / Business Analyst | Sở hữu và sắp thứ tự backlog, làm rõ yêu cầu, quyết định trade-off và chấp nhận/reject story |
| Luân | Architecture / Technical Lead | Duyệt tác động kiến trúc, ADR, NFR và ràng buộc kỹ thuật/bảo mật |
| Hùng | UI/UX Designer / Front-end Developer | Kiểm chứng workflow/usability, duy trì truy vết prototype và phát triển giao diện |
| Trí | PoC / Integration & E2E Developer | Kiểm chứng tính khả thi, tích hợp, dữ liệu/test đầu-cuối và bằng chứng cho technical enabler |

### 1.2 Ranh giới bản phát hành

| Phạm vi | Quyết định |
|---|---|
| R1 Bắt buộc | Xác thực và phân quyền; nhập JD bằng văn bản/tệp; trích xuất trực tiếp và OCR dự phòng; hiệu chỉnh; phân tích yêu cầu/phân loại; ánh xạ câu hỏi có giải thích; kế hoạch chuẩn bị; ngân hàng câu hỏi; xác minh và lịch rảnh của Cố vấn; đặt lịch gắn với kế hoạch; bàn giao liên kết họp ngoài hệ thống; phản hồi/đánh giá; quản trị tối thiểu và thông báo đặt lịch tin cậy |
| R1 Mở rộng | Bảng tiến độ cơ bản và lời nhắc buổi gặp theo lịch |
| Tương lai | Nhập hàng loạt câu hỏi, gợi ý ngữ nghĩa/ML, phỏng vấn/chấm điểm tự động, OCR diện rộng, video/ghi hình/phiên âm tích hợp, thanh toán tự động, ứng dụng di động riêng và tích hợp ATS |

### 1.3 Quy tắc nghiệp vụ

Quy tắc nghiệp vụ dùng mã ổn định, ghi rõ nguồn/chủ sở hữu và mức độ có thể thay đổi.

| Mã | Quy tắc | Nguồn/chủ sở hữu | Khả năng thay đổi |
|---|---|---|---|
| BR-01 | Chỉ Cố vấn ở trạng thái `APPROVED` mới được công khai hồ sơ/khung giờ và nhận yêu cầu đặt lịch. | Phạm vi sản phẩm / PO | Trung bình |
| BR-02 | Mỗi khung giờ chỉ thuộc tối đa một lịch hẹn ở trạng thái chiếm chỗ. Lịch đã xác nhận vẫn giữ khung giờ cũ khi đề xuất đổi lịch chưa được giải quyết. | Tính toàn vẹn đặt lịch / Kiến trúc | Thấp |
| BR-03 | Yêu cầu đặt lịch phải có khung giờ khả dụng, ngữ cảnh vị trí/phỏng vấn và mục tiêu có ý nghĩa. | Quy trình sản phẩm / PO | Trung bình |
| BR-04 | Chỉ Sinh viên/Cố vấn thuộc lịch hẹn và Quản trị viên được ủy quyền mới truy cập dữ liệu riêng tư, liên kết họp hoặc phản hồi của lịch hẹn đó. | Chính sách bảo mật/quyền riêng tư | Thấp |
| BR-05 | Chỉ Cố vấn được ủy quyền mới tạo phản hồi sau khi lịch hẹn ở trạng thái `COMPLETED`. | Quy trình sản phẩm / PO | Trung bình |
| BR-06 | Sinh viên thuộc lịch hẹn chỉ được tạo tối đa một đánh giá sau một lịch hẹn `COMPLETED` hợp lệ. | Quy trình sản phẩm / PO | Trung bình |
| BR-07 | Câu hỏi chỉ được công khai hoặc dùng để ánh xạ khi ở trạng thái `PUBLISHED`, có phân loại và nguồn gốc hợp lệ. | Chính sách nội dung / PO | Trung bình |
| BR-08 | Mỗi lần chuyển trạng thái lịch hẹn phải ghi trạng thái trước/sau, tác nhân, thời điểm và lý do khi cần. Hai bên được hủy/đề xuất đổi lịch đến trước giờ bắt đầu 12 giờ; tối đa hai đề xuất đổi lịch. Hành động muộn hơn cần Quản trị viên hoặc bên còn lại giải quyết. Cố vấn được đánh dấu `COMPLETED` sau giờ kết thúc; Sinh viên được khiếu nại trong 24 giờ. Khi có khiếu nại, đánh giá chưa được công bố cho đến quyết định có lưu vết của Quản trị viên; trạng thái không được tự đổi. Sau thời gian chờ 15 phút, hai bên được báo vắng mặt, nhưng phải có Quản trị viên hoặc bên còn lại xác nhận trước khi chuyển `NO_SHOW`. | Chính sách đặt lịch / PO và Vận hành, PD-02 | Trung bình |
| BR-09 | Thông báo xác nhận được gửi ngay. Nếu chọn US-22 thuộc R1 Mở rộng, lịch `CONFIRMED` nhận lời nhắc trước 24 giờ và 1 giờ, trừ mốc đã trôi qua khi xác nhận muộn. Thời gian lưu theo UTC và hiển thị theo múi giờ người nhận. Hủy/đổi lịch vô hiệu tác vụ cũ. Hệ thống gửi một lần và thử lại tại phút 1, 5; lỗi không hoàn tác lịch hẹn và chuyển sang trạng thái trong ứng dụng/xử lý thủ công. | Quyết định độ tin cậy/lời nhắc / Kiến trúc và Vận hành, PD-05 | Trung bình |
| BR-10 | Tạo lịch hẹn và các chuyển trạng thái quan trọng phải an toàn khi thử lại; một khóa chống trùng không được tạo lặp trạng thái hoặc sự kiện. | Quyết định độ tin cậy / Kiến trúc | Thấp |
| BR-11 | Cố vấn sở hữu lịch hẹn tạo liên kết họp ngoài hệ thống sau khi xác nhận và được sửa đến trước giờ bắt đầu 2 giờ; Quản trị viên can thiệp phải ghi lý do/lưu vết. Chỉ hai bên của lịch hẹn được xem liên kết từ trạng thái `CONFIRMED` đến 24 giờ sau buổi gặp. Khi nhà cung cấp lỗi, Cố vấn có tối đa 15 phút để đưa liên kết thay thế; nếu vẫn không có liên kết dùng được thì phải đưa ra luồng đổi lịch rõ ràng, không được chuyển trạng thái ngầm. Liên kết họp, bằng chứng xác minh, phản hồi và hồ sơ riêng tư không được công khai hoặc ghi đầy đủ vào nhật ký. | Chính sách cuộc họp/quyền riêng tư / PO và Kỹ thuật, PD-03/04 | Trung bình |
| BR-12 | Sinh viên được dán tối đa 50.000 ký tự Unicode hoặc tải lên một tệp PDF/PNG/JPEG cho mỗi JD. Tệp tối đa 10 MB; PDF tối đa 5 trang; PNG/JPEG là một ảnh. Dữ liệu không hỗ trợ, hỏng, mã hóa, rỗng, nhiều tệp, có tệp đính kèm nhúng, vượt giới hạn hoặc không an toàn phải bị từ chối trước phân tích. | ADR-004 / PO và Kiến trúc, PD-06 | Thấp trong thử nghiệm |
| BR-13 | Dùng trích xuất trực tiếp cho văn bản dán/PDF có lớp chữ; OCR nội bộ tiếng Việt/Anh chỉ dùng cho PNG/JPEG hoặc PDF quét. Mỗi tiến trình xử lý tối đa hai tác vụ đồng thời; mỗi tác vụ hết hạn sau 60 giây và có tối đa hai lần chạy tự động. Khi lỗi luôn cho phép dán/sửa thủ công. | ADR-004 / Kiến trúc, PD-07 | Trung bình |
| BR-14 | Sinh viên phải xem, sửa và xác nhận một phiên bản văn bản hiệu chỉnh trước phân tích. Khi đổi phiên bản đã xác nhận, dữ liệu yêu cầu, ánh xạ và kế hoạch dẫn xuất phải bị vô hiệu để tạo lại. | Quy trình sản phẩm / PO | Thấp |
| BR-15 | Mỗi yêu cầu được phát hiện phải giữ bằng chứng gốc và trạng thái chuẩn hóa; thuật ngữ chưa biết phải để chưa ánh xạ, không được tự gán thành một chủ đề phân loại. | Phạm vi phân tích JD / PO và Nội dung | Trung bình |
| BR-16 | Ánh xạ câu hỏi dùng văn bản đã xác nhận và bộ phân loại/tên đồng nghĩa có phiên bản. Điểm 0–100 gồm chủ đề/tên đồng nghĩa chính xác 40, độ phủ từ khóa yêu cầu 30, độ phù hợp vai trò 15, độ phù hợp cấp bậc/độ khó 15. Chỉ câu hỏi `PUBLISHED` có điểm ≥60 được chọn; trả tối đa 10 câu/JD và 3 câu/yêu cầu, với quy tắc phân xử ổn định. Mỗi kết quả lưu nguồn yêu cầu, chủ đề, điểm/lý do, mã câu hỏi và phiên bản ánh xạ. | Phạm vi ánh xạ / PO và Nội dung, PD-08 | Trung bình |
| BR-17 | Kế hoạch chuẩn bị thuộc một Sinh viên, tham chiếu JD và kết quả ánh xạ có phiên bản đã chọn, đồng thời giữ lịch sử khi phản hồi thay đổi hành động tiếp theo. | Quy trình sản phẩm / PO | Trung bình |
| BR-18 | Mọi lịch hẹn R1 phải tham chiếu JD hoặc kế hoạch chuẩn bị thuộc Sinh viên đặt lịch. Cố vấn chỉ xem ngữ cảnh tối thiểu cần cho buổi luyện. | Phạm vi sản phẩm/quyền riêng tư / PO | Thấp |
| BR-19 | Tệp JD gốc, văn bản trích xuất/hiệu chỉnh, yêu cầu, kết quả ánh xạ và kế hoạch là riêng tư. Tệp gốc bị xóa trong 24 giờ sau khi trích xuất kết thúc; dữ liệu dẫn xuất từ JD hết hạn sau 90 ngày không hoạt động. Dữ liệu lịch hẹn/phản hồi/đánh giá/chuyển trạng thái hết hạn sau 180 ngày. Yêu cầu xóa người dùng phải loại dữ liệu riêng tư đang hoạt động trong 7 ngày và bản sao lưu trong 30 ngày; nhật ký không chứa JD gốc. | Chính sách quyền riêng tư/tải tệp / PO và Quyền riêng tư, PD-03/06 | Trung bình |

Hướng trích xuất/ánh xạ của BR-12/13 được chủ sở hữu Kiến trúc ghi tại [ADR-004 ở commit `54e1113`](https://github.com/tnnhuaa/InterviewQuestionBank/blob/54e1113113f6ada9c0ecec565eb8f883966d18f9/docs/Project_Architecture/ADR/ADR-004-JD-Processing-and-Question-Matching.md). PD-06/07 cung cấp giá trị thử nghiệm hữu hạn cho các tham số ADR-004 còn để cấu hình; mọi thay đổi phải có bằng chứng đo kiểm mới và qua kiểm soát thay đổi.

### 1.4 Từ vựng trạng thái đặt lịch

| Trạng thái nghiệp vụ | Mã API/lưu trữ | Chiếm khung giờ | Ý nghĩa |
|---|---|---|---|
| Chờ xử lý | `PENDING` | Không | Yêu cầu của Sinh viên đang chờ Cố vấn quyết định |
| Đã xác nhận | `CONFIRMED` | Có | Cố vấn đã chấp nhận và khung giờ được giữ |
| Đã đề xuất đổi lịch | `RESCHEDULE_PROPOSED` | Khung mới: không; khung cũ: vẫn giữ | Bên còn lại phải chấp nhận hoặc từ chối đề xuất |
| Bị từ chối | `REJECTED` | Không | Cố vấn từ chối yêu cầu hiện tại |
| Đã hủy | `CANCELLED` | Không | Việc hủy hợp lệ đã hoàn tất theo chính sách |
| Đã hoàn thành | `COMPLETED` | Lưu lịch sử sở hữu | Buổi luyện đã diễn ra và được ghi nhận hoàn thành |
| Vắng mặt | `NO_SHOW` | Lịch sử/ngoại lệ | Được báo sau thời gian chờ 15 phút và được Quản trị viên hoặc bên còn lại xác nhận bằng bằng chứng có thời điểm |

Nhãn giao diện có thể được bản địa hóa, nhưng hợp đồng API, kiểm thử và tài liệu phải ánh xạ nhất quán về các mã trạng thái trên.

## 2. Danh sách công việc sản phẩm (Product Backlog)

Backlog được sắp theo giá trị và quan hệ phụ thuộc. R1 có 27 câu chuyện Bắt buộc; US-21–US-22 là Mở rộng và US-23 thuộc Tương lai. Mã US-01–US-23 được giữ nguyên; phạm vi lấy JD làm điểm bắt đầu được bổ sung bằng US-24–US-30. Điểm câu chuyện là ước lượng kích thước tương đối, không phải số giờ, và cần Nhóm phát triển xác nhận khi tinh chỉnh.

| Thứ tự | Mã | Nhóm chức năng | Câu chuyện người dùng | Giá trị / mục tiêu | Bản phát hành | Phụ thuộc | Truy vết | SP | Mức sẵn sàng/trạng thái |
|---:|---|---|---|---|---|---|---|---:|---|
| 1 | US-01 | Danh tính | Là người dùng, tôi muốn đăng ký và đăng nhập để dữ liệu cá nhân được bảo vệ. | Nền tảng/quyền riêng tư | R1 Bắt buộc | — | RQ-01; BR-04/11/19 | 8 | Lát cắt phiên đăng nhập và xác minh có rủi ro cao |
| 2 | US-02 | Danh tính | Là Quản trị viên, tôi muốn hệ thống thực thi vai trò Sinh viên/Cố vấn/Quản trị viên để giới hạn đúng chức năng và dữ liệu. | Bất biến bảo mật | R1 Bắt buộc | US-01 | RQ-01; BR-04/19 | 3 | Cần ma trận vai trò/đối tượng |
| 3 | US-24 | Nhập JD | Là Sinh viên, tôi muốn dán hoặc tải lên mô tả công việc để chuẩn bị theo đúng vị trí ứng tuyển. | OBJ-02; điểm vào chính | R1 Bắt buộc | US-01 | RQ-11; BR-12/19; FS-01 | 5 | Giới hạn 50.000 ký tự hoặc một PDF/PNG/JPEG, 10 MB/5 trang |
| 4 | US-25 | Trích xuất JD | Là Sinh viên, tôi muốn văn bản được trích xuất trực tiếp hoặc bằng OCR khi cần để kiểm tra nội dung JD. | OBJ-02; khả dụng đầu vào | R1 Bắt buộc | US-24 | RQ-11; BR-13/19; FS-02 | 8 | OCR song ngữ 60 giây; vẫn cần xem xét tách nhỏ |
| 5 | US-26 | Hiệu chỉnh JD | Là Sinh viên, tôi muốn xem, sửa và xác nhận văn bản trích xuất để phân tích dùng đúng phiên bản. | OBJ-02; cổng chất lượng | R1 Bắt buộc | US-25 | RQ-11; BR-14/19; FS-03 | 3 | Phải nêu rõ cơ chế vô hiệu phiên bản |
| 6 | US-27 | Phân tích JD | Là Sinh viên, tôi muốn hệ thống phát hiện và chuẩn hóa vị trí, cấp bậc, kỹ năng, công nghệ và yêu cầu để hiểu JD. | OBJ-03; thông tin chuyên sâu | R1 Bắt buộc | US-26 | RQ-12; BR-14/15/19; FS-04 | 8 | Bộ 20 JD có nhãn: 12 hiệu chỉnh/8 kiểm chứng mù |
| 7 | US-03 | Sinh viên | Là Sinh viên, tôi muốn lưu vị trí mục tiêu và mục tiêu phỏng vấn để luyện tập và đặt lịch dùng cùng ngữ cảnh. | OBJ-03/06; ngữ cảnh | R1 Bắt buộc | US-01 | RQ-02; BR-03; FS-04 | 2 | Lát cắt nhỏ lưu hồ sơ/ngữ cảnh |
| 8 | US-18 | Quản trị nội dung | Là Quản trị viên, tôi muốn quản lý/kiểm duyệt câu hỏi và bộ phân loại để chỉ công bố nội dung được quản trị. | Điều kiện trước cho ánh xạ/nội dung | R1 Bắt buộc | US-02 | RQ-03/10/12; BR-07/08; FS-05 | 5 | Bao gồm quản trị bộ phân loại/tên đồng nghĩa |
| 9 | US-28 | Ánh xạ câu hỏi | Là Sinh viên, tôi muốn yêu cầu JD được ánh xạ đến câu hỏi đã quản trị để biết nội dung cần luyện. | OBJ-04; giá trị cốt lõi | R1 Bắt buộc | US-18, US-27 | RQ-12; BR-07/15/16; FS-05 | 8 | Đã duyệt quy tắc điểm/ngưỡng; vẫn cần xem xét tách phần hiện thực |
| 10 | US-29 | Kế hoạch chuẩn bị | Là Sinh viên, tôi muốn mỗi câu hỏi gợi ý có giải thích và được sắp vào kế hoạch chuẩn bị để chọn hành động tiếp theo. | OBJ-04/05; kích hoạt | R1 Bắt buộc | US-28 | RQ-12; BR-16/17/19; FS-06 | 5 | Cần lý do/nội dung và quyền sở hữu kế hoạch |
| 11 | US-04 | Câu hỏi | Là Sinh viên, tôi muốn duyệt/tìm kiếm/lọc câu hỏi đã quản trị để khám phá hoặc bổ sung kế hoạch. | OBJ-05; tự luyện | R1 Bắt buộc | US-02, US-18 | RQ-03; BR-07; FS-07 | 5 | Quy tắc lọc, phân trang và hiển thị |
| 12 | US-05 | Câu hỏi | Là Sinh viên, tôi muốn xem chi tiết câu hỏi và tiêu chí trả lời để biết một câu trả lời tốt cần có gì. | OBJ-05; tự luyện | R1 Bắt buộc | US-04 | RQ-03; BR-07; FS-07 | 2 | Chỉ đọc chi tiết trên mô hình Câu hỏi |
| 13 | US-06 | Luyện tập | Là Sinh viên, tôi muốn đánh dấu và theo dõi trạng thái luyện tập để tiếp tục và làm theo kế hoạch/phản hồi. | OBJ-05/08; duy trì sử dụng | R1 Bắt buộc | US-04 | RQ-03; BR-04; FS-07/14 | 3 | Trạng thái và phân quyền theo người dùng |
| 14 | US-07 | Cố vấn | Là Cố vấn, tôi muốn tạo hồ sơ và gửi thông tin xác minh để cung cấp dịch vụ đáng tin cậy. | Nguồn cung | R1 Bắt buộc | US-01 | RQ-04; BR-01/11; FS-08 | 5 | Vòng đời hồ sơ và xác minh |
| 15 | US-08 | Quản trị Cố vấn | Là Quản trị viên, tôi muốn duyệt/từ chối xác minh Cố vấn kèm lý do để quản trị nguồn cung công khai. | Cổng tin cậy/nguồn cung | R1 Bắt buộc | US-02, US-07 | RQ-04; BR-01/08; FS-08 | 3 | Chuyển trạng thái duyệt và lưu vết |
| 16 | US-09 | Lịch rảnh | Là Cố vấn đã duyệt, tôi muốn quản lý khung giờ tương lai để Sinh viên xem được lịch rảnh hợp lệ. | Cho phép đặt lịch | R1 Bắt buộc | US-08 | RQ-05; BR-01/02; FS-08 | 5 | Kiểm tra thời gian và ràng buộc khung giờ đã chiếm |
| 17 | US-10 | Danh mục Cố vấn | Là Sinh viên, tôi muốn tìm Cố vấn đã duyệt theo chủ đề kế hoạch và lịch rảnh để chọn buổi phù hợp. | OBJ-05/06; khám phá | R1 Bắt buộc | US-08, US-09, US-29 | RQ-05; BR-01; FS-08 | 3 | Truy vấn theo chủ đề kế hoạch và lịch rảnh |
| 18 | US-30 | Từ kế hoạch đến đặt lịch | Là Sinh viên, tôi muốn gắn JD hoặc kế hoạch chuẩn bị vào lịch với Cố vấn để họ nhận đúng ngữ cảnh luyện tập. | OBJ-06; bàn giao ngữ cảnh | R1 Bắt buộc | US-10, US-29 | RQ-13; BR-17/18/19; FS-09 | 5 | Đã duyệt bản chiếu ngữ cảnh tối thiểu và chính sách lưu giữ |
| 19 | US-11 | Đặt lịch | Là Sinh viên, tôi muốn gửi yêu cầu đặt lịch cùng mục tiêu và ngữ cảnh JD/kế hoạch để Cố vấn quyết định. | OBJ-06; chuyển đổi | R1 Bắt buộc | US-03, US-30 | RQ-06/13; BR-02/03/10/18; FS-09 | 5 | Tạo lịch có kiểm soát đồng thời/chống trùng |
| 20 | US-12 | Đặt lịch | Là Cố vấn sở hữu lịch, tôi muốn chấp nhận, từ chối hoặc đề xuất giờ mới để lịch hẹn chuyển sang trạng thái hợp lệ. | OBJ-06; vòng đời | R1 Bắt buộc | US-11 | RQ-06; BR-02/08/10; FS-10 | 8 | Đã duyệt mốc 12 giờ và điều kiện đổi lịch |
| 21 | US-13 | Đặt lịch | Là một bên của lịch hẹn, tôi muốn hủy hoặc giải quyết đề xuất đổi lịch theo chính sách rõ ràng để ngoại lệ không cần phối hợp ngầm. | OBJ-06; vận hành | R1 Bắt buộc | US-12 | RQ-06; BR-02/08/10; FS-10 | 8 | Đã duyệt chính sách; vẫn cần xem xét tách câu chuyện |
| 22 | US-14 | Buổi gặp | Là một bên của lịch hẹn, tôi muốn truy cập có kiểm soát vào liên kết họp ngoài hệ thống khi lịch đã xác nhận để tham gia an toàn. | OBJ-06; bàn giao buổi gặp | R1 Bắt buộc | US-12 | RQ-07; BR-04/11; FS-11/12 | 3 | Đã duyệt liên kết do Cố vấn quản lý và phương án dự phòng 15 phút |
| 23 | US-19 | Thông báo | Là người dùng, tôi muốn nhận thông báo sự kiện đặt lịch tin cậy để biết hành động tiếp theo ngay cả khi nhà cung cấp tạm lỗi. | OBJ-06; điều phối | R1 Bắt buộc | US-11 và các câu chuyện tạo sự kiện | RQ-09; BR-09/10; FS-11 | 8 | Rủi ro hộp sự kiện, thử lại và chống trùng |
| 24 | US-15 | Phản hồi | Là Cố vấn sở hữu lịch, tôi muốn gửi phản hồi có cấu trúc sau khi hoàn thành để Sinh viên nhận hướng dẫn có thể thực hiện. | OBJ-07/08; giá trị cốt lõi | R1 Bắt buộc | US-14 | RQ-08; BR-04/05/08; FS-13 | 5 | Đã duyệt hoàn thành bởi Cố vấn và khiếu nại trong 24 giờ |
| 25 | US-16 | Phản hồi | Là Sinh viên thuộc lịch hẹn, tôi muốn xem phản hồi và hành động tiếp theo để cập nhật kế hoạch chuẩn bị. | OBJ-07/08; vòng lặp học tập | R1 Bắt buộc | US-15 | RQ-08; BR-04/11/17; FS-14 | 3 | Hành động phản hồi/kế hoạch có phân quyền |
| 26 | US-17 | Đánh giá | Là Sinh viên thuộc lịch hẹn, tôi muốn đánh giá Cố vấn sau khi hoàn thành để Sinh viên khác có tín hiệu tin cậy. | Niềm tin vào danh mục Cố vấn | R1 Bắt buộc | US-15 | RQ-08; BR-06; FS-14 | 3 | Một đánh giá cho mỗi lịch hoàn thành |
| 27 | US-20 | Vận hành | Là Quản trị viên được ủy quyền, tôi muốn giải quyết báo cáo và ngoại lệ lịch hẹn để thử nghiệm vận hành an toàn. | Tin cậy/khả năng vận hành | R1 Bắt buộc | US-02, US-13, US-17 | RQ-10; BR-01/07/08/11/19 | 5 | Lát cắt vận hành tối thiểu có quản trị |
| 28 | US-21 | Tiến độ | Là Sinh viên, tôi muốn có bảng tiến độ cơ bản để biết nội dung cần luyện tiếp theo. | OBJ-08; duy trì sử dụng | R1 Mở rộng | US-06, US-16 | RQ-03; FS-14 | 5 | Ngoài cam kết Bắt buộc được đề xuất |
| 29 | US-22 | Lời nhắc | Là một bên của lịch hẹn, tôi muốn nhận lời nhắc theo lịch để giảm khả năng bỏ lỡ buổi gặp. | OBJ-06; tỷ lệ hoàn thành | R1 Mở rộng | US-19 | RQ-09; BR-09; FS-11 | 3 | Đã duyệt mốc 24 giờ/1 giờ và chính sách thử lại |
| 30 | US-23 | Nhập dữ liệu | Là Quản trị viên, tôi muốn nhập hàng loạt câu hỏi có quản trị để mở rộng nội dung mà không bỏ qua kiểm duyệt. | Hiệu quả nội dung | Tương lai/Có thể | US-18 | RQ-03/10; BR-07/08 | 8 | Cần tách phần kiểm tra/lỗi từng phần |

Lựa chọn R1 chỉ trở thành cam kết bàn giao sau khi Product Owner phê duyệt, Nhóm phát triển thực hiện Planning Poker và rà soát khoảng vận tốc.

### 2.1 Phương pháp và tổng Điểm câu chuyện

- Điểm câu chuyện biểu thị kích thước tổng thể tương đối, không phải số giờ.
- Ước lượng dùng dãy Fibonacci `1, 2, 3, 5, 8`; khoảng cách lớn hơn thể hiện độ bất định cao hơn. Đây là ước lượng ban đầu bằng so sánh/phân rã và cần xác nhận bằng Planning Poker.
- Mỗi SP bao phủ một câu chuyện dọc hoàn chỉnh, gồm hiện thực, kiểm thử, tài liệu và bằng chứng chấp nhận. EN-01–EN-09 là cổng chất lượng/bàn giao đã nằm trong các câu chuyện liên quan; nếu lập lịch riêng cho một công việc hỗ trợ thì phải ước lượng riêng và kiểm tra lại để tránh tính hai lần.
- `US-03 = 2 SP` là mốc cho phần lưu dữ liệu nhỏ; công việc đầu-cuối có giới hạn thường là `3–5 SP`; `8 SP` biểu thị độ bất định hoặc cần tách. US-01, US-12, US-13, US-19, US-23, US-25, US-27 và US-28 phải được xem xét tách trước khi kéo vào Ready.

| Nhóm backlog | Số câu chuyện | SP ban đầu | Cách diễn giải kế hoạch |
|---|---:|---:|---|
| R1 Bắt buộc | 27 | 134 | Cần trung bình `134 / 4 = 33,5 SP/tuần` trong bốn tuần execution tái dựng; chỉ kết luận khả thi sau khi có khoảng throughput và lập lại đường cơ sở |
| R1 Mở rộng | 2 | 8 | US-21 = 5, US-22 = 3; chỉ chọn khi phần Bắt buộc và dự phòng an toàn |
| Tương lai/Có thể | 1 | 8 | US-23; không thuộc R1 |
| Toàn bộ Product Backlog | 30 | 150 | Ước lượng kích thước tương đối đang chờ Nhóm phát triển xác nhận |

## 3. Hạng mục xuyên suốt và bàn giao

| Mã | Hạng mục / kết quả hoàn tất | Hỗ trợ | Cổng phát hành |
|---|---|---|---|
| EN-01 | Bằng chứng khám phá, nguyên mẫu và khả dụng xác lập đường cơ sở cho vấn đề chuẩn bị theo JD. | US-24–US-30; luồng cốt lõi | Trước khi chốt đường cơ sở |
| EN-02 | Nền tảng kiến trúc/môi trường chạy/phiên đăng nhập/CI vượt qua cổng dựng frontend độc lập, kiểm thử/chuyển đổi cơ sở dữ liệu backend và phiên/CSRF. | Toàn bộ R1 | Nền tảng |
| EN-03 | Kiểm thử PostgreSQL chứng minh chỉ một lịch chiếm chỗ khi có ≥20 xác nhận cạnh tranh, xung đột ổn định, chống trùng và chỉ một sự kiện chuyển trạng thái/hộp sự kiện. | US-11–US-13 | Cổng đặt lịch |
| EN-04 | Ma trận vai trò/quyền sở hữu phía máy chủ bảo vệ JD, kế hoạch, lịch hẹn, liên kết họp, phản hồi và xác minh. | US-01/02/07/08/11–20/24–30 | Cổng bảo mật |
| EN-05 | Máy trạng thái chuẩn và lưu vết bao phủ luồng thành công, không hợp lệ, đổi lịch, hủy, hoàn thành và vắng mặt. | US-12/13/15/20 | Cổng vòng đời |
| EN-06 | Lọc và ánh xạ câu hỏi chứng minh không lộ bản nháp, thứ tự ổn định, phân loại hợp lệ và có nguồn gốc. | US-04/18/27–29 | Cổng nội dung/ánh xạ |
| EN-07 | Hộp sự kiện giao dịch chứng minh lịch hẹn vẫn được ghi khi nhà cung cấp lỗi, có chống trùng, nhiều tiến trình cạnh tranh, thử lại/chờ tăng dần và xử lý lỗi thủ công. | US-19/22 | Cổng độ tin cậy |
| EN-08 | Bản dựng tích hợp, kiểm thử bảo mật/âm, hồ sơ hiệu năng, sao lưu/phục hồi, UAT, triển khai và hướng dẫn đạt Định nghĩa Hoàn thành. | Toàn bộ R1 | Cổng phát hành |
| EN-09 | PoC JD chứng minh định tuyến trích xuất trực tiếp/OCR, cổng hiệu chỉnh, chuẩn hóa tên đồng nghĩa, ánh xạ ổn định có giải thích và bàn giao từ kế hoạch sang đặt lịch trên bộ dữ liệu có nhãn. | US-24–US-30 | Cổng JD |

## 4. Tiêu chí chấp nhận

Tiêu chí chấp nhận là hợp đồng kiểm chứng, không phải tuyên bố tính năng đã hiện thực. Luồng rủi ro phải gồm ca thành công, âm, biên, độc hại, phân quyền, đồng thời và lỗi nhà cung cấp.

| Mã AC | Câu chuyện | Loại | Tiêu chí chấp nhận theo Điều kiện / Khi / Kết quả |
|---|---|---|---|
| AC-01-01 | US-01 | Thành công/bảo mật | Điều kiện email hợp lệ chưa đăng ký; khi đăng ký và xác minh thành công; kết quả là đúng một tài khoản được tạo và không có thông tin xác thực/bí mật dạng rõ trong nơi lưu trữ hoặc nhật ký. |
| AC-01-02 | US-01 | Phiên đăng nhập | Điều kiện người dùng đã xác thực; khi phiên được tạo/hết hạn/thu hồi; kết quả là quyền truy cập tuân theo chính sách phía máy chủ và phía khách không thể tự nhận danh tính/vai trò qua tiêu đề được tin cậy. |
| AC-02-01 | US-02 | Phân quyền | Điều kiện tác nhân không có vai trò/quan hệ cần thiết; khi gọi tuyến được bảo vệ; kết quả là hệ thống từ chối an toàn, không đổi dữ liệu và không lộ nội dung nhạy cảm. |
| AC-03-01 | US-03 | Kiểm tra dữ liệu | Điều kiện Sinh viên đã đăng nhập; khi lưu vị trí mục tiêu, loại phỏng vấn và mục tiêu hợp lệ; kết quả là dữ liệu được lưu bền vững, trường không hợp lệ báo lỗi mà không tạo dữ liệu dở dang ngoài ý muốn. |
| AC-04-01 | US-04 | Biên | Điều kiện có không/một/nhiều câu hỏi `PUBLISHED` và câu hỏi nhiều nhãn; khi áp dụng lọc/phân trang/sắp xếp; kết quả ổn định, không trùng và không lộ nội dung `DRAFT`/`ARCHIVED`. |
| AC-05-01 | US-05 | Hiển thị | Điều kiện có câu hỏi `PUBLISHED`; khi mở chi tiết; kết quả hiển thị nội dung, phân loại, tiêu chí trả lời và nguồn gốc; nội dung chưa công khai vẫn không truy cập được. |
| AC-06-01 | US-06 | Quyền sở hữu | Điều kiện Sinh viên đã đăng nhập; khi đổi trạng thái đánh dấu/luyện tập; kết quả là trạng thái riêng tư được lưu và Sinh viên khác không thể đọc/sửa. |
| AC-07-01 | US-07 | Trạng thái/quyền riêng tư | Điều kiện dữ liệu Cố vấn và đồng ý xử lý đầy đủ; khi gửi xác minh; kết quả trạng thái thành `PENDING`, bằng chứng vẫn bị giới hạn và dữ liệu thiếu bị từ chối. |
| AC-08-01 | US-08 | Phân quyền/lưu vết | Điều kiện xác minh đang `PENDING`; khi Quản trị viên được ủy quyền duyệt/từ chối kèm lý do; kết quả lưu trạng thái, tác nhân, lý do, thời điểm; người không phải Quản trị viên không thể quyết định. |
| AC-09-01 | US-09 | Biên/trạng thái | Điều kiện Cố vấn `APPROVED`; khi tạo khung giờ tương lai không chồng lấn và có múi giờ; kết quả khung giờ được lưu; khung quá khứ/không hợp lệ/chồng lấn hoặc Cố vấn chưa duyệt bị từ chối. |
| AC-10-01 | US-10 | Hiển thị | Điều kiện có chủ đề kế hoạch và dữ liệu Cố vấn/khung giờ công khai; khi Sinh viên lọc; kết quả chỉ hiện Cố vấn `APPROVED` phù hợp chuyên môn/lịch rảnh và phân biệt rõ trạng thái không có kết quả. |
| AC-11-01 | US-11 | Thành công/kiểm tra dữ liệu | Điều kiện khung giờ khả dụng và JD/kế hoạch thuộc Sinh viên; khi gửi đủ ngữ cảnh; kết quả tạo đúng một lịch `PENDING`; ngữ cảnh thiếu/thuộc người khác hoặc khung giờ sai bị từ chối. |
| AC-11-02 | US-11 | Chống trùng | Điều kiện có yêu cầu/khóa chống trùng; khi thử lại cùng yêu cầu; kết quả trả kết quả ban đầu, không tạo trùng lịch/sự kiện; dữ liệu khác với cùng khóa trả xung đột ổn định. |
| AC-12-01 | US-12 | Đồng thời | Điều kiện ≥20 lịch `PENDING` cạnh tranh một khung giờ; khi xác nhận đồng thời trên PostgreSQL; kết quả đúng một lịch chiếm chỗ, các lịch còn lại nhận xung đột ổn định và chỉ có một chuyển trạng thái/sự kiện hộp sự kiện logic. |
| AC-12-02 | US-12 | Chuyển trạng thái | Điều kiện lịch `PENDING`/`CONFIRMED` và đúng bên sở hữu; khi từ chối hoặc đề xuất đổi lịch trước mốc 12 giờ và lịch có ít hơn hai đề xuất; kết quả chuyển trạng thái/lưu vết được ghi nguyên tử; sai tác nhân, hành động muộn chưa duyệt hoặc đề xuất thứ ba bị từ chối. |
| AC-12-03 | US-12 | Bất biến | Điều kiện đề xuất đổi lịch từ `CONFIRMED` chưa được giải quyết; khi đề xuất còn chờ; kết quả khung giờ cũ vẫn được bảo vệ và khung đề xuất chưa bị chiếm cho đến khi chấp nhận nguyên tử. |
| AC-13-01 | US-13 | Chính sách | Điều kiện trạng thái cho phép; khi bên được ủy quyền hành động trước giờ bắt đầu ≥12 giờ; kết quả hủy/đổi lịch theo điều kiện tự phục vụ. Trong 12 giờ, hành động cần Quản trị viên hoặc bên còn lại giải quyết. Trạng thái, khung giờ và lưu vết vẫn nguyên tử; chuyển sai không tạo tác động từng phần. |
| AC-13-02 | US-13 | Tranh chấp đồng thời | Điều kiện hai đề xuất đổi lịch cạnh tranh một khung giờ mới; khi được chấp nhận đồng thời; kết quả chỉ một đề xuất nhận khung giờ và bên còn lại giữ trạng thái an toàn do chính sách quy định. |
| AC-14-01 | US-14 | Phân quyền | Điều kiện lịch `CONFIRMED`; khi Cố vấn sở hữu tạo liên kết ngoài hệ thống và cập nhật thông thường không muộn hơn 2 giờ trước khi bắt đầu; kết quả chỉ Sinh viên/Cố vấn thuộc lịch được xem đến 24 giờ sau buổi gặp; người không liên quan và nhật ký không nhận liên kết. |
| AC-14-02 | US-14 | Nhà cung cấp/trạng thái | Điều kiện nhà cung cấp/liên kết lỗi; khi Cố vấn đưa liên kết thay thế trong 15 phút; kết quả lịch vẫn `CONFIRMED`. Nếu không, hệ thống đưa ra hành động đổi lịch rõ ràng; không chuyển trạng thái ngầm hoặc lộ liên kết trái quyền. |
| AC-15-01 | US-15 | Trạng thái/quyền sở hữu | Điều kiện đã qua giờ kết thúc và Cố vấn sở hữu đánh dấu lịch `COMPLETED`; khi gửi đủ thang đánh giá, điểm mạnh, điểm yếu và hành động tiếp theo; kết quả tạo một phản hồi/lưu vết riêng tư. Sinh viên được khiếu nại trong 24 giờ; đánh giá chưa công bố đến khi giải quyết; sai trạng thái/tác nhân/dữ liệu bị từ chối. |
| AC-15-02 | US-15 | Quyền riêng tư | Điều kiện đã có phản hồi; khi kiểm tra nhật ký, phân tích hoặc tuyến công khai/hồ sơ; kết quả không có toàn bộ nội dung phản hồi trừ khi chính sách cho phép rõ ràng. |
| AC-16-01 | US-16 | Phân quyền | Điều kiện đã có phản hồi; khi Sinh viên thuộc lịch mở phản hồi; kết quả hiển thị thang đánh giá và hành động tiếp theo; người không liên quan bị từ chối và nội dung không tự công khai. |
| AC-17-01 | US-17 | Duy nhất/tranh chấp | Điều kiện lịch `COMPLETED` chưa có đánh giá; khi Sinh viên thuộc lịch gửi đánh giá hợp lệ; kết quả tạo tối đa một đánh giá. Đánh giá chỉ được công bố sau khi hết thời hạn khiếu nại 24 giờ mà không có khiếu nại, hoặc sau quyết định có lưu vết của Quản trị viên; trường hợp trùng/sai tác nhân/trạng thái bị từ chối. |
| AC-18-01 | US-18 | Kiểm duyệt | Điều kiện Quản trị viên được ủy quyền; khi công bố câu hỏi có phân loại/nguồn gốc hợp lệ; kết quả câu hỏi được công khai/ánh xạ và quyết định được lưu; dữ liệu thiếu hoặc người không phải Quản trị viên bị từ chối. |
| AC-19-01 | US-19 | Lỗi nhà cung cấp | Điều kiện sự kiện lịch hẹn/lời nhắc đã được ghi; khi gửi thông báo lỗi; kết quả lịch hẹn vẫn được giữ và một tác vụ chống trùng thử lại tối đa tại phút 1, 5; lỗi hết lượt hiển thị để xử lý trong ứng dụng/thủ công. |
| AC-19-02 | US-19 | Tiến trình/phục hồi | Điều kiện nhiều tiến trình cạnh tranh và có lỗi tạm thời/vĩnh viễn; khi xử lý tác vụ; kết quả mỗi tác vụ chỉ do một tiến trình nhận, lần thử lại quan sát được, thành công chuyển `SENT`, hết lượt chuyển `DEAD`/xử lý thủ công. |
| AC-20-01 | US-20 | Phân quyền/lưu vết | Điều kiện có báo cáo/ngoại lệ mở; khi Quản trị viên được ủy quyền giải quyết; kết quả lưu quyết định, lý do, tác nhân, thời gian và bản ghi bị ảnh hưởng; ghi chú hạn chế vẫn riêng tư và không bỏ qua quy tắc máy trạng thái. |
| AC-21-01 | US-21 | Giá trị/quyền sở hữu | Điều kiện có dữ liệu kế hoạch/luyện tập/phản hồi của Sinh viên; khi mở bảng tiến độ; kết quả chỉ hiện tiến độ/hành động thật của Sinh viên đó, không có điểm bịa đặt hoặc dữ liệu của Sinh viên khác. |
| AC-22-01 | US-22 | Lập lịch | Điều kiện lịch tương lai ở `CONFIRMED`; khi đến mốc 24 giờ hoặc 1 giờ; kết quả một lời nhắc chống trùng được hiển thị theo múi giờ từng người nhận từ lịch UTC. Xác nhận muộn bỏ mốc đã qua; hủy/đổi lịch loại tác vụ cũ. |
| AC-23-01 | US-23 | Nhập/kiểm duyệt | Điều kiện tệp nhập có quản trị; khi Quản trị viên kiểm tra/nhập; kết quả dòng hợp lệ vào `DRAFT`/đang duyệt và có nguồn gốc, lỗi theo dòng được báo, xử lý trùng ổn định và không mục nào tự công bố. |
| AC-24-01 | US-24 | Đầu vào/biên | Điều kiện ≤50.000 ký tự dán hoặc một PDF/PNG/JPEG ≤10 MB (PDF ≤5 trang; ảnh = một ảnh); khi Sinh viên gửi; kết quả tạo một `JobDescription` riêng tư. Dữ liệu rỗng, nhiều tệp, không hỗ trợ, hỏng, mã hóa, có đính kèm nhúng hoặc vượt giới hạn bị từ chối mà không phân tích. |
| AC-24-02 | US-24 | Bảo mật/quyền riêng tư | Điều kiện có tệp tải lên; khi kiểm tra chữ ký tệp/MIME, an toàn bộ phân tích hoặc quyền sở hữu thất bại; kết quả tệp bị từ chối/cách ly, không cho nội dung hoạt động hoặc kết nối ra ngoài, không cấp URL công khai và nhật ký không chứa JD. |
| AC-25-01 | US-25 | Định tuyến/trạng thái | Điều kiện văn bản dán/PDF có chữ hoặc PNG/JPEG/PDF quét tiếng Việt/Anh; khi bắt đầu trích xuất; kết quả ưu tiên trích xuất trực tiếp, OCR nội bộ chỉ xử lý nguồn quét/ảnh; lưu phương pháp/phiên bản/trạng thái/thời lượng và văn bản dùng được hoặc lỗi an toàn. |
| AC-25-02 | US-25 | Lỗi/chống trùng | Điều kiện hết hạn/lỗi sau 60 giây hoặc thử lại cùng dữ liệu; khi tiếp tục xử lý; kết quả có tối đa hai lần chạy tự động, tác vụ trùng không tạo phiên bản xung đột và vẫn cho phép dán/sửa/thử thủ công. |
| AC-26-01 | US-26 | Hiệu chỉnh/phiên bản | Điều kiện có văn bản trích xuất/dán; khi Sinh viên sửa và xác nhận; kết quả phân tích dùng đúng phiên bản hiệu chỉnh đó; lần sửa sau vô hiệu kết quả yêu cầu/ánh xạ/kế hoạch dẫn xuất đến khi tạo lại. |
| AC-27-01 | US-27 | Phân tích/bằng chứng | Điều kiện văn bản đã xác nhận và phân loại/tên đồng nghĩa đã duyệt; khi phân tích; kết quả vị trí/cấp bậc/kỹ năng/công nghệ/yêu cầu giữ bằng chứng gốc; tên đồng nghĩa đã biết được chuẩn hóa đúng, thuật ngữ lạ vẫn có thể rà soát và chưa ánh xạ. |
| AC-28-01 | US-28 | Tính ổn định/giải thích | Điều kiện cùng văn bản hiệu chỉnh và phiên bản phân loại/tên đồng nghĩa/quy tắc; khi ánh xạ lặp lại; kết quả điểm 40/30/15/15 và phân xử ổn định tạo cùng mã băm thứ tự; mỗi kết quả truy được về bằng chứng yêu cầu/chủ đề/lý do. |
| AC-28-02 | US-28 | Hiển thị/âm | Điều kiện có câu hỏi `DRAFT`/`ARCHIVED`/phân loại sai hoặc điểm <60; khi ánh xạ; kết quả các mục đó không xuất hiện; tối đa 10 câu hỏi và 3 câu/yêu cầu, nếu thiếu thì hiển thị khoảng trống độ phủ trung thực, không ngầm đổi ngưỡng. |
| AC-29-01 | US-29 | Kế hoạch/quyền sở hữu | Điều kiện kết quả ánh xạ đủ điểm và hợp lệ; khi Sinh viên rà soát lựa chọn và tạo kế hoạch; kết quả mỗi mục giữ truy vết yêu cầu/chủ đề/câu hỏi/lý do/phiên bản; chỉ chủ sở hữu được sửa và không kết quả nào được trình bày như bảo đảm nội dung phỏng vấn. |
| AC-30-01 | US-30 | Bàn giao/phân quyền | Điều kiện JD/kế hoạch thuộc Sinh viên và Cố vấn/khung giờ đã chọn; khi tạo lịch hẹn; kết quả lịch tham chiếu ngữ cảnh đó; Cố vấn sở hữu chỉ thấy trường đã duyệt, còn tác nhân không liên quan và ngữ cảnh Sinh viên khác bị từ chối. |

## 5. Yêu cầu chất lượng

Yêu cầu chất lượng là đường cơ sở đặc tả có thể đo vì không thể đánh giá chất lượng nếu thiếu yêu cầu và tiêu chí so sánh.

| Mã | Yêu cầu | Truy vết câu chuyện/PBI | Cách kiểm chứng |
|---|---|---|---|
| NFR-01 | Chính sách từ chối mặc định và phân quyền vai trò/đối tượng phía máy chủ bảo vệ mọi đối tượng riêng tư/hạn chế, gồm JD, kế hoạch, lịch hẹn và phản hồi. | Toàn bộ R1; EN-04 | Ma trận kiểm thử âm tác nhân/vai trò/quan hệ trên API thật |
| NFR-02 | Với cấu hình thử nghiệm đã duyệt, tuyến đọc/ghi không dùng OCR có p95 ≤3 giây và lỗi 5xx <1%; trích xuất/OCR có p95 ≤45 giây, hết hạn sau 60 giây và phải hiển thị tiến độ/trạng thái. | US-04/10–15/24–30; EN-08/09 | Kiểm thử tải/thời gian trên môi trường thử với dữ liệu ổn định |
| NFR-03 | Mỗi khung giờ có đúng một lịch chiếm chỗ khi có ≥20 yêu cầu xác nhận đồng thời. | US-12/13; EN-03 | Kiểm thử đồng thời PostgreSQL và truy vấn bất biến |
| NFR-04 | Ghi vào hộp sự kiện phải nguyên tử; tiến trình nhận tác vụ có p95 ≤10 giây khi nhà cung cấp hoạt động; lỗi phải quan sát và phục hồi được. | US-19/22; EN-07 | Tích hợp nhà cung cấp giả lập, số đo và kiểm thử phục hồi |
| NFR-05 | TLS 1.2+, kiểm soát phiên/CSRF đã chấp nhận và kho mã/nhật ký không chứa bí mật bảo vệ đường truyền và môi trường chạy. | US-01/02/14/24–30; EN-02/08 | Kiểm tra cấu hình và kiểm thử âm phiên/CSRF/bí mật |
| NFR-06 | Dữ liệu thử nghiệm có RPO ≤24 giờ và RTO ≤4 giờ. | Toàn bộ R1; EN-08 | Diễn tập sao lưu/phục hồi trước thử nghiệm |
| NFR-07 | Tác vụ cốt lõi JD đến kế hoạch và kế hoạch đến đặt lịch trên nguyên mẫu đều đạt tỷ lệ hoàn tất ≥80%; trạng thái đang tải/rỗng/lỗi/từ chối quyền/xung đột phải dùng được. | US-24–30 và luồng Sinh viên cốt lõi; EN-01 | Báo cáo quan sát nguyên mẫu/UAT |
| NFR-08 | Không còn lỗi Mức nghiêm trọng/Cao đang mở và 100% kiểm thử quy trình trọng yếu đạt trước khi kết thúc UAT. | Toàn bộ R1; EN-08 | Sổ lỗi và kết quả UAT có xác nhận |
| NFR-09 | Tải lên nhận một PDF/PNG/JPEG ≤10 MB (PDF ≤5 trang), kiểm tra chữ ký tệp/MIME/nội dung, cô lập bộ phân tích/OCR nội bộ không cho kết nối ra ngoài và thất bại an toàn. OCR hỗ trợ Việt/Anh, ≤2 tác vụ đồng thời/tiến trình, hết hạn 60 giây và ≤2 lần chạy. | US-24/25; EN-04/09 | Kiểm thử tệp lỗi/đa định dạng/quá cỡ/mã hóa và đo hàng đợi/đồng thời/thời hạn |
| NFR-10 | Bộ 8 JD kiểm chứng mù đạt độ bao phủ yêu cầu ≥80% và precision@10 ≥80%; cùng văn bản hiệu chỉnh + phiên bản phân loại/tên đồng nghĩa/quy tắc tạo cùng mã băm thứ tự trong 100% lần chạy; mọi kết quả có nguồn/chủ đề/lý do/phiên bản và không lộ câu hỏi chưa `PUBLISHED`. | US-27–29; EN-06/09 | Bộ chuẩn 20 JD có phiên bản, hai lượt duyệt, kiểm thử lặp lại và vòng đời |
| NFR-11 | Áp dụng đặc quyền tối thiểu và giảm thiểu dữ liệu. JD gốc hết hạn ≤24 giờ sau trích xuất; dữ liệu dẫn xuất sau 90 ngày không hoạt động; lịch hẹn/phản hồi sau 180 ngày; yêu cầu xóa loại dữ liệu hoạt động ≤7 ngày và bản sao lưu ≤30 ngày; nhật ký/phân tích không chứa JD gốc. | US-24–30; EN-04/08 | Phân quyền, bộ lập lịch lưu giữ/xóa, hết hạn sao lưu và kiểm tra nhật ký |

### 5.1 Danh mục bộ kiểm thử

| Bộ kiểm thử | Trọng tâm kiểm chứng |
|---|---|
| TC-AUTH | Đăng ký/đăng nhập, phiên, nâng quyền, CSRF, hết hạn/thu hồi |
| TC-JD | Dán/tải lên, loại/chữ ký/giới hạn tệp, định tuyến trích xuất trực tiếp/OCR, dữ liệu hỏng/mã hóa/rỗng, thử lại/trạng thái và phiên bản hiệu chỉnh |
| TC-MAP | Bằng chứng yêu cầu, chuẩn hóa tên đồng nghĩa, thuật ngữ chưa ánh xạ, điểm/lý do/phiên bản ổn định chỉ cho nội dung `PUBLISHED` và bộ dữ liệu đánh giá liên quan |
| TC-PLAN | Chọn kết quả ánh xạ, quyền sở hữu/phiên bản/lịch sử kế hoạch, hành động từ phản hồi và bàn giao từ kế hoạch sang đặt lịch |
| TC-STUDENT | Kiểm tra mục tiêu/hồ sơ, lưu bền vững và quyền sở hữu |
| TC-Q | Không/một/nhiều kết quả, nhiều nhãn, hiển thị theo vòng đời, phân trang/sắp xếp và nguồn gốc |
| TC-M | Trạng thái xác minh, quyết định trái quyền và tách hồ sơ công khai/riêng tư |
| TC-SLOT | Múi giờ, kiểm tra quá khứ/chồng lấn, bất biến chiếm chỗ và cập nhật đồng thời |
| TC-B | Ngữ cảnh/tạo/chuyển trạng thái/đổi/hủy lịch, chống trùng, lưu vết và đồng thời |
| TC-SESSION | Chỉ lịch `CONFIRMED` được truy cập liên kết họp, phân quyền đối tượng và phương án dự phòng nhà cung cấp |
| TC-F | Phản hồi chỉ sau `COMPLETED`, quyền sở hữu, kiểm tra thang đánh giá, quyền riêng tư, hành động kế hoạch và tính duy nhất của đánh giá |
| TC-N | Hộp sự kiện nguyên tử, chống trùng, tiến trình cạnh tranh, thử lại/chờ tăng dần, trạng thái `DEAD` và phục hồi |
| TC-ADM | Kiểm duyệt phân loại/câu hỏi, giải quyết báo cáo/ngoại lệ, ghi chú hạn chế và dấu vết kiểm toán |

## 6. Kế hoạch KPI

| KPI | Sự kiện/nguồn | Công thức | Mục tiêu đề xuất |
|---|---|---|---:|
| Xác nhận vấn đề | Mẫu khám phá | người xác nhận khó khăn chuẩn bị theo JD / mẫu hợp lệ | ≥70% |
| Hoàn tất tác vụ nhập JD | Quan sát khả dụng | hoàn tất dán/tải lên-rà soát-xác nhận / số lần thử | ≥80% |
| Trích xuất thành công | Sự kiện đầu vào hỗ trợ | đầu vào đến văn bản có thể sửa / đầu vào hỗ trợ hợp lệ | ≥90% |
| Độ bao phủ yêu cầu | Bộ kiểm thử JD có nhãn | yêu cầu mong đợi được phát hiện / tổng yêu cầu mong đợi | ≥80% |
| Độ liên quan ánh xạ | Chuyên gia rà soát | câu hỏi gợi ý liên quan / tổng gợi ý được rà soát | ≥80% |
| Khả năng giải thích ánh xạ | Bản ghi ánh xạ | kết quả có nguồn yêu cầu + chủ đề + lý do / tổng kết quả | 100% |
| Kích hoạt kế hoạch | Sự kiện sản phẩm/khả dụng | người bắt đầu câu hỏi hoặc luồng Cố vấn / người có kế hoạch hợp lệ | ≥80% |
| Hoàn tất tác vụ đặt lịch | Quan sát khả dụng | lịch hẹn có ngữ cảnh hợp lệ / số lần thử | ≥80% |
| Độ tin cậy đặt lịch | Sự kiện lịch hẹn | số hoàn thành / số xác nhận | ≥80% |
| Phản hồi đầy đủ | Bản ghi phản hồi | phản hồi đủ thang đánh giá / lịch hẹn hoàn thành | ≥90% |
| Giá trị cảm nhận | Khảo sát sau buổi | điểm trung bình | ≥4/5 |
| Mức tăng tự tin | Khảo sát trước/sau | trung bình sau − trước | ≥1/5 |

Bằng chứng KPI xác nhận kết quả đầu ra; bằng chứng kiểm thử xác nhận hành vi. Không được suy ra hai loại bằng chứng này chỉ từ việc có giao diện, kịch bản không có kiểm tra hoặc kết quả sinh ra chưa so với đầu ra mong đợi.

## 7. Kiểm soát Sẵn sàng và Hoàn thành

### 7.1 Định nghĩa Sẵn sàng

Một câu chuyện chỉ Sẵn sàng khi có tác nhân/giá trị, tiêu chí chấp nhận, phụ thuộc, đầu vào quy trình/thiết kế/hợp đồng, đường cơ sở PD đã duyệt áp dụng cho câu chuyện và ước lượng của Nhóm phát triển. Mọi đề xuất lệch PD-01–PD-08 phải qua kiểm soát thay đổi trước khi câu chuyện được coi là Sẵn sàng.

### 7.2 Định nghĩa Hoàn thành

- Tiêu chí chấp nhận và NFR áp dụng đều đạt, có bằng chứng lưu lại; Product Owner chấp nhận hành vi.
- Mã nguồn tuân chuẩn, được thành viên khác rà soát, dựng không lỗi và có kiểm thử đơn vị/tích hợp/đầu-cuối/âm phù hợp.
- Kiểm thử xử lý JD dùng đầu vào đã biết và văn bản/yêu cầu/ánh xạ mong đợi; hiệu chỉnh, vô hiệu phiên bản, bảo mật tệp và phân quyền đối tượng riêng tư đạt khi áp dụng.
- Kiểm thử trên PostgreSQL bao phủ đồng thời đặt lịch, máy trạng thái, phân quyền và hộp sự kiện khi áp dụng; đối tượng giả không chứng minh được các bất biến này.
- Chuyển đổi cơ sở dữ liệu, hợp đồng API, lưu vết/đo lường và tài liệu được cập nhật; kho mã/nhật ký không chứa bí mật thật hoặc dữ liệu JD/PII không cần thiết.
- Bản dựng tích hợp được triển khai lên môi trường mục tiêu, được thành viên khác kiểm tra nhanh và không còn lỗi Mức nghiêm trọng/Cao đang mở.
- Backlog phát hành, kế hoạch/lịch, hướng dẫn người dùng/triển khai và liên kết bằng chứng được cập nhật.

Các điều kiện này bảo đảm hạng mục chỉ được xem là hoàn thành khi đã sẵn sàng cho môi trường mục tiêu và có đủ bằng chứng kiểm chứng.

## 8. Ma trận truy vết yêu cầu

| Yêu cầu | Nguồn/mục tiêu | Câu chuyện | Quy tắc / chấp nhận | Quy trình / khái niệm nguyên mẫu | Kiểm chứng |
|---|---|---|---|---|---|
| RQ-01 Danh tính/RBAC | Quyền riêng tư/bảo mật | US-01, US-02 | BR-04/11/19; AC-01/02 | Xác thực + trạng thái quyền | EN-02/04; TC-AUTH; NFR-01/05 |
| RQ-11 Nhập/trích xuất JD | OBJ-02 | US-24, US-25, US-26 | BR-12/13/14/19; AC-24/25/26 | FS-01–03; nhập/rà soát JD | EN-09; TC-JD; NFR-09/11; KPI |
| RQ-12 Phân tích/ánh xạ/kế hoạch JD | OBJ-03/04/05 | US-27, US-28, US-29 | BR-07/14–17/19; AC-27/28/29 | FS-04–06; kế hoạch chuẩn bị | EN-06/09; TC-MAP/PLAN; NFR-10/11; KPI |
| RQ-02 Mục tiêu Sinh viên | OBJ-03/06 | US-03 | BR-03; AC-03-01 | Xác nhận hồ sơ/ngữ cảnh | TC-STUDENT |
| RQ-03 Ngân hàng câu hỏi/luyện tập | OBJ-05/08 | US-04/05/06/18/21/23 | BR-07/08; AC liên quan | FS-05–07/14; màn hình câu hỏi/kế hoạch | EN-06; TC-Q; NFR-02/07 |
| RQ-04 Tiếp nhận Cố vấn | Nguồn cung/tin cậy | US-07, US-08 | BR-01/08/11; AC-07/08 | Tiếp nhận Cố vấn/Quản trị viên duyệt | TC-M; NFR-01 |
| RQ-05 Lịch rảnh/khám phá | OBJ-05/06 | US-09, US-10 | BR-01/02; AC-09/10 | FS-08; màn hình Cố vấn/đặt lịch | TC-SLOT; kiểm thử khả dụng |
| RQ-13 Ngữ cảnh từ kế hoạch đến đặt lịch | OBJ-06 | US-30, US-11 | BR-03/17/18/19; AC-30/11 | FS-09; đặt lịch có ngữ cảnh | EN-04/09; TC-PLAN/B; NFR-11 |
| RQ-06 Vòng đời đặt lịch | OBJ-06 | US-11/12/13 | BR-02/03/08/10/18; AC liên quan | FS-09/10 | EN-03/05; TC-B; NFR-03 |
| RQ-07 Truy cập buổi gặp | OBJ-06 | US-14 | BR-04/11; AC-14 | FS-11/12 | EN-04; TC-SESSION; NFR-01/05 |
| RQ-08 Phản hồi/đánh giá | OBJ-07/08 | US-15/16/17 | BR-04/05/06/11/17; AC liên quan | FS-13/14 | EN-04/05; TC-F; KPI |
| RQ-09 Thông báo | OBJ-06 | US-19, US-22 | BR-09/10; AC-19/22 | FS-11 + ngoại lệ | EN-07; TC-N; NFR-04 |
| RQ-10 Kiểm duyệt/vận hành | Tin cậy/thử nghiệm | US-18/20/23 | BR-01/07/08/11/19; AC liên quan | Vận hành Quản trị viên | TC-ADM; NFR-01/08 |

## 9. Kế hoạch phát hành

R1 dùng Kanban trong cửa sổ tám tuần từ 29/06/2026 đến 23/08/2026. Phần execution được tái dựng theo bốn tuần từ 27/07 đến 23/08; kế hoạch theo ngày cố định phải dùng PBI đã ước lượng/ưu tiên và khoảng throughput của nhóm.

| Nhóm backlog | Câu chuyện | SP ban đầu | Ràng buộc kế hoạch |
|---|---:|---:|---|
| R1 Bắt buộc | US-01–US-20 và US-24–US-30 | 134 | Cần `33,5 SP/tuần` trong bốn tuần execution tái dựng; chưa cam kết đến khi khoảng throughput và đường cơ sở năng lực xác nhận tính khả thi |
| R1 Mở rộng | US-21–US-22 | 8 | Chỉ chọn sau khi phần Bắt buộc và dự phòng an toàn |
| Tương lai | US-23 | 8 | Không thuộc R1 |

Đường “chắc chắn có/có thể có” chưa được đặt đến khi Nhóm phát triển xác nhận ước lượng và cung cấp khoảng throughput thấp/cao. Thay đổi lấy JD làm điểm bắt đầu tăng phạm vi Bắt buộc thêm 42 SP ban đầu; không được kế thừa kết luận khả thi cũ ở mức 92 SP nếu chưa ước lượng lại.

### 9.1 Bản đồ câu chuyện

| Hoạt động | Câu chuyện | Kết quả |
|---|---|---|
| Nền tảng | US-01, US-02, US-18 | Danh tính an toàn và phân loại/câu hỏi có quản trị |
| Nhập JD | US-24, US-25, US-26 | Văn bản đã xác nhận sẵn sàng phân tích |
| Phân tích và lập kế hoạch | US-27, US-28, US-29, US-03 | Yêu cầu/ánh xạ có giải thích và kế hoạch chuẩn bị |
| Tự luyện | US-04, US-05, US-06 | Sinh viên luyện câu hỏi đã quản trị |
| Đặt lịch Cố vấn | US-07–US-14, US-19, US-30 | Lịch hẹn có ngữ cảnh, tin cậy và bàn giao buổi gặp ngoài hệ thống |
| Phản hồi và vận hành | US-15–US-17, US-20 | Phản hồi có thể hành động, đánh giá và ngoại lệ có quản trị |

## 10. Quyết định sản phẩm đã phê duyệt

Các giá trị được chọn là ước lượng lập kế hoạch cho thử nghiệm 8 tuần. Cách tính, độ tin cậy và phương pháp thay bằng số liệu thực nghiệm được ghi tại [Ghi chú ước lượng quyết định sản phẩm](Product_Decision_Estimation_Notes.md).

| Mã | Quyết định lập kế hoạch đã duyệt | Lý do / đánh đổi | Chủ sở hữu | Backlog bị ảnh hưởng |
|---|---|---|---|---|
| PD-01 | Thử nghiệm nhóm Thực tập sinh/Lập trình viên Front-end mới vào nghề (JavaScript/TypeScript/React); 20 JD đã khử định danh = 12 hiệu chỉnh + 8 kiểm chứng mù; 12 Sinh viên, 4 Cố vấn `APPROVED` có ≥3 khung giờ/người; 12 yêu cầu đặt lịch hợp lệ, mục tiêu ≥10 `CONFIRMED` và ≥8 `COMPLETED` | Phân khúc hẹp giúp phân loại và đánh giá nhất quán nhưng chưa đại diện mọi vai trò | Hưng / Nghiên cứu | OBJ-01/03/04; kế hoạch KPI |
| PD-02 | Tự hủy/đổi lịch đến trước 12 giờ; tối đa 2 đề xuất; hành động muộn cần Quản trị viên/bên còn lại; Cố vấn đánh dấu `COMPLETED` sau giờ kết thúc, Sinh viên khiếu nại trong 24 giờ; khiếu nại giữ đánh giá chưa công bố đến quyết định có lưu vết; báo vắng mặt sau 15 phút và cần Quản trị viên/bên còn lại xác nhận | Cân bằng linh hoạt và điều phối Cố vấn; tránh tự ghi vắng mặt hoặc công bố đánh giá khi còn tranh chấp | Hưng / Vận hành | US-12/13/15/20; BR-08 |
| PD-03 | Xin đồng ý ở lần tải đầu; JD gốc ≤24 giờ; dữ liệu dẫn xuất 90 ngày không hoạt động; lịch hẹn/phản hồi 180 ngày; xóa dữ liệu hoạt động ≤7 ngày và bản sao lưu ≤30 ngày; nhật ký/phân tích không chứa JD gốc | Hỗ trợ một chu kỳ chuẩn bị phỏng vấn đồng thời giảm phơi nhiễm dữ liệu nhạy cảm | Hưng / Quyền riêng tư | BR-11/19; NFR-06/11 |
| PD-04 | Cố vấn sở hữu tạo/sửa liên kết ngoài hệ thống đến trước 2 giờ; chỉ hai bên xem đến 24 giờ sau buổi gặp; Quản trị viên can thiệp phải lưu vết; khi nhà cung cấp lỗi, Cố vấn có 15 phút đưa liên kết thay thế, nếu không phải đổi lịch rõ ràng | Tránh tích hợp video và giới hạn quyền với liên kết, đổi lại phụ thuộc thao tác Cố vấn | Hưng / Kỹ thuật | US-14 |
| PD-05 | Xác nhận tức thời thuộc Bắt buộc; lời nhắc theo lịch vẫn là US-22 R1 Mở rộng. Khi được chọn: nhắc trước 24 giờ và 1 giờ, lưu UTC/hiển thị giờ địa phương, bỏ tác vụ cũ, một lần gửi + thử lại phút 1 và 5, dự phòng trong ứng dụng/thủ công | Giữ đường cơ sở Bắt buộc 134 SP trong khi vẫn có chính sách lời nhắc kiểm thử được; bằng chứng thử nghiệm có thể đổi nhịp | Hưng / Vận hành | US-19/22 |
| PD-06 | Dán ≤50.000 ký tự hoặc một PDF/PNG/JPEG ≤10 MB; PDF ≤5 trang; PNG/JPEG là một ảnh; từ chối dữ liệu mã hóa/nhiều tệp/nhúng/không an toàn; JD gốc ≤24 giờ | Bao phủ JD phổ biến và giới hạn rủi ro bộ phân tích, CPU, lưu trữ và bảo mật | Hưng / Kiến trúc / Bảo mật | US-24/25; BR-12/19; NFR-09 |
| PD-07 | OCR nội bộ tiếng Việt/Anh; ≤2 tác vụ đồng thời/tiến trình; hết hạn 60 giây; ≤2 lần chạy tự động; p95 ≤45 giây; đầu vào hỗ trợ thành công ≥90%; độ chính xác trực tiếp ≥95%; OCR ≥85%; độ tin cậy <0,80 phải đánh dấu; bắt buộc có dán/sửa dự phòng | Mục tiêu thử nghiệm cụ thể, kiểm thử được; ảnh chất lượng thấp vẫn do người dùng hiệu chỉnh | Luân / Hưng | US-25/26; BR-13 |
| PD-08 | Hưng sở hữu phân loại/nội dung; Luân duyệt phiên bản lược đồ/quy tắc; Trí kiểm chứng bộ dữ liệu/kiểm thử; Tuấn Anh kiểm soát cấu hình/phát hành. Trọng số 40/30/15/15, ngưỡng 60, tối đa 10 câu/JD và 3 câu/yêu cầu; độ bao phủ yêu cầu và precision@10 ≥80%; tính lặp lại/giải thích 100% | Ổn định và giải thích được nhưng kém ánh xạ ngữ nghĩa khi gặp tên đồng nghĩa mới | Hưng / Nội dung / Kiến trúc | US-27–29; BR-15/16; NFR-10 |

## 11. Tinh chỉnh backlog và kiểm soát thay đổi

Hưng với vai trò Product Owner / Business Analyst tổ chức tinh chỉnh ít nhất mỗi tuần một lần hoặc khi cần bổ sung công việc vào Kanban, với đại diện Phát triển, Kiến trúc, UX và QA. Mỗi thay đổi được duyệt phải cập nhật câu chuyện, tiêu chí chấp nhận, thứ tự, phụ thuộc, ước lượng, truy vết, hợp đồng kiến trúc/nguyên mẫu và tác động phát hành liên quan.

Một câu chuyện chỉ được kéo vào cột Ready khi:

1. tác nhân, giá trị, ưu tiên, phụ thuộc và tiêu chí chấp nhận theo Điều kiện/Khi/Kết quả đã rõ;
2. quy trình/nguyên mẫu và đầu vào kỹ thuật đã sẵn có;
3. phần hiện thực tuân PD-01–PD-08, hoặc có bản ghi thay đổi đã duyệt và bằng chứng thay thế;
4. Nhóm phát triển xác nhận ước lượng bằng dãy Fibonacci đã thống nhất;
5. câu chuyện 8 điểm được tách hoặc được chấp nhận là ngoại lệ trước khi kéo vào Ready;
6. có dữ liệu kiểm thử và đầu ra mong đợi cho câu chuyện trích xuất/phân tích/ánh xạ;
7. Product Owner, lập trình viên và QA đồng ý câu chuyện có thể hiện thực và kiểm thử trong giới hạn WIP đã đặt.
