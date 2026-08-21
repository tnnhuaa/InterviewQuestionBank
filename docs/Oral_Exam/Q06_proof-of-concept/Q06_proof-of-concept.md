# Câu 06 — Sản phẩm Chứng minh ý tưởng (Proof of Concept)

## 1. Đề bài

**Câu hỏi 6:** Trình bày quá trình hình thành và phương pháp đánh giá sản phẩm Chứng minh ý tưởng (Proof of Concept) của nhóm. 
*(Sinh viên nộp kèm bản in giao diện thể hiện đầu vào và đầu ra khi chạy mã nguồn Chứng minh ý tưởng của nhóm.)*

**Các câu hỏi thường gặp:** 
- Sản phẩm Chứng minh ý tưởng (Proof of Concept) là gì? 
- Giải thích các phương pháp có thể dùng để chứng minh khả năng hoàn thành dự án về mặt kỹ thuật. 
- Nhóm chọn sản phẩm gì để Chứng minh ý tưởng? 
- Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo sản phẩm Chứng minh ý tưởng là gì? 
- Tại sao cần tạo sản phẩm Chứng minh ý tưởng? 
- Sản phẩm Chứng minh ý tưởng của nhóm đã được sử dụng trong quá trình thực hiện dự án như thế nào?

## 2. Dàn ý viết A4 trong 10 phút

1. **Mục tiêu kiểm chứng:** Tính khả thi khi dùng LLM (Gemini AI) trích xuất chủ đề từ Job Description (JD) và map vào Ngân hàng câu hỏi (Question Bank).
2. **Đầu vào:** File JD mẫu (PDF/Image/Text), API key Gemini, Database câu hỏi mẫu.
3. **Cách tạo (5 bước xử lý):** Nhận file -> Gửi AI phân tích -> Nhận topics -> Mapping Database -> Trả kết quả Frontend.
4. **Đầu ra:** Ứng dụng PoC chạy thực tế với Backend (Node.js) và Frontend (React).
5. **Đánh giá:** Upload JD mẫu, kiểm tra tính chính xác của các topics được AI trích xuất và câu hỏi được map.
6. **Cách sử dụng:** Quyết định chọn LLM làm giải pháp cốt lõi cho tính năng "Tạo đề tự động", chốt luồng xử lý kỹ thuật.

## 3. Sản phẩm là gì và nhằm kiểm chứng điều gì?

- **WHAT:** Nhóm đã xây dựng POC có chức năng phân tích file JD (bằng văn bản hoặc hình ảnh) và tự động sinh ra danh sách câu hỏi phỏng vấn tương ứng từ ngân hàng câu hỏi.
- **Kiểm chứng:** 
  - Tính khả thi của việc dùng AI (Gemini) để đọc và trích xuất ý chính (topics) từ các định dạng file JD phức tạp (PDF, Hình ảnh).
  - Khả năng match  chính xác các keyword mà AI trích xuất được với dữ liệu câu hỏi trong Database hệ thống (PostgreSQL).
- **WHY:** Tính năng "Tự động tạo câu hỏi từ JD" là tính năng cốt lõi (Core Feature) mang lại lợi thế cạnh tranh nhưng mang rủi ro kỹ thuật cao chưa từng làm. Nếu không làm PoC, dự án có thể thất bại nếu AI trả về kết quả ảo (hallucination) hoặc tốc độ xử lý quá chậm.
- **Tiêu chí thành công:** Hệ thống đọc được nội dung JD, AI nhận diện được chính xác `job_title` và  các `topics` kỹ thuật có trong JD, sau đó truy xuất được câu hỏi liên quan từ DB.

## 4. Quá trình tạo sản phẩm thực tế

- **Thời điểm:** Thực hiện ở giai đoạn Khởi tạo dự án (Project Initiation).
- **Đầu vào:** Các tài liệu JD mẫu (PDF, PNG).
- **Người tham gia:** Đỗ Nguyễn Minh Trí phụ trách Backend (tích hợp API AI và Database) và Frontend (làm giao diện upload đơn giản).
- **Các bước nhóm đã làm (Dựa trên luồng thực tế của Controller backend):**
  1. **Bước 1:** Xây dựng API nhận input file (JD) từ client .
  2. **Bước 2:** Xử lý file (parse PDF/Base64 Image) và gửi dữ liệu lên AI (Gemini) để phân tích .
  3. **Bước 3:** Nhận lại kết quả từ AI gồm các topics và keywords
  4. **Bước 4:** Áp dụng thuật toán mapping (so khớp) các topics và keywords với database 
  5. **Bước 5:** Nếu khớp thì lưu session đó vào DB và trả kết quả hiển thị về giao diện Frontend.
- **Công cụ:** Node.js, Express, PostgreSQL, Google Gemini API, React (Vite).
- **Đầu ra:** Mã nguồn  có thể chạy thành công trên localhost.
- **Bằng chứng:** Mã nguồn, hình ảnh input và output với các log chi tiết `[Step 1]` đến `[Step 5]`.

## 5. Phương pháp đánh giá

- **Definition of Done  cho PoC:**
  - Hệ thống nhận và đọc được file JD (PDF/PNG/JPEG) không bị lỗi (crash).
  - AI Gemini trích xuất thành công và chính xác các topics cốt lõi.
  - Backend thực hiện truy vấn và mapping thành công các topics này với dữ liệu trong PostgreSQL.
  - Thời gian phản hồi từ lúc upload đến khi hiển thị kết quả dưới 10 giây.
  - Giao diện hiển thị được trực quan danh sách câu hỏi được đề xuất.
- **Người đánh giá:** Các thành viên trong nhóm đóng vai trò người tuyển dụng.
- **Kịch bản đánh giá:** Tải lên các loại JD khác nhau (JD rõ chữ, JD dưới dạng ảnh chụp mờ) và xem phản hồi của hệ thống.
- **Dữ liệu đầu vào:** 3 file JD định dạng PDF, 2 file JD định dạng ảnh (JPEG).
- **Kết quả quan sát được:** AI có khả năng nhận dạng tốt văn bản từ PDF và từ cả ảnh  của Gemini. Tốc độ trả về trung bình mất 3-5 giây.
- **Kết luận đạt/chưa đạt tiêu chí:** Đạt tiêu chí về mặt công nghệ và độ chính xác của từ khóa.
- **Phản hồi và thay đổi sau đánh giá:** Nhận thấy nếu AI không tìm thấy topic, không nên bắt AI tự chế ra câu hỏi (vì sẽ dẫn đến hallucination). Nhóm quyết định chỉ map câu hỏi có sẵn trong DB, nếu không có thì trả về số lượng 0 để người dùng tự bổ sung thủ công (chốt logic trong code).

## 6. Cách nhóm sử dụng kết quả

- Nhóm xác nhận tính khả thi của giải pháp kỹ thuật, từ đó đưa tính năng này vào bản kế hoạch chính thức.
- Xác định được giới hạn: File tải lên phải được giới hạn kích thước (vì parse nội dung đưa vào prompt LLM có giới hạn token).
- Sử dụng chính kiến trúc của PoC này (Nodejs + Gemini + PostgreSQL) làm nền tảng (baseline) để mở rộng cho sản phẩm thực tế.

## 7. Phân biệt với sản phẩm hoàn chỉnh hoặc khái niệm gần

**PoC so với Prototype:**
- **PoC (Chứng minh ý tưởng):** Tập trung vào 1 vấn đề kỹ thuật cụ thể nhằm kiểm chứng "Có làm được không?" (Can we really do it?). Ở dự án này là việc dùng AI tách nội dung JD. Giao diện của PoC làm rất sơ sài cốt để xem kết quả.
- **Prototype (Bản mẫu):** Tập trung vào việc mô phỏng trải nghiệm người dùng (UX) và luồng nghiệp vụ nhằm kiểm chứng "Hệ thống sẽ trông như thế nào và hoạt động ra sao?". Prototype tập trung nhiều vào bề nổi (UI).
- **Sản phẩm hoàn chỉnh:** Là sản phẩm có đầy đủ tính năng, tính bảo mật, khả năng mở rộng, UI/UX mượt mà, sẵn sàng triển khai ra thị trường. PoC là mã nguồn chỉ để tham khảo, không đạt chuẩn chất lượng của sản phẩm hoàn chỉnh.

## 8. Câu hỏi phụ thường gặp

### Sản phẩm Chứng minh ý tưởng (Proof of Concept) là gì?
- **WHAT:** Là quá trình hoặc sản phẩm thử nghiệm nhỏ nhằm chứng minh một lý thuyết, một ý tưởng công nghệ, hoặc một phương pháp có tính khả thi trong thực tế và có thể áp dụng cho dự án.
- **HOW:** Xác định rủi ro công nghệ cốt lõi -> Viết mã nguồn/chạy thử nghiệm tính năng đó một cách tối giản (không quan tâm bảo mật, giao diện) -> Đánh giá kết quả -> Đưa ra quyết định Go/No-go (làm tiếp hay đổi công nghệ).
- **WHY:** Giúp hạn chế rủi ro dự án thất bại ở giai đoạn sau (vì chọn sai công nghệ); tiết kiệm thời gian và chi phí nếu ý tưởng không khả thi.
- **WHEN:** Thực hiện ở giai đoạn sớm của dự án (Initiation hoặc đầu giai đoạn Planning), khi nhóm chưa chắc chắn về một công nghệ hoặc giải pháp mới.

### Các phương pháp có thể dùng để chứng minh khả năng hoàn thành dự án về mặt kỹ thuật?
1. **Proof of Concept (PoC):** Code thử một phần kỹ thuật khó nhất để xem khả năng đáp ứng.
3. **Prototyping:** Xây dựng bản mẫu kiến trúc hoặc giao diện để đánh giá khả năng vận hành trơn tru trước khi code thật. VD: giao diện giúp dev xác định flow-business như nào để viết API hợp lý 
4. **Feasibility Study (Nghiên cứu khả thi):** Đánh giá tổng quan về kỹ thuật dựa trên nghiên cứu tài liệu hoặc sản phẩm tương tự trên thị trường. VD chức năng tìm câu hỏi với JD. Hệ thống có 1 triệu câu hỏi, nếu không nghiên cứu cách tổ trức thì thời gian phản hồi lâu 

## 9. Bản in phải nộp

- [ ] Bản in giao diện frontend của POC khi upload file JD.
- [ ] Bản in kết quả đầu ra (Giao diện hiển thị danh sách câu hỏi AI trả về).
- [ ] Bản in Console (Log terminal backend) thể hiện rõ quá trình chạy 5 steps khi xử lý API `/upload-jd`.

## 10. References (Tài liệu tham khảo)

- **Mục "3. Sản phẩm là gì và nhằm kiểm chứng điều gì?" & "7. Phân biệt với khái niệm gần":** Kiến thức lấy từ `docs/slides/03. Software Project Initiation.pdf`, trang số 2 (Mục "Can We Really Do It? - Prototype vs Proof of Concept"). Slide này nêu rõ PoC dùng để trả lời câu hỏi "Can we really do it?" và giải quyết Problem solving.
- **Mục "4. Quá trình tạo sản phẩm thực tế":** Viết dựa trên mã nguồn thực tế của nhóm tại file `poc_question/backend/src/controllers/jdController.js` (Luồng 5 bước upload, parse file, gọi Gemini AI và lưu DB).
- **Mục "8. Câu hỏi phụ thường gặp":** Các phương pháp chứng minh (PoC, Prototype, Nghiên cứu khả thi) được tham chiếu từ nội dung `docs/slides/03. Software Project Initiation.pdf`, trang số 1 (Mục Objectives - liệt kê các tài liệu: Feasibility study report, Mockup and prototype, Proof of concept).
- **Cấu trúc bài viết:** Dựa hoàn toàn vào các quy tắc và cấu trúc trong `docs/Oral_Exam/template/04-template-san-pham-thuc-nghiem.md` và `docs/Oral_Exam/template/01-template-khai-niem-phuong-phap.md`.
