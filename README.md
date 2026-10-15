# FREVO Screen

Frontend FREVO gồm màn hình “Khám phá dự án” và trang đăng nhập. Giao diện được dựng bằng React 19, TypeScript, Vite, Tailwind CSS v4 và các component shadcn/ui. React Router quản lý điều hướng; Axios dùng cho REST API.

## Chạy tại máy

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```bash
npm ci
npm run dev
```

Mở URL Vite hiển thị trong terminal (mặc định <http://localhost:5173>).

Trang đăng nhập ở `/login`. Form có kiểm tra email, mật khẩu và các trạng thái tương tác; chức năng xác thực, đặt lại mật khẩu và tạo tài khoản cần được kết nối với backend sau.

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

## REST API

Mặc định ứng dụng tải sáu dự án mẫu qua Axios từ `public/data/projects.json`. Thao tác ứng tuyển được mô phỏng tại trình duyệt và không gửi dữ liệu đi.

Để dùng backend, tạo `.env.local` từ `.env.example` và đặt `VITE_API_BASE_URL`. Khi đó ứng dụng gọi:

- `GET {VITE_API_BASE_URL}/projects`: trả về mảng dự án theo kiểu `Project` trong `src/lib/projects.ts`.
- `POST {VITE_API_BASE_URL}/applications`: nhận `{ projectId, proposal, portfolioUrl }`.

Frontend chỉ đánh dấu đã ứng tuyển sau khi API trả về thành công. Nếu API lỗi, giao diện hiển thị thông báo và giữ form để thử lại. Cần cấu hình CORS trên backend cho origin của frontend.

## Cấu trúc

- `src/App.tsx`: React Router với trang danh sách, URL `/projects/:projectId` và `/login`.
- `src/components/login-page.tsx` và `login-page.css`: giao diện đăng nhập responsive.
- `design/login-prototype-desktop.png`: ảnh prototype tham chiếu cho trang đăng nhập.
- `src/components/project-explorer.tsx`: giao diện, bộ lọc và tương tác.
- `src/components/ui/`: source component shadcn/ui.
- `src/lib/api.ts`: Axios instance và hàm gọi API.
- `src/index.css`: Tailwind v4 và giao diện FREVO.
- `public/assets/`: logo FREVO.
- `public/data/`: dữ liệu demo.

Phông Archivo và Space Grotesk tải từ Google Fonts khi có mạng, với phông hệ thống dự phòng.
