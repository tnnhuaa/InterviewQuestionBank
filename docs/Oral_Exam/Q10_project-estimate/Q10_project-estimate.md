# Câu 10 - Ước lượng dự án

## 1. Đề chính thức và phạm vi trả lời

> Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Ước lượng dự án (Project Estimate) của nhóm.

**Bản in đề yêu cầu:** tài liệu Ước lượng dự án của nhóm.

Ngoài số liệu của nhóm, đề yêu cầu giải thích phân rã/tái kết hợp, xử lý hạng mục chưa thể phân rã, độ bất định đầu dự án, lợi ích của ước lượng kích cỡ, quy tắc Đếm - Tính toán - Đánh giá, kỹ thuật tăng độ chính xác của đánh giá chủ quan và Planning Poker.

## 2. Nguồn tài liệu

Phần trả lời sử dụng số liệu từ các tài liệu ước lượng chung của nhóm. Các số liệu được dẫn lại đúng theo nguồn, không được trình bày như kết quả tính mới hoặc thành tích của một cá nhân.

Nguồn chính:

- `Estimation_Comparison.md`;
- `Cost_Time_Resources.md`;
- `ResourcePlan.md`;
- Product Backlog hiện hành.

## 3. Câu trả lời theo WHAT - HOW - WHY - WHEN - EVIDENCE

### WHAT - Ước lượng dự án là gì?

Ước lượng dự án là dự báo có căn cứ về quy mô, công sức, thời gian và chi phí cần thiết để hoàn thành một phạm vi xác định. Ước lượng không phải cam kết. Cam kết chỉ hình thành sau khi phạm vi, năng lực nhóm, rủi ro và người có thẩm quyền cùng chấp thuận.

### HOW - Nhóm đã ước lượng như thế nào?

Nhóm dùng hai phương pháp độc lập:

1. **Từ trên xuống theo tham số (Top-down parametric):** đếm 20 câu chuyện Must của phạm vi lịch sử, nhân hệ số 26 giờ/câu chuyện, điều chỉnh độ phức tạp, chi phí hoạt động chung và 15% dự phòng.
2. **Từ dưới lên kết hợp ba điểm (Bottom-up + Three-point):** chia công việc theo nhóm chức năng; với mỗi nhóm dùng công thức PERT `E = (O + 4M + P) / 6`, sau đó cộng 15% dự phòng.

Trong công thức PERT:

- `O` là trường hợp lạc quan;
- `M` là trường hợp có khả năng nhất;
- `P` là trường hợp bi quan;
- `E` là công sức kỳ vọng.

Sau khi tính, nhóm so sánh chéo hai phương pháp, kiểm tra với năng lực 6 người/8 tuần, rà soát phạm vi và giả định, rồi ghi điều kiện phải ước lượng lại. Đây là phương pháp đánh giá tài liệu; chênh lệch nhỏ giữa hai cách không tự chứng minh ước lượng đúng nếu cả hai cùng dùng phạm vi cũ hoặc giả định sai.

### WHY - Vì sao dùng hai phương pháp?

- Phương pháp từ trên xuống nhanh và tạo mức trần để cảnh báo.
- Phương pháp từ dưới lên có khả năng truy vết tốt hơn đến từng nhóm công việc.
- So sánh độc lập giúp phát hiện bỏ sót hoặc đếm trùng.
- Khoảng chênh cho thấy mức bất định thay vì tạo ảo giác về một con số tuyệt đối.

### WHEN - Khi nào ước lượng được tạo và cần cập nhật?

- Baseline khởi tạo được ghi trong commit `dfdaf1c` ngày 16/08/2026.
- Các tài liệu dùng chung được hòa giải trong `f0292a3` ngày 23/08/2026.
- Cần ước lượng lại khi phạm vi đổi, rủi ro kỹ thuật thay đổi, năng lực thực tế khác kế hoạch hoặc dự báo vượt giới hạn thời gian/chi phí.

### EVIDENCE - Minh chứng nào được dùng?

- Bảng công thức và kết quả của hai phương pháp.
- Kế hoạch nguồn lực 6 người, 16 giờ/người/tuần, 8 tuần.
- Baseline chi phí tiền mặt và giá trị công lao động.
- Lịch sử Git của các tài liệu ước lượng.

## 4. Kết quả hai phương pháp

| Chỉ tiêu | Từ trên xuống | Từ dưới lên + ba điểm |
|---|---:|---:|
| Công sức trước dự phòng | 565 giờ | 527 giờ |
| Dự phòng 15% | 85 giờ | 79 giờ |
| Tổng ước lượng | **650 giờ** | **606 giờ** |
| Thời lượng tham chiếu | 8,0 tuần | 7,4 tuần |
| Phần còn lại so với năng lực khoảng 653 giờ | 3 giờ | 47 giờ |

Chênh lệch là 44 giờ, tương đương 7,3% so với ước lượng từ dưới lên. Nhóm dùng 606 giờ làm dự báo làm việc vì có khả năng truy vết tốt hơn và dùng 650 giờ làm mức cảnh báo thận trọng.

## 5. Năng lực và chi phí kế hoạch

| Thành phần | Giá trị |
|---|---:|
| Năng lực danh nghĩa | `6 x 16 x 8 = 768` giờ |
| Dự phòng năng lực 15% | 115 giờ |
| Năng lực dành cho phạm vi | khoảng 653 giờ |
| Trần tiền mặt trực tiếp | 1.125.000 VND |
| Giá trị công lao động tham chiếu | 30.300.000 VND |
| Tổng giá trị kinh tế kế hoạch | 31.425.000 VND |

Mức 50.000 VND/giờ là giả định học thuật do nhóm đặt ra, không phải mức lương hoặc báo giá thị trường. Chi phí tiền mặt và giá trị công lao động phải được trình bày riêng.

## 6. Giới hạn quan trọng

Hai con số 606/650 giờ được tính từ phạm vi cơ sở lịch sử có 20 câu chuyện Must. Product Backlog hiện có 27 câu chuyện R1 Must với 134 SP. Vì vậy:

- 606/650 giờ chỉ là dự báo lịch sử, chưa phải cam kết cho backlog hiện tại;
- không được coi 47 giờ còn lại là ngân sách để thêm tính năng;
- cần cập nhật WBS/PERT theo phạm vi mới, tinh chỉnh lại Product Backlog và hiệu chỉnh Story Point trước khi đưa hạng mục vào Ready hoặc tái thiết lập đường cơ sở phát hành;
- dự báo vượt khoảng 653 giờ hoặc 8 tuần phải dẫn đến tái ước lượng, cắt phạm vi Extended/Future hoặc quyết định của Product Owner/Sponsor.

## 7. Câu hỏi phụ thường gặp trong đề

### Tài liệu Ước lượng dự án phải trả lời gì?

- Phạm vi/đường cơ sở nào được ước lượng và phần nào bị loại trừ?
- Kích cỡ, công sức, thời lượng, nguồn lực và chi phí dự báo là bao nhiêu?
- Phương pháp, dữ liệu, giả định, dự phòng và mức bất định là gì?
- Ai tạo/xem xét ước lượng, khi nào phải ước lượng lại và kết quả được dùng cho quyết định nào?

### Đầu vào và các bước nhóm đã dùng là gì?

Đầu vào gồm Product Backlog lịch sử, nhóm chức năng/WBS, số người và thời gian sẵn có, giả định 26 giờ/story, ba điểm O-M-P, dự phòng 15%, chi phí trực tiếp và đơn giá học thuật. Nhóm khóa phạm vi, chọn hai phương pháp độc lập, tính từng phương pháp, so sánh 606/650 giờ, đối chiếu năng lực khoảng 653 giờ, ghi giới hạn và đặt trigger tái ước lượng.

### Tài liệu được đánh giá, sử dụng và cập nhật thế nào?

- Kiểm tra số học và đơn vị; không trộn giờ công, thời lượng lịch và Story Point.
- So sánh top-down với bottom-up để tìm bỏ sót/đếm trùng.
- Đối chiếu năng lực, lịch 8 tuần và đường cơ sở chi phí.
- Kiểm tra phạm vi: số 606/650 dùng 20 Must story, trong khi backlog hiện hành có 27 Must/134 SP.
- Xem xét giả định, rủi ro, dự phòng và người thực hiện; sau mỗi mốc so số thực tế với ước lượng để hiệu chỉnh.
- Dùng kết quả cho quyết định phạm vi, nguồn lực, lịch và cảnh báo; ước lượng lại khi phạm vi, năng lực, nhà cung cấp hoặc rủi ro đổi.

Repository chưa có bảng giờ công/số liệu thực tế hoàn chỉnh nên chưa tính được sai số tương đối (Magnitude of Relative Error - MRE) cho toàn dự án. Vì vậy không được gọi 606 giờ là dự báo đã được kiểm chứng bằng số liệu thực tế.

### Giải thích các phương pháp phân rã tính năng lớn

- **Theo hành trình/nghiệp vụ:** tách từng bước có giá trị, ví dụ tải JD -> sửa/xác nhận -> phân tích -> đối sánh -> lập kế hoạch.
- **Theo quy tắc nghiệp vụ:** tách luồng thành công, quyền, xung đột, phục hồi và nhật ký kiểm toán.
- **Theo dữ liệu/CRUD:** tách tạo, xem, cập nhật, lưu trữ khi mỗi phần tạo giá trị độc lập.
- **Theo kênh/biến thể:** văn bản trước, PDF/ảnh/OCR sau; một vai trò hoặc một loại thông báo trước.
- **Theo mức rủi ro:** thực hiện khảo sát kỹ thuật có giới hạn thời gian (spike)/PoC cho OCR, nhà cung cấp hoặc xử lý đồng thời trước phần triển khai đầy đủ.
- **Theo lớp công việc:** API, database, UI, migration, operation và evidence; dùng để lập WBS nhưng không nên biến thành các User Story không có giá trị người dùng.

Mục tiêu là tạo khoảng 5-10 hạng mục đủ độc lập để hưởng lợi từ việc sai số có thể bù trừ. Ở mức tác vụ, nên tách công việc về cỡ không quá khoảng hai ngày, nhưng vẫn phải cộng tích hợp, xem xét, tài liệu và thời gian chờ.

### Khi chưa thể phân rã thì làm gì?

Không ép một con số chính xác giả tạo. Nhóm cần ghi đây là epic có bất định cao, làm khảo sát kỹ thuật/PoC có giới hạn thời gian, làm rõ yêu cầu/kiến trúc, dùng ước lượng tương tự hoặc đánh giá chuyên gia có cấu trúc, đưa khoảng O-M-P và dự phòng rủi ro, rồi ước lượng lại trước khi kéo hạng mục vào Ready hoặc cam kết phát hành.

### Ước lượng đầu dự án có thể sai bao nhiêu lần?

Theo mô hình Nón bất định (Cone of Uncertainty), ở thời điểm rất sớm một dự báo có thể chỉ bằng khoảng `0,25x` hoặc lên tới khoảng `4x` kết quả cuối: sai lệch tới bốn lần theo mỗi phía, tương đương tỷ lệ 16 lần giữa hai cực. Đây là phạm vi tham khảo, không phải định luật tự thu hẹp. Nón chỉ hẹp khi nhóm loại bỏ biến thiên bằng quyết định, khám phá, prototype, dữ liệu thực tế và kiểm soát thay đổi.

### Tại sao vẫn cần ước lượng sớm?

Ước lượng sớm giúp kiểm tra mục tiêu có khả thi, so phương án, lập ngân sách/lịch, nhận diện rủi ro và quyết định phạm vi trước khi chi phí thay đổi tăng cao. Vì bất định lớn, kết quả sớm phải là range kèm giả định và mốc tái ước lượng, không phải cam kết cứng.

### Kích cỡ (Size) có ích gì khi quản lý quan tâm Duration và Cost?

Size là đầu vào tương đối ổn định hơn để suy ra effort dựa trên năng suất lịch sử; effort kết hợp số người/lịch làm việc mới cho duration, và effort kết hợp đơn giá/tài nguyên mới cho cost. Size còn cho phép so productivity (`size/effort`) và quality (`defects/size`) giữa các mốc. Nếu bỏ size và chỉ đo thời gian, nhóm khó phân biệt chậm do sản phẩm lớn hơn với chậm do năng suất thấp hơn.

### Quy tắc “Đếm, Tính toán và Đánh giá” là gì?

1. **Đếm (Count) nếu có thể:** đếm story, use case, screen, report, table hoặc work package rõ ràng.
2. **Tính toán (Compute) khi không thể đếm trực tiếp:** dùng dữ liệu lịch sử để chuyển số lượng/kích cỡ thành effort, duration hoặc cost.
3. **Đánh giá (Judge) chỉ khi thiếu dữ liệu:** dùng structured expert judgment, công khai giả định/range và lập kế hoạch thu thập actual.

Trong ước lượng lịch sử của PrepVI, số story là phần đếm; 26 giờ/story và PERT là phần tính toán dựa trên giả định/đánh giá có cấu trúc. Do thiếu historical actual, các hệ số chưa phải mô hình đã hiệu chỉnh.

### Làm sao tăng độ chính xác của đánh giá chủ quan?

- để người trực tiếp làm việc tham gia ước lượng;
- dùng nhiều ước lượng độc lập trước khi thảo luận để tránh neo số;
- cung cấp cùng scope, Definition of Done và giả định;
- dùng analogy/reference class và dữ liệu đã ghi thay vì chỉ nhớ;
- dùng range hoặc O-M-P/PERT thay vì một điểm “best case”;
- dùng moderator, time-box, ghi outlier/risk và lặp vòng như Wideband Delphi;
- so estimate với actual/MRE sau khi xong để hiệu chỉnh người và mô hình.

### Làm sao tăng độ chính xác của “Phân rã và Kết hợp”?

1. Khóa phạm vi và Definition of Done.
2. Tách thành 5-10 work package rồi nhỏ tiếp các task lớn hơn khoảng hai ngày.
3. Ước lượng độc lập từng phần với người thực hiện, range/PERT và assumption.
4. Thêm rõ integration, QA, documentation, deployment, communication, wait time và cross-cutting work.
5. Kiểm tra dependency, phần thiếu và phần đếm trùng trước khi cộng.
6. Cộng bottom-up, thêm contingency theo rủi ro và so chéo với top-down/capacity.
7. Theo dõi actual ở cùng cấu trúc WBS để tái kết hợp và hiệu chỉnh.

### Planning Poker hoạt động thế nào?

1. Product Owner trình bày story/AC; nhóm hỏi để thống nhất phạm vi và DoD.
2. Chọn story mốc và thang tương đối, thường `1, 2, 3, 5, 8, 13`.
3. Mỗi người chọn lá bài bí mật; mọi người lật đồng thời để tránh ảnh hưởng/neo số.
4. Người chọn cao và thấp giải thích assumption/risk, không biểu quyết theo số đông và không để nhiều junior “thắng phiếu” một senior.
5. Nhóm làm rõ hoặc tách story, rồi bỏ phiếu lại đến khi đạt đồng thuận đủ dùng.
6. Story quá lớn/không rõ phải tách hoặc khảo sát kỹ thuật; Story Point là kích cỡ tương đối, không đổi thẳng thành giờ nếu chưa có dữ liệu hiệu chỉnh.

### Ước lượng và cam kết khác nhau thế nào?

Estimate là dự báo có thể thay đổi khi có dữ liệu mới. Commitment là thỏa thuận giao một phạm vi trong giới hạn đã được phê duyệt.

### Tại sao có cả dự phòng năng lực và dự phòng công sức?

Dự phòng năng lực bảo vệ tổng thời gian sẵn có của nhóm. Dự phòng công sức được cộng vào dự báo công việc. Không được cộng/chuyển chúng thành phạm vi mới nếu chưa phân tích để tránh đếm dự phòng hai lần.

### Story Point có đổi trực tiếp sang giờ không?

Không. Story Point là thước đo tương đối về độ lớn, phức tạp và bất định. Với Kanban, nhóm ưu tiên dữ liệu thực nghiệm về thông lượng, thời gian chu trình, thời gian hoàn thành và WIP để dự báo. Repository hiện chưa lưu đủ dữ liệu lịch sử này, nên không được đổi trực tiếp Story Point sang giờ hoặc xem điểm mỗi tuần là tốc độ thực tế.

## 8. Minh chứng hình ảnh

**Hình Q10-01 - Tài liệu so sánh hai phương pháp ước lượng được mở trực tiếp trên GitHub.**

![Estimation Comparison trên GitHub](img/Q10-01-estimation-comparison-github.png)

**Hình Q10-02 - Baseline chi phí, thời gian và nguồn lực được mở trực tiếp trên GitHub.**

![Cost Time Resources trên GitHub](img/Q10-02-cost-baseline-github.png)

## 9. Tài liệu in kèm

- [Project Estimation Report](Project_Estimation_Report.md).
- [Estimation Comparison](../../Project_Resource_Plan/Estimation_Comparison.md).
- [Cost, Time and Resources](../../Project_Resource_Plan/Cost_Time_Resources.md).
- [Resource Plan](../../Project_Resource_Plan/ResourcePlan.md).

## 10. Dàn ý trả lời trong 10 phút trên giấy A4

1. Định nghĩa ước lượng và phân biệt mục tiêu/cam kết.
2. Nêu đầu vào và hai phương pháp của nhóm, công thức PERT.
3. Ghi bảng 650 vs 606 giờ, chênh 44 giờ/7,3%, capacity khoảng 653 giờ.
4. Trình bày cách đánh giá: kiểm tra số học, so chéo hai phương pháp, năng lực/chi phí/phạm vi và điều kiện tái ước lượng.
5. Nêu giới hạn 20 Must cũ so với 27 Must/134 SP hiện tại.
6. Giải thích Cone `0,25x-4x`, lợi ích size và Count-Compute-Judge.
7. Giải thích phân rã/tái kết hợp và khi phải khảo sát kỹ thuật.
8. Trình bày Planning Poker và chỉ bản in/bằng chứng GitHub.

## 11. Checklist tự học

- [ ] Nêu được hai phương pháp và công thức PERT.
- [ ] Nhớ 650 giờ, 606 giờ, chênh 44 giờ/7,3% và năng lực khoảng 653 giờ.
- [ ] Phân biệt ước lượng với cam kết.
- [ ] Giải thích được vì sao số liệu phải cập nhật cho 27 câu chuyện/134 SP.
- [ ] Không gọi giả định 50.000 VND/giờ là lương thực tế.
- [ ] Giải thích được Cone `0,25x-4x`, Count-Compute-Judge và lợi ích của Size.
- [ ] Nêu được phân rã/tái kết hợp, đánh giá chuyên gia có cấu trúc và Planning Poker.
