import { FileText } from "lucide-react";
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';
import { applicationLabels } from '../hooks/useApplicationsPage';
import type { AgreementProposal, Candidate, ProjectBrief } from '@/lib/types/marketplace.types';
export interface ApplicationItem {
    candidate: Candidate;
    project?: ProjectBrief;
    readOnly?: boolean;
    agreement?: AgreementProposal;
    pendingAgreement?: boolean;
}
const applicationDate = (value: string) => new Date(value).toLocaleDateString('vi-VN');
export function ApplicationCard({ item, selected, onSelect, onWithdraw }: {
    item: ApplicationItem;
    selected: boolean;
    onSelect: () => void;
    onWithdraw: () => void;
}) {
    const { candidate: c, project: p } = item;
    return <Box component="article" sx={{ position: 'relative', p: 2.5, bgcolor: 'background.paper', border: selected ? '2px solid' : '1px solid', borderColor: selected ? 'text.primary' : 'divider', borderRadius: '13px', boxShadow: selected ? '4px 4px 0 #f4490b' : 'none' }}>
 <Stack direction="row" sx={{
        gap: 1.5,
        alignItems: "start",
        flexWrap: "wrap"
    }}><Box sx={{ width: 42, height: 42, bgcolor: '#fff0e9', borderRadius: '9px', display: 'grid', placeItems: 'center', fontWeight: 800, color: 'primary.dark' }}>{p?.company?.slice(0, 1) ?? 'F'}</Box><Box sx={{ flex: 1, minWidth: 160 }}><Typography variant="caption" color="text.secondary">{p?.company ?? 'Doanh nghiệp'} / {p?.category ?? 'Dự án'}</Typography><Button disableRipple onClick={onSelect} aria-pressed={selected} sx={{ position: 'static', display: 'block', p: 0, textAlign: 'left', color: 'text.primary', fontFamily: 'Archivo, sans-serif', fontSize: 17, borderRadius: 1, '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: '13px', zIndex: 1 }, '&.Mui-focusVisible::after': { outline: '2px solid', outlineColor: 'primary.dark', outlineOffset: 3 } }}>{p?.title ?? 'Dự án không còn khả dụng'}</Button></Box><Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{!item.readOnly && item.agreement && <Chip size="small" icon={<FileText size={14} aria-hidden="true" />} label="Có thỏa thuận" sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontWeight: 700 }} />}<Chip size="small" label={c.status === "offer" ? "Đang trao đổi" : applicationLabels[c.status]} sx={{ bgcolor: c.status === 'offer' ? '#fff0e9' : '#eef0eb', color: c.status === 'offer' ? 'primary.dark' : 'text.primary' }}/></Box></Stack>
 <Stack direction="row" sx={{
        gap: 2,
        flexWrap: "wrap",
        ...{ my: 2 }
    }}><Typography variant="body2" sx={{
        fontWeight: 600
    }}>{p?.budget ?? 'Thỏa thuận'} / dự án</Typography><Typography variant="body2" color="text.secondary">{p?.duration ?? 'Chưa xác định'}</Typography><Typography variant="body2" color="text.secondary">{c.source}</Typography><Typography variant="caption" color="text.secondary" sx={{ ml: { sm: 'auto' } }}>Nộp {applicationDate(c.receivedAt)}</Typography></Stack>
 <Stack direction={{ xs: 'column', sm: 'row' }} sx={{
        gap: 1,
        justifyContent: "space-between",
        alignItems: { sm: 'center' },
        ...{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }
    }}><Typography variant="caption" color="text.secondary">{c.status === 'not_selected' ? 'Hồ sơ không tiếp tục xét duyệt' : c.chatUnlocked ? 'Doanh nghiệp đã duyệt hồ sơ.' : 'Chat sẽ mở khi doanh nghiệp duyệt hồ sơ.'}</Typography><Stack direction="row" sx={{
        gap: 1,
        justifyContent: "end"
    }}>{!item.readOnly && ['new', 'under_review'].includes(c.status) && <Button size="small" color="secondary" sx={{ position: 'relative', zIndex: 2 }} onClick={onWithdraw}>Rút hồ sơ</Button>}<Button size="small" sx={{ position: 'relative', zIndex: 2 }} onClick={onSelect}>Xem hồ sơ</Button></Stack></Stack>
 </Box>;
}
export function ApplicationDetail({ item }: {
    item: ApplicationItem;
}) {
    const { candidate: c, project: p } = item;
    const chat = !item.readOnly && c.chatUnlocked && ['discussing', 'offer', 'selected'].includes(c.status);
    return <Box component="aside" aria-label="Chi tiết hồ sơ ứng tuyển" sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '13px' }}><Typography variant="h6" sx={{
        fontWeight: 700
    }}>Hồ sơ ứng tuyển</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>{p?.company}</Typography><Typography variant="h6" sx={{ mt: 1, mb: 2 }}>{p?.title ?? 'Dự án không còn khả dụng'}</Typography><Chip label={c.status === "offer" ? "Đang trao đổi" : applicationLabels[c.status]} size="small"/><Box sx={{ my: 3, p: 2, bgcolor: '#fff0e9', borderRadius: '13px' }}><Typography variant="body2">{item.pendingAgreement ? 'Doanh nghiệp đã gửi đề xuất hợp tác. Xem chi tiết để phản hồi.' : chat ? 'Hồ sơ đã được duyệt. Bạn có thể tiếp tục trao đổi.' : c.status === 'not_selected' ? 'Hồ sơ đã đóng. Bạn có thể xem lại nội dung đã gửi.' : 'Hồ sơ đang chờ doanh nghiệp xét duyệt.'}</Typography>{!item.readOnly && item.agreement && <Box sx={{ mt: 2 }}><Typography variant="body2">Phiên bản {item.agreement.version} · Hạn phản hồi: {new Date(item.agreement.expiresAt).toLocaleString("vi-VN")}</Typography><Button component={Link} to={`/projects/${encodeURIComponent(c.projectId)}/agreement?${new URLSearchParams({ talent: c.talentId })}`} variant="contained" fullWidth sx={{ mt: 1 }}>Xem thỏa thuận</Button></Box>}{chat && !item.pendingAgreement && <Button component={Link} to={c.status === 'selected' ? `/workspace/${c.projectId}` : `/freelancer/messages?${new URLSearchParams({ project: c.projectId, talent: c.talentId })}`} variant="contained" fullWidth sx={{ mt: 2 }}>{c.status === 'selected' ? 'Không gian làm việc' : 'Mở trao đổi'}</Button>}</Box><Typography variant="body2" sx={{
        fontWeight: 700
    }}>Tiến trình hồ sơ</Typography><Typography variant="body2" sx={{ mt: 1 }}>Đã gửi hồ sơ: {applicationDate(c.receivedAt)}</Typography>{c.chatUnlockedAt && <Typography variant="body2" sx={{ mt: 1 }}>Đã mở trao đổi: {applicationDate(c.chatUnlockedAt)}</Typography>}<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{applicationLabels[c.status]}</Typography>{c.proposal && <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 3, pt: 3 }}><Typography variant="body2" sx={{
        fontWeight: 700
    }}>Đề xuất của bạn</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{c.proposal}</Typography></Box>}{p && <Button component={Link} to={`/projects/${c.projectId}/details`} fullWidth sx={{ mt: 3 }}>Xem chi tiết dự án</Button>}</Box>;
}
