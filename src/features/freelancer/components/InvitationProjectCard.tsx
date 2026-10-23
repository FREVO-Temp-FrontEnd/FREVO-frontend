import { Box, Button, Typography } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { Invitation, ProjectBrief } from "@/lib/types/marketplace.types";
import "./invitation-project-card.css";

interface InvitationProjectCardProps {
  invitation: Invitation;
  project: ProjectBrief;
  selected: boolean;
  onSelect: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function InvitationProjectCard({ invitation, project, selected, onSelect, onAccept, onDecline }: InvitationProjectCardProps) {
  const categoryType = project.category.toLocaleLowerCase("vi").includes("nội dung") ? "content" : project.type ?? "brand";
  return (
    <article className={`project-card interactive-card invitation-project-card ${selected ? "selected" : ""}`}>
      <button className="card-main" type="button" aria-pressed={selected} aria-label={`Xem thông tin ${project.title}`} onClick={onSelect}>
        <span className="card-top">
          <span className={`category-pill ${categoryType}`}>{project.category}</span>
          <span className="age">Chờ phản hồi</span>
        </span>
        <h3>{project.title}</h3>
        <span className="card-company">{project.company}{project.city ? ` · ${project.city}` : ""}{project.remote ? " · Từ xa" : ""}</span>
      </button>
      <Box className="invitation-card-actions">
        <Button component={Link} to={`/projects/${encodeURIComponent(project.id)}/details`} variant="outlined" endIcon={<ArrowUpRight size={17} aria-hidden="true" />} aria-label={`Xem thêm về ${project.title}`} sx={{ borderColor: "primary.dark", color: "primary.dark", "&:hover": { borderColor: "primary.dark", bgcolor: "primary.dark", color: "primary.contrastText" } }}>Xem thêm</Button>
        <Button variant="contained" onClick={onAccept}>Chấp nhận</Button>
        <Button variant="outlined" color="secondary" onClick={onDecline}>Từ chối</Button>
      </Box>
      <div className="card-bottom">
        <dl className="card-facts">
          <div><dt>Ngân sách</dt><dd>{project.budget}</dd></div>
          <div><dt>Hạn dự án</dt><dd>{project.deadline}</dd></div>
          <div><dt>Phản hồi trước</dt><dd>{new Date(invitation.expiresAt).toLocaleDateString("vi-VN")}</dd></div>
        </dl>
        <ul className="skill-list" aria-label="Kỹ năng cần thiết">
          {project.skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
      </div>
      {invitation.note && <Box className="invitation-message"><Typography variant="caption" component="strong">Lời nhắn từ doanh nghiệp</Typography><Typography variant="body2">“{invitation.note}”</Typography></Box>}
    </article>
  );
}
