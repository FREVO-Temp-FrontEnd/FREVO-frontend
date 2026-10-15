import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khám phá dự án · FREVO",
  description: "Khám phá các dự án sáng tạo trên FREVO.",
  icons: { icon: "/assets/frevo-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
