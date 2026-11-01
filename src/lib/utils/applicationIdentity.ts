import type { Candidate, TalentProfile } from '../types/marketplace.types';

export function applicationIdentity(candidate: Candidate, talent?: TalentProfile) {
  const submission = candidate.submission;
  const identity = submission?.applicantIdentity ?? (submission?.teamAtSubmission || talent?.kind === 'Team' || candidate.talentId.startsWith('managed-team:') ? 'team' : talent?.kind === 'Cá nhân' ? 'individual' : undefined);
  return {
    isTeam: identity === 'team',
    label: identity === 'team' ? 'Ứng tuyển theo nhóm · ' + (submission?.teamAtSubmission?.name || talent?.name || 'Nhóm sáng tạo') : identity === 'individual' ? 'Ứng tuyển cá nhân' : 'Chưa có thông tin tư cách ứng tuyển',
  };
}
