import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Eye, Heart, MessageSquare, Star, Users } from "lucide-react";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import type { Work } from "@/lib/types/portfolio.types";
import "../styles/profile-page.css";
import "../styles/portfolio-detail-page.css";

const partnerReviews = [
  { id: "brand", name: "Đại diện thương hiệu", role: "Đối tác dự án Mộc Coffee", initials: "MC", rating: 5, text: "Minh Anh nắm bắt tinh thần thương hiệu rất tốt. Hệ thống nhận diện nhất quán, cách trình bày phương án rõ ràng và chủ động trao đổi trong suốt quá trình thực hiện.", criteria: ["Hiểu brief", "Chất lượng thiết kế", "Giao tiếp rõ ràng"] },
  { id: "marketing", name: "Đội ngũ Marketing", role: "Đối tác triển khai Mộc Coffee", initials: "MK", rating: 4, text: "Bộ file bàn giao được tổ chức dễ sử dụng, bao bì giữ được cảm giác mộc mạc như mong muốn. Các góp ý được tiếp nhận và điều chỉnh cẩn thận.", criteria: ["Bàn giao đầy đủ", "Tiếp nhận phản hồi"] },
];

function WorkImage({ work }: { work: Work }) {
  const [failed, setFailed] = useState(false);
  const cover = work.media.find(item => item.kind === "image");
  return cover && !failed ? <img src={cover.src} alt={work.title} onError={() => setFailed(true)} /> : <div className="work-cover-fallback">{work.brand}</div>;
}

export default function PortfolioDetailPage() {
  const { workId } = useParams();
  const { works } = usePortfolio();
  const work = works.find(item => item.id === workId);
  const workTitle = work?.title;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const previousTitle = document.title;
    document.title = workTitle ? `${workTitle} | FREVO Portfolio` : "Không tìm thấy dự án | FREVO";
    return () => { document.title = previousTitle; };
  }, [workId, workTitle]);
  const reviews = work?.id === "moc" ? partnerReviews : [];
  const cover = work?.media.find(item => item.kind === "image");
  const gallery = work?.media.filter(item => item.id !== cover?.id) ?? [];
  const related = works.filter(item => item.id !== workId).slice(0, 2);
  return <>
    <a className="skip-link" href="#work-main">Đến nội dung dự án</a>
    <header className="site-header"><div className="header-left"><Link to="/" aria-label="FREVO — Khám phá dự án"><img className="logo" src="/assets/frevo-logo.png" alt="FREVO" /></Link><span className="header-divider" /><span className="screen-name">Portfolio sáng tạo</span></div><Link to="/profile" className="account" aria-label="Tài khoản của Minh Anh"><span className="account-copy"><strong>Minh Anh</strong><small>Freelancer</small></span><span className="avatar grid place-items-center">MA</span></Link></header>
    {!work ? <main id="work-main" className="work-not-found"><h1>Chưa tìm thấy tác phẩm này<span>.</span></h1><p>Dự án có thể đã bị xóa hoặc chỉ tồn tại trong bản xem thử trước khi tải lại.</p><Link className="secondary-button" to="/profile?tab=portfolio"><ArrowLeft size={16} /> Trở về Portfolio</Link></main> : <main id="work-main" className="work-page">
      <nav className="work-breadcrumb" aria-label="Đường dẫn"><Link to="/profile?tab=portfolio"><ArrowLeft size={16} /> Portfolio của Minh Anh</Link><span>/</span><span>Chi tiết dự án</span></nav>
      <div className="work-page-heading"><div><span className="work-category">{work.category}</span><h1>{work.title}<span>.</span></h1><div className="work-heading-meta"><span><CalendarDays size={15} /> Hoàn thành {work.date.slice(5)}/{work.date.slice(0, 4)}</span><span><Users size={15} />{work.team}</span></div></div></div>
      <p className="work-demo">Hồ sơ minh họa · Thông tin và đánh giá trên trang là dữ liệu mẫu.</p>
      <div className="work-layout">
        <div className="work-main-column">
          <figure className="work-cover"><WorkImage key={cover?.src ?? work.id} work={work} /><figcaption>{work.title}</figcaption></figure>
          <nav className="work-section-nav" aria-label="Nội dung dự án"><a href="#work-story">Tổng quan</a><a href="#work-gallery">Hình ảnh & sản phẩm</a><a href="#work-reviews">Đánh giá đối tác <span>{reviews.length}</span></a></nav>
          <section id="work-story" className="work-section"><span className="work-section-kicker">Đằng sau tác phẩm</span><h2>Câu chuyện dự án<span>.</span></h2><p>{work.description}</p><div className="work-contribution"><h3>Vai trò & đóng góp</h3><strong>{work.role}</strong><p>{work.contribution}</p></div><h3>Kỹ năng & công cụ sử dụng</h3><div className="work-tags">{work.tags.map(tag => <span key={tag}>{tag}</span>)}</div></section>
          <section id="work-gallery" className="work-section"><div className="work-section-heading"><h2>Hình ảnh & sản phẩm<span>.</span></h2><span>{work.media.length} tệp</span></div>{gallery.length ? <div className="work-gallery">{gallery.map((item, index) => <figure key={item.id}>{item.kind === "image" ? <img src={item.src} alt={item.alt} loading="lazy" /> : <video src={item.src} controls preload="metadata" />}<figcaption>{item.kind === "image" ? "Hình ảnh" : "Video"} dự án · {index + 1}</figcaption></figure>)}</div> : <p className="work-empty">Ảnh bìa phía trên là hình ảnh hiện có của dự án. Các sản phẩm bổ sung sẽ hiển thị tại đây.</p>}</section>
          <section id="work-reviews" className="work-section"><div className="work-section-heading"><h2>Đối tác nói gì<span>?</span></h2><span className="work-sample-badge">Đánh giá mẫu</span></div><p className="work-review-intro">Góc nhìn từ phía đối tác sau quá trình hợp tác và bàn giao dự án.</p>{reviews.length ? <><div className="work-rating-summary"><div><strong>{(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}</strong><span>/ 5</span></div><div><span className="work-stars" aria-label="Điểm trung bình 4,5 trên 5"><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star size={18} /></span><p>Từ {reviews.length} đánh giá minh họa</p></div></div><div className="work-reviews">{reviews.map(review => <article className="work-review" key={review.id}><header><span className="work-review-avatar">{review.initials}</span><div><h3>{review.name}</h3><p>{review.role}</p></div><span className="work-review-score"><Star size={14} fill="currentColor" /> {review.rating}.0</span></header><blockquote>{review.text}</blockquote><div className="work-review-tags">{review.criteria.map(item => <span key={item}><Check size={12} />{item}</span>)}</div></article>)}</div></> : <div className="work-empty"><MessageSquare size={24} /><h3>Chưa có đánh giá từ đối tác</h3><p>Phản hồi của đối tác sau khi hoàn thành dự án sẽ được hiển thị tại đây khi kết nối dữ liệu thật.</p></div>}<p className="work-review-disclaimer">Nội dung minh họa cho giao diện, chưa phải phản hồi đã xác thực từ khách hàng.</p></section>
        </div>
        <aside className="work-sidebar"><section className="work-author"><span className="work-author-avatar">MA</span><div><span>Người thực hiện</span><h2>Minh Anh<span>.</span></h2><p>Brand & Product Designer</p></div><Link to="/profile?tab=personal">Xem hồ sơ <ArrowUpRight size={16} /></Link></section><section className="work-brief"><h2>Thông tin dự án</h2><dl><div><dt>Lĩnh vực</dt><dd>{work.category}</dd></div><div><dt>Vai trò</dt><dd>{work.role}</dd></div><div><dt>Hình thức</dt><dd>{work.team === "Cá nhân" ? "Dự án cá nhân" : "Hợp tác đội ngũ"}</dd></div><div><dt>Đơn vị thực hiện</dt><dd>{work.team}</dd></div><div><dt>Hoàn thành</dt><dd>Tháng {work.date.slice(5)} / {work.date.slice(0, 4)}</dd></div><div><dt>Hiển thị (bản mẫu)</dt><dd>{work.visibility === "private" ? "Riêng tư" : work.visibility === "link" ? "Người có liên kết" : "Công khai"}</dd></div></dl><div className="work-engagement"><span><Eye size={16} />{work.views.toLocaleString("vi-VN")} lượt xem</span><span><Heart size={16} />{work.likes} yêu thích</span></div>{work.url && <a className="primary-button work-live-link" href={work.url} target="_blank" rel="noreferrer">Xem sản phẩm <ArrowUpRight size={16} /></a>}</section><div className="work-sidebar-note"><MessageSquare size={21} /><p>Mỗi dự án là một câu chuyện hợp tác. Những phản hồi giúp câu chuyện ấy trọn vẹn hơn.</p></div></aside>
      </div>
      {related.length > 0 && <section className="work-related"><div className="work-section-heading"><h2>Khám phá thêm từ Minh Anh<span>.</span></h2><Link to="/profile?tab=portfolio">Tất cả tác phẩm <ArrowUpRight size={16} /></Link></div><div>{related.map(item => <Link to={`/profile/portfolio/${item.id}`} className="work-related-card" key={item.id}><WorkImage key={item.media[0]?.src ?? item.id} work={item} /><div><span>{item.category}</span><h3>{item.title}</h3><ArrowUpRight size={20} /></div></Link>)}</div></section>}
    </main>}
  </>;
}
