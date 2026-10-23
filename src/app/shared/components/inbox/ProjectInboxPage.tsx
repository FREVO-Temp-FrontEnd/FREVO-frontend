import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  LockKeyhole,
  MessageCircleMore,
  Search,
  Star,
  X,
} from "lucide-react";
import { Avatar, Box, IconButton, InputAdornment, Menu, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import ProjectChatPage from "@/features/projects/chat/ProjectChatPage";
import type { ProjectBrief, ProjectStatus } from "@/lib/types/marketplace.types";
import { useBusinessInbox, useBusinessInboxPreferences, type BusinessChatContact } from "@/lib/hooks/useProjectInbox";

import { useAuthSession } from "@/lib/hooks/useAuthSession";

const bodyFont = '"Space Grotesk", Arial, sans-serif';
const projectIconColors = [
  { foreground: "#a64220", background: "#fff0e9" },
  { foreground: "#2563a6", background: "#e7f1ff" },
  { foreground: "#187b5c", background: "#e4f5ec" },
  { foreground: "#7652a6", background: "#f1eaff" },
  { foreground: "#a66a00", background: "#fff5dd" },
  { foreground: "#0d7e89", background: "#e4f6f7" },
  { foreground: "#ad4e68", background: "#fdebf0" },
  { foreground: "#4d62b0", background: "#ecefff" },
] as const;
type InboxView = "all" | "project";
type InboxFilter = "all" | "unread" | "favorites";

interface InboxThread {
  project: ProjectBrief;
  contact: BusinessChatContact;
}

function projectStatus(status: ProjectStatus) {
  if (status === "published") return "Đang tuyển";
  if (status === "ongoing") return "Đang thực hiện";
  if (status === "draft") return "Bản nháp";
  if (status === "completed") return "Đã hoàn thành";
  return "Đã đóng tuyển";
}

function lastActivity(thread: InboxThread) {
  return thread.contact.lastMessage?.sentAt ?? thread.contact.candidate.chatUnlockedAt ?? "";
}

function formatThreadDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function ContactRow({
  thread,
  active,
  unread,
  favorite,
  showProject,
  onSelect,
  onToggleFavorite,
}: {
  thread: InboxThread;
  active: boolean;
  unread: boolean;
  favorite: boolean;
  showProject: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const { project, contact } = thread;
  const { role } = useAuthSession();
  const freelancer = role === "freelancer";
  const preview = contact.lastMessage
    ? `${contact.lastMessage.sender === (freelancer ? "talent" : "business") ? "Bạn: " : ""}${contact.lastMessage.body || "Đã gửi tệp đính kèm"}`
    : "Bắt đầu cuộc trao đổi";

  return (
    <div
      className={`group relative flex items-start border-b border-[#c8cec3] border-l-[3.5px] transition-colors last:border-b-0 ${
        active
          ? "border-l-[#bd3d14] bg-[#fff0e9] shadow-xs"
          : "border-l-transparent bg-transparent hover:bg-[#edf0f4]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        aria-controls="business-inbox-conversation"
        className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f4490b]"
      >
        <Avatar
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            bgcolor: contact.talent.color || "#f4490b",
            color: "#20201f",
            fontFamily: bodyFont,
            fontSize: 13,
            fontWeight: 700,
            borderRadius: "50%",
          }}
        >
          {freelancer ? project.company.slice(0, 2).toUpperCase() : contact.talent.initials}
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-1.5">
            <span className="flex items-center gap-1.5 truncate">
              <span
                className={`truncate text-[13.5px] leading-5 text-[#20201f] ${
                  unread ? "font-bold text-[#f4490b]" : active ? "font-bold" : "font-semibold"
                }`}
              >
                {freelancer ? project.title : contact.talent.name}
              </span>
              <span className="shrink-0 rounded bg-[#e9ebef] px-1.5 py-0.2 text-[9.5px] font-semibold text-[#555a64]">
                {freelancer ? "Doanh nghiệp" : contact.talent.kind === "Team" ? "Nhóm" : "Cá nhân"}
              </span>
            </span>
            {contact.lastMessage && (
              <time dateTime={contact.lastMessage.sentAt} className="shrink-0 text-[11px] font-normal text-[#8e918b]">
                {formatThreadDate(contact.lastMessage.sentAt)}
              </time>
            )}
          </span>

          {(freelancer || showProject) && (
            <span className="mt-0.5 block truncate text-[11px] font-medium text-[#bd3d14]">
              {freelancer ? project.company : project.title}
            </span>
          )}

          <span className={`mt-1 block truncate text-[12px] leading-snug ${unread ? "font-semibold text-[#1a1b18]" : "text-[#6c6e68]"}`}>
            {preview}
          </span>

          <span className="mt-1 flex items-center gap-2 text-[10.5px] text-[#939690]">
            {contact.readOnly && (
              <span className="inline-flex items-center gap-1 font-medium text-[#7c7e78]">
                <LockKeyhole size={10} aria-hidden="true" /> Chỉ xem
              </span>
            )}
            {unread && (
              <span className="inline-flex items-center gap-1 font-bold text-[#f4490b]">
                <span className="size-2 rounded-full bg-[#f4490b]" aria-hidden="true" />
                Mới
              </span>
            )}
          </span>
        </span>
      </button>

      {!freelancer && <Tooltip title={favorite ? "Bỏ khỏi mục yêu thích" : "Lưu vào mục yêu thích"}>
        <Box
          component="button"
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={favorite}
          aria-label={`${favorite ? "Bỏ khỏi" : "Thêm vào"} mục yêu thích: ${freelancer ? project.title : contact.talent.name} · ${project.title}`}
          className="mr-2 mt-3.5 grid size-7 shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-[#f4490b]"
          sx={{
            color: favorite ? "#d89100" : "#a8aba5",
            "&:hover": { bgcolor: "#e8eae5", color: favorite ? "#bd7800" : "#62645e" },
          }}
        >
          <Star size={15} fill={favorite ? "currentColor" : "none"} />
        </Box>
      </Tooltip>}
    </div>
  );
}

export function ProjectInboxPage() {
  const { role } = useAuthSession();
  const freelancer = role === "freelancer";
  const groups = useBusinessInbox();
  const projectIconColorById = useMemo(() => new Map(
    groups.map((group) => group.project.id).sort().map((id, index) => [id, projectIconColors[index % projectIconColors.length]]),
  ), [groups]);
  const { isUnread, isFavorite, markRead, toggleFavorite } = useBusinessInboxPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [projectMenuAnchor, setProjectMenuAnchor] = useState<HTMLElement | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const view: InboxView = !freelancer && searchParams.get("view") === "project" ? "project" : "all";
  const scope = searchParams.get("scope") ?? "";
  const query = search.trim().toLocaleLowerCase("vi");

  const allThreads = useMemo(() => groups
    .flatMap((group) => group.contacts.map((contact): InboxThread => ({ project: group.project, contact })))
    .sort((a, b) => lastActivity(b).localeCompare(lastActivity(a))), [groups]);

  const selected = allThreads.find(
    (thread) => thread.project.id === searchParams.get("project") && thread.contact.talent.id === searchParams.get("talent")
  );
  const activeThread = view === "project" && selected?.project.id !== scope ? undefined : selected;
  const selectedGroup = groups.find((group) => group.project.id === scope);
  const unreadCount = allThreads.filter((thread) => isUnread(thread.project.id, thread.contact)).length;
  const favoriteCount = allThreads.filter((thread) => isFavorite(thread.project.id, thread.contact.talent.id)).length;

  const visibleThreads = allThreads.filter((thread) => {
    if (view === "project" && thread.project.id !== scope) return false;
    if (filter === "unread" && !isUnread(thread.project.id, thread.contact)) return false;
    if (filter === "favorites" && !isFavorite(thread.project.id, thread.contact.talent.id)) return false;
    return (
      !query ||
      thread.project.title.toLocaleLowerCase("vi").includes(query) ||
      thread.contact.talent.name.toLocaleLowerCase("vi").includes(query)
    );
  });

  const availableProjectGroups = groups.filter((group) => {
    if (query && !group.project.title.toLocaleLowerCase("vi").includes(query)) return false;
    if (filter === "unread") return group.contacts.some((contact) => isUnread(group.project.id, contact));
    if (filter === "favorites") return group.contacts.some((contact) => isFavorite(group.project.id, contact.talent.id));
    return true;
  });

  useEffect(() => {
    if (activeThread) markRead(activeThread.project.id, activeThread.contact);
  }, [activeThread, markRead]);

  function switchView(nextView: InboxView) {
    setFilter("all");
    setProjectMenuAnchor(null);
    const nextParams = new URLSearchParams({ view: nextView });
    if (nextView === "project" && (activeThread?.project.id || scope)) nextParams.set("scope", activeThread?.project.id ?? scope);
    if (activeThread) {
      nextParams.set("project", activeThread.project.id);
      nextParams.set("talent", activeThread.contact.talent.id);
    }
    setSearchParams(nextParams);
  }

  function selectProject(projectId: string) {
    setFilter("all");
    setProjectMenuAnchor(null);
    setSearchParams({ view: "project", scope: projectId });
  }

  function selectConversation(thread: InboxThread) {
    setSearchParams({
      view,
      ...(view === "project" ? { scope: thread.project.id } : {}),
      project: thread.project.id,
      talent: thread.contact.talent.id,
    });
    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.requestAnimationFrame(() => conversationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  function handleBackToList() {
    const nextParams = new URLSearchParams({ view });
    if (view === "project" && scope) nextParams.set("scope", scope);
    setSearchParams(nextParams);
  }

  let emptyTitle = "Chưa có cuộc trao đổi nào";
  let emptyDescription = "Cuộc hội thoại xuất hiện khi doanh nghiệp duyệt trao đổi.";
  if (view === "project" && !scope) {
    emptyTitle = "Chọn một dự án";
    emptyDescription = "Chọn dự án đang tuyển hoặc đang thực hiện để xem hội thoại của dự án đó.";
  } else if (query) {
    emptyTitle = "Không tìm thấy hội thoại";
    emptyDescription = "Thử tìm bằng tên dự án hoặc tên người trao đổi khác.";
  } else if (filter === "unread") {
    emptyTitle = "Bạn đã đọc hết tin nhắn";
    emptyDescription = "Tin nhắn mới từ đối tác sẽ xuất hiện ở đây khi có thông báo mới.";
  } else if (filter === "favorites") {
    emptyTitle = "Chưa có mục yêu thích";
    emptyDescription = "Chọn biểu tượng ngôi sao bên cạnh một hội thoại để ghim vào danh sách ưu tiên.";
  } else if (view === "project" && selectedGroup) {
    emptyTitle = "Dự án này chưa có hội thoại";
    emptyDescription = "Sau khi doanh nghiệp duyệt trao đổi, cuộc trao đổi của dự án sẽ xuất hiện tại đây.";
  }

  return (
    <Box
      sx={{
        fontFamily: bodyFont,
        display: "grid",
        width: "100%",
        height: "100%",
        minHeight: 0,
        gridTemplateColumns: {
          xs: "1fr",
          lg: "360px minmax(0, 1fr)",
          xl: "380px minmax(0, 1fr)",
        },
        bgcolor: "#f4f5f2",
        p: { xs: "12px", lg: "20px" },
        gap: "16px",
        overflow: "hidden",
      }}
    >
      {/* Cột 2: Nav Trong Message (Cột danh sách hội thoại) */}
      <Box
        component="section"
        aria-label={view === "all" ? "Tất cả cuộc trò chuyện" : "Hội thoại theo dự án"}
        sx={{
          display: { xs: activeThread ? "none" : "flex", lg: "flex" },
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          bgcolor: "#f6f7f9",
          border: "2px solid #747773",
          borderRadius: "13px",
          overflow: "hidden",
        }}
      >
        {/* Header danh sách hội thoại */}
        <div className="border-b-2 border-[#a8b0a2] bg-[#f6f7f9] px-4 pb-3.5 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Typography
                component="h1"
                sx={{
                  fontFamily: "Archivo, Arial, sans-serif",
                  fontSize: 19,
                  fontWeight: 800,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  color: "#20201f",
                }}
              >
                Hộp tin nhắn
              </Typography>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#fff0e9] px-2 py-0.5 text-[11px] font-bold text-[#bd3d14]">
                  {unreadCount}
                </span>
              )}
            </div>
          
          </div>

          {!freelancer && (<>
          {/* Toggle Tin nhắn chung / Theo dự án */}
          <Box
            className="mt-3 flex rounded-lg bg-[#e9ebef] p-0.5"
            role="group"
            aria-label="Cách xem hộp tin nhắn"
            sx={{ "&& > button": { fontFamily: bodyFont, fontSize: 12, fontWeight: 600, lineHeight: 1.4 } }}
          >
            {([
              { value: "all", label: "Tin nhắn chung" },
              { value: "project", label: "Theo dự án" },
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={view === option.value}
                onClick={() => switchView(option.value)}
                className={`min-w-0 flex-1 rounded-md px-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-[#f4490b] ${
                  view === option.value
                    ? "bg-white font-bold text-[#bd3d14] shadow-xs"
                    : "font-semibold text-[#747773] hover:text-[#20201f]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </Box>

          </>)}
          {/* Dropdown chọn dự án khi ở tab "Theo dự án" */}
          {view === "project" && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={(event) => setProjectMenuAnchor(event.currentTarget)}
                aria-haspopup="menu"
                aria-expanded={Boolean(projectMenuAnchor)}
                aria-controls={projectMenuAnchor ? "business-project-picker" : undefined}
                className="flex w-full items-center gap-2.5 rounded-lg border border-[#deded9] bg-white px-3 py-2 text-left transition-colors hover:border-[#f5bda5] hover:bg-[#fffaf7] focus-visible:outline-2 focus-visible:outline-[#f4490b]"
              >
                <Box
                  component="span"
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    color: selectedGroup ? projectIconColorById.get(selectedGroup.project.id)?.foreground : "#bd3d14",
                    bgcolor: selectedGroup ? projectIconColorById.get(selectedGroup.project.id)?.background : "#fff0e9",
                  }}
                >
                  <BriefcaseBusiness size={14} aria-hidden="true" />
                </Box>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold text-[#20201f]">
                    {selectedGroup?.project.title ?? "Chọn một dự án để xem…"}
                  </span>
                </span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-[#747773] transition-transform ${projectMenuAnchor ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <Menu
                id="business-project-picker"
                anchorEl={projectMenuAnchor}
                open={Boolean(projectMenuAnchor)}
                onClose={() => setProjectMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: {
                      width: 320,
                      maxWidth: "calc(100vw - 32px)",
                      maxHeight: 360,
                      mt: 0.75,
                      border: "1px solid #deded9",
                      borderRadius: 2,
                      boxShadow: "0 14px 36px rgba(32,32,31,.12)",
                      "& .MuiList-root": { py: 0.75 },
                    },
                  },
                }}
              >
                {groups.length ? (
                  groups.map((group) => (
                    <MenuItem
                      key={group.project.id}
                      selected={group.project.id === scope}
                      onClick={() => selectProject(group.project.id)}
                      sx={{
                        mx: 0.75,
                        my: 0.25,
                        px: 1.25,
                        py: 1,
                        borderRadius: 1,
                        fontFamily: bodyFont,
                        alignItems: "flex-start",
                        gap: 1.25,
                        "&.Mui-selected": { bgcolor: "#fff0e9" },
                        "&.Mui-selected:hover": { bgcolor: "#ffe6d8" },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          mt: 0.25,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: 1,
                          color: projectIconColorById.get(group.project.id)?.foreground,
                          bgcolor: projectIconColorById.get(group.project.id)?.background,
                        }}
                      >
                        <BriefcaseBusiness size={14} aria-hidden="true" />
                      </Box>
                      <span className="min-w-0 flex-1">
                        <span className="block whitespace-normal text-[13px] font-semibold leading-5 text-[#20201f]">
                          {group.project.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#747773]">
                          {projectStatus(group.project.status)} · {group.contacts.length} hội thoại
                        </span>
                      </span>
                      {group.project.id === scope && (
                        <Check size={16} className="mt-1 shrink-0 text-[#bd3d14]" aria-label="Đang chọn" />
                      )}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled sx={{ fontFamily: bodyFont, fontSize: 13 }}>
                    Chưa có dự án nào
                  </MenuItem>
                )}
              </Menu>
            </div>
          )}

          {/* Ô tìm kiếm */}
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ mt: 1.5 }}
            placeholder={view === "project" && scope ? "Tìm hội thoại trong dự án…" : "Tìm theo tên hoặc dự án…"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={15} className="text-[#8e918b]" />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearch("")}
                      aria-label="Xóa tìm kiếm"
                      sx={{ p: 0.25 }}
                    >
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  fontFamily: bodyFont,
                  fontSize: 12.5,
                  borderRadius: "8px",
                  bgcolor: "#ffffff",
                  "& fieldset": { borderColor: "#dcdfe4" },
                  "&:hover fieldset": { borderColor: "#bfc4cd" },
                  "&.Mui-focused fieldset": { borderColor: "#f4490b" },
                },
              },
              htmlInput: { "aria-label": "Tìm hội thoại" },
            }}
          />

          {!freelancer && (<>
          {/* Bộ lọc Tất cả / Chưa đọc / Yêu thích */}
          <Box
            className="mt-2.5 flex gap-1 overflow-x-auto pb-0.5"
            role="group"
            aria-label="Lọc hội thoại"
            sx={{ "&& > button": { fontFamily: bodyFont, fontSize: 11, fontWeight: 600, lineHeight: 1.4 } }}
          >
            {([
              { value: "all", label: "Tất cả" },
              { value: "unread", label: `Chưa đọc${unreadCount ? ` (${unreadCount})` : ""}` },
              { value: "favorites", label: `Yêu thích${favoriteCount ? ` (${favoriteCount})` : ""}` },
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-[#f4490b] ${
                  filter === option.value
                    ? "bg-[#fff0e9] font-bold text-[#bd3d14]"
                    : "bg-[#e9ebef] text-[#555a64] hover:bg-[#dfe2e8]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </Box>
          </>)}
        </div>

        {/* Danh sách các cuộc trò chuyện */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {view === "project" && !scope ? (
            <div className="p-3">
              <p className="px-2 pb-2 text-[12px] font-semibold text-[#747773]">Chọn dự án để xem hội thoại</p>
              {availableProjectGroups.map((group) => (
                <button
                  key={group.project.id}
                  type="button"
                  onClick={() => selectProject(group.project.id)}
                  className="mb-1 flex w-full items-start gap-2.5 rounded-lg border border-transparent p-3 text-left transition-colors hover:border-[#dcdfe4] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#f4490b]"
                >
                  <Box component="span" sx={{ mt: 0.25, display: "grid", placeItems: "center", flexShrink: 0, width: 32, height: 32, borderRadius: 1.5, color: projectIconColorById.get(group.project.id)?.foreground, bgcolor: projectIconColorById.get(group.project.id)?.background }}>
                    <BriefcaseBusiness size={17} aria-hidden="true" />
                  </Box>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-[#20201f]">{group.project.title}</span>
                    <span className="mt-0.5 block text-[11px] text-[#747773]">
                      {projectStatus(group.project.status)} · {group.contacts.length} cuộc trao đổi
                    </span>
                  </span>
                </button>
              ))}
              {groups.length === 0 && <p className="px-2 py-5 text-[11px] text-[#747773]">Chưa có dự án nào.</p>}
              {groups.length > 0 && availableProjectGroups.length === 0 && (
                <p className="px-2 py-5 text-[11px] text-[#747773]">
                  {query
                    ? "Không tìm thấy dự án phù hợp."
                    : filter === "unread"
                    ? "Không có dự án với tin nhắn chưa đọc."
                    : "Chưa có dự án trong mục yêu thích."}
                </p>
              )}
            </div>
          ) : visibleThreads.length ? (
            visibleThreads.map((thread) => (
              <ContactRow
                key={`${thread.project.id}-${thread.contact.candidate.id}`}
                thread={thread}
                active={
                  activeThread?.project.id === thread.project.id &&
                  activeThread.contact.talent.id === thread.contact.talent.id
                }
                unread={isUnread(thread.project.id, thread.contact)}
                favorite={isFavorite(thread.project.id, thread.contact.talent.id)}
                showProject={view === "all"}
                onSelect={() => selectConversation(thread)}
                onToggleFavorite={() => toggleFavorite(thread.project.id, thread.contact.talent.id)}
              />
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <MessageCircleMore size={28} className="mx-auto mb-3 text-[#b2b5ae]" aria-hidden="true" />
              <p className="text-[13.5px] font-semibold text-[#20201f]">{emptyTitle}</p>
              <p className="mx-auto mt-1 max-w-[240px] text-[11.5px] leading-5 text-[#747773]">{emptyDescription}</p>
              {!freelancer && view === "project" && selectedGroup?.project.status === "published" && filter === "all" && !query && (
                <Link
                  to={`/business/projects/${selectedGroup.project.id}/applicants`}
                  className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#bd3d14] hover:underline"
                >
                  Xem ứng viên <ArrowRight size={12} />
                </Link>
              )}
            </div>
          )}
        </Box>
      </Box>

      {/* Cột 3: Message (Khung trò chuyện) */}
      <Box
        id="business-inbox-conversation"
        ref={conversationRef}
        sx={{
          display: { xs: activeThread ? "flex" : "none", lg: "flex" },
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          bgcolor: "#ffffff",
          border: "2px solid #747773",
          borderRadius: "13px",
          overflow: "hidden",
        }}
      >
        {activeThread ? (
          <ProjectChatPage
            key={`${activeThread.project.id}-${activeThread.contact.candidate.id}`}
            projectIdOverride={activeThread.project.id}
            talentIdOverride={activeThread.contact.talent.id}
            embedded
            onBackToList={handleBackToList}
          />
        ) : (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "grid",
              placeItems: "center",
              p: 4,
              textAlign: "center",
              bgcolor: "#ffffff",
            }}
          >
            <div>
              <span className="mx-auto mb-4 grid size-16 place-items-center rounded-xl bg-[#fff0e9] text-[#bd3d14]">
                <MessageCircleMore size={30} />
              </span>
              <Typography
                component="h2"
                sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 20, fontWeight: 700, color: "#20201f" }}
              >
                {view === "project" && !scope
                  ? "Chọn một dự án để xem hội thoại"
                  : allThreads.length
                  ? "Chọn một cuộc trò chuyện để bắt đầu"
                  : "Chưa có cuộc trao đổi nào"}
              </Typography>
              <Typography
                sx={{
                  mx: "auto",
                  mt: 1.25,
                  maxWidth: 420,
                  color: "text.secondary",
                  fontFamily: bodyFont,
                  fontSize: 13,
                  lineHeight: 1.65,
                }}
              >
                {view === "project" && !scope
                  ? "Các dự án có ứng viên được duyệt sẽ xuất hiện trong danh sách bên trái."
                  : "Chọn hội thoại từ danh sách bên trái để trao đổi chi tiết về yêu cầu dự án, tiến độ và giải đáp thắc mắc cùng đối tác."}
              </Typography>
              {allThreads.length === 0 && (
                <Link
                  to={freelancer ? "/freelancer/applications" : "/business/projects"}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#f4490b] px-4 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-[#bd3d14]"
                >
                  Xem dự án của tôi <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
}
