import type { PublicTeamMember, Work } from '../types/portfolio.types';

export function publicTeamMembers(members: { id: string; name: string; role: string; isLeader: boolean; talentId?: string }[]): PublicTeamMember[] {
  return members.map(({ id, name, role, isLeader, talentId }) => ({ id, name, role, isLeader, ...(talentId ? { talentId } : {}) }));
}

export function validateTeamWork(work: Work, members: PublicTeamMember[]): string {
  if (![work.title, work.category, work.role, work.description, work.contribution, work.date].every(value => typeof value === 'string' && value.trim())) return 'Điền đầy đủ tên, lĩnh vực, vai trò, mô tả, đóng góp và thời gian.';
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(work.date)) return 'Thời gian hoàn thành không hợp lệ.';
  if (!['public', 'private'].includes(work.visibility)) return 'Chọn công khai hoặc riêng tư cho tác phẩm nhóm.';
  if (work.url && !/^https?:\/\//i.test(work.url)) return 'Liên kết dự án cần bắt đầu bằng http:// hoặc https://.';
  if (!work.media.length || !work.media.some(item => item.kind === 'image') || work.media.some(item => !['image', 'video'].includes(item.kind) || !/^(https?:\/\/|data:(image\/(png|jpeg|webp|gif)|video\/mp4);base64,|\/(?!\/))/i.test(item.src))) return 'Thêm ảnh bìa và chỉ sử dụng ảnh/video hợp lệ.';
  if (!work.contributors?.length || work.contributors.some(item => !members.some(member => member.id === item.memberId) || !item.role.trim())) return 'Chọn ít nhất một thành viên và ghi rõ phần đóng góp của từng người.';
  if (new Set(work.contributors.map(item => item.memberId)).size !== work.contributors.length) return 'Mỗi thành viên chỉ được ghi nhận một lần.';
  return '';
}

export function publicTeamWorks(works: Work[]): Work[] {
  return works.filter(work => work.visibility === 'public').sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}

export function canManageTeamPortfolio(talent: { kind: string; teamLeaderId?: string } | undefined, user: { id: string; role: string }): boolean {
  return user.role === 'freelancer' && talent?.kind === 'Team' && talent.teamLeaderId === user.id;
}
