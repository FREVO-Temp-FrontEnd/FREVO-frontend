# Trang quản lý nhóm freelancer

## Phạm vi đã được duyệt

Theo prototype được duyệt trong cuộc trao đổi ngày 27/10/2026, trang `/team/profile` chỉ quản lý nhóm. Chọn tư cách Cá nhân/Nhóm thuộc luồng ứng tuyển từng dự án, không nằm trên trang này.

- TEAM-001: trạng thái chưa có nhóm; tạo và chỉnh sửa tên, giới thiệu, chuyên môn.
- TEAM-002: danh sách thành viên, vai trò chuyên môn và người đại diện; danh sách lời mời email, gửi lại và thu hồi.
- Truy vết: FR-063, FLOW-05; giữ nguyên nguyên tắc một người đại diện và BR-003 của luồng ứng tuyển.
- Thay đổi được người dùng duyệt so với TEAM-002 cũ: bổ sung lời mời email dưới dạng mô phỏng. Không triển khai tài khoản thành viên, nhận lời mời thật hoặc phân quyền TEAM-005/DEC-09.
- DEC-07: không tích hợp nhà cung cấp gửi email. Giao diện và thông báo xác nhận ghi rõ mô phỏng.

## Hành vi

- Dữ liệu lưu trong localStorage theo email tài khoản; khi không có email dùng mã tài khoản. Không thay đổi actingIdentity hoặc hồ sơ ứng viên đã gửi.
- Tài khoản có sẵn tư cách Team được hiển thị hồ sơ cơ bản tương ứng, với chính tài khoản đó làm đại diện. Tài khoản khác bắt đầu bằng trạng thái chưa có nhóm.
- Thành viên mới chưa được thêm chỉ bằng thao tác gửi lời mời. Số lời mời chỉ tính những lời mời đang chờ.
- Kiểm tra email sai định dạng, trùng thành viên hoặc trùng lời mời đang chờ; chuẩn hóa email không phân biệt hoa/thường.
- Thu hồi cần xác nhận. Lời mời đã thu hồi là chỉ đọc và có thể được thay bằng lời mời mới.
- Lỗi đọc dữ liệu hiển thị nút thử lại, không tự xóa dữ liệu. Lỗi lưu giữ biểu mẫu và nội dung đã nhập.
- Chỉ freelancer đăng nhập được vào trang qua RoleGuard hiện có.
- Giao diện dùng MUI, hỗ trợ bố cục hẹp và màu sáng/tối theo hệ thống; hộp thoại có nhãn và xử lý focus mặc định của MUI.

## Tệp thay đổi

- `src/app/router/Routes.tsx`
- `src/features/team/pages/TeamProfilePage.tsx`
- `src/features/team/components/TeamRosterTab.tsx`
- `src/features/team/components/TeamInvitationsTab.tsx`
- `src/features/team/components/TeamManagementDialogs.tsx`
- `src/features/team/hooks/useTeamManagement.ts`
- `src/features/team/team-model.ts`
- `src/features/team/team-model.test.mjs`

## Kiểm tra

- `npm.cmd run typecheck`: đạt.
- `npm.cmd run lint`: không có lỗi; cảnh báo có sẵn trong `design/applications-prototype.tsx`.
- `npm.cmd run build`: đạt; Vite báo kích thước bundle toàn ứng dụng trên 500 kB.
- `node --experimental-strip-types --test --test-isolation=none src/features/team/team-model.test.mjs`: 4 bài kiểm tra đạt (biểu mẫu, email trùng, lời mời thu hồi, dữ liệu lưu bị lỗi).
- Trình duyệt cục bộ đã hiển thị trang và trạng thái chưa có nhóm qua accessibility tree. Chưa hoàn tất kiểm tra ảnh chụp, màn hình nhỏ và giao diện tối do công cụ chụp màn hình không trả khung hình.

## Giới hạn

Không gửi email thật hoặc tự thêm thành viên từ tài khoản khác. Chưa có dịch vụ backend đồng bộ hồ sơ nhóm hay nhận lời mời. Dữ liệu mô phỏng chỉ thuộc trình duyệt hiện tại.
