import { useState } from 'react';
import { useFreelancer } from '@/lib/hooks/useFreelancer';
import type { Candidate } from '@/lib/types/marketplace.types';
export const applicationLabels: Record<Candidate['status'], string> = { new: 'Chờ xét duyệt', under_review: 'Chờ xét duyệt', discussing: 'Đang trao đổi', offer: 'Chờ xác nhận', selected: 'Đã được chọn', not_selected: 'Đã đóng / Đã rút' };
const PAGE_SIZE = 10;
export function useApplicationsPage() {
    const data = useFreelancer();
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('new');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [withdrawId, setWithdrawId] = useState<string | null>(null);
    const filterKey = `${filter}:${query.trim().toLocaleLowerCase('vi')}`;
    const [pagination, setPagination] = useState({ filterKey, page: 1 });
    const rows = data.myApplications.map(candidate => ({ candidate, readOnly: !data.canManage(candidate), project: data.projects.find(p => p.id === candidate.projectId) }));
    const visible = rows.filter(({ candidate, project }) => {
        const matchesStatus = filter === 'new'
            ? ['new', 'under_review'].includes(candidate.status)
            : filter === 'discussing'
                ? ['discussing', 'offer'].includes(candidate.status)
                : candidate.status === 'selected';
        return matchesStatus && `${project?.title ?? ''} ${project?.company ?? ''}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'));
    }).sort((a, b) => Date.parse(b.candidate.receivedAt) - Date.parse(a.candidate.receivedAt));
    if (pagination.filterKey !== filterKey) setPagination({ filterKey, page: 1 });
    const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
    const page = pagination.filterKey === filterKey ? Math.min(pagination.page, pageCount) : 1;
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageRows = visible.slice(pageStart, pageStart + PAGE_SIZE);
    const selected = pageRows.find(r => r.candidate.id === selectedId) ?? pageRows[0];
    const withdrawCandidate = data.myApplications.find(c => c.id === withdrawId);
    const confirmWithdraw = () => { if (withdrawCandidate && ['new', 'under_review'].includes(withdrawCandidate.status))
        data.withdrawApplication(withdrawCandidate.id); setWithdrawId(null); };
    const statusCounts: Record<string, number> = { new: 0, discussing: 0, selected: 0 };
    for (const { candidate } of rows) {
        if (['new', 'under_review'].includes(candidate.status)) statusCounts.new += 1;
        if (['discussing', 'offer'].includes(candidate.status)) statusCounts.discussing += 1;
        if (candidate.status === 'selected') statusCounts.selected += 1;
    }
    const changePage = (nextPage: number) => {
        setSelectedId(null);
        setPagination({ filterKey, page: Math.max(1, Math.min(nextPage, pageCount)) });
    };
    return { statusCounts, ...data, rows, visible, pageRows, page, pageCount, firstResult: visible.length ? pageStart + 1 : 0, lastResult: Math.min(pageStart + PAGE_SIZE, visible.length), changePage, selected, query, setQuery, filter, setFilter, setSelectedId, withdrawCandidate, setWithdrawId, confirmWithdraw };
}
