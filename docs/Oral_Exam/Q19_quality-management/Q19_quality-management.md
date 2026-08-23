# Câu 19 — Kế hoạch quản lý chất lượng

## 1. Đề bài

Trình bày quá trình hình thành và phương pháp đánh giá tài liệu **Kế hoạch quản lý chất lượng (Software Quality Management Plan)** của nhóm. 
*(Sinh viên nộp kèm bản in tài liệu Kế hoạch quản lý chất lượng của nhóm, bản in định nghĩa hoàn thành (Definition of Done) của nhóm, bản in giao diện cấu hình đảm bảo Coding Standards cho mã nguồn của nhóm, bản in biên bản thanh tra mã nguồn của nhóm, bản in biên bản phản hồi từ khách hàng của nhóm.)*

**Các câu hỏi thường gặp:** 
- Các câu hỏi chính cần trả lời trong tài liệu Kế hoạch quản lý chất lượng là gì? 
- Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu Kế hoạch quản lý chất lượng là gì? 
- Tài liệu Kế hoạch quản lý chất lượng của nhóm đã được đánh giá thế nào? 
- Tại sao cần tạo tài liệu Kế hoạch quản lý chất lượng? 
- Tài liệu Kế hoạch quản lý chất lượng của nhóm đã được sử dụng và cập nhật trong quá trình thực hiện dự án như thế nào? 
- Giải thích sự hỗ trợ của các mô hình McCall, ISO 9126 trong việc kiểm soát chất lượng các sản phẩm của dự án? 
- Đo lường định tính khác gì đo lường định lượng (qualitative vs. quantitative measurement)? 
- Giải thích phương pháp đo lường chất lượng các sản phẩm, quy trình và con người trong một dự án. 
- Giải thích các phương pháp giúp hạn chế việc các tài liệu dự án không đúng với yêu cầu khách hàng đề ra. 
- Giải thích các phương pháp giúp hạn chế việc mã nguồn hệ thống không đúng với thiết kế đề ra. 
- Giải thích các phương pháp giúp hạn chế việc phần mềm hoạt động không đúng với yêu cầu khách hàng đề ra.

## 2. Dàn ý viết A4 trong 10 phút

- **Mục đích:** Đảm bảo sản phẩm đáp ứng các tiêu chuẩn và yêu cầu về chất lượng của người dùng và kỹ thuật.
- **Khởi tạo:** Xác định các thuộc tính chất lượng cần đo, chọn metric và phương pháp đo (QA/QC), lập Definition of Done.
- **Đánh giá:** Review nội bộ xem các tiêu chí có khả thi, dễ đo lường hay không (VD: đổi từ định tính sang định lượng).
- **Sử dụng:** Áp dụng Coding Standards, CI/CD, Unit tests (QA) và Review, Testing, Inspections (QC) theo quy định trong Plan.
- **Cập nhật:** Điều chỉnh metrics hoặc quy trình QA/QC khi phát hiện ra điểm không phù hợp trong quá trình phát triển thực tế.
- **Kết quả:** Chất lượng code tăng, lỗi được phát hiện sớm, sản phẩm đáp ứng mong đợi (Customer Satisfaction).

## 3. Tài liệu là gì và tại sao cần tạo?

- **WHAT:** Tài liệu Kế hoạch Quản lý Chất lượng (SQMP) là nơi xác định cách tổ chức đáp ứng các yêu cầu chất lượng của khách hàng và các bên liên quan. Bao gồm các tiêu chuẩn, số liệu đo lường (metrics), Definition of Done, và quy trình QA/QC.
- **WHY:** Để đảm bảo sản phẩm phần mềm, quy trình và môi trường đạt được chất lượng theo kỳ vọng, hạn chế tình trạng dự án làm xong nhưng khách hàng không chấp nhận do không dùng được hoặc dùng không tốt.
- **WHEN:** Được tạo ra ở giai đoạn lập kế hoạch dự án (Project Planning), ngay sau khi có tài liệu Viễn cảnh và Yêu cầu (Vision & Requirements).

## 4. Quá trình khởi tạo thực tế (Nhóm tự điền chi tiết dự án thực tế)

- **Bối cảnh và thời điểm:** TODO (Ví dụ: Tuần X, sau khi có Product Backlog).
- **Đầu vào:** Project Vision and Scope, Software Requirements.
- **Người tham gia và trách nhiệm:** TODO (Ai viết, ai duyệt).
- **Các bước nhóm đã làm:**
  1. Xác định đối tượng cần quản lý chất lượng (Sản phẩm, quy trình, con người).
  2. Chọn các đặc tính chất lượng cần quan tâm (Theo chuẩn ISO 9126 như Functionality, Usability...).
  3. Đặt các số liệu đo lường (Metrics) cụ thể cho các đặc tính đó (Quantitative).
  4. Xác định các phương pháp Đảm bảo chất lượng (QA) - VD: cấu hình Prettier/ESLint để đảm bảo Coding Standards, đưa ra define of done 
  5. Xác định các phương pháp Kiểm soát chất lượng (QC) - VD: Code Inspection, Testing.
  6. Thống nhất "Definition of Done".
- **Công cụ:** TODO (Google Docs / Notion...).
- **Phiên bản đầu ra:** TODO (Phiên bản v1.0).
- **Bằng chứng:** Bản in tài liệu Kế hoạch quản lý chất lượng của nhóm.

## 5. Quá trình đánh giá thực tế

- **Người đánh giá:** TODO (Ví dụ: Leader, Khách hàng hoặc Mentor).
- **Thời điểm:** TODO (Sau khi draft xong bản đầu tiên).
- **Tiêu chí hoặc phương pháp:** Đánh giá tính khả thi và đo lường được của các metrics.
- **Vấn đề được phát hiện:** TODO (Ví dụ: Một số tiêu chí quá cảm tính/định tính, khó đo lường bằng con số cụ thể).
- **Cách nhóm xử lý:** TODO (Ví dụ: Chuyển các tiêu chí đánh giá định tính thành định lượng rõ ràng hơn).
- **Kết quả sau đánh giá:** Bản Kế hoạch Quản lý Chất lượng hoàn chỉnh, được chốt để tiến hành áp dụng vào các Sprint.
- **Bằng chứng:** TODO (Commit history / Lịch sử chỉnh sửa doc / Biên bản họp).

## 6. Quá trình sử dụng thực tế

- **QA (Ngăn ngừa lỗi):** Sử dụng các tài liệu, cấu hình (ESLint/Prettier) đã định nghĩa trong plan để áp đặt rule lên team code. Bắt buộc viết Unit Test.
- **QC (Phát hiện lỗi):** Áp dụng Code Inspection thông qua Pull Request trên Github, team phải review code chéo nhau mới được merge.
- **Dùng "Definition of Done":** Khi Dev báo xong Task, PM hoặc QA dựa vào DoD để kiểm chứng trước khi chuyển trạng thái sang Done hoàn toàn.
- **Kết quả:** TODO (Nêu cụ thể kết quả nhóm đạt được, số lỗi giảm đi, v.v.)

## 7. Quá trình cập nhật thực tế

- **Nguyên nhân:** TODO (Ví dụ: Quá trình test thực tế tốn quá nhiều thời gian nên cần đổi tool hoặc bỏ bớt tiêu chí rườm rà).
- **Nội dung:** TODO.
- **Người cập nhật & Thời điểm:** TODO.
- **Bằng chứng:** TODO (Link commit sửa đổi tài liệu Kế hoạch quản lý chất lượng).

## 8. Câu hỏi lý thuyết và câu hỏi phụ

- **Các câu hỏi chính cần trả lời trong SQMP?**
  - Các yêu cầu chất lượng (Quality requirements) là gì?
  - Dùng phương pháp/công cụ nào để đo lường các đặc tính chất lượng đó?
  - Tổ chức và thực hiện QA (phòng ngừa lỗi) như thế nào?
  - Tổ chức và thực hiện QC (phát hiện lỗi) như thế nào?

- **Mô hình McCall, ISO 9126 hỗ trợ gì?**
  - Giúp cung cấp một bộ khung (framework) để phân loại và định nghĩa các thuộc tính chất lượng (Quality Characteristics). Ví dụ ISO 9126 chia thành Functionality, Reliability, Usability, Efficiency, Maintainability, Portability, từ đó team có thể dễ dàng thiết lập metrics đo lường mà không bị sót ý.

- **Đo lường định tính (Qualitative) khác gì định lượng (Quantitative)?**
  - *Định tính:* Đo lường dựa trên mô tả, đánh giá chủ quan bằng lời nói, quan sát (Ví dụ: màu sắc, độ đẹp, mức độ hài lòng khách hàng "rất tốt").
  - *Định lượng:* Đo lường dựa trên các con số cụ thể, tính toán được (Ví dụ: thời gian response < 3s, độ bao phủ test đạt 80%, RAM usage < 600Mb).

- **Phương pháp đo lường chất lượng:**
  - *Sản phẩm (Product):* Đo số dòng code (LOC), Defect density, Unit test coverage.
  - *Quy trình (Process):* Số lượng work products tạo ra, số lượng activities thực hiện.
  - *Con người (Person):* Đo số năm kinh nghiệm, kỹ năng xã hội, Degree of satisfaction (độ hài lòng).

- **Hạn chế tài liệu dự án không đúng yêu cầu khách hàng:**
  - Sử dụng phương pháp đánh giá (Review/Walkthrough) tài liệu sớm với khách hàng. Lấy chữ ký xác nhận.

- **Hạn chế mã nguồn không đúng thiết kế:**
  - Áp dụng Code Inspection (Thanh tra mã nguồn) chéo nhau. Tuân thủ nghiêm ngặt Coding Standards.

- **Hạn chế phần mềm không đúng yêu cầu khách hàng:**
  - Xây dựng Bản mẫu (Prototype) trước để khách hình dung. 
  - Yêu cầu khách hàng thực hiện Acceptance Tests định kỳ.

- **Tóm tắt lại kiến thức**
  - Quality là mức độ mà các quality attribute đáp ứng các yêu cầu đã đề ra, bao gồm functionability, security, availability, performance, maintainability, portability,..
  - Metrics & Data: Turn vague ideas into something measurable. VD usability -> đo một người dùng thực tế trải nghiệp app tốn bao nhiêu thời gian khi đăng JD hay khi luyện tập câu hỏi 
  - How to manage quality: 
    - Chọn cái cần đo (Sản phẩm).
    - Chọn khía cạnh (Performance).
    - Chọn số liệu (RAM, CPU).
    - Cách đo (Mở Task Manager lên xem).
    - Đối chiếu (Quy định RAM không quá 200MB, nếu vọt lên 300MB là rớt).
  - Quality is not code mà còn ở 
    - Product --> Code 
    - Process: Làm theo SCRUM hay Kaban, .. 
    - Project: Đo bằng Năng suất (Productivity), tỷ lệ tính năng hoàn thành đúng hạn (Deliverables), và Tiền/Tài nguyên đã tiêu tốn (Costs/Resources).
    - Person: Đo lường kinh nghiệm, tâm lý hành vi họ có hứng thú với project ko
  - QA vs QC 
    - QA : tập trung vào process. Goal: ngăn ngừa lỗi không cho nó sinh ra. VD: quy trình rõ ràng, tài liệu đặc tả rõ ràng, convention lúc code       
    - QC : tập trung vào product. Goal: phát hiện lỗi trước khi giao tới khách hàng. VD: 

## 9. Bản in phải nộp

- [ ] Bản in tài liệu Kế hoạch quản lý chất lượng của nhóm.
- [ ] Bản in định nghĩa hoàn thành (Definition of Done) của nhóm.
- [ ] Bản in giao diện cấu hình đảm bảo Coding Standards (vd: file `.eslintrc`, `.prettierrc`).
- [ ] Bản in biên bản thanh tra mã nguồn (VD: Comment review trên Pull Request Github).
- [ ] Bản in biên bản phản hồi từ khách hàng của nhóm (VD: Feedback report, tin nhắn group chat với KH).

## 10. References (Trích dẫn)

*Ghi chú: Để ôn tập lý thuyết, bạn hãy tham khảo trực tiếp các slide sau theo sự chỉ dẫn chi tiết:*

- **Về Đặc tính chất lượng và Mô hình ISO 9126 / McCall:** 
  - Xem `11. Software Quality Management.pdf` - Slide số 3.
- **Về Định tính (Qualitative) vs Định lượng (Quantitative):** 
  - Xem `11. Software Quality Management.pdf` - Slide số 4 (Data & A Test) và Slide số 5 (Select Evaluation Method).
- **Về các nhóm Metrics đo lường (Product, Process, Person):**
  - Xem `11. Software Quality Management.pdf` - Slide số 5 (Customer's view) và Slide số 6 (Process, Project, Person metrics).
- **Về QA (Đảm bảo chất lượng) vs QC (Kiểm soát chất lượng):**
  - Xem `11. Software Quality Management.pdf` - Slide số 7.
- **Về "Definition of Done":**
  - Xem `11.1. Agile Quality Management.pdf` - Slide số 3 (Create "Definition of Done").
- **Về Coding Standards, Code Inspection và Unit tests:**
  - Xem `11.1. Agile Quality Management.pdf` - Slide số 1 (Create Coding Standards) và Slide số 2 (Perform Code Inspection, Create Unit Tests).

