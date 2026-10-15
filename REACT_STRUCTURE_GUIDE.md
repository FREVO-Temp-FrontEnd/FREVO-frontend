# FREVO — Hướng dẫn cấu trúc React

Tài liệu dành cho người mới học React và AI triển khai trang mới. Đọc cùng `STYLE_GUIDE.md`: file đó quy định giao diện, file này quy định code nằm ở đâu và các phần kết nối với nhau thế nào.

## 1. Nguyên tắc chính

**Mở rộng cấu trúc hiện có, chỉ tạo thêm thư mục khi có nhu cầu thực tế.** React không bắt buộc một cấu trúc folder duy nhất. Quy ước dưới đây được chọn theo dự án FREVO hiện tại, không phải quy định chung của React.

- Giữ `App.tsx` tập trung vào route; không viết cả giao diện trang mới trong file này.
- Màn hình đặt trong `src/components/`, cùng cách với login và home hiện có.
- UI cơ bản dùng chung đặt trong `src/components/ui/`.
- Hàm gọi API và logic thuần dùng chung đặt trong `src/lib/`.
- CSS riêng đặt cạnh màn hình hoặc component sở hữu nó.
- Không tự di chuyển login/home, đổi cấu trúc toàn dự án hoặc đổi framework khi chỉ được yêu cầu thêm trang.

## 2. Dự án đang dùng gì?

Dựa trên mã nguồn và cấu hình tại thời điểm viết tài liệu:

- React + TypeScript: xây giao diện bằng component và kiểm tra kiểu dữ liệu.
- Vite: chạy môi trường phát triển và build frontend.
- React Router: quản lý URL và chuyển trang; dự án import từ `react-router`.
- Tailwind CSS v4 kết hợp CSS riêng: định dạng giao diện.
- Component shadcn/ui dựa trên Radix trong `src/components/ui/`.
- Axios: gọi API qua cấu hình chung trong `src/lib/api.ts`.
- Lucide React: icon.
- Alias `@/` trỏ tới `src/`, đã cấu hình trong Vite và TypeScript.

Đây là ứng dụng React chạy phía trình duyệt. Không áp dụng cấu trúc Next.js như `app/page.tsx`, `layout.tsx`, API route hoặc chỉ thị `use client`. Tạo file component mới chưa tự sinh URL; phải đăng ký route trong `App.tsx`.

## 3. Cấu trúc hiện tại

```text
FREVO-frontend/
├── public/
│   ├── assets/                     # Logo và minh họa
│   └── data/
│       └── projects.json           # Dữ liệu dự án demo
├── design/
│   └── login-prototype-desktop.png # Ảnh tham khảo thiết kế
├── src/
│   ├── main.tsx                   # Khởi động React, BrowserRouter, CSS global
│   ├── App.tsx                    # Khai báo route
│   ├── index.css                  # Font, token, reset, style home hiện có
│   ├── components/
│   │   ├── login-page.tsx         # Trang đăng nhập
│   │   ├── login-page.css         # CSS riêng của login
│   │   ├── project-explorer.tsx   # Trang khám phá + chi tiết dự án
│   │   └── ui/                    # Thành phần UI nền dùng lại
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       └── textarea.tsx
│   └── lib/
│       ├── api.ts                 # Axios instance và API hiện có
│       ├── projects.ts            # Kiểu Project
│       └── utils.ts               # Hàm cn() ghép class
├── index.html                     # HTML gốc để React gắn giao diện vào
├── package.json                   # Thư viện và lệnh chạy
├── vite.config.ts                # Cấu hình Vite, Tailwind, alias
├── tsconfig.app.json              # Cấu hình TypeScript cho src
├── components.json               # Cấu hình shadcn/ui
├── .env.example                  # Mẫu cấu hình môi trường
├── STYLE_GUIDE.md                 # Quy tắc style và vibe
└── REACT_STRUCTURE_GUIDE.md       # Tài liệu này
```

Đây là các file chính, không phải danh sách đầy đủ mọi file cấu hình. `node_modules/` và thư mục build không phải nơi viết code tính năng.

## 4. Hiểu luồng hoạt động

```text
index.html
  → src/main.tsx
      → BrowserRouter
          → App.tsx chọn màn hình theo URL
              → Component màn hình
                  → Component con và UI dùng chung
                  → Hàm API trong lib → backend hoặc dữ liệu demo
```

Ví dụ: truy cập `/login` → route chọn `LoginPage` → trang hiển thị form bằng `Input`, `Checkbox`, `Button` → CSS global kết hợp `login-page.css` tạo giao diện.

- **Page/màn hình**: phần giao diện chính ứng với một route.
- **Component**: một khối giao diện, như card dự án, header hoặc nút.
- **Props**: dữ liệu và callback component cha truyền cho component con.
- **State**: dữ liệu thay đổi khi tương tác, như giá trị input hoặc trạng thái mở dialog.
- **Hook**: hàm React giúp quản lý state, effect hoặc tái sử dụng logic có liên quan tới React.
- **Type**: mô tả hình dạng dữ liệu bằng TypeScript.

## 5. Quy tắc đặt file mới

### Màn hình nhỏ hoặc vừa

Đặt cạnh các màn hình hiện tại:

```text
src/components/
├── register-page.tsx
└── register-page.css
```

Tên file dùng kebab-case; tên component dùng PascalCase: `register-page.tsx` export `RegisterPage`. Dùng hậu tố `-page` cho màn hình mới để dễ nhận biết. `project-explorer.tsx` là tên hiện có, không cần đổi chỉ để đồng nhất.

Component con nhỏ, chỉ dùng trong một màn hình, có thể là một hàm riêng trong cùng file. Không cần tách từng dòng JSX thành file riêng.

### Màn hình có nhiều khối độc lập

Khi file chứa nhiều phần lớn hoặc khó đọc, đặt màn hình cùng các phần con vào thư mục theo tính năng. Ví dụ đề xuất khi tạo trang hồ sơ phức tạp:

```text
src/components/profile/
├── profile-page.tsx              # Ghép các khối và quản lý state chung
├── profile-page.css              # Style có phạm vi profile
├── profile-summary.tsx           # Thông tin tổng quan
├── portfolio-list.tsx            # Danh sách sản phẩm
└── edit-profile-dialog.tsx       # Dialog chỉnh sửa
```

Chọn một trong hai cách theo độ phức tạp. Không tạo đồng thời `components/profile-page.tsx` và `components/profile/profile-page.tsx` cho cùng một màn hình. Tách theo trách nhiệm, không áp dụng giới hạn số dòng cứng nhắc.

### Component dùng chung

- `components/ui/`: chỉ dành cho primitive như button, input, checkbox, dialog. Không đặt `ProjectCard` hay `ProfilePage` ở đây.
- Khi nhiều màn hình thật sự dùng cùng header/layout/card nghiệp vụ, có thể tạo `components/shared/` cho các phần đó.
- `shared/` là thư mục mở rộng đề xuất, hiện chưa có. Chỉ tạo khi đã có component dùng chung cụ thể.
- Nếu trích header hiện tại thành component chung, cập nhật các nơi sử dụng trong cùng thay đổi và giữ hành vi cũ.
- Tái sử dụng component qua props khi cấu trúc giống nhau; tránh một component quá tổng quát với hàng loạt cờ cho những màn hình không liên quan.

### Kiểu dữ liệu, API và helper

- Kiểu chỉ dùng nội bộ một component: khai báo ngay trong file đó.
- Kiểu nghiệp vụ dùng ở nhiều nơi: đặt trong `lib/<domain>.ts`, theo mẫu `lib/projects.ts` đang có.
- API hiện có giữ trong `lib/api.ts`. Khi thêm một nhóm API mới đủ lớn, có thể tạo `lib/<domain>-api.ts` và import `api` từ `@/lib/api`.
- Ví dụ trang hồ sơ có thể cần `lib/profile.ts` cho kiểu dữ liệu và `lib/profile-api.ts` cho API, nhưng chỉ tạo nếu trang thực sự cần.
- Helper nghiệp vụ thuần đặt trong file theo domain; `lib/utils.ts` dành cho helper chung, không trở thành nơi chứa mọi logic.
- Dùng `import type` cho import chỉ phục vụ TypeScript.

### Custom hook

- Dùng `useState`, `useEffect` trực tiếp trong màn hình khi logic còn đơn giản.
- Chỉ tách custom hook khi giúp tái sử dụng hoặc tách một trách nhiệm có ý nghĩa.
- Hook chỉ phục vụ một tính năng đặt cạnh tính năng đó, ví dụ `components/profile/use-profile.ts`.
- Hook dùng chung nhiều tính năng có thể đặt trong `src/hooks/`; thư mục này chưa có, dù alias đã được khai báo trong `components.json`.
- Tên hook bắt đầu bằng `use`, ví dụ `useProfile`. Không đặt tên helper thuần là hook.

## 6. Route và điều hướng

- `main.tsx` đã bọc ứng dụng bằng `BrowserRouter`; không thêm router thứ hai trong từng trang.
- Import page mới và đăng ký `Route` trong `App.tsx`.
- Các route hiện có: `/`, `/projects/:projectId`, `/login`; route không khớp chuyển về `/`.
- Dùng `Link` cho liên kết nội bộ, `useNavigate` khi chuyển trang sau một hành động, `useParams` để đọc tham số URL.
- Giữ `<a>` cho liên kết ngoài hoặc anchor trong trang khi phù hợp.
- Không tự đặt route guard giả khi chưa có cơ chế xác thực thật.

Ví dụ bổ sung sau khi đã tạo `RegisterPage`:

```tsx
// Thêm import vào src/App.tsx:
import RegisterPage from "@/components/register-page";

// Thêm bên trong <Routes> hiện có, giữ các route khác:
<Route path="/register" element={<RegisterPage />} />
```

Đoạn trên minh họa hai vị trí cần sửa, không phải nội dung thay thế toàn bộ `App.tsx`.

## 7. CSS và asset

- `index.css` giữ font, reset, biến màu, theme Tailwind và style home hiện có.
- Trang mới có CSS riêng thì import CSS trong file page, giống login.
- Dùng tiền tố theo trang: `.register-shell`, `.register-form`, `.profile-summary`. CSS import trong component vẫn có phạm vi global; việc đặt file cạnh component không tự cô lập selector.
- Tránh selector quá rộng như `button { ... }`, `h1 { ... }` trong CSS trang mới vì có thể làm thay đổi trang khác.
- Dùng lại biến CSS và primitive sẵn có theo `STYLE_GUIDE.md`.
- Không tạo lại `tailwind.config.js` theo cấu trúc Tailwind cũ; repo đang dùng plugin Vite và `@theme` trong CSS.
- Asset public dùng đường dẫn từ gốc: `/assets/frevo-logo.png`, không phải `/public/assets/frevo-logo.png`.
- Dữ liệu demo công khai đặt trong `public/data/`. Không đưa thông tin riêng tư vào thư mục public.
- `design/` chứa tài liệu/ảnh tham khảo, không phải nơi mặc định để phục vụ asset trên trang.

## 8. Dữ liệu và state

- State gần nơi sử dụng: toggle chỉ dùng trong component thì để tại đó; dữ liệu nhiều component con cần thì đặt ở cha chung gần nhất.
- Truyền dữ liệu xuống bằng props và xử lý sự kiện bằng callback.
- Danh sách lọc/sắp xếp nên tính từ dữ liệu nguồn và bộ lọc; tránh lưu thêm state trùng lặp có thể lệch nhau. Chỉ dùng `useMemo` khi có lý do cụ thể.
- Gọi API trong hàm xử lý hoặc effect phù hợp, không gọi trực tiếp mỗi lần render.
- Effect tải dữ liệu cần cleanup hoặc cơ chế bỏ qua kết quả cũ khi không còn phù hợp. Tham khảo cờ `active` ở `project-explorer.tsx`.
- Không khai báo component con bên trong thân component cha; đặt ở cấp module để tránh tạo component type mới mỗi lần render.
- Dùng key ổn định như `item.id` cho danh sách.
- Không thêm Redux, Zustand, query library hoặc form library chỉ vì tạo thêm một trang; chỉ bổ sung khi nhu cầu thực tế và phạm vi công việc cần.

## 9. Kết nối backend và demo

- Tái sử dụng Axios instance `api`, không tạo cấu hình base URL khác cho từng page.
- Hiện `VITE_API_BASE_URL` quyết định chế độ backend; khi không có giá trị, danh sách dự án đọc từ `/data/projects.json` và ứng tuyển được mô phỏng.
- Cơ chế demo này chỉ áp dụng cho các hàm đã viết; API mới không tự có dữ liệu demo.
- Đọc hợp đồng API có sẵn trước khi kết nối. Nếu chưa có, phân biệt rõ giao diện demo với tính năng hoạt động thật; không tự khẳng định đăng nhập, thanh toán hoặc lưu dữ liệu đã thành công.
- Với thao tác lưu thật, chỉ hiển thị thành công sau khi API xác nhận; nếu lỗi, giữ dữ liệu form để người dùng sửa/thử lại.
- Biến `VITE_*` được đưa vào frontend và có thể bị đọc từ trình duyệt; không đặt secret trong đó.
- Khi bổ sung biến môi trường cần thiết, cập nhật `.env.example` bằng giá trị mẫu, không ghi credential thật vào repo.

## 10. Quy trình cho AI khi được yêu cầu tạo trang

1. Đọc `STYLE_GUIDE.md`, tài liệu này, `App.tsx`, component liên quan và cấu hình hiện tại; tuân thủ hướng dẫn repository nếu có.
2. Kiểm tra thay đổi đang có để không ghi đè công việc của người dùng.
3. Xác định route, các khối UI, dữ liệu và hành vi cần xây; dùng component có sẵn khi phù hợp.
4. Chọn vị trí file theo quy tắc ở trên. Không tạo cả cây thư mục dự phòng rỗng.
5. Viết page, CSS riêng và các component con cần thiết; tách API khỏi JSX.
6. Đăng ký route và liên kết điều hướng liên quan trong phạm vi yêu cầu.
7. Hoàn thiện responsive, keyboard focus, validation và trạng thái loading/error/empty/success cần thiết.
8. Với thay đổi code, chạy `npm run lint`, `npm run typecheck`, `npm run build`. Nếu có lỗi có sẵn hoặc không chạy được, báo đúng giới hạn, không khẳng định đã pass.
9. Xem thử trang bằng trình duyệt nếu khả dụng và kiểm tra ảnh hưởng tới màn hình có dùng component vừa sửa.
10. Báo ngắn gọn route mới, các file chính, phần dùng dữ liệu demo và kết quả kiểm tra.

Chỉnh tài liệu đơn thuần không cần chạy lại build ứng dụng.

## 11. Những điều cần tránh

- Nhét toàn bộ trang mới vào `App.tsx` hoặc `main.tsx`.
- Tự tạo thêm `pages/`, `views/`, `screens/` song song với cách tổ chức đã chọn chỉ cho một trang mới.
- Di chuyển hàng loạt file cũ khi không có yêu cầu refactor.
- Copy button/input/dialog thành nhiều phiên bản thay vì dùng `components/ui/`.
- Đặt logic API trong primitive UI hoặc rải URL backend trong JSX.
- Tạo kiểu `Project` thứ hai thay vì import kiểu hiện có.
- Dùng `any` hoặc tắt TypeScript/ESLint để che lỗi.
- Tạo `index.ts` re-export cho mọi folder khi không có nhu cầu.
- Tự thêm backend, đổi package manager hoặc cài thư viện không cần thiết.
- Viết trạng thái thành công giả khiến người dùng tưởng dữ liệu đã được lưu thật.

## 12. Prompt mẫu dùng lại

```text
Hãy tạo trang [tên trang] tại route [đường dẫn] cho FREVO.
Chức năng cần có: [mô tả].

Trước khi triển khai, đọc STYLE_GUIDE.md và REACT_STRUCTURE_GUIDE.md
ở thư mục gốc, rồi đối chiếu với source hiện tại.

Giữ style của login/home và cấu trúc React + TypeScript + Vite đang có.
Đặt page trong src/components; nếu phức tạp thì nhóm file theo tính năng.
Tái sử dụng src/components/ui, token CSS và Axios instance hiện tại.
Đăng ký route trong App.tsx, đặt CSS riêng cạnh page, tách API/type khi cần.
Không tự di chuyển file cũ hoặc đổi kiến trúc toàn dự án.

Làm đầy đủ responsive và các trạng thái tương tác phù hợp.
Nếu chưa có backend, ghi rõ phần demo và không giả lập thành công như dữ liệu thật.
Chạy lint, typecheck, build và báo kết quả cùng các file chính đã thay đổi.
```

Bạn chỉ cần mô tả trang và chức năng; AI sẽ dùng hai tài liệu để quyết định cách sắp file và dựng giao diện. Khi bắt đầu một chat mới, hãy nhắc tên hai file trong prompt để AI đọc chúng; tên file Markdown thông thường không bảo đảm được tự động nạp ở mọi phiên.
