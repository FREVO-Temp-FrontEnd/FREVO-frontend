import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Eye,
  FolderOpen,
  Heart,
  MapPin,
  Pencil,
  Plus,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/app/shared/components/ui/button";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import type { Work } from "@/lib/types/portfolio.types";
import { EditProfileDialog, type EditRequest } from "../components/EditProfileDialog";
import { PortfolioEditor } from "../components/PortfolioEditor";
import { PortfolioCover } from "../components/PortfolioCover";
import "../styles/profile-page.css";

const tabs = [
  { id: "personal", label: "Thông tin cá nhân", icon: UserRound },
  { id: "portfolio", label: "Portfolio", icon: FolderOpen },
  { id: "experience", label: "Kinh nghiệm & Kỹ năng", icon: Sparkles },
  { id: "services", label: "Dịch vụ & Báo giá", icon: Wallet },
];

function splitTags(value: string) {
  return [...new Set(value.split(",").map((tag) => tag.trim()).filter(Boolean))];
}

export default function ProfilePage() {
  const [params] = useSearchParams();
  const activeTab = tabs.some((tab) => tab.id === params.get("tab"))
    ? params.get("tab")!
    : "portfolio";
  const { works, setWorks } = usePortfolio();
  const [sort, setSort] = useState("newest");
  const [portfolioEditor, setPortfolioEditor] = useState<{
    work: Work | null;
  } | null>(null);
  const [personal, setPersonal] = useState({
    name: "Minh Anh",
    specialty: "Brand & Product Designer",
    location: "TP. Hồ Chí Minh",
    working: "Freelance · Làm việc từ xa",
    availability: "Sẵn sàng hợp tác",
    bio: "Mình là designer tập trung vào nhận diện thương hiệu và sản phẩm số. Mình thích biến những bài toán phức tạp thành trải nghiệm trực quan, gần gũi và có cá tính.",
  });
  const [experiences, setExperiences] = useState([
    {
      id: "independent",
      period: "2023 — Hiện tại",
      title: "Independent Designer",
      description:
        "Thiết kế thương hiệu, bao bì và sản phẩm số cho doanh nghiệp vừa và nhỏ.",
    },
    {
      id: "studio",
      period: "2022 — 2023",
      title: "Designer · Collective Studio",
      description:
        "Phối hợp cùng đội ngũ sáng tạo phát triển hệ thống nhận diện và các điểm chạm thương hiệu.",
    },
  ]);
  const [skills, setSkills] = useState([
    "Brand Strategy",
    "Visual Identity",
    "UI/UX Design",
    "Typography",
    "Packaging",
    "Figma",
    "Adobe Illustrator",
    "Adobe Photoshop",
  ]);
  const [services, setServices] = useState([
    {
      id: "brand",
      title: "Nhận diện thương hiệu",
      price: "8000000",
      text: "Định hướng hình ảnh, thiết kế logo, bảng màu, typography và hướng dẫn sử dụng.",
    },
    {
      id: "ux",
      title: "Thiết kế UI/UX",
      price: "12000000",
      text: "Nghiên cứu trải nghiệm, wireframe, giao diện và prototype tương tác trên Figma.",
    },
    {
      id: "packaging",
      title: "Thiết kế bao bì",
      price: "5000000",
      text: "Ý tưởng bao bì, thiết kế nhãn và hoàn thiện file in cho sản phẩm.",
    },
  ]);
  const [editing, setEditing] = useState<EditRequest | null>(null);
  const initials = personal.name
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase("vi-VN");

  function editPersonal() {
    setEditing({
      title: "Chỉnh sửa thông tin cá nhân",
      fields: [
        { name: "name", label: "Họ và tên", value: personal.name, maxLength: 80 },
        { name: "specialty", label: "Chuyên môn", value: personal.specialty },
        { name: "location", label: "Địa điểm", value: personal.location },
        { name: "working", label: "Hình thức làm việc", value: personal.working },
        {
          name: "availability",
          label: "Trạng thái hợp tác",
          value: personal.availability,
        },
        {
          name: "bio",
          label: "Giới thiệu bản thân",
          value: personal.bio,
          type: "textarea",
        },
      ],
      onSave: (values) =>
        setPersonal({
          name: values.name,
          specialty: values.specialty,
          location: values.location,
          working: values.working,
          availability: values.availability,
          bio: values.bio,
        }),
    });
  }

  function editWork(work: Work) {
    setPortfolioEditor({ work });
  }

  const [notice, setNotice] = useState("");
  const sorted = [...works].sort((a, b) =>
    sort === "popular"
      ? b.views - a.views
      : b.date.localeCompare(a.date)
  );

  return (
    <>
      <a className="skip-link" href="#profile-content">
        Đến nội dung hồ sơ
      </a>
      <header className="site-header">
        <div className="header-left">
          <Link to="/" aria-label="FREVO — Khám phá dự án">
            <img className="logo" src="/assets/frevo-logo.png" alt="FREVO" />
          </Link>
          <span className="header-divider" />
          <span className="screen-name">Hồ sơ của tôi</span>
        </div>
        <Link
          to="/profile"
          className="account"
          aria-label={`Tài khoản của ${personal.name}`}
          aria-current="page"
        >
          <span className="account-copy">
            <strong>{personal.name}</strong>
            <small>Freelancer</small>
          </span>
          <span className="avatar grid place-items-center">{initials}</span>
        </Link>
      </header>
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <Link to="/" className="profile-back">
            <ArrowLeft size={16} /> Khám phá dự án
          </Link>
          <div className="profile-identity">
            <div className="profile-avatar">
              {initials}
              <span />
            </div>
            <h2>
              {personal.name}
              <span>.</span>
            </h2>
            <p>{personal.specialty}</p>
            <span className="profile-location">
              <MapPin size={14} /> {personal.location}
            </span>
            <span className="profile-available">{personal.availability}</span>
          </div>
          <nav className="profile-side-nav" aria-label="Các mục hồ sơ">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`/profile?tab=${tab.id}`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.id === "portfolio" && <span>{works.length}</span>}
              </Link>
            ))}
          </nav>
          <div className="profile-sidebar-note">
            <Sparkles size={22} />
            <h3>Để tác phẩm lên tiếng.</h3>
            <p>
              Chia sẻ những dự án thể hiện rõ nhất cá tính và cách bạn sáng tạo.
            </p>
          </div>
        </aside>
        <main id="profile-content" className="profile-main">
          <nav className="profile-tabs" aria-label="Điều hướng hồ sơ">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`/profile?tab=${tab.id}`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.id === "portfolio" && <span>{works.length}</span>}
              </Link>
            ))}
          </nav>
          <div className="profile-breadcrumb">
            Hồ sơ <span>/</span> {tabs.find((tab) => tab.id === activeTab)?.label}
          </div>
          {activeTab === "portfolio" ? (
            <>
              <div className="profile-heading">
                <div>
                  <h1>
                    Portfolio của tôi<span>.</span>
                  </h1>
                  <p>
                    Trưng bày những dự án nổi bật, chia sẻ vai trò và dấu ấn sáng
                    tạo của bạn.
                  </p>
                </div>
                <Button
                  className="primary-button"
                  onClick={() => setPortfolioEditor({ work: null })}
                >
                  <Plus size={17} /> Thêm dự án mới
                </Button>
              </div>
              <div className="profile-stats">
                <div>
                  <span>Tổng dự án</span>
                  <strong>{works.length} tác phẩm</strong>
                  <FolderOpen />
                </div>
                <div>
                  <span>Lượt tiếp cận</span>
                  <strong>
                    {new Intl.NumberFormat("vi-VN").format(
                      works.reduce((n, w) => n + w.views, 0)
                    )}
                  </strong>
                  <Eye />
                </div>
                <div>
                  <span>Lượt yêu thích</span>
                  <strong>
                    {works.reduce((n, w) => n + w.likes, 0)} lượt
                  </strong>
                  <Heart />
                </div>
              </div>
              <div className="portfolio-toolbar">
                <p>
                  Bộ sưu tập <strong>({works.length})</strong>
                </p>
                <label>
                  <SlidersHorizontal size={15} />
                  <span className="sr-only">Sắp xếp dự án</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Xem nhiều nhất</option>
                  </select>
                </label>
              </div>
              <div className="portfolio-grid">
                {sorted.map((work) => (
                  <article className="portfolio-card" key={work.id}>
                    <Link
                      className="portfolio-open"
                      to={`/profile/portfolio/${work.id}`}
                      aria-label={`Xem ${work.title}`}
                    >
                      <div className="portfolio-image">
                        <PortfolioCover
                          key={
                            work.media.find((item) => item.kind === "image")
                              ?.src ?? work.id
                          }
                          work={work}
                        />
                        <div className="portfolio-badges">
                          <span>Năm {work.date.slice(0, 4)}</span>
                          <span>
                            {work.team === "Cá nhân" ? (
                              <UserRound size={11} />
                            ) : (
                              <Users size={11} />
                            )}
                            {work.team}
                          </span>
                        </div>
                      </div>
                      <div className="portfolio-card-copy">
                        <h2>{work.title}</h2>
                        <p className="portfolio-contribution">
                          <span>Vai trò:</span> <strong>{work.role}</strong> ·{" "}
                          <span>Đóng góp:</span> {work.contribution}
                        </p>
                        <div className="portfolio-tags">
                          {work.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="portfolio-card-footer">
                          <span>
                            <Eye size={13} />
                            {new Intl.NumberFormat("vi-VN", {
                              notation: "compact",
                            }).format(work.views)}
                            <Heart size={13} />
                            {work.likes}
                          </span>
                          <span>
                            Hoàn thành: {work.date.slice(5)}/
                            {work.date.slice(0, 4)}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="portfolio-edit-action">
                      <span className="portfolio-visibility">
                        {work.visibility === "private"
                          ? "Riêng tư"
                          : work.visibility === "link"
                          ? "Có liên kết"
                          : "Công khai"}
                      </span>
                      <Button
                        className="secondary-button profile-edit-button"
                        aria-label={`Chỉnh sửa ${work.title}`}
                        onClick={() => editWork(work)}
                      >
                        <Pencil size={14} /> Chỉnh sửa
                      </Button>
                    </div>
                  </article>
                ))}
                <button
                  className="portfolio-add"
                  onClick={() => setPortfolioEditor({ work: null })}
                >
                  <span>
                    <Plus size={24} />
                  </span>
                  <strong>Dự án tiếp theo của bạn</strong>
                  <p>Thêm một dấu ấn mới vào portfolio.</p>
                </button>
              </div>
            </>
          ) : activeTab === "personal" ? (
            <>
              <div className="profile-heading">
                <div>
                  <h1>
                    Một chút về tôi<span>.</span>
                  </h1>
                  <p>Con người đứng sau những ý tưởng.</p>
                </div>
                <Button
                  className="secondary-button profile-edit-button"
                  onClick={editPersonal}
                >
                  <Pencil size={15} /> Chỉnh sửa thông tin
                </Button>
              </div>
              <section className="profile-info-panel">
                <h2>Xin chào, mình là {personal.name}.</h2>
                <p>{personal.bio}</p>
                <dl className="profile-facts">
                  <div>
                    <dt>Họ và tên</dt>
                    <dd>{personal.name}</dd>
                  </div>
                  <div>
                    <dt>Chuyên môn</dt>
                    <dd>{personal.specialty}</dd>
                  </div>
                  <div>
                    <dt>Địa điểm</dt>
                    <dd>{personal.location}</dd>
                  </div>
                  <div>
                    <dt>Hình thức làm việc</dt>
                    <dd>{personal.working}</dd>
                  </div>
                </dl>
              </section>
            </>
          ) : activeTab === "experience" ? (
            <>
              <div className="profile-heading">
                <div>
                  <h1>
                    Kinh nghiệm & kỹ năng<span>.</span>
                  </h1>
                  <p>Hành trình sáng tạo và những điều mình làm tốt.</p>
                </div>
              </div>
              <section className="profile-info-panel">
                <h2>Kinh nghiệm làm việc</h2>
                {experiences.map((experience) => (
                  <div className="profile-experience" key={experience.id}>
                    <BriefcaseBusiness />
                    <div>
                      <span>{experience.period}</span>
                      <h3>{experience.title}</h3>
                      <p>{experience.description}</p>
                      <Button
                        className="secondary-button profile-edit-button"
                        aria-label={`Chỉnh sửa kinh nghiệm ${experience.title}`}
                        onClick={() =>
                          setEditing({
                            title: "Chỉnh sửa kinh nghiệm",
                            fields: [
                              {
                                name: "period",
                                label: "Thời gian",
                                value: experience.period,
                              },
                              {
                                name: "title",
                                label: "Vị trí & đơn vị",
                                value: experience.title,
                              },
                              {
                                name: "description",
                                label: "Mô tả công việc",
                                value: experience.description,
                                type: "textarea",
                              },
                            ],
                            onSave: (values) =>
                              setExperiences((previous) =>
                                previous.map((item) =>
                                  item.id === experience.id
                                    ? {
                                        ...item,
                                        period: values.period,
                                        title: values.title,
                                        description: values.description,
                                      }
                                    : item
                                )
                              ),
                          })
                        }
                      >
                        <Pencil size={14} /> Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="profile-section-heading">
                  <h2>Kỹ năng & công cụ</h2>
                  <Button
                    className="secondary-button profile-edit-button"
                    onClick={() =>
                      setEditing({
                        title: "Chỉnh sửa kỹ năng & công cụ",
                        fields: [
                          {
                            name: "skills",
                            label: "Kỹ năng (phân cách bằng dấu phẩy)",
                            value: skills.join(", "),
                            type: "textarea",
                          },
                        ],
                        onSave: (values) => setSkills(splitTags(values.skills)),
                      })
                    }
                  >
                    <Pencil size={14} /> Chỉnh sửa kỹ năng
                  </Button>
                </div>
                <div className="profile-skill-tags">
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="profile-heading">
                <div>
                  <h1>
                    Dịch vụ & báo giá<span>.</span>
                  </h1>
                  <p>Chọn cách chúng ta có thể cùng tạo nên điều hay.</p>
                </div>
              </div>
              <div className="profile-services">
                {services.map((service) => (
                  <section key={service.id} className="profile-info-panel">
                    <Wallet size={24} />
                    <h2>{service.title}</h2>
                    <p>{service.text}</p>
                    <strong className="profile-price">
                      Từ{" "}
                      {new Intl.NumberFormat("vi-VN").format(
                        Number(service.price)
                      )}{" "}
                      đ
                    </strong>
                    <span className="profile-price-note">
                      Báo giá tham khảo · Tùy phạm vi dự án
                    </span>
                    <Button
                      className="secondary-button profile-edit-button"
                      aria-label={`Chỉnh sửa dịch vụ ${service.title}`}
                      onClick={() =>
                        setEditing({
                          title: "Chỉnh sửa dịch vụ & báo giá",
                          fields: [
                            {
                              name: "title",
                              label: "Tên dịch vụ",
                              value: service.title,
                            },
                            {
                              name: "text",
                              label: "Mô tả dịch vụ",
                              value: service.text,
                              type: "textarea",
                            },
                            {
                              name: "price",
                              label: "Giá khởi điểm (đ)",
                              value: service.price,
                              type: "number",
                            },
                          ],
                          onSave: (values) =>
                            setServices((previous) =>
                              previous.map((item) =>
                                item.id === service.id
                                  ? {
                                      ...item,
                                      title: values.title,
                                      text: values.text,
                                      price: values.price,
                                    }
                                  : item
                              )
                            ),
                        })
                      }
                    >
                      <Pencil size={14} /> Chỉnh sửa dịch vụ
                    </Button>
                  </section>
                ))}
              </div>
            </>
          )}
          <p className="profile-demo-note">
            Hồ sơ mẫu để xem trước giao diện. Thông tin, tác phẩm và số liệu chưa
            kết nối với tài khoản thật.
          </p>
          <p className="profile-status" role="status">
            {notice}
          </p>
        </main>
      </div>
      {editing && (
        <EditProfileDialog
          request={editing}
          onClose={() => setEditing(null)}
          onSaved={() =>
            setNotice(
              "Đã cập nhật bản xem thử. Thay đổi sẽ mất khi rời trang hoặc tải lại."
            )
          }
        />
      )}
      {portfolioEditor && (
        <PortfolioEditor
          work={portfolioEditor.work}
          onClose={() => setPortfolioEditor(null)}
          onSave={(work) => {
            setWorks((previous) =>
              previous.some((item) => item.id === work.id)
                ? previous.map((item) => (item.id === work.id ? work : item))
                : [work, ...previous]
            );
            setPortfolioEditor(null);
            setNotice(
              "Đã cập nhật portfolio trong bản xem thử. Thay đổi sẽ mất khi tải lại ứng dụng."
            );
          }}
          onDelete={(id) => {
            setWorks((previous) => previous.filter((item) => item.id !== id));
            setPortfolioEditor(null);
            setNotice("Đã xóa dự án khỏi bản xem thử.");
          }}
        />
      )}
    </>
  );
}
