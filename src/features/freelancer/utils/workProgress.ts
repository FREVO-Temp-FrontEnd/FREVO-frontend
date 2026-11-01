import type { AgreementProposal } from '@/lib/types/marketplace.types';

export function workProgress(agreement?: AgreementProposal) {
  const milestones = agreement?.milestones ?? [];
  const completed = milestones.filter(item => item.status === 'completed').length;
  const next = milestones.find(item => item.status === 'submitted')
    ?? milestones.find(item => item.status === 'in_progress')
    ?? milestones.find(item => item.status === 'upcoming');
  const revision = next?.status !== 'submitted' && next?.revisionHistory?.some(item => !item.resolvedAt);
  return { completed, total: milestones.length, percent: milestones.length ? Math.round(completed / milestones.length * 100) : 0, next, revision };
}
