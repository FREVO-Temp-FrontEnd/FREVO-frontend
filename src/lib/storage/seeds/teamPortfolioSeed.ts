import { initialWorks } from './portfolioSeed';
import type { PublicTeamMember, Work } from '@/lib/types/portfolio.types';

export const sampleTeamMembers: PublicTeamMember[] = [
  { id: 'minh-anh', talentId: 'minh-anh', name: 'Minh Anh', role: 'Định hướng sáng tạo', isLeader: true },
  { id: 'quoc-huy-demo', name: 'Quốc Huy', role: 'Thiết kế nhận diện', isLeader: false },
  { id: 'thuy-trang-demo', name: 'Thùy Trang', role: 'Minh họa & hình ảnh', isLeader: false },
];

export function teamPortfolioSamples(name: string, members: PublicTeamMember[]): Work[] {
  return [initialWorks[0], initialWorks[2]].map((work, index) => ({
    ...structuredClone(work), id: 'team-demo-' + (index ? 'herbe' : 'moc'), title: work.title.replace(/[—–]/g, '-'),
    team: name, role: 'Định hướng sáng tạo và thiết kế', featured: true, isSample: true, views: 0, likes: 0,
    contribution: 'Dự án mẫu: nhóm xây dựng định hướng hình ảnh, thiết kế hệ nhận diện và ứng dụng trên bao bì.',
    contributors: members.map(member => ({ memberId: member.id, name: member.name, role: member.role, ...(member.talentId ? { talentId: member.talentId } : {}) })),
  }));
}

export function seededTeamPortfolio(talentId: string) {
  if (!['may-creative', 'studio-dau'].includes(talentId)) return undefined;
  const name = talentId === 'may-creative' ? 'Mây Creative' : 'Studio Dâu';
  const ids = talentId === 'may-creative' ? ['lala-id', 'som-campaign'] : ['mua-vi', 'cham-camp'];
  return teamPortfolioSamples(name, sampleTeamMembers).map((work, index) => ({ ...work, id: ids[index] }));
}
