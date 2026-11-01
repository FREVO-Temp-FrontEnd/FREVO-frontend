import { useState } from "react";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { ArrowLeft, FilePenLine, Layers3, MessageCircle } from "lucide-react";
import { Link, Navigate } from "react-router";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import { useProjectAgreement } from "./hooks/useProjectAgreement";
import { DraftAgreementForm } from "./DraftAgreementForm";
import { AgreementReviewCard } from "./AgreementReviewCard";
import { AgreementVersionHistory } from "./AgreementVersionHistory";
import { AgreementChangeSummary } from "./AgreementChangeSummary";
import { formatMoneyText } from "@/lib/utils/money";

const panelSx = { p: { xs: 2.5, md: 3 }, borderRadius: "13px", minWidth: 0 };
const dateTime = (value: string) => new Date(value).toLocaleString("vi-VN");

export function ProjectAgreementPage() {
  const page = useProjectAgreement();
  const [response, setResponse] = useState<{ accept: boolean; id: string } | null>(null);
  const { project, talent, current, effective } = page;
  const containerSx = {
    maxWidth: 1440, mx: "auto", minWidth: 0,
    px: page.isBusiness ? 0 : { xs: 2, md: 4 },
    py: page.isBusiness ? 0 : 3,
    pb: page.isBusiness ? 0 : 6,
    "& .MuiButton-root": { minHeight: 44, fontSize: 14, whiteSpace: "nowrap" },
    "& .MuiButton-contained": { bgcolor: "primary.dark", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" } },
  };
  if (!project || !talent) return <Box sx={containerSx}>
    <Paper variant="outlined" sx={{ ...panelSx, textAlign: "center", py: 6 }}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>Chưa có thỏa thuận hợp tác</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>Chọn dự án và bên thực hiện để xem nội dung thỏa thuận.</Typography>
      <Button component={Link} to={page.isBusiness ? "/business/projects" : "/freelancer/applications"} variant="outlined">Về danh sách dự án</Button>
    </Paper>
  </Box>;
  if (!page.canAccess) return <Navigate to="/forbidden" replace />;

  const editing = page.isDrafting || !current;
  const expired = current?.status === "expired" || (current?.status === "pending" && Date.parse(current.expiresAt) <= page.now);
  const latest = current?.id === page.versions[0]?.id;
  const canRespond = !!current?.id && latest && current.status === "pending" && !expired && !editing;
  const previous = page.versions.find(item => current && item.version < current.version);
  const status = current?.isEffective ? "Đang có hiệu lực"
    : expired ? "Đã hết hạn"
    : current?.status === "rejected" ? "Đã từ chối"
    : current?.status === "superseded" ? "Đã được thay thế"
    : current?.status === "confirmed" ? "Bản đã xác nhận"
    : "Chờ phản hồi";

  return <Box component={page.isBusiness ? "div" : "main"} id={page.isBusiness ? "agreement-content" : "main"} sx={containerSx}>
    <ProjectBreadcrumbs items={[
      { label: page.isBusiness ? "Dự án của tôi" : effective ? "Công việc của tôi" : "Việc làm đã ứng tuyển", to: page.isBusiness ? "/business/projects" : effective ? "/freelancer/work" : "/freelancer/applications" },
      { label: project.title, to: page.projectPath }, { label: "Thỏa thuận" },
    ]} />
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 2, flexWrap: "wrap", mb: 3 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h1" sx={{ fontFamily: "h1.fontFamily", fontSize: { xs: 27, md: 32 }, fontWeight: 800, lineHeight: 1.25 }}>
          Thỏa thuận hợp tác<Box component="span" color="primary.main">.</Box>
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, overflowWrap: "anywhere" }}>{project.title}</Typography>
      </Box>
      <Button component={Link} to={page.projectPath} variant="outlined" color="secondary" startIcon={<ArrowLeft size={17} aria-hidden="true" />}>Về dự án</Button>
    </Box>

    {page.error && <Alert severity="error" sx={{ mb: 3 }}>{page.error}</Alert>}
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" }, gap: 3, alignItems: "start" }}>
      <Stack spacing={3} sx={{ minWidth: 0 }}>
        {effective && <Alert severity="success">
          {effective.version === current?.version
            ? "Hai bên đã xác nhận thỏa thuận. Dự án đã đóng tuyển và chọn bên thực hiện."
            : `Phiên bản ${effective.version} tiếp tục có hiệu lực cho đến khi phiên bản điều chỉnh được hai bên xác nhận.`}
        </Alert>}
        {!editing && current && !latest && <Alert severity="info" action={<Button onClick={() => page.select(page.versions[0].version)}>Xem bản mới nhất</Button>}>
          Bạn đang xem phiên bản cũ. Chỉ phiên bản mới nhất còn hạn mới có thể được phản hồi.
        </Alert>}
        {!editing && expired && <Alert severity="warning">Đề xuất đã hết hạn phản hồi. Bạn vẫn có thể xem nội dung và trao đổi để nhận phiên bản mới.</Alert>}
        {editing ? page.canPropose
          ? <DraftAgreementForm key={`${project.id}:${talent.id}:draft`} project={project} talent={talent} existingAgreement={page.versions[0] ?? effective} onSubmit={page.createProposal} onCancel={current ? () => page.setIsDrafting(false) : undefined} />
          : <Paper variant="outlined" sx={panelSx}><Typography color="text.secondary">Chưa có đề xuất để phản hồi. Bạn có thể tiếp tục trao đổi với doanh nghiệp trong Tin nhắn.</Typography></Paper>
          : <AgreementReviewCard agreement={current} project={project} talent={talent} />}
        {!editing && current && previous && <AgreementChangeSummary before={previous} after={current} />}
      </Stack>

      <Stack component="aside" aria-label="Tóm tắt và phản hồi thỏa thuận" spacing={3} sx={{ minWidth: 0 }}>
        {current && <Paper variant="outlined" sx={panelSx}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", mb: 2 }}>
            <Typography component="h2" sx={{ fontWeight: 700, fontSize: 18 }}>Tóm tắt đề xuất</Typography>
            <Chip size="small" label={status} sx={{ bgcolor: current.isEffective ? "#e8f7ef" : "#fff0e9", color: current.isEffective ? "success.dark" : "primary.dark", fontWeight: 600 }} />
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>Ngân sách đề xuất</Typography>
          <Typography sx={{ fontFamily: "h2.fontFamily", fontSize: 28, fontWeight: 800, color: "primary.dark", mt: 0.5, overflowWrap: "anywhere", fontVariantNumeric: "tabular-nums" }}>{formatMoneyText(current.budget)} đ</Typography>
          <Box component="dl" sx={{ m: 0, mt: 2.5, display: "grid", gap: 2, "& dt": { fontSize: 13, color: "text.secondary" }, "& dd": { m: 0, mt: 0.5, fontSize: 14, fontWeight: 600, overflowWrap: "anywhere" } }}>
            <Box><Typography component="dt">Hạn hoàn thành</Typography><Typography component="dd">{current.deadline}</Typography></Box>
            <Box><Typography component="dt">Kế hoạch bàn giao</Typography><Typography component="dd">{current.milestones.length} mốc công việc</Typography></Box>
            <Box><Typography component="dt">Phiên bản và người gửi</Typography><Typography component="dd">Phiên bản {current.version} · {current.createdBy?.name ?? project.company}</Typography></Box>
            <Box><Typography component="dt">Thời điểm gửi</Typography><Typography component="dd">{dateTime(current.sentAt)}</Typography></Box>
            {current.status === "pending" && <Box><Typography component="dt">Hạn phản hồi</Typography><Typography component="dd">{dateTime(current.expiresAt)}</Typography></Box>}
            {current.confirmedAt && <Box><Typography component="dt">Đã xác nhận</Typography><Typography component="dd">{dateTime(current.confirmedAt)}</Typography></Box>}
          </Box>
          <Stack spacing={1.5} sx={{ mt: 3, pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
            {!page.isBusiness && canRespond && <>
              <Typography variant="body2" color="text.secondary">Kiểm tra phạm vi, ngân sách và thời hạn trước khi phản hồi.</Typography>
              <Button variant="contained" onClick={() => current.id && setResponse({ accept: true, id: current.id })}>Xác nhận thỏa thuận</Button>
              <Button variant="outlined" color="secondary" onClick={() => current.id && setResponse({ accept: false, id: current.id })}>Từ chối đề xuất</Button>
            </>}
            {page.canPropose && !editing && <Button variant="contained" startIcon={<FilePenLine size={16} aria-hidden="true" />} onClick={() => page.setIsDrafting(true)}>{expired ? "Tạo đề xuất mới" : "Điều chỉnh đề xuất"}</Button>}
            <Button component={Link} to={page.chatPath} variant="outlined" color="secondary" startIcon={<MessageCircle size={16} aria-hidden="true" />}>Trao đổi thêm</Button>
            {effective && <Button component={Link} to={page.progressPath} variant="outlined" startIcon={<Layers3 size={16} aria-hidden="true" />}>Vào không gian làm việc</Button>}
          </Stack>
        </Paper>}
        {!current && <Button component={Link} to={page.chatPath} variant="outlined" startIcon={<MessageCircle size={16} aria-hidden="true" />}>Trao đổi thêm</Button>}
        {page.versions.length > 0 && <AgreementVersionHistory agreements={page.versions} selectedVersion={current?.version ?? 1} onSelectVersion={page.select} />}
        {page.isDemoMode && page.isBusiness && <Paper variant="outlined" sx={{ ...panelSx, borderStyle: "dashed" }}>
          <Chip size="small" label="Công cụ demo" sx={{ mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700 }}>Mô phỏng phản hồi</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>Giả lập bên thực hiện đồng ý để kiểm tra luồng chốt tuyển. Đây không phải phản hồi thật từ ứng viên.</Typography>
          <Button fullWidth variant="outlined" disabled={!page.canDemoAccept || editing} onClick={page.demoAccept}>Mô phỏng đồng ý</Button>
          {!page.canDemoAccept && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Chỉ dùng khi đề xuất mới nhất đang chờ phản hồi và còn hạn.</Typography>}
        </Paper>}
      </Stack>
    </Box>

    <Dialog open={!!response && response.id === current?.id} onClose={() => setResponse(null)} maxWidth="xs" fullWidth aria-labelledby="agreement-response-title" aria-describedby="agreement-response-description">
      <DialogTitle id="agreement-response-title">{response?.accept ? "Xác nhận thỏa thuận?" : "Từ chối đề xuất?"}</DialogTitle>
      <DialogContent><DialogContentText id="agreement-response-description">
        {project.title}. Bên thực hiện: {talent.name}. Phiên bản {current?.version}.
        {response?.accept ? " Bạn đồng ý với nội dung đề xuất này. Với đề xuất đầu tiên, dự án sẽ đóng tuyển và chọn bạn làm bên thực hiện." : " Đề xuất này sẽ bị từ chối. Bạn vẫn có thể tiếp tục trao đổi với doanh nghiệp."}
      </DialogContentText></DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: "wrap", gap: 1 }}>
        <Button onClick={() => setResponse(null)} autoFocus>Quay lại</Button>
        <Button variant="contained" sx={{ minHeight: 44, bgcolor: "primary.dark", "&:hover": { bgcolor: "primary.dark" } }} disabled={!canRespond} onClick={() => { if (response && response.id === current?.id) page.respond(response.accept); setResponse(null); }}>{response?.accept ? "Xác nhận thỏa thuận" : "Từ chối đề xuất"}</Button>
      </DialogActions>
    </Dialog>
    <Snackbar open={!!page.notice} message={page.notice} autoHideDuration={5000} onClose={() => page.setNotice("")} />
  </Box>;
}

export default ProjectAgreementPage;
