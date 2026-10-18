import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { ProjectBrief } from "@/lib/types/marketplace.types";

export function CreateBriefPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, saveProject } = useBusiness();

  const existingProject = projectId ? projects.find((p) => p.id === projectId) : undefined;

  const [title, setTitle] = useState(existingProject?.title || "");
  const [category, setCategory] = useState(existingProject?.category || "Thiết kế thương hiệu");
  const [description, setDescription] = useState(existingProject?.description || "");
  const [skills, setSkills] = useState(existingProject?.skills.join(", ") || "");
  const [budget, setBudget] = useState(existingProject?.budget || "");
  const [deadline, setDeadline] = useState(existingProject?.deadline || "");
  const [applicationDeadline, setApplicationDeadline] = useState(
    existingProject?.applicationDeadline || ""
  );
  const [deliverables, setDeliverables] = useState(
    existingProject?.deliverables.join("\n") || ""
  );
  const [preference, setPreference] = useState<ProjectBrief["preference"]>(
    existingProject?.preference || "both"
  );
  const [error, setError] = useState<string>("");

  function handleSubmit(status: "draft" | "published") {
    if (!title.trim()) {
      setError("Vui lòng nhập tên dự án.");
      return;
    }
    if (
      status === "published" &&
      (!description.trim() ||
        !skills.trim() ||
        !budget.trim() ||
        !deadline.trim() ||
        !deliverables.trim())
    ) {
      setError(
        "Hãy điền đầy đủ mô tả, kỹ năng, ngân sách, thời hạn và sản phẩm bàn giao trước khi công bố (FR-012)."
      );
      return;
    }

    setError("");

    const newOrUpdatedProject: ProjectBrief = {
      id: existingProject?.id || `project-${Date.now()}`,
      title: title.trim(),
      category,
      company: existingProject?.company || "Nắng Studio",
      remote: existingProject?.remote ?? true,
      description: description.trim(),
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      budget: budget.trim(),
      duration: existingProject?.duration || "4 tuần",
      deadline: deadline.trim(),
      applicationDeadline: applicationDeadline.trim(),
      deliverables: deliverables
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean),
      preference,
      status,
      createdAt: existingProject?.createdAt || new Date().toISOString(),
      publishedAt: status === "published" ? new Date().toISOString() : existingProject?.publishedAt,
    };

    saveProject(newOrUpdatedProject);
    navigate(`/business/projects/${newOrUpdatedProject.id}`);
  }

  return (
    <>
      <Link
        className="fb-back"
        to={existingProject ? `/business/projects/${existingProject.id}` : "/business/projects"}
      >
        <ArrowLeft size={16} /> {existingProject ? "Về dự án" : "Dự án của tôi"}
      </Link>

      <div className="fb-page-heading">
        <div>
          <span className="fb-eyebrow">PROJECT BRIEF</span>
          <h1>
            {existingProject ? "Chỉnh sửa brief" : "Tạo dự án mới"}
            <span className="fb-dot">.</span>
          </h1>
          <p>Mô tả rõ việc cần làm để freelancer đánh giá cơ hội và đưa ra đề xuất phù hợp.</p>
        </div>
      </div>

      <div className="fb-form-layout">
        <form
          className="fb-form-card"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleSubmit("published");
          }}
        >
          {/* Section 1 */}
          <div className="fb-form-section">
            <span className="fb-step">01</span>
            <div>
              <h2>Thông tin cơ bản</h2>
              <p>Giới thiệu ngắn về dự án và mục tiêu của bạn.</p>
            </div>
          </div>

          <div className="fb-fields">
            <label>
              Tên dự án <span>*</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Thiết kế bộ nhận diện thương hiệu"
                maxLength={100}
              />
            </label>

            <label>
              Lĩnh vực <span>*</span>
              <span className="fb-select">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Thiết kế thương hiệu</option>
                  <option>UI/UX & Website</option>
                  <option>Nội dung sáng tạo</option>
                  <option>Motion & Digital</option>
                </select>
                <ChevronDown size={17} />
              </span>
            </label>

            <label className="fb-field-full">
              Mô tả dự án <span>*</span>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bạn đang xây dựng điều gì? Mục tiêu và đối tượng sử dụng là ai?"
              />
            </label>
          </div>

          {/* Section 2 */}
          <div className="fb-form-section">
            <span className="fb-step">02</span>
            <div>
              <h2>Yêu cầu và phạm vi</h2>
              <p>Giúp ứng viên hình dung công việc cần thực hiện.</p>
            </div>
          </div>

          <div className="fb-fields">
            <label className="fb-field-full">
              Kỹ năng yêu cầu <span>*</span>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Brand identity, Logo design, Packaging"
              />
              <small>Ngăn cách từng kỹ năng bằng dấu phẩy.</small>
            </label>

            <label className="fb-field-full">
              Sản phẩm bàn giao <span>*</span>
              <textarea
                rows={4}
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder={"Logo chính và biến thể\nBảng màu và kiểu chữ\nBộ bài đăng mạng xã hội"}
              />
              <small>Mỗi sản phẩm bàn giao trên một dòng.</small>
            </label>

            <label>
              Ngân sách dự kiến <span>*</span>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ví dụ: 15–25 triệu"
              />
            </label>

            <label>
              Hạn hoàn thành <span>*</span>
              <input
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Ví dụ: 30/11/2026"
              />
            </label>

            <label>
              Hạn nhận hồ sơ
              <input
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                placeholder="Ví dụ: 31/10/2026"
              />
            </label>

            <fieldset className="fb-preference">
              <legend>Ưu tiên bên thực hiện (BR-001)</legend>
              <div>
                {[
                  ["both", "Cả hai"],
                  ["individual", "Cá nhân"],
                  ["team", "Team"],
                ].map(([val, lbl]) => (
                  <label key={val}>
                    <input
                      type="radio"
                      name="preference"
                      checked={preference === val}
                      onChange={() => setPreference(val as ProjectBrief["preference"])}
                    />{" "}
                    {lbl}
                  </label>
                ))}
              </div>
              <small>Ưu tiên hỗ trợ sắp xếp thứ tự phù hợp, không loại trừ hồ sơ còn lại.</small>
            </fieldset>
          </div>

          {error && (
            <p className="fb-form-error" role="alert">
              {error}
            </p>
          )}

          <div className="fb-form-actions">
            <button
              className="fb-button fb-button-secondary"
              type="button"
              onClick={() => handleSubmit("draft")}
            >
              Lưu bản nháp
            </button>
            <button className="fb-button fb-button-primary" type="submit">
              Công bố dự án <ArrowRight size={17} />
            </button>
          </div>
        </form>

        <aside className="fb-form-aside">
          <span className="fb-eyebrow">MẸO VIẾT BRIEF</span>
          <h3>Một brief rõ ràng giúp bạn nhận đề xuất sát nhu cầu hơn.</h3>
          <p>
            Nêu rõ kết quả cần có, thời gian dự kiến và khoảng ngân sách. Bạn có thể lưu nháp rồi bổ
            sung sau.
          </p>
          <div>
            <Check size={17} /> Chỉ dự án đã công bố mới nhận hồ sơ ứng tuyển và gửi lời mời.
          </div>
        </aside>
      </div>
    </>
  );
}
