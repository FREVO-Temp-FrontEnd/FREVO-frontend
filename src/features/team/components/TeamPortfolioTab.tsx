import { useState } from 'react';
import { Alert, Box, Button, Checkbox, Chip, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import { ArrowUpRight, Eye, EyeOff, Plus, Pencil, Star, X } from 'lucide-react';
import { Link } from 'react-router';
import { PortfolioCover, PortfolioEditor, FreelancerProfile } from '@/features/profile';
import { publicTeamWorks } from '@/lib/storage/teamPortfolio';
import type { PortfolioContributor, Work } from '@/lib/types/portfolio.types';
import { teamWorkPath } from '@/lib/utils/portfolioPaths';
import { useTeamPortfolio } from '../hooks/useTeamPortfolio';

export function TeamPortfolioTab({ talentId }: { talentId: string }) {
  const vm = useTeamPortfolio(talentId);
  const [editor, setEditor] = useState<{ work: Work | null } | null>(null);
  const [preview, setPreview] = useState(false);
  const [contributors, setContributors] = useState<PortfolioContributor[]>([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const members = vm.talent?.teamMembers ?? [];
  function edit(work: Work | null) {
    vm.clearError(); setContributors(work?.contributors ?? []); setCategory(work?.category ?? ''); setBrand(work?.brand ?? ''); setEditor({ work });
  }
  return <Box sx={{ py: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <Box><Typography component="h3" sx={{ fontSize: 21, fontWeight: 700 }}>Portfolio của nhóm</Typography><Typography color="text.secondary" sx={{ mt: 1, fontSize: 14, maxWidth: 540 }}>Giới thiệu thành quả chung và phần đóng góp của từng thành viên. Chỉ tác phẩm công khai được doanh nghiệp nhìn thấy.</Typography></Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', '& .MuiButton-root': { minHeight: 44 } }}><Button variant="outlined" startIcon={<Eye size={16} aria-hidden="true" />} onClick={() => setPreview(true)}>Xem hồ sơ nhóm</Button><Button variant="contained" disabled={!vm.canEdit} startIcon={<Plus size={17} aria-hidden="true" />} onClick={() => edit(null)} sx={{ bgcolor: 'primary.dark', '&:hover': { bgcolor: 'primary.dark' } }}>Thêm tác phẩm</Button></Box>
    </Box>
    {vm.error && !editor && <Alert severity="error" sx={{ mb: 2 }}>{vm.error}</Alert>}
    {!vm.canEdit && <Alert severity="info" sx={{ mb: 2 }}>Chỉ tài khoản đại diện được cập nhật portfolio của nhóm.</Alert>}
    {!vm.works.length && <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: '13px' }}><Typography component="h4" sx={{ fontWeight: 700 }}>Chưa có tác phẩm</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Thêm dự án nhóm đã thực hiện và ghi rõ vai trò của từng người.</Typography></Box>}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'repeat(2,minmax(0,1fr))' }, gap: 2.5 }}>
      {vm.works.map(work => <Box component="article" key={work.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '13px', overflow: 'hidden', minWidth: 0, bgcolor: 'background.paper' }}>
        <PortfolioCover work={work} />
        <Box sx={{ p: 2.25 }}><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}><Chip label={work.visibility === 'public' ? 'Công khai' : 'Riêng tư'} size="small" variant="outlined" />{work.featured && <Chip label="Nổi bật" size="small" sx={{ bgcolor: 'action.selected', color: 'primary.dark' }} />}{work.isSample && <Chip label="Dữ liệu mẫu" size="small" variant="outlined" />}</Box>
          <Typography component="h4" sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, overflowWrap: 'anywhere' }}>{work.title}</Typography><Typography color="text.secondary" sx={{ fontSize: 13, mt: 1 }}>{work.category}</Typography><Typography sx={{ fontSize: 14, mt: 1.5, lineHeight: 1.6 }}>{work.contribution}</Typography>
          <Box sx={{ mt: 2, display: 'grid', gap: .75 }}>{work.contributors?.map(person => <Typography key={person.memberId} sx={{ fontSize: 13, overflowWrap: 'anywhere' }}><Box component="span" sx={{ fontWeight: 700 }}>{person.name}</Box>: {person.role}</Typography>)}</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .5, mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', '& .MuiButton-root': { minHeight: 44, fontSize: 13 } }}>
            <Button disabled={!vm.canEdit} onClick={() => edit(work)} startIcon={<Pencil size={15} aria-hidden="true" />}>Sửa</Button><Button disabled={!vm.canEdit} onClick={() => vm.toggleVisibility(work)} startIcon={work.visibility === 'public' ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}>{work.visibility === 'public' ? 'Ẩn' : 'Công khai'}</Button>
            <Button disabled={!vm.canEdit || work.visibility !== 'public'} aria-pressed={!!work.featured} onClick={() => vm.toggleFeatured(work)} startIcon={<Star size={15} aria-hidden="true" />}>{work.featured ? 'Bỏ nổi bật' : 'Nổi bật'}</Button>
            {work.visibility === 'public' && <Button component={Link} to={teamWorkPath(talentId, work.id)} endIcon={<ArrowUpRight size={15} aria-hidden="true" />}>Xem</Button>}
          </Box>
        </Box>
      </Box>)}
    </Box>
    {editor && <PortfolioEditor key={editor.work?.id ?? 'new'} work={editor.work} teamName={vm.talent?.name} onClose={() => setEditor(null)} onSave={work => {
      const result = vm.save({ ...work, category: category.trim(), brand: brand.trim(), contributors, featured: editor.work?.featured ?? false, isSample: editor.work?.isSample });
      if (!result) setEditor(null);
    }} onDelete={id => { if (!vm.remove(id)) setEditor(null); }} extraFields={<Box sx={{ display: 'grid', gap: 2, py: 1 }}>
      <Typography component="h3" sx={{ fontSize: 18, fontWeight: 700 }}>Thông tin tác phẩm nhóm</Typography>
      <TextField label="Lĩnh vực" required value={category} onChange={event => setCategory(event.target.value)} slotProps={{ htmlInput: { maxLength: 100 } }} /><TextField label="Khách hàng / thương hiệu" value={brand} onChange={event => setBrand(event.target.value)} slotProps={{ htmlInput: { maxLength: 100 } }} />
      <Typography sx={{ fontWeight: 700 }}>Thành viên đóng góp *</Typography>
      {members.map(member => { const contributor = contributors.find(item => item.memberId === member.id); return <Box key={member.id}><FormControlLabel control={<Checkbox checked={!!contributor} onChange={(_, checked) => setContributors(current => checked ? [...current, { memberId: member.id, name: member.name, role: member.role, ...(member.talentId ? { talentId: member.talentId } : {}) }] : current.filter(item => item.memberId !== member.id))} />} label={member.name} />{contributor && <TextField fullWidth label={'Đóng góp của ' + member.name} required value={contributor.role} onChange={event => setContributors(current => current.map(item => item.memberId === member.id ? { ...item, role: event.target.value } : item))} slotProps={{ htmlInput: { maxLength: 200 } }} sx={{ mt: 1 }} />}</Box>; })}
      {vm.error && <Alert severity="error">{vm.error}</Alert>}
    </Box>} />}
    <Dialog open={preview} onClose={() => setPreview(false)} maxWidth="lg" fullWidth aria-labelledby="team-preview-title"><DialogTitle id="team-preview-title" sx={{ pr: 7 }}>Hồ sơ nhóm công khai<IconButton aria-label="Đóng xem trước hồ sơ nhóm" onClick={() => setPreview(false)} sx={{ position: 'absolute', top: 8, right: 8, minWidth: 44, minHeight: 44 }}><X size={20} /></IconButton></DialogTitle><DialogContent sx={{ bgcolor: 'background.default', pt: '16px !important' }}>{vm.talent && <FreelancerProfile talent={vm.talent} works={publicTeamWorks(vm.works)} embedded workPathFor={id => teamWorkPath(talentId, id)} />}</DialogContent></Dialog>
    <Snackbar open={!!vm.notice} autoHideDuration={4000} message={vm.notice} onClose={vm.clearNotice} />
  </Box>;
}
