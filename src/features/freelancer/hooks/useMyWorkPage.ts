import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useFreelancer } from '@/lib/hooks/useFreelancer';
import { workProgress } from '../utils/workProgress';
import { normalized } from '@/lib/utils/formatters';

export function useMyWorkPage() {
  const data = useFreelancer();
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Công việc của tôi | FREVO';
    return () => { document.title = previousTitle; };
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const filter = params.get('status') === 'completed' ? 'completed' : 'active';
  const update = (key: string, value: string) => {
    setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(key, value); else next.delete(key); next.delete('page'); return next; }, { replace: true });
  };
  const rows = data.myApplications.filter(candidate => candidate.status === 'selected').map(candidate => {
    const agreements = data.agreements.filter(item => item.projectId === candidate.projectId && item.talentId === candidate.talentId).sort((a, b) => b.version - a.version);
    const agreement = agreements[0];
    const effectiveAgreement = agreements.find(item => item.isEffective);
    const readOnly = !data.canManage(candidate);
    const pendingAgreement = !readOnly && agreement?.status === 'pending' && Date.parse(agreement.expiresAt) > now;
    return { candidate, agreement, effectiveAgreement, readOnly, pendingAgreement, project: data.projects.find(item => item.id === candidate.projectId), progress: workProgress(effectiveAgreement) };
  });
  const counts = { all: rows.length, active: rows.filter(item => item.project?.status !== 'completed').length, completed: rows.filter(item => item.project?.status === 'completed').length };
  const visible = rows.filter(({ project }) => (project?.status === 'completed' ? filter === 'completed' : filter === 'active') && normalized((project?.title ?? '') + ' ' + (project?.company ?? '')).includes(normalized(query.trim())))
    .sort((a, b) => Date.parse(b.candidate.receivedAt) - Date.parse(a.candidate.receivedAt));
  const pageCount = Math.max(1, Math.ceil(visible.length / 10));
  const requestedPage = Number(params.get('page'));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1;
  return { query, filter, counts, visible, page, pageCount, pageRows: visible.slice((page - 1) * 10, page * 10), setQuery: (value: string) => update('q', value), reset: () => setParams({ status: filter }), changePage: (value: number) => setParams(previous => { const next = new URLSearchParams(previous); next.set('page', String(value)); return next; }) };
}
export type MyWorkItem = ReturnType<typeof useMyWorkPage>['pageRows'][number];
