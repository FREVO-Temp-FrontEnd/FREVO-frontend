# FREVO Screen

Frontend prototype màn hình “Khám phá dự án” của FREVO, dựng bằng Next.js App Router, React, TypeScript và Tailwind CSS v4.

## Chạy tại máy

Yêu cầu Node.js 20.9 trở lên.

```bash
npm ci
npm run dev
```

Mở <http://localhost:3000>. Để kiểm tra bản production:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Cấu trúc

- `app/`: App Router, metadata và CSS.
- `components/project-explorer.tsx`: giao diện và tương tác phía client.
- `lib/projects.ts`: sáu brief minh họa có kiểu TypeScript.
- `public/assets/`: logo FREVO.

Tìm kiếm, lọc, sắp xếp, lưu và ứng tuyển là tương tác mô phỏng trên trình duyệt. Không có API hoặc dữ liệu thật được gửi đi. Phông Archivo và Space Grotesk tải từ Google Fonts khi có mạng, với phông hệ thống dự phòng.
