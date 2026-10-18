# FREVO — Hướng dẫn kiến trúc React (Feature-Based Architecture with MUI)

Tài liệu dành cho developer và AI phát triển tính năng mới cho dự án FREVO. Kiến trúc này được chuẩn hóa theo mô hình **Feature-Based Clean Architecture** (kết hợp các best practice từ dự án mẫu `Reactivities` & Material UI), giúp mã nguồn dễ mở rộng, bảo trì và tái sử dụng.

---

## 1. Nguyên tắc cốt lõi

1. **Phân tầng rõ ràng 3 lớp**:
   - `src/app/`: Quản lý Application Shell, layout chung (`app/layout/`), định tuyến tập trung (`app/router/`), cấu hình theme tập trung (`app/theme/theme.ts`) và các custom components dùng chung toàn ứng dụng (`app/shared/components/`).
   - `src/features/`: Quản lý nghiệp vụ theo từng domain độc lập (`features/auth/`, `features/projects/`, `features/profile/`, `features/errors/`).
   - `src/lib/`: Cơ sở hạ tầng dùng chung gồm Axios client (`lib/api/`), Custom hooks (`lib/hooks/`), State/Context (`lib/context/`), Types (`lib/types/`) và Tiện ích (`lib/util/`).
2. **Material UI (MUI) First**:
   - Tận dụng hệ sinh thái MUI (`@mui/material`, `@emotion/react`, `@emotion/styled`) kết hợp Theme cấu hình sẵn (`palette`, `typography`, `components styleOverrides`).
   - Loại bỏ các folder wrapper trung gian thừa thãi (như `ui/`).
3. **Component nhỏ, một trách nhiệm**: Chia nhỏ các màn hình lớn thành các sub-components độc lập (ví dụ: `ProjectList`, `ProjectCard`, `ProjectFilters`, `ProjectDetail`).
4. **Tách biệt Data Logic khỏi Presentation**: Fetching và xử lý state nghiệp vụ được gom vào custom hooks (`useProjects`, `usePortfolio`), component chỉ phụ trách render và xử lý sự kiện giao diện.
5. **Đảm bảo tính toàn vẹn UI/UX**: Mọi refactor cấu trúc tuyệt đối giữ nguyên toàn bộ CSS tokens, layout responsive, màu sắc thương hiệu (`#f4490b`, `#20201f`, `#fff0e9`) và font chữ (`Archivo`, `Space Grotesk`).

---

## 2. Cấu trúc thư mục chi tiết

```text
FREVO-frontend/
├── public/
│   ├── assets/                             # Logo và hình ảnh minh họa
│   └── data/
│       └── projects.json                   # Dữ liệu dự án mock/demo
├── src/
│   ├── app/                                # Application Core & Shell
│   │   ├── layout/
│   │   │   └── App.tsx                     # Root Layout (chứa ThemeProvider, CssBaseline, ScrollRestoration, Outlet)
│   │   ├── router/
│   │   │   └── Routes.tsx                  # createBrowserRouter định tuyến tập trung
│   │   ├── theme/
│   │   │   └── theme.ts                    # Cấu hình MUI theme (màu sắc, typography, overrides)
│   │   └── shared/
│   │       └── components/                 # Các custom component dùng chung đa tính năng (nếu có)
│   │
│   ├── features/                           # Domain Modules (Feature Slices)
│   │   ├── auth/                           # Module xác thực tài khoản (MUI)
│   │   │   └── pages/                      # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── freelancer/                     # Module trang chủ & điều hướng Freelancer
│   │   │   ├── FreelancerHomePage.tsx      # Khám phá, Đã lưu, Đã ứng tuyển
│   │   │   └── components/                 # FreelancerHeader, FreelancerNav, NotificationsBell
│   │   ├── business/                       # Module dành cho doanh nghiệp
│   │   │   ├── BusinessPrototype.tsx       # Prototype workspace & quản lý dự án
│   │   │   └── business-data.ts            # Dữ liệu mock doanh nghiệp
│   │   ├── projects/                       # Module khám phá & ứng tuyển dự án (MUI)
│   │   │   ├── dashboard/                  # ProjectList, ProjectCard, ProjectFilters...
│   │   │   ├── details/                    # ProjectDetailPage, ProjectDetailContent, Body, Sidebar...
│   │   │   └── application/                # ProjectApplyDialog (MUI)
│   │   ├── profile/                        # Module hồ sơ cá nhân & portfolio (MUI)
│   │   │   ├── pages/                      # ProfilePage, PortfolioDetailPage
│   │   │   ├── components/                 # EditProfileDialog, PortfolioEditor, PortfolioCover
│   │   │   └── data/                       # portfolio-data.ts, stitch-images.json
│   │   └── errors/                         # Màn hình lỗi (MUI)
│   │       └── NotFound.tsx                # Trang 404 thân thiện
│   │
│   ├── lib/                                # Hạ tầng & tiện ích dùng chung
│   │   ├── api/                            # Axios agent với interceptors & domain api clients
│   │   ├── context/                        # React Context providers (PortfolioContext)
│   │   ├── hooks/                          # Custom Hooks (useProjects, usePortfolio)
│   │   ├── types/                          # TypeScript interfaces & types
│   │   └── util/                           # Helper functions (formatters, text normalization)
│   │
│   ├── index.css                           # Global styles, font imports & CSS variables
│   └── main.tsx                            # Điểm khởi chạy với RouterProvider
```

---

## 3. Luồng hoạt động

```text
index.html
  → src/main.tsx
      → RouterProvider (src/app/router/Routes.tsx)
          → App Layout (src/app/layout/App.tsx)
              → ThemeProvider (MUI Theme) & CssBaseline
                  → PortfolioProvider & ScrollRestoration
                      → Outlet (render Feature Page tương ứng theo URL)
                          → Feature Sub-components & MUI Components
                          → Custom Hooks (src/lib/hooks/)
                              → API Client (src/lib/api/agent.ts)
```

---

## 4. Quy ước thêm tính năng / màn hình mới

1. **Tạo feature mới**: Khi thêm một nghiệp vụ mới (ví dụ `messages`, `proposals`), tạo thư mục trong `src/features/<feature-name>/`.
2. **Phân rã thành phần**:
   - `pages/`: Component màn hình chính gắn với route.
   - `components/`: Các khối UI con thuộc riêng feature đó.
3. **Sử dụng Material UI**:
   - Sử dụng các component từ `@mui/material` (`Box`, `Typography`, `Button`, `Dialog`, v.v.).
   - Tuân thủ palette và typography đã khai báo trong `src/app/theme/theme.ts`.
4. **Đăng ký route**: Khai báo route mới bên trong children của `src/app/router/Routes.tsx`.
5. **Gọi API**: Tạo client riêng trong `src/lib/api/<feature>Api.ts` sử dụng `agent` từ `src/lib/api/agent.ts`, bọc qua custom hook trong `src/lib/hooks/`.
6. **Kiểm tra chất lượng**: Luôn chạy `npm run typecheck`, `npm run lint` và `npm run build` sau khi thêm hoặc sửa đổi code.
