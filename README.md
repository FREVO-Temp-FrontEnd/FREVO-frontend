# FREVO Frontend

Frontend FREVO gồm màn hình “Khám phá dự án”, “Chi tiết dự án”, “Hồ sơ cá nhân / Portfolio” và luồng “Xác thực tài khoản”. Giao diện được xây dựng bằng **React 19**, **TypeScript**, **Vite** và **Material UI (MUI)** theo kiến trúc **Feature-Based Clean Architecture** (tham chiếu từ dự án mẫu `Reactivities`). React Router v7 quản lý điều hướng tập trung; Axios quản lý REST API.

---

## Chạy tại máy

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```bash
npm ci
npm run dev
```

Mở URL Vite hiển thị trong terminal (mặc định <http://localhost:5173>).

### Các lệnh kiểm tra chất lượng code:

```bash
npm run lint         # Kiểm tra linter ESLint (0 errors, 0 warnings)
npm run typecheck    # Kiểm tra TypeScript type safety
npm run build        # Build production bundle
npm run preview      # Xem trước bản build production
```

---

## Cấu trúc dự án (Feature-Based Architecture)

Dự án áp dụng mô hình phân tầng module nghiệp vụ (Feature Slices):

- `src/app/`:
  - `layout/App.tsx`: App Shell bọc `ThemeProvider`, `CssBaseline`, `PortfolioProvider`.
  - `router/Routes.tsx`: Cấu hình định tuyến tập trung với `createBrowserRouter`.
  - `theme/theme.ts`: Cấu hình MUI Theme (màu cam `#f4490b`, bo góc, typography `Archivo` & `Space Grotesk`).
  - `shared/components/`: Các custom components tái sử dụng chung.
- `src/features/`:
  - `auth/`: Trang đăng nhập, đăng ký, quên mật khẩu (`LoginPage`, `RegisterPage`, `ForgotPasswordPage`).
  - `projects/`: Trang khám phá dự án, chi tiết công việc, bộ lọc và modal ứng tuyển (`ProjectDashboard`, `ProjectDetail`, `ProjectFilters`, `ProjectApplyDialog`).
  - `profile/`: Trang hồ sơ freelancer, studio chỉnh sửa portfolio (`ProfilePage`, `PortfolioDetailPage`, `PortfolioEditor`, `EditProfileDialog`).
  - `errors/`: Trang báo lỗi (`NotFound`).
- `src/lib/`:
  - `api/`: Axios agent và các api modules (`projectsApi.ts`).
  - `context/`: React context providers (`portfolio-provider.tsx`).
  - `hooks/`: Custom hooks (`useProjects.ts`, `usePortfolio.ts`).
  - `types/`: Kiểu dữ liệu TypeScript (`project.types.ts`, `portfolio.types.ts`).
- `src/index.css`: Nạp web fonts (`Archivo`, `Space Grotesk`) và CSS reset toàn trang.
- `public/`: Chứa logo, assets tĩnh và mock data (`projects.json`).

Chi tiết về quy chuẩn code và kiến trúc xem tại [REACT_STRUCTURE_GUIDE.md](./REACT_STRUCTURE_GUIDE.md).

---

## REST API

Mặc định ứng dụng tải danh sách dự án mẫu qua Axios từ `public/data/projects.json`. Thao tác ứng tuyển được mô phỏng tại trình duyệt và không gửi dữ liệu đi nếu chưa cấu hình backend.

Để kết nối backend thật, tạo `.env.local` từ `.env.example` và đặt biến:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

Các endpoint chính:
- `GET {VITE_API_BASE_URL}/projects`: Lấy danh sách dự án.
- `POST {VITE_API_BASE_URL}/applications`: Gửi đơn ứng tuyển `{ projectId, proposal, portfolioUrl }`.
