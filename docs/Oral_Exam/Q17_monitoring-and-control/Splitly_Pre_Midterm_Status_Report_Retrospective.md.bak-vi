# Báo cáo trạng thái hồi cứu — Splitly trước giữa kỳ

## 1. Thông tin báo cáo

| Thuộc tính               | Nội dung                                                  |
| ------------------------ | --------------------------------------------------------- |
| Dự án                    | Splitly — Smart Expense Sharing Platform                  |
| Kỳ báo cáo được tái dựng | 13/07–19/07/2026, tuần trước buổi giữa kỳ ngày 24/07/2026 |
| Ngày lập hồi cứu         | 23/08/2026                                                |
| Người tổng hợp           | Tuấn Anh                                                  |
| Trạng thái tổng thể      | **At Risk (Vàng)**                                        |

> **Disclosure:** Nhóm không lập status report tại thời điểm 13/07–19/07. Báo cáo này được tái dựng ngày 23/08 từ bộ tài liệu Splitly mà nhóm xác nhận đã dùng trước giữa kỳ và từ diễn biến sau buổi trình bày. Báo cáo không thay thế snapshot board, timesheet hoặc biên bản được lập tại thời điểm đó.

## 2. Tóm tắt điều hành

Đến tuần trước giữa kỳ, Splitly đã có phần lớn baseline ở mức tài liệu: Project Charter đề ngày 15/07, Proposal đề ngày 16/07, cùng Vision & Scope, backlog, acceptance criteria, workflow, prototype, architecture, Resource Plan, Cost–Time–Resources và Feasibility Study [S1–S9]. Những artifact này làm rõ bài toán chia hóa đơn, phạm vi MVP và hướng kỹ thuật.

Tuy nhiên, các nguồn đều mô tả Splitly là dự án mới hoặc proposed baseline; chúng không chứng minh tính năng đã hoàn thành [S1, S3, S4]. Nhóm cũng chưa có board lịch sử, timesheet hoặc test result để tính phần trăm hoàn thành thực tế. Vì vậy, trạng thái trước giữa kỳ được đánh giá là **At Risk**: planning đã hình thành nhưng tính hấp dẫn của ý tưởng, mức sẵn sàng sử dụng và mô hình duy trì sản phẩm chưa được kiểm chứng đủ mạnh.

## 3. Phạm vi và đầu ra đã hình thành

| Nhóm đầu ra                   | Trạng thái có thể chứng minh                                                                                      | Nguồn             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------- |
| Project initiation            | Charter 1.0 ở trạng thái proposed baseline, pending approval; sponsor ghi Naver nhưng PM/PO và các chữ ký còn TBD | [S1]              |
| Business proposal             | Proposal 2.0 draft mô tả vấn đề, công cụ hiện có, đối thủ, market gap và giá trị đề xuất                          | [S2]              |
| Product baseline              | Vision, phạm vi MVP, backlog 21 User Story và acceptance criteria đã được mô tả                                   | [S3], [S4]        |
| Workflow và prototype         | Có current/future workflow và prototype cho luồng nhập hóa đơn thủ công lẫn Gemini-assisted                       | [S5], [S6]        |
| Technical planning            | Kiến trúc modular monolith, React/Node/MongoDB và các adapter Gemini/VietQR/email đã được đề xuất                 | [S7]              |
| Resource, cost và feasibility | Có kế hoạch sáu thành viên, capacity, chi phí dự kiến và kết luận Conditional Go                                  | [S8], [S9], [S10] |

Các trạng thái trên phản ánh mức độ hoàn thiện của tài liệu. Không có đủ bằng chứng để chuyển chúng thành tỷ lệ hoàn thành phần mềm hoặc khẳng định MVP đã chạy end-to-end.

## 4. Đánh giá kế hoạch so với bối cảnh thực tế

| Khía cạnh          | Kế hoạch trong tài liệu Splitly                                                                                                    | Đánh giá hồi cứu                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Thời gian          | Mười tuần, 120 person-days/960 giờ [S1, S8, S9]                                                                                    | Không khớp cửa sổ học phần tám tuần 29/06–23/08 mà nhóm đã xác nhận. Baseline cần được reconcile trước khi dùng để cam kết delivery.    |
| Phạm vi            | Authentication, group, ba cách chia bill, Gemini OCR, VietQR, payment confirmation, reminder, notification và history [S1, S3, S4] | Phạm vi lớn so với thời gian và chưa có actual tracking để chứng minh khả năng hoàn thành.                                              |
| Chi phí            | USD 360 cho sáu tài khoản Codex Plus, trần USD 432 [S1, S9]                                                                        | Đây là forecast, không phải actual cash. Tài liệu chưa có chứng từ hoặc actual cost.                                                    |
| Khả thi kỹ thuật   | Feasibility Study kết luận Conditional Go nếu bảo vệ MVP, làm PoC sớm và giữ manual fallback [S10]                                 | Có hướng kiểm soát kỹ thuật, nhưng các go/no-go gate chưa có kết quả thực thi trong bộ tài liệu.                                        |
| Khả thi thị trường | Proposal lập luận cho luồng receipt-to-settlement và VietQR [S2]                                                                   | Chưa có bằng chứng người dùng thật sẵn sàng đổi từ note/chat/calculator hoặc tải sản phẩm; revenue/sustainability chưa được chứng minh. |

## 5. Issue và risk quan trọng

1. **Business-value risk:** lợi ích của một ứng dụng riêng chưa vượt rõ chi phí người dùng phải mở web/app và nhập bill, trong khi họ có thể ghi nhanh ai nợ ai bao nhiêu.
2. **Adoption risk:** chưa có người dùng thật tải hoặc dùng sản phẩm; proposal mới dừng ở lập luận và benchmark đối thủ.
3. **Sustainability risk:** nhóm dự kiến cung cấp miễn phí nhưng chưa xác định nguồn thu hoặc lý do duy trì sản phẩm sau môn học.
4. **Schedule risk:** baseline mười tuần không khớp cửa sổ học phần tám tuần.
5. **Scope risk:** nhiều capability phụ thuộc nhau, gồm OCR, tính toán tài chính, payment status và notification, trong khi chưa có actual progress đáng tin cậy.
6. **Technical and data risk:** chính Feasibility Study đánh dấu rủi ro cao ở correctness, OCR/provider, secret, privacy và external-service availability [S10].

Ba rủi ro đầu chỉ được nhận diện rõ sau phản biện trực tiếp của giảng viên tại buổi giữa kỳ; vì vậy, đây là đánh giá hồi cứu chứ không phải issue log được nhóm ghi trước ngày 24/07.

## 6. Quyết định và hành động sau kỳ báo cáo

Sau buổi trình bày giữa kỳ, nhóm nhận ra Splitly chưa đủ mạnh về business value và khả năng được sử dụng. Nhóm không tiếp tục coi baseline Splitly là kế hoạch thực thi phù hợp mà quay lại tìm ý tưởng mới. Giai đoạn brainstorm kéo dài đến 09/08; sau khi chốt InterviewQuestionBank, nhóm làm lại Project Initiation và Project Planning rồi tiếp tục execution trong thời gian còn lại.

| Hành động kiểm soát                   | Kết quả                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| Dừng cam kết mở rộng Splitly          | Tránh tiếp tục đầu tư vào một business case chưa được xác nhận                        |
| Quay lại ideation và đánh giá ý tưởng | Dùng phản biện về problem, alternatives, adoption, risk và sustainability để sàng lọc |
| Chọn InterviewQuestionBank            | Chuyển sang pain point chuẩn bị phỏng vấn theo JD                                     |
| Làm lại Initiation và Planning        | Tạo Charter, Proposal, backlog, architecture, resource/cost plan và scope mới         |

## 7. Giới hạn dữ liệu

- Không có status report được lập trong tuần 13/07–19/07.
- Không có snapshot board Splitly theo ngày hoặc timesheet.
- Không có actual cost, actual effort hoặc phần trăm hoàn thành phần mềm đáng tin cậy.
- Không dùng số lượng tài liệu để thay cho phần trăm hoàn thành sản phẩm.
- Các tài liệu ngoài Charter và Proposal không ghi ngày rõ trong nội dung; việc xếp chúng vào bộ trước giữa kỳ dựa trên xác nhận của nhóm.

## 8. Nguồn nội bộ

- **[S1]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Governance & Stakeholder/Project_Charter.md` — Document Control, Objectives, Scope, Milestones, Risks.
- **[S2]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Proposal/Project_Proposal_Draft.md` — Problem Statement, Competitor Context, Business Value.
- **[S3]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Vision_and_Scope/Project_Vision_and_Scope.md` — Product Positioning, Goals, MVP Scope, Constraints.
- **[S4]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md` — release boundary, 21 User Story và acceptance criteria.
- **[S5]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Vision_and_Scope/Current_State_Workflow.md` và `Future_State_Workflow.md`.
- **[S6]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Prototype/Prototype_Workflow.md`.
- **[S7]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Architecture/software_architecture.md`.
- **[S8]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Resource_Plan/ResourcePlan.md`.
- **[S9]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Resource_Plan/Cost_Time_Resources.md`.
- **[S10]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Feasibility/feasibility.md`.
