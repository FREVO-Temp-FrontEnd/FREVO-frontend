import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowRight, LockKeyhole, MessageCircleMore } from "lucide-react";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import ProjectChatPage from "@/features/projects/chat/ProjectChatPage";
import { useBusinessInboxPreferences, useBusinessProjectChats, type BusinessChatContact } from "../hooks/useBusinessProjectChats";

const bodyFont = '"Be Vietnam Pro", sans-serif';

function ContactOption({ contact, selected, onClick }: { contact: BusinessChatContact; selected: boolean; onClick: () => void }) {
  const lastMessage = contact.lastMessage;
  const preview = lastMessage
    ? `${lastMessage.sender === "business" ? "Bạn: " : ""}${lastMessage.body || "Đã gửi tệp đính kèm"}`
    : "Kênh trao đổi đã mở. Bắt đầu cuộc trò chuyện.";

  return (
    <button type="button" onClick={onClick} aria-current={selected ? "true" : undefined} aria-controls="business-project-conversation"
      className={`flex w-full items-start gap-3 border-b border-[#e4e6e2] px-4 py-4 text-left transition-colors last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f4490b] ${selected ? "bg-[#fff3ec]" : "hover:bg-[#f7f8f6]"}`}>
      <Avatar sx={{ width: 40, height: 40, flexShrink: 0, bgcolor: contact.talent.color, color: "#20201f", fontFamily: bodyFont, fontSize: 12, fontWeight: 700 }}>{contact.talent.initials}</Avatar>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-bold text-[#20201f]">{contact.talent.name}</span>
          <span className="rounded-full border border-[#e4e6e2] bg-white px-1.5 py-0.5 text-[10px] text-[#747773]">{contact.talent.kind}</span>
          {contact.readOnly && <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f3f0] px-1.5 py-0.5 text-[10px] font-semibold text-[#62645e]"><LockKeyhole size={10} /> Chỉ xem</span>}
        </span>
        <span className="mt-1 block truncate text-[11px] text-[#747773]">{contact.talent.role}</span>
        <span className="mt-2 block truncate text-[11px] leading-5 text-[#62645e]">{preview}</span>
      </span>
      {lastMessage && <time dateTime={lastMessage.sentAt} className="shrink-0 text-[10px] text-[#999c97]">{new Date(lastMessage.sentAt).toLocaleDateString("vi-VN")}</time>}
    </button>
  );
}

export function BusinessMessagesPage({ projectId }: { projectId: string }) {
  const { project, contacts } = useBusinessProjectChats(projectId);
  const { markRead } = useBusinessInboxPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedContact = contacts.find((contact) => contact.talent.id === searchParams.get("talent")) ?? contacts[0];

  useEffect(() => {
    if (selectedContact) markRead(projectId, selectedContact);
  }, [projectId, selectedContact, markRead]);

  if (!project) return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper", p: 4, textAlign: "center" }}>
      <Typography component="h1" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 22, fontWeight: 700 }}>Không tìm thấy dự án</Typography>
      <Button component={Link} to="/business/projects" variant="contained" sx={{ mt: 2, fontFamily: bodyFont, fontSize: 12 }}>Về dự án của tôi</Button>
    </Box>
  );

  const statusLabel = project.status === "published" ? "Đang tuyển" : project.status === "ongoing" ? "Đang thực hiện" : project.status === "completed" ? "Đã hoàn thành" : project.status === "closed" ? "Đã đóng tuyển" : "Bản nháp";

  return (
    <Box sx={{ fontFamily: bodyFont }}>
      <ProjectBreadcrumbs items={[{ label: "Dự án của tôi", to: "/business/projects" }, { label: project.title, to: `/business/projects/${project.id}` }, { label: "Hộp tin nhắn" }]} />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Typography component="h1" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: { xs: 28, sm: 34 }, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.025em" }}>Hộp tin nhắn<span className="text-[#f4490b]">.</span></Typography>
          <Typography sx={{ mt: 0.75, color: "text.secondary", fontFamily: bodyFont, fontSize: 12, lineHeight: 1.6 }}>{project.title}</Typography>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip label={statusLabel} size="small" sx={{ bgcolor: project.status === "published" ? "#e8f7ef" : "#f2f3f0", color: project.status === "published" ? "#16805b" : "#62645e", fontFamily: bodyFont, fontSize: 11, fontWeight: 700 }} />
          <Button component={Link} to={`/business/projects/${project.id}/applicants`} size="small" endIcon={<ArrowRight size={14} />} sx={{ fontFamily: bodyFont, fontSize: 11, fontWeight: 700 }}>Xem ứng viên</Button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <Box sx={{ minHeight: 350, display: "grid", placeItems: "center", border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper", p: 4, textAlign: "center" }}>
          <div>
            <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[#fff0e9] text-[#bd3d14]"><MessageCircleMore size={27} /></span>
            <Typography component="h2" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 20, fontWeight: 700 }}>Chưa có cuộc trao đổi nào</Typography>
            <Typography sx={{ mx: "auto", mt: 1, maxWidth: 440, color: "text.secondary", fontFamily: bodyFont, fontSize: 12, lineHeight: 1.7 }}>Chỉ ứng viên được bạn duyệt mới xuất hiện ở đây. Việc gửi hoặc chấp nhận lời mời chưa tự mở chat.</Typography>
            {project.status === "published" && <Button component={Link} to={`/business/projects/${project.id}/applicants`} variant="contained" size="small" endIcon={<ArrowRight size={14} />} sx={{ mt: 2.5, fontFamily: bodyFont, fontSize: 11, fontWeight: 700 }}>Xem hồ sơ chờ duyệt</Button>}
          </div>
        </Box>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[270px_minmax(0,1fr)]">
          <Box component="section" aria-label="Người đã được mở chat" sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
            <div className="flex items-center justify-between border-b border-[#e4e6e2] px-4 py-4">
              <div>
                <Typography component="h2" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 16, fontWeight: 700 }}>Cuộc trao đổi</Typography>
                <Typography sx={{ mt: 0.5, color: "text.secondary", fontFamily: bodyFont, fontSize: 11 }}>Người đã được duyệt trong dự án</Typography>
              </div>
              <span className="grid size-6 place-items-center rounded-full bg-[#f2f3f0] text-[11px] font-bold text-[#62645e]">{contacts.length}</span>
            </div>
            {contacts.map((contact) => <ContactOption key={contact.candidate.id} contact={contact} selected={selectedContact?.talent.id === contact.talent.id} onClick={() => setSearchParams({ talent: contact.talent.id })} />)}
          </Box>
          <div id="business-project-conversation" className="min-w-0">
            {selectedContact && <ProjectChatPage key={selectedContact.candidate.id} projectIdOverride={project.id} talentIdOverride={selectedContact.talent.id} embedded />}
          </div>
        </div>
      )}
    </Box>
  );
}
