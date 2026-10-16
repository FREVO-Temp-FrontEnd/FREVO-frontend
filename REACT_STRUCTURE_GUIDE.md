# FREVO — Hướng dẫn kiến trúc React (Feature-Based Architecture)

Tài liệu dành cho developer và AI phát triển tính năng mới cho dự án FREVO. Kiến trúc này được chuẩn hóa theo mô hình **Feature-Based Clean Architecture** (tương tự kiến trúc Reactivities & Bulletproof React), giúp mã nguồn dễ mở rộng, bảo trì và tái sử dụng.

---

## 1. Nguyên tắc cốt lõi

1. **Phân tầng rõ ràng 3 lớp**:
   - `src/app/`: Quản lý Application Shell, layout chung (`app/layout/`), định tuyến tập trung (`app/router/`) và UI primitive dùng chung toàn app (`app/shared/components/ui/`).
   - `src/features/`: Quản lý nghiệp vụ theo từng domain độc lập (`features/auth/`, `features/projects/`, `features/profile/`, `features/errors/`).
   - `src/lib/`: Cơ sở hạ tầng dùng chung gồm API client (`lib/api/`), Custom hooks (`lib/hooks/`), State/Context (`lib/context/`), Types (`lib/types/`) và Tiện ích (`lib/util/`).
2. **Component nhỏ, một trách nhiệm**: Chia nhỏ các màn hình lớn thành các sub-components độc lập (ví dụ: `ProjectList`, `ProjectCard`, `ProjectFilters`, `ProjectDetail`).
3. **Tách biệt Data Logic khỏi Presentation**: Fetching và xử lý state nghiệp vụ được gom vào custom hooks (`useProjects`, `usePortfolio`), component chỉ phụ trách render và xử lý sự kiện giao diện.
4. **Không đổi UI hiện có**: Mọi refactor cấu trúc tuyệt đối giữ nguyên toàn bộ CSS class, layout responsive và token thiết kế theo `STYLE_GUIDE.md`.

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
│   │   │   └── App.tsx                     # Root Layout (chứa Providers, ScrollRestoration, Outlet)
│   │   ├── router/
│   │   │   └── Routes.tsx                  # createBrowserRouter định tuyến tập trung
│   │   └── shared/
│   │       └── components/
│   │           └── ui/                     # UI Primitives (Button, Dialog, Input, Checkbox, etc.)
│   │
│   ├── features/                           # Domain Modules (Feature Slices)
│   │   ├── auth/                           # Module xác thực tài khoản
│   │   │   ├── pages/                      # LoginPage, RegisterPage, ForgotPasswordPage
│   │   │   └── styles/                     # CSS chuyên biệt của auth
│   │   ├── projects/                       # Module khám phá & ứng tuyển dự án
│   │   │   ├── dashboard/                  # ProjectDashboard, ProjectList, ProjectCard, ProjectFilters...
│   │   │   ├── details/                    # ProjectDetail
│   │   │   └── application/                # ProjectApplyDialog
│   │   ├── profile/                        # Module hồ sơ cá nhân & portfolio
│   │   │   ├── pages/                      # ProfilePage, PortfolioDetailPage
│   │   │   ├── components/                 # EditProfileDialog, PortfolioEditor, PortfolioCover
│   │   │   ├── data/                       # portfolio-data.ts, stitch-images.json
│   │   │   └── styles/                     # profile-page.css, portfolio-detail-page.css
│   │   └── errors/                         # Màn hình lỗi
│   │       └── NotFound.tsx                # Trang 404 thân thiện
│   │
│   ├── lib/                                # Hạ tầng & tiện ích dùng chung
│   │   ├── api/                            # Axios agent với interceptors & domain api clients
│   │   ├── context/                        # React Context providers (PortfolioContext)
│   │   ├── hooks/                          # Custom Hooks (useProjects, usePortfolio)
│   │   ├── types/                          # TypeScript interfaces & types
│   │   └── util/                           # Helper functions (cn, formatters, text normalization)
│   │
│   ├── index.css                           # Tailwind CSS v4, theme tokens & global styles
│   └── main.tsx                            # Điểm khởi chạy với RouterProvider
```

---

## 3. Luồng hoạt động

```text
index.html
  → src/main.tsx
      → RouterProvider (src/app/router/Routes.tsx)
          → App Layout (src/app/layout/App.tsx)
              → PortfolioProvider & ScrollRestoration
                  → Outlet (render Feature Page tương ứng theo URL)
                      → Feature Sub-components & Shared UI
                      → Custom Hooks (src/lib/hooks/)
                          → API Client (src/lib/api/agent.ts)
```

---

## 4. Quy ước thêm tính năng / màn hình mới

1. **Tạo feature mới**: Khi thêm một nghiệp vụ mới (ví dụ `messages`, `proposals`), tạo thư mục trong `src/features/<feature-name>/`.
2. **Phân rã thành phần**:
   - `pages/`: Component màn hình chính gắn với route.
   - `components/`: Các khối UI con thuộc riêng feature đó.
   - `styles/`: CSS riêng cho feature (nếu không dùng thuần Tailwind utility classes).
3. **Đăng ký route**: Khai báo route mới bên trong children của `src/app/router/Routes.tsx`.
4. **Gọi API**: Tạo client riêng trong `src/lib/api/<feature>Api.ts` sử dụng `agent` từ `src/lib/api/agent.ts`, bọc qua custom hook trong `src/lib/hooks/`.
5. **Kiểm tra chất lượng**: Luôn chạy `npm run typecheck` và `npm run build` sau khi thêm hoặc sửa đổi code.
