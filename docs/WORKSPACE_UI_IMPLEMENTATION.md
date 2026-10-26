# Hoàn tất chỉnh UI workspace theo Stitch

## Màn hình và truy vết
- WORK-001: Tổng quan không gian làm việc — FR-037, UC-07, FLOW-13.
- WORK-002/003: Tiến độ, mốc và sản phẩm bàn giao — FR-039, FR-049, FR-050, BR-025, FLOW-13/14.
- WORK-005: Nghiệm thu và yêu cầu chỉnh sửa — FR-051/052, BR-014, FLOW-14/16.
- WORK-008: Cảnh báo quá hạn cho mốc chưa bàn giao — FR-049–053.
- WORK-007: Giữ đường dẫn đề xuất điều chỉnh phạm vi hiện có; không thay đổi quy tắc xác nhận hai bên.
- NFR-01/02/06: Responsive desktop/mobile, nhãn điều khiển, focus của MUI, validation và giữ góp ý khi lỗi.
- DEC-03: Số lượt sửa lấy từ thỏa thuận demo; không thêm chính sách tính phí hoặc tự động nghiệm thu.

## Kết quả
Section tiến độ có tóm tắt hai mốc, khối cần hành động, milestone mở/thu gọn, tệp bàn giao, nhật ký hoạt động và cột thông tin thỏa thuận. Mobile ưu tiên khối cần xử lý. Dialog hai cột trên desktop và một cột trên mobile, hiển thị ảnh tham khảo Stitch, tệp và checklist. Yêu cầu sửa phải có tiêu chí và lý do; xác nhận nghiệm thu chỉ bật khi đã đối chiếu đủ tiêu chí. Dữ liệu, lịch sử và trạng thái tiếp tục dùng mockStorage.

Header, nav, logo và định tuyến chung được giữ nguyên. Không thêm hoặc chỉnh file CSS; dùng MUI sx và Tailwind.

## File chỉnh sửa
- REACT_STRUCTURE_GUIDE.md
- src/features/workspace/pages/WorkspaceOverviewPage.tsx
- src/features/workspace/components/AcceptanceReviewDialog.tsx
- src/features/workspace/components/MilestoneTimeline.tsx
- src/features/workspace/components/OverdueWarningBanner.tsx
- src/lib/storage/mockStorage.ts
- src/lib/types/marketplace.types.ts

## File mới
- src/features/workspace/components/MilestoneFiles.tsx
- src/features/workspace/components/WorkspaceContextSidebar.tsx
- src/features/workspace/components/WorkspaceProgressOverview.tsx
- src/features/workspace/hooks/useWorkspace.ts
- src/features/workspace/hooks/useMilestoneReview.ts
- src/features/workspace/utils/workspace.ts
- public/assets/demo/co-may-concept.pdf
- public/assets/demo/co-may-moodboard.pdf
- docs/WORKSPACE_UI_IMPLEMENTATION.md

## Giới hạn mô phỏng
Dự án Cỏ Mây giữ hai mốc 8 triệu và 16 triệu từ dữ liệu hiện có; các số liệu khác nhau trong ba mẫu Stitch không được đưa vào nghiệp vụ. Hai PDF là tài liệu demo tải thử; ảnh tham khảo dùng URL trong mẫu Stitch. Migration chỉ bổ sung chi tiết cho bản seed gốc còn thiếu, giữ trạng thái và tệp người dùng đã thay đổi. Không thêm cơ chế chuyển tiền thật hay tự bắt đầu mốc kế tiếp. Luồng hoàn tất dự án và ghi nhận thanh toán mô phỏng hiện có được giữ lại.

## Kiểm tra
- npm.cmd run typecheck: PASS.
- npm.cmd run lint: PASS, không có error; còn warning đã có trong design/applications-prototype.tsx về Fast Refresh.
- npm.cmd run build: PASS; Vite còn cảnh báo bundle lớn hơn 500 kB.
- Browser desktop 1440px và mobile 390px: trang và dialog hiển thị, không tràn ngang.
- Browser: kiểm tra nút nghiệm thu, chuyển tab, validation thiếu tiêu chí/lý do, xác nhận được bật khi đối chiếu đủ các mục.
- Kiểm tra mockStorage trong bộ nhớ riêng: fixture, validation lý do rỗng, lưu revision, nộp lại, nghiệm thu, tiến độ 1/2 và trạng thái thanh toán mô phỏng đều PASS; không thay đổi bản dữ liệu đang xem của người dùng.

## Điểm cần lưu ý
Ảnh tham khảo phụ thuộc URL bên ngoài của mẫu Stitch. Backend, giao dịch thanh toán thật và chính sách nghiệm thu cuối cùng nằm ngoài lần chỉnh UI này.

## Bổ sung: Thỏa thuận và Thanh toán

- Màn hình: PROJ-003/004/005/007 (thỏa thuận, phiên bản, phản hồi và hết hạn); PAY-001–005 (sổ, tạm giữ, giải ngân, thử lại, tranh chấp ở mức khái niệm). Luồng liên quan: FLOW-10/11/15/16; yêu cầu FR-032/047/048/056–060, BR-024, NFR-01/02/06. DEC-04/05 giữ phí, hoàn tiền và phân xử ở trạng thái chưa chốt.
- Trang tiến độ bỏ vòng phần trăm và dòng `0/2 mốc đã nghiệm thu` ở khu vực tổng quan; đổi icon đồng hồ cát sang clipboard chờ duyệt. Trạng thái từng mốc vẫn hiển thị rõ trong lộ trình.
- Trang Thỏa thuận hiển thị nội dung như một bản tóm tắt dễ đọc, các mốc, lịch sử phiên bản và bản đang có hiệu lực. Doanh nghiệp có thể mở form đề xuất phiên bản mới; Freelancer chỉ phản hồi đề xuất mới nhất còn hạn. Giữ ba ngày phản hồi và bản cũ có hiệu lực đến khi hai bên xác nhận phiên bản mới.
- Trang Thanh toán tách ngân sách, số tiền đang tạm giữ mô phỏng và đã giải ngân mô phỏng; tách trạng thái công việc khỏi trạng thái tài chính; có lịch sử giao dịch, dialog tạm giữ và trạng thái thử lại. Không nhập thẻ, không chuyển tiền thật, không tự suy ra giải ngân từ nghiệm thu khi chưa có bản ghi thanh toán.
- File chỉnh sửa: `REACT_STRUCTURE_GUIDE.md`, `src/features/workspace/components/WorkspaceProgressOverview.tsx`, `src/features/workspace/hooks/useWorkspace.ts`, `src/features/workspace/pages/WorkspaceOverviewPage.tsx`, `src/features/projects/agreements/AgreementReviewCard.tsx`, `src/features/projects/agreements/AgreementVersionHistory.tsx`, `src/features/projects/agreements/DraftAgreementForm.tsx`, `src/features/projects/agreements/ProjectAgreementPage.tsx`, `src/features/payments/components/DisbursementHistoryTable.tsx`, `src/features/payments/components/DisputeConceptCard.tsx`, `src/features/payments/components/FundMilestoneModal.tsx`, `src/features/payments/components/PaymentRetryState.tsx`, `src/features/payments/pages/PaymentLedgerPage.tsx`, `docs/WORKSPACE_UI_IMPLEMENTATION.md`.
- File mới: `src/features/projects/agreements/hooks/useProjectAgreement.ts`, `src/features/payments/hooks/usePaymentLedger.ts`.
- Kiểm tra: `npm.cmd run typecheck` PASS; `npm.cmd run lint` PASS với 1 warning đã có ở `design/applications-prototype.tsx`; `npm.cmd run build` PASS với cảnh báo bundle trên 500 kB. Browser: hai trang desktop/mobile hiển thị, mobile 390px không tràn ngang; dialog tạm giữ mở và đóng được. Các nút xác nhận giao dịch mô phỏng và thỏa thuận chưa được bấm trong dữ liệu người dùng khi kiểm tra giao diện.

## Sửa shell của sổ thanh toán

`/payments/:projectId` giờ hiển thị trong BusinessLayout cho doanh nghiệp, giữ URL hiện có từ trang tiến độ Business. Freelancer được chuyển sang `/freelancer/payments/:projectId` trong FreelancerLayout; liên kết từ workspace theo đúng vai trò. Nav Business đánh dấu “Dự án của tôi” khi ở sổ thanh toán. Màn hình PAY-001; không thay đổi dữ liệu giao dịch hay chính sách PAY-002–005. File chỉnh sửa trong lần sửa: `REACT_STRUCTURE_GUIDE.md`, `src/app/router/Routes.tsx`, `src/features/business/layout/BusinessLayout.tsx`, `src/features/workspace/pages/WorkspaceOverviewPage.tsx`, `src/features/payments/pages/PaymentLedgerPage.tsx`, `docs/WORKSPACE_UI_IMPLEMENTATION.md`. File mới: `src/app/router/PaymentRoute.tsx`.
