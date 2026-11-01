import { Box, Button, InputAdornment, Pagination, Paper, Stack, TextField, Typography } from '@mui/material';
import { Briefcase, Search } from 'lucide-react';
import { Link } from 'react-router';
import { MyWorkCard } from '../components/MyWorkCard';
import { useMyWorkPage } from '../hooks/useMyWorkPage';

export default function MyWorkPage() {
  const page = useMyWorkPage();
  const title = page.filter === 'completed' ? 'Công việc đã hoàn thành' : 'Công việc đang thực hiện';
  return <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 4 }, pt: 3, pb: 6 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Không gian freelancer / Công việc của tôi</Typography>
    <Typography component="h1" sx={{ fontFamily: 'Archivo', fontSize: { xs: 27, md: 32 }, fontWeight: 800, mb: 1 }}>{title}<Box component="span" sx={{ color: 'primary.main' }}>.</Box></Typography>
    <Typography color="text.secondary" sx={{ maxWidth: 720, mb: 3 }}>Từ thỏa thuận đến bàn giao. Theo dõi tiến độ và tiếp tục công việc cùng doanh nghiệp tại đây.</Typography>
    <Paper variant="outlined" sx={{ borderRadius: '13px', mb: 3, p: { xs: 2, md: 2.5 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: "space-between", gap: 2, alignItems: { xs: "stretch", md: "center" } }}>
        <TextField size="small" label="Tìm công việc, doanh nghiệp" value={page.query} onChange={event => page.setQuery(event.target.value)} sx={{ width: { xs: '100%', md: 340 }, '& input': { minHeight: 23 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} aria-hidden="true" /></InputAdornment> } }} />
      </Stack>
    </Paper>
    <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>{page.visible.length ? ((page.page - 1) * 10 + 1) + '–' + Math.min(page.page * 10, page.visible.length) + ' trong ' + page.visible.length + ' công việc · Mới nhận gần đây' : '0 công việc'}</Typography>
    <Stack spacing={3}>{page.pageRows.map(item => <MyWorkCard key={item.candidate.id} item={item} />)}</Stack>
    {!page.visible.length && <Paper variant="outlined" sx={{ p: { xs: 3, md: 6 }, borderRadius: '13px', textAlign: 'center' }}>
      <Briefcase size={32} aria-hidden="true" style={{ margin: '0 auto 16px' }} />
      <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>{page.counts.all ? 'Không có công việc phù hợp' : 'Sẵn sàng cho công việc đầu tiên'}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>{page.counts.all ? 'Chưa có công việc trong mục này hoặc khớp với từ khóa. Bạn có thể chuyển mục trên menu Công việc của tôi.' : 'Dự án sẽ xuất hiện tại đây sau khi bạn xác nhận thỏa thuận hợp tác.'}</Typography>
      {page.counts.all ? (page.query ? <Button onClick={page.reset} variant="outlined" sx={{ minHeight: 44 }}>Xóa tìm kiếm</Button> : null) : <Button component={Link} to="/freelancer/applications" variant="outlined" sx={{ minHeight: 44 }}>Xem hồ sơ ứng tuyển</Button>}
    </Paper>}
    {page.pageCount > 1 && <Pagination count={page.pageCount} page={page.page} onChange={(_, value) => page.changePage(value)} color="primary" aria-label="Phân trang công việc" sx={{ mt: 3, '& .MuiPagination-ul': { justifyContent: 'center' } }} />}
  </Box>;
}
