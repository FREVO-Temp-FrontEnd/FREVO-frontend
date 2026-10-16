import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/shared/components/ui/button";

export default function NotFound() {
  return (
    <main
      className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8"
      style={{ background: "var(--color-bg, #fcfbf9)" }}
    >
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
          Lỗi 404
        </p>
        <h1 className="mt-2 text-3xl font-serif font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Không tìm thấy trang<span>.</span>
        </h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-4">
          <Button asChild className="primary-button">
            <Link to="/">
              <ArrowLeft size={16} /> Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
