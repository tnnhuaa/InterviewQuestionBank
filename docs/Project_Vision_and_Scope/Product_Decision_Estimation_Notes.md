# Nền tảng luyện phỏng vấn — Ghi chú ước lượng quyết định sản phẩm

## 1. Mục đích và trạng thái

Tài liệu ghi lại các con số đường cơ sở lập kế hoạch được chọn để hoàn tất PD-01–PD-08 và giúp backlog đủ cụ thể để tinh chỉnh. Đây là **ước lượng có giả định**, chưa phải kết quả nghiên cứu hay đo kiểm đã quan sát. Mỗi con số chỉ trở thành đường cơ sở thực nghiệm sau khi thực hiện phương pháp kiểm chứng ở mục 4–6 và lưu bằng chứng.

Trách nhiệm tuân theo Project Charter: Hưng (Product Owner/BA) sở hữu quyết định sản phẩm và giả định phạm vi; Gia Thành (PM/Scrum Master, initiation & estimation) điều phối hai estimate và baseline; Hùng (UI/UX) cung cấp bằng chứng trải nghiệm/nghiên cứu; Trí (PoC/E2E) cung cấp bằng chứng kiểm chứng; Luân (Architecture/technical lead) duyệt tác động kiến trúc/ADR; Tuấn Anh (Trưởng nhóm / leadership & governance) điều phối governance, configuration và readiness. Mỗi người chỉ phê duyệt trong thẩm quyền của vai trò chính.

Đường cơ sở áp dụng cho thử nghiệm hẹp: **Thực tập sinh/Lập trình viên Front-end mới vào nghề tại Việt Nam**, trọng tâm JavaScript, TypeScript và React; JD có thể bằng tiếng Việt hoặc tiếng Anh.

## 2. Các con số đã chọn

| Mã | Đường cơ sở lập kế hoạch | Lý do chọn | Đánh đổi / mức tin cậy |
|---|---|---|---|
| PD-01 | 20 JD đã khử dữ liệu nhạy cảm: 12 dùng hiệu chỉnh + 8 dùng kiểm chứng mù; 12 Sinh viên; 4 Cố vấn `APPROVED` tham gia tự nguyện, mỗi người có ≥3 khung giờ; 12 yêu cầu đặt lịch hợp lệ, mục tiêu ≥10 `CONFIRMED` và ≥8 `COMPLETED` | Đủ kiểm tra đầu-cuối và tạo tập giữ lại nhỏ, phù hợp thử nghiệm 8 tuần | Không đại diện toàn bộ thị trường; độ tin cậy thấp–trung bình đối với nhu cầu sản phẩm |
| PD-02 | Mốc tự hủy/đề xuất đổi lịch: trước 12 giờ; tối đa 2 đề xuất/lịch; thời gian chờ vắng mặt: 15 phút; Sinh viên có 24 giờ khiếu nại `COMPLETED`; khiếu nại giữ đánh giá chưa công bố đến quyết định có lưu vết của Quản trị viên | Cân bằng linh hoạt và chi phí điều phối Cố vấn; tránh công bố đánh giá khi hoàn thành còn tranh chấp; chưa có thanh toán nên chưa cần phạt tài chính | Có thể quá cứng với lịch sinh viên; cần đo tỷ lệ hủy/vắng mặt thực tế |
| PD-03 | JD gốc: xóa ≤24 giờ sau khi trích xuất kết thúc; văn bản/yêu cầu/ánh xạ/kế hoạch: 90 ngày từ hoạt động cuối; lịch hẹn/phản hồi/đánh giá/chuyển trạng thái: 180 ngày; xóa dữ liệu hoạt động ≤7 ngày, bản sao lưu ≤30 ngày | Đủ cho một chu kỳ ứng tuyển và đánh giá thử nghiệm, đồng thời giảm lưu dữ liệu nhạy cảm | Có thể thay đổi sau rà soát quyền riêng tư/pháp lý; độ tin cậy trung bình cho thử nghiệm học thuật |
| PD-04 | Cố vấn tạo/cập nhật liên kết họp ngoài hệ thống; khóa sửa thông thường trước 2 giờ; liên kết chỉ hiện cho hai bên từ `CONFIRMED` đến 24 giờ sau buổi gặp; khi nhà cung cấp lỗi, Cố vấn có 15 phút đưa liên kết thay thế, nếu không phải đổi lịch rõ ràng | Tránh tích hợp video và giảm quyền của Sinh viên/Quản trị viên với liên kết | Phụ thuộc thao tác Cố vấn và công cụ ngoài |
| PD-05 | Xác nhận tức thời thuộc Bắt buộc; lời nhắc trước 24 giờ và 1 giờ thuộc US-22 Mở rộng; UTC là nguồn lưu, hiển thị theo múi giờ từng người; gửi một lần + thử lại phút 1 và 5; trạng thái trong ứng dụng/gửi lại thủ công là dự phòng | Giữ đường cơ sở Bắt buộc 134 SP; hai lời nhắc đủ hữu ích nhưng chưa gây quá nhiều thông báo | Cần thử nghiệm A/B hoặc thử nghiệm lớn hơn để quyết định đưa lời nhắc vào Bắt buộc |
| PD-06 | Dán ≤50.000 ký tự; một tệp/JD; PDF/PNG/JPEG ≤10 MB; PDF ≤5 trang; tệp ảnh là một ảnh; không nhận tệp mã hóa, đính kèm nhúng hoặc nhiều tệp | Bao phủ JD phổ biến và giới hạn rủi ro CPU/lưu trữ/bộ phân tích | Không phù hợp hồ sơ năng lực hoặc bộ JD nhiều tệp; có dán văn bản dự phòng |
| PD-07 | OCR tiếng Việt + tiếng Anh; 2 tác vụ đồng thời/tiến trình; hết hạn 60 giây; tối đa 2 lần chạy tự động; p95 ≤45 giây; trích xuất thành công ≥90%; độ chính xác văn bản trực tiếp ≥95%; độ chính xác ký tự OCR ≥85%; độ tin cậy <0,80 phải đánh dấu rà soát | Khả thi cho OCR nội bộ trong thử nghiệm và tạo ngưỡng đo rõ | OCR ảnh xấu có thể không đạt; luôn bắt buộc hiệu chỉnh thủ công |
| PD-08 | Điểm 0–100: khớp chính xác chủ đề/tên đồng nghĩa 40, độ phủ từ khóa yêu cầu 30, phù hợp vai trò 15, phù hợp cấp bậc/độ khó 15; ngưỡng ≥60; tối đa 10 câu/JD và 3 câu/yêu cầu; độ bao phủ yêu cầu ≥80%, precision@10 ≥80%, tính lặp lại/giải thích 100% | Quy tắc đơn giản, ổn định, giải thích được và đúng phạm vi không dùng ML | Có thể bỏ sót tên đồng nghĩa/ngữ nghĩa lạ; chất lượng phân loại và tên đồng nghĩa quyết định kết quả |

## 3. Đường cơ sở năng lực và chi phí đã chấp nhận

| Hạng mục | Cách tính | Đường cơ sở |
|---|---|---:|
| Năng lực danh nghĩa | 6 thành viên × 16 giờ/tuần × 8 tuần | 768 giờ |
| Dự phòng | 768 × 15% | 115,2 giờ |
| Năng lực cho phạm vi | 768 − 115,2 | khoảng 653 giờ |
| R1 Bắt buộc | Tổng Điểm câu chuyện của 27 câu chuyện Bắt buộc | 134 SP |
| Vận tốc cần thiết | 134 SP / 4 sprint | 33,5 SP/sprint |
| Tiền mặt trực tiếp | Tên miền 300.000 + hỗ trợ người tham gia 600.000 | 900.000 VNĐ |
| Dự phòng tiền mặt | 900.000 × 25% | 225.000 VNĐ |
| Trần tiền mặt | Tiền trực tiếp + dự phòng | 1.125.000 VNĐ |

Năng lực không tự chứng minh backlog khả thi. Điểm câu chuyện là kích thước tương đối, không quy đổi trực tiếp sang giờ; 33,5 SP/sprint chỉ là thông lượng cần thiết để so với vận tốc thực tế. Working estimate 606 giờ và guardrail 650 giờ của thành viên 1 được lập từ 20 câu chuyện Bắt buộc cũ; phải cập nhật lại theo 27 câu chuyện/134 SP trước cam kết phát hành.

## 4. Phương pháp hiệu chỉnh số liệu sản phẩm và thử nghiệm

### 4.1 Mẫu khám phá và kiểm thử khả dụng

1. Dùng lấy mẫu có chủ đích để tuyển đúng Thực tập sinh/Lập trình viên Front-end mới vào nghề đang có JD thật; lưu câu hỏi sàng lọc, tiêu chí loại và đồng ý tham gia.
2. Chạy 12 phiên kiểm thử khả dụng theo tác vụ thành hai vòng, mỗi vòng 6 người; sửa nguyên mẫu giữa hai vòng và không đưa thành viên nhóm phát triển vào mẫu.
3. Ghi tỷ lệ hoàn thành tác vụ, thời gian, lỗi/khả năng phục hồi, câu hỏi giải thích ánh xạ và quyết định tự luyện/chọn Cố vấn.
4. Báo cả tử số/mẫu số và khoảng tin cậy Wilson; mẫu 12 chỉ dùng phát hiện lỗi và xu hướng, không dùng khẳng định tỷ lệ thị trường.
5. Sau thử nghiệm, tính phễu `đã gửi JD → đã xác nhận văn bản → đã tạo kế hoạch → đã yêu cầu đặt lịch → đã xác nhận → đã hoàn thành → đã phản hồi`, rồi thay mục tiêu ước lượng bằng đường cơ sở quan sát được.
6. Nếu cần ước lượng tỷ lệ thị trường, tính cỡ mẫu khảo sát bằng công thức Cochran `n0 = z² × p × (1−p) / e²`. Với độ tin cậy 95% (`z=1,96`), chưa biết tỷ lệ (`p=0,5`) và sai số ±10% (`e=0,10`), cần khoảng 97 phản hồi hợp lệ; dùng hiệu chỉnh quần thể hữu hạn nếu biết tổng quần thể.

### 4.2 Kiểm chứng chính sách đặt lịch

1. Gắn sự kiện đo cho mọi lần hủy/đổi lịch/vắng mặt, gồm tác nhân, thời điểm so với buổi gặp, lý do và kết quả; không lưu nội dung JD.
2. Sau tối thiểu 12 lịch hẹn, lập biểu đồ phân bố số giờ báo trước và phỏng vấn Sinh viên/Cố vấn về mốc 12 giờ.
3. Giữ mốc nếu ≥80% trường hợp hợp lệ tự xử lý được và không tạo khiếu nại nghiêm trọng; nếu không, so sánh phương án 6/12/24 giờ trong buổi rà soát với Vận hành.
4. Kiểm tra mọi khiếu nại `COMPLETED` và ca `NO_SHOW`; nếu khối lượng xử lý của Quản trị viên vượt 20% lịch hẹn thì đơn giản hóa bằng chứng hoặc bổ sung xác nhận của bên còn lại.

### 4.3 Kiểm chứng lời nhắc

1. Ghi phiên bản lời nhắc, thời điểm dự kiến/đã gửi/đã nhận/thất bại, múi giờ và kết quả lịch hẹn.
2. Trong thử nghiệm nhỏ, phân bổ luân phiên hai phương án “24 giờ + 1 giờ” và “chỉ 1 giờ” để tìm tín hiệu, nhưng không tuyên bố có ý nghĩa thống kê.
3. Khi có mẫu đủ lớn, thực hiện thử nghiệm A/B với chỉ số chính `COMPLETED / CONFIRMED`; chỉ số bảo vệ gồm hủy đăng ký/khiếu nại và lỗi gửi.
4. Trước thử nghiệm A/B, phân tích lực kiểm định bằng tỷ lệ hoàn thành quan sát được, mức thay đổi nhỏ nhất cần phát hiện do PO chọn, α=0,05 và lực kiểm định 0,80 để tính số lịch hẹn mỗi nhánh.
5. Chỉ thay nhịp lời nhắc sau khi có kích thước ảnh hưởng, khoảng tin cậy, phép tính cỡ mẫu và PO/Vận hành rà soát.

### 4.4 Rà soát quyền riêng tư, cuộc họp và lưu giữ dữ liệu

1. Lập danh mục dữ liệu cho từng trường/đối tượng: mục đích, chủ sở hữu, tác nhân được xem, nơi lưu, mức lộ trong nhật ký, thời hạn lưu và đường lan truyền khi xóa.
2. Tổ chức hội thảo quyền riêng tư/mô hình mối đe dọa với PO, Kiến trúc, Bảo mật và Nhà tài trợ; kiểm tra giảm thiểu dữ liệu, phân quyền đối tượng, cô lập bộ phân tích và hết hạn sao lưu.
3. Diễn tập xóa trên một bộ dữ liệu Sinh viên: gửi yêu cầu xóa, kiểm tra cơ sở dữ liệu/kho đối tượng đang hoạt động trong 7 ngày và vòng quay sao lưu trong 30 ngày.
4. Diễn tập bàn giấy khi nhà cung cấp họp bị gián đoạn tại các mốc trước 2 giờ, đúng giờ và quá 15 phút; xác nhận liên kết thay thế/đổi lịch, thông báo và lưu vết không tạo trạng thái ngầm.
5. Chỉ thay mốc 24 giờ/90 ngày/180 ngày khi rà soát mục đích dữ liệu chứng minh cần giữ lâu hơn hoặc rà soát quyền riêng tư/pháp lý yêu cầu ngắn hơn.

## 5. Phương pháp tạo bộ dữ liệu và đo trích xuất/ánh xạ

### 5.1 Bộ JD có nhãn

1. Thu 20 JD hợp pháp, khử tên người, email, điện thoại và thông tin công ty không cần thiết; cân bằng văn bản dán, PDF có chữ, PNG/JPEG và PDF quét bằng tiếng Việt/Anh.
2. Tách cố định 12 JD hiệu chỉnh và 8 JD kiểm chứng mù trước khi chỉnh quy tắc; không dùng tập mù để chỉnh trọng số/tên đồng nghĩa.
3. Hai người rà soát độc lập gắn nhãn vai trò, cấp bậc, yêu cầu, chủ đề đã chuẩn hóa và câu hỏi liên quan; lưu hướng dẫn và điểm bất đồng.
4. Tính hệ số Cohen’s kappa cho nhãn phân loại, mục tiêu ≥0,70; bất đồng do PO/người duyệt Nội dung phân xử và tạo phiên bản nhãn chuẩn mới.

### 5.2 Đo kiểm trích xuất

1. Tạo văn bản chuẩn bằng hai lượt chép thủ công.
2. Tính `CER = (số ký tự thay thế + xóa + chèn) / số ký tự chuẩn`; độ chính xác ký tự là `1 − CER`.
3. Báo riêng PDF trích xuất trực tiếp và OCR theo nguồn/ngôn ngữ; không lấy trung bình để che nhóm yếu.
4. Chạy mỗi mẫu ít nhất ba lần; đo tỷ lệ thành công, thời lượng p50/p95, thử lại và bộ nhớ/CPU; kiểm thử tệp hỏng, mã hóa, giả MIME và tệp >10 MB.
5. Đạt khi đầu vào hỗ trợ thành công ≥90%, độ chính xác trực tiếp ≥95%, OCR ≥85%, p95 ≤45 giây và mọi lỗi đều có dán/sửa thủ công dự phòng.

### 5.3 Đo kiểm ánh xạ

1. Mỗi câu hỏi được hai người rà soát chấm liên quan/không liên quan theo yêu cầu của từng JD; người gắn nhãn không thấy điểm hệ thống.
2. Tính `precision@10 = số câu liên quan trong 10 kết quả đầu / số câu được trả về trong 10 kết quả đầu`.
3. Tính `độ bao phủ yêu cầu = số yêu cầu mong đợi được phát hiện / tổng yêu cầu mong đợi`.
4. Chạy lại cùng văn bản hiệu chỉnh + phiên bản phân loại/tên đồng nghĩa/quy tắc và so mã băm kết quả theo thứ tự; tính lặp lại phải đạt 100%.
5. Chỉ chấp nhận đường cơ sở khi tập mù đạt độ bao phủ yêu cầu ≥80%, precision@10 ≥80%, 100% kết quả có nguồn/chủ đề/lý do/phiên bản và không có câu hỏi `DRAFT`.

## 6. Phương pháp hiệu chỉnh ước lượng, năng lực và chi phí

1. Nhóm phát triển thực hiện Planning Poker cho từng câu chuyện sau khi đạt Định nghĩa Sẵn sàng; dùng Fibonacci 1/2/3/5/8 và tách câu chuyện 8 SP nếu còn nhiều nguồn bất định.
2. Sau 2–3 sprint, tính khoảng vận tốc từ SP đã hoàn thành và chấp nhận, không tính phần làm dở; dùng vận tốc chậm/nhanh để dựng đường “chắc chắn có/có thể có”.
3. Theo dõi công sức thực tế theo luồng công việc để kiểm tra năng lực khoảng 653 giờ, nhưng không dùng giờ để sửa Điểm câu chuyện bằng công thức cố định; đồng thời cập nhật cả hai estimate độc lập khi phạm vi thay đổi từ 20 lên 27 câu chuyện Bắt buộc.
4. Người sở hữu chi phí thu trang giá/báo giá chính thức có ngày truy cập cho tên miền, máy chủ/lưu trữ, email và công cụ OCR nếu thay đường cơ sở nội bộ.
5. Dự báo lại mỗi sprint; bắt buộc có yêu cầu thay đổi nếu dự báo vượt 8 tuần, khoảng 653 giờ hoặc 1.125.000 VNĐ.

## 7. Bằng chứng bắt buộc trước khi thay ước lượng

- Câu hỏi sàng lọc tuyển người, đồng ý tham gia và danh sách mẫu đã khử định danh.
- Danh mục bộ JD có nhãn, hướng dẫn gắn nhãn, mức thống nhất giữa người duyệt và phiên bản nhãn chuẩn.
- Báo cáo đo kiểm trích xuất, mã băm mẫu, môi trường/cấu hình và số đo tổng hợp gốc.
- Báo cáo đánh giá ánh xạ với ví dụ nhầm lẫn, độ bao phủ, precision@10 và mã băm kiểm tra lặp lại.
- Kịch bản khả dụng, kết quả tác vụ, ghi chú quan sát và mức nghiêm trọng của vấn đề.
- Định nghĩa sự kiện đặt lịch/lời nhắc, bảng theo dõi/bản xuất và bản ghi quyết định.
- Bản ghi Planning Poker, khoảng vận tốc sprint, công sức/chi phí thực tế và dự báo lại.
- Bản ghi phê duyệt tương ứng của PO, Kiến trúc, Quyền riêng tư/Vận hành và Nhà tài trợ.

## 8. Nguyên tắc áp dụng

- Quy tắc nghiệp vụ phải có mã, nguồn và khả năng thay đổi.
- Backlog phải đầy đủ và Product Owner ưu tiên giá trị trước.
- Điểm câu chuyện là kích thước tương đối và dùng Fibonacci/Planning Poker.
- Kế hoạch theo ngày cố định cần khoảng vận tốc và đường “chắc chắn có/có thể có”.
- Chất lượng phải có số đo, phương pháp đánh giá và chuẩn so sánh.
