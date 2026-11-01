import { Avatar, Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { ArrowUpRight, Briefcase, FileText, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';
import { formatMoneyText } from '@/lib/utils/money';
import type { MyWorkItem } from '../hooks/useMyWorkPage';

export function MyWorkCard({ item }: { item: MyWorkItem }) {
  const { project, candidate, agreement, effectiveAgreement: effective, pendingAgreement, readOnly, progress } = item;
  const completed = project?.status === 'completed';
  const agreementPath = '/projects/' + encodeURIComponent(candidate.projectId) + '/agreement?' + new URLSearchParams({ talent: candidate.talentId });
  const workspacePath = '/workspace/' + encodeURIComponent(candidate.projectId);
  const nextLabel = progress.next?.name.replace(/^Mốc\s*\d+\s*[·:–-]\s*/i, '');
  return <Paper component="article" variant="outlined" sx={{ borderRadius: '13px', overflow: 'hidden' }}>
    <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(220px, 1fr) 180px' }, gap: 3, alignItems: 'center' }}>
      <Stack direction="row" spacing={2} sx={{ minWidth: 0, alignItems: "flex-start" }}>
        <Avatar variant="rounded" src={project?.heroImage} alt="" sx={{ width: { xs: 56, sm: 80 }, height: { xs: 56, sm: 80 }, borderRadius: '10px', bgcolor: 'background.default', color: 'primary.dark' }}><Briefcase size={28} aria-hidden="true" /></Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{project?.company ?? 'Doanh nghiệp'}</Typography>
          <Typography component="h2" sx={{ fontFamily: 'Archivo', fontSize: { xs: 19, md: 21 }, fontWeight: 700, lineHeight: 1.4, overflowWrap: 'anywhere', mb: 1.5 }}>
            {!readOnly && project ? <Box component={Link} to={workspacePath} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.dark' } }}>{project.title}</Box> : project?.title ?? 'Dự án không còn khả dụng'}
          </Typography>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}><Chip size="small" variant="outlined" label={completed ? 'Đã hoàn thành' : 'Đang thực hiện'} />{pendingAgreement && <Chip size="small" label="Có thỏa thuận mới" sx={{ bgcolor: 'primary.light', color: 'primary.dark' }} />}</Stack>
        </Box>
      </Stack>
      <Box>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1, mb: 1 }}><Typography variant="body2" sx={{ fontWeight: 600 }}>Tiến độ nghiệm thu</Typography><Typography variant="body2">{progress.percent}%</Typography></Stack>
        <LinearProgress variant="determinate" value={progress.percent} aria-label={'Tiến độ ' + (project?.title ?? 'công việc')} sx={{ height: 6, borderRadius: 99, bgcolor: 'background.default' }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{progress.total ? progress.completed + '/' + progress.total + ' mốc đã nghiệm thu' : 'Chưa có mốc công việc'}</Typography>
      </Box>
      <Box component="dl" sx={{ m: 0, display: 'grid', gap: 1.5, '& dt': { fontSize: 13, color: 'text.secondary' }, '& dd': { m: 0, mt: .5, fontSize: 15, fontWeight: 600 } }}>
        <Box><Typography component="dt">Giá trị thỏa thuận</Typography><Typography component="dd">{effective ? formatMoneyText(effective.budget) + ' đ' : 'Chưa có thỏa thuận hiệu lực'}</Typography></Box>
        <Box><Typography component="dt">Hạn hoàn thành</Typography><Typography component="dd">{effective?.deadline ?? 'Theo thỏa thuận'}</Typography></Box>
      </Box>
    </Box>
    <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2, bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ flex: '1 1 260px' }}><Typography variant="body2" sx={{ fontWeight: 600, color: pendingAgreement ? 'primary.dark' : 'text.primary' }}>{pendingAgreement ? 'Đề xuất điều chỉnh đang chờ bạn phản hồi' : completed ? 'Dự án đã hoàn thành' : progress.revision ? 'Cần chỉnh sửa sản phẩm bàn giao' : progress.next?.status === 'submitted' ? 'Đang chờ doanh nghiệp nghiệm thu' : nextLabel ? 'Mốc tiếp theo: ' + nextLabel : 'Theo dõi chi tiết trong không gian công việc'}</Typography>
        {readOnly ? <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Tài khoản đại diện ứng tuyển quản lý công việc của nhóm.</Typography> : progress.next && !pendingAgreement && !completed && <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Hạn mốc: {progress.next.deadline}</Typography>}
      </Box>
      {!readOnly && <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', '& .MuiButton-root': { minHeight: 44 } }}>
        <Button component={Link} to={'/freelancer/messages?' + new URLSearchParams({ project: candidate.projectId, talent: candidate.talentId })} disabled={!candidate.chatUnlocked} startIcon={<MessageCircle size={16} aria-hidden="true" />}>Tin nhắn</Button>
        {agreement && <Button component={Link} to={agreementPath} variant={pendingAgreement ? 'outlined' : 'text'} startIcon={<FileText size={16} aria-hidden="true" />}>{pendingAgreement ? 'Xem đề xuất' : 'Thỏa thuận'}</Button>}
        <Button component={Link} to={workspacePath} variant="contained" disabled={!project} endIcon={<ArrowUpRight size={17} aria-hidden="true" />} sx={{ bgcolor: 'primary.dark', '&:hover': { bgcolor: 'primary.dark' } }}>Xem tiến độ</Button>
      </Stack>}
    </Box>
  </Paper>;
}
