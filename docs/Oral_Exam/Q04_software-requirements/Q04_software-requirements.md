# Câu 04 - Yêu cầu phần mềm, Product Backlog và tiêu chí chấp nhận

## 1. Câu hỏi trọng tâm

1. Yêu cầu phần mềm, câu chuyện người dùng, Product Backlog và tiêu chí chấp nhận là gì?
2. Nhóm thu thập, phân loại, ưu tiên, ước lượng và kiểm chứng yêu cầu như thế nào?
3. Nhóm viết tiêu chí chấp nhận để có thể kiểm thử ra sao?
4. Yêu cầu chức năng, yêu cầu phi chức năng và quy tắc nghiệp vụ khác nhau thế nào?
5. Nhóm duy trì khả năng truy vết và kiểm soát thay đổi Product Backlog như thế nào?

> Product Backlog là tên chuẩn trong Scrum nên được giữ nguyên. Các thuật ngữ chuyên môn khác được giải thích bằng tiếng Việt ở lần xuất hiện đầu tiên.

## 2. Câu trả lời ngắn theo WHAT - HOW - WHY - WHEN - EVIDENCE

### WHAT - Tài liệu là gì?

- **Yêu cầu phần mềm:** nhu cầu hoặc điều kiện mà sản phẩm phải đáp ứng.
- **Câu chuyện người dùng (User Story):** mô tả ngắn người dùng nào cần gì và nhận được giá trị gì.
- **Tiêu chí chấp nhận (Acceptance Criteria - AC):** điều kiện quan sát được để Product Owner chấp nhận hoặc từ chối một câu chuyện người dùng.
- **Product Backlog:** danh sách công việc sản phẩm được sắp thứ tự, có độ ưu tiên, quan hệ phụ thuộc, ước lượng và trạng thái.
- **Quy tắc nghiệp vụ (Business Rule - BR):** chính sách miền áp dụng cho một hoặc nhiều câu chuyện người dùng.
- **Yêu cầu phi chức năng (Non-functional Requirement - NFR):** thuộc tính chất lượng hoặc ràng buộc có thể đo được, như bảo mật, hiệu năng và độ tin cậy.

### HOW - Nhóm tạo tài liệu như thế nào?

1. Lấy đầu vào từ Project Charter, Vision and Scope, luồng hiện tại/tương lai, prototype, phỏng vấn và ràng buộc kiến trúc.
2. Chuẩn hóa thuật ngữ và vai trò người dùng.
3. Nhóm yêu cầu theo năng lực sản phẩm như JD, Question Bank, Mentor, Booking, Session, Feedback và Operations.
4. Viết câu chuyện người dùng theo cấu trúc vai trò - nhu cầu - giá trị.
5. Xác định quan hệ phụ thuộc và ranh giới bản phát hành.
6. Viết tiêu chí chấp nhận theo Given/When/Then hoặc điều kiện - hành động - kết quả.
7. Liên kết câu chuyện với quy tắc nghiệp vụ, NFR, luồng, bộ kiểm thử và mục tiêu sản phẩm.
8. Development Team ước lượng tương đối bằng Story Point; Product Owner sắp thứ tự theo giá trị, rủi ro và quan hệ phụ thuộc.

### WHY - Vì sao nhóm cần tài liệu này?

- Thống nhất điều sản phẩm phải làm và điều chưa thuộc phạm vi.
- Tạo đầu vào chung cho phát triển, thiết kế giao diện, kiến trúc và kiểm thử.
- Cho phép Product Owner chấp nhận dựa trên kết quả quan sát được thay vì cảm tính.
- Kiểm soát tác động khi phạm vi thay đổi.

### WHEN - Tài liệu được tạo và cập nhật khi nào?

- `0743a68` ngày 13/08/2026: thư mục tài liệu ban đầu được tạo.
- `7ca1f6e` ngày 16/08/2026, PR #6: cập nhật phạm vi và Product Backlog của nhóm.
- `f0292a3` ngày 23/08/2026, PR #23: hòa giải tài liệu dùng chung và chuẩn hóa bản tiếng Anh.
- `fd8a30b` là mốc mã nguồn được dùng cho lần đối chiếu hiện trạng này.

Git chứng minh tài liệu đã thay đổi. Repository không lưu chữ ký hoặc biên bản chứng minh Product Owner, khách hàng hay Sponsor đã chấp nhận chính thức.

### EVIDENCE - Minh chứng nào được dùng?

- Lịch sử Git của Product Backlog.
- Product Backlog, Future-State Workflow và Vision and Scope hiện hành.
- Các mô-đun, tệp chuyển đổi cơ sở dữ liệu, tuyến API và màn hình trong mã nguồn tại `fd8a30b`.
- Kết quả kiểm thử/UAT chỉ được coi là minh chứng chấp nhận khi được lưu riêng và liên kết với AC tương ứng.

## 3. Phạm vi Product Backlog hiện hành

| Phân loại phát hành | Câu chuyện | Story Point | Ý nghĩa |
|---|---|---:|---|
| R1 Must | US-01-US-20 và US-24-US-30 | 134 | 27 câu chuyện bắt buộc trong phạm vi cơ sở |
| R1 Extended | US-21-US-22 | 8 | Chỉ chọn khi phần Must và nguồn dự phòng vẫn an toàn |
| Future/Maybe | US-23 | 8 | Không thuộc cam kết R1 hiện tại |

Story 8 SP thể hiện độ lớn hoặc bất định cao và cần được Development Team cân nhắc tách trước khi đưa vào trạng thái Ready.

## 4. Ví dụ cụ thể: US-30

**Câu chuyện:** Là Học viên (Student), tôi muốn gắn JD hoặc Preparation Plan của mình vào lịch hẹn để Người hướng dẫn (Mentor) nhận đúng ngữ cảnh luyện tập.

**Các tiêu chí chính:**

- Yêu cầu đặt lịch tham chiếu đúng một JD hoặc một kế hoạch thuộc Học viên.
- JD/kế hoạch phải là phiên bản đang hoạt động.
- Các chủ đề được chọn phải là tập con hợp lệ của ngữ cảnh.
- Mentor phải ở trạng thái `APPROVED` và chuyên môn phải giao với chủ đề đã chọn.
- Khung giờ phải còn khả dụng trong cùng giao dịch cơ sở dữ liệu.
- Bản chụp ngữ cảnh chỉ chứa dữ liệu tối thiểu cần cho buổi luyện tập.
- Gửi lại cùng `Idempotency-Key` không được tạo lịch hẹn trùng.
- Truy cập sai chủ sở hữu không được làm lộ tài nguyên; tranh chấp khung giờ trả HTTP `409` cùng hướng chọn giờ khác.

Ví dụ này cho thấy một câu chuyện người dùng phải bao quát hành vi chức năng, bảo mật, quyền riêng tư, tính nhất quán và cách phục hồi khi xảy ra lỗi.

## 5. Cách viết tiêu chí chấp nhận tốt

Tiêu chí tốt phải:

- có kết quả quan sát được và xác định được đạt/không đạt;
- nêu vai trò, điều kiện trước, hành động và kết quả mong đợi;
- bao phủ luồng thành công, dữ liệu sai, thiếu quyền, xung đột và cách phục hồi;
- không khóa chi tiết triển khai nếu kết quả nghiệp vụ không yêu cầu;
- có giới hạn hoặc số đo cụ thể cho hiệu năng và chất lượng;
- tránh các từ mơ hồ như “nhanh”, “dễ dùng” hoặc “an toàn” khi chưa có chuẩn đo.

**Chưa tốt:** “Hệ thống tải JD lên nhanh và an toàn.”

**Tốt hơn:** “Hệ thống chấp nhận một tệp PDF/PNG/JPEG tối đa 10 MB; kiểm tra chữ ký tệp và MIME; PDF tối đa năm trang; tệp rỗng, hỏng, mã hóa hoặc không hỗ trợ bị từ chối trước phân tích với mã lỗi và hướng tải lại/dán văn bản.”

Tiêu chí chấp nhận là hợp đồng kiểm chứng, không phải tuyên bố tính năng đã hoàn thành. Muốn gọi một câu chuyện là Done vẫn cần minh chứng kiểm thử, đánh giá và quyết định chấp nhận phù hợp.

## 6. Quy tắc nghiệp vụ và NFR tiêu biểu

- **BR-02:** một khung giờ chỉ có tối đa một lịch hẹn chiếm chỗ.
- **BR-07:** chỉ câu hỏi `PUBLISHED` có phân loại và nguồn hợp lệ mới được công khai hoặc dùng cho đối sánh.
- **BR-08:** chuyển trạng thái phải được ghi audit; áp dụng các mốc 12 giờ, 24 giờ và 15 phút.
- **BR-12/13:** giới hạn tệp và OCR.
- **BR-16:** đối sánh theo trọng số 40/30/15/15, mức tối thiểu 60 và thứ tự kết quả ổn định.
- **BR-18/19:** ngữ cảnh đặt lịch tối thiểu, đúng chủ sở hữu, bảo vệ quyền riêng tư và thời hạn lưu dữ liệu.
- **NFR-01:** từ chối mặc định nếu chưa có quyền rõ ràng.
- **NFR-03:** khi nhiều yêu cầu cạnh tranh, chỉ một yêu cầu được thắng khung giờ.
- **NFR-10:** recall và precision@10 được đề xuất tối thiểu 80%; khả năng giải thích và tính lặp lại 100% trên bộ dữ liệu đã thống nhất.

Các mục tiêu NFR chỉ được báo cáo là đạt khi có kết quả đo và bộ dữ liệu/rubric được lưu.

## 7. Khả năng truy vết và kiểm soát thay đổi

Ví dụ chuỗi truy vết:

`RQ-11 -> US-24/25/26 -> BR-12/13/14/19 -> AC-24/25/26 -> TC-JD -> NFR-09/11 -> OBJ-02`

Chuỗi này trả lời yêu cầu đến từ đâu, câu chuyện nào triển khai, quy tắc nào ràng buộc và bộ kiểm thử nào kiểm chứng.

Khi thay đổi phạm vi, nhóm phải cập nhật đồng thời câu chuyện/AC, thứ tự/phụ thuộc, ước lượng, ma trận truy vết, prototype/kiến trúc bị ảnh hưởng và tác động phát hành.

## 8. Đối chiếu với mã nguồn tại `fd8a30b`

| Hạng mục | Hiện trạng mã nguồn | Cách trình bày đúng |
|---|---|---|
| US-01-US-20, US-24-US-30 | Có các mô-đun và màn hình chính cho định danh, câu hỏi, JD, Mentor, đặt lịch và vận hành | Có triển khai không đồng nghĩa toàn bộ 27 câu chuyện đã qua UAT hoặc được Product Owner chấp nhận |
| US-21 | Có Dashboard dùng dữ liệu thật | Vẫn được phân loại R1 Extended trong Product Backlog |
| US-22 | Có cấu trúc dữ liệu và xử lý lịch nhắc trong tiến trình nền | Mặc định tắt bằng `BOOKING_REMINDERS_ENABLED=false`; vẫn thuộc R1 Extended |
| US-23 | Có tệp chuyển đổi cơ sở dữ liệu, API và giao diện nhập CSV | Mã nguồn tồn tại nhưng Product Backlog vẫn xếp Future/Maybe |
| Gemini theo ADR-005 | Có phân tích yêu cầu, giải thích gợi ý và bản nháp cho Mentor | Chỉ là lớp hỗ trợ có cờ tính năng, nguồn kết quả, cơ chế dự phòng và bước xác nhận; không thay bộ đối sánh theo quy tắc |
| Kiểm thử tự động | Có Vitest cho một số chính sách, API và hàm phía giao diện | Chỉ là minh chứng kỹ thuật một phần; CI hiện chưa chạy `npm test` |

Nếu muốn chuyển US-21, US-22 hoặc US-23 vào phạm vi cơ sở, Product Owner phải ra quyết định và cập nhật Product Backlog, tác động bản phát hành cùng minh chứng chấp nhận.

## 9. Câu hỏi phụ thường gặp

### Ai ước lượng Story Point?

Development Team ước lượng. Product Owner giải thích giá trị và yêu cầu, sau đó sắp thứ tự Product Backlog; Product Owner không tự áp đặt điểm.

### Độ ưu tiên và quan hệ phụ thuộc khác nhau thế nào?

Độ ưu tiên phản ánh giá trị/rủi ro và do Product Owner quyết định. Quan hệ phụ thuộc cho biết điều kiện kỹ thuật hoặc nghiệp vụ phải có trước. Một câu chuyện ưu tiên cao vẫn có thể bị chặn bởi phụ thuộc.

### AC và Definition of Done khác nhau thế nào?

AC mô tả điều kiện chấp nhận riêng của một câu chuyện. Definition of Done là chuẩn chung gồm đánh giá, kiểm thử/minh chứng, chuyển đổi cơ sở dữ liệu, tài liệu, bảo mật và khả năng phát hành.

## 10. Minh chứng hình ảnh

**Hình Q04-01 - Ranh giới bản phát hành và số liệu Product Backlog.**

![Release boundary and ordered backlog](img/Q04-01-release-boundary.png)

**Hình Q04-02 - Lịch sử thay đổi Product Backlog trong Git.**

![Backlog document history](img/Q04-02-git-history.png)

## 11. Tài liệu in kèm

- [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md).
- [Future-State Workflow](../../Project_Vision_and_Scope/Future_State_Workflow.md).

## 12. Checklist tự học

- [ ] Giải thích được yêu cầu, câu chuyện người dùng, AC, BR và NFR.
- [ ] Nêu đúng 27 Must/134 SP, 2 Extended/8 SP và 1 Future/8 SP.
- [ ] Trình bày được US-30 và một chuỗi truy vết.
- [ ] Phân biệt mã nguồn đã có với câu chuyện đã được nghiệm thu.
- [ ] Nêu đúng lịch sử `0743a68 -> 7ca1f6e -> f0292a3`.
- [ ] Không tuyên bố mục tiêu hoặc UAT chưa có minh chứng là đã đạt.
