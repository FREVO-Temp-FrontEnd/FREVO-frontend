import { canManageTeamPortfolio } from "@/lib/storage/teamPortfolio";
import { useState } from 'react';
import { useBusiness } from '@/lib/hooks/useBusiness';
import { useAuthSession } from '@/lib/hooks/useAuthSession';
import { mockStorage } from '@/lib/storage/mockStorage';
import type { Work } from '@/lib/types/portfolio.types';

export function useTeamPortfolio(talentId: string) {
  const { teamPortfolios, talents } = useBusiness();
  const { user, role } = useAuthSession();
  const talent = talents.find(item => item.id === talentId);
  const works = teamPortfolios[talentId] ?? [];
  const canEdit = canManageTeamPortfolio(talent, { id: user?.id ?? '', role });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  function persist(next: Work[], message: string) {
    try { mockStorage.saveTeamPortfolio(talentId, next); setError(''); setNotice(message); return ''; }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Chưa lưu được portfolio nhóm.'; setError(message); return message; }
  }
  return { talent, works, canEdit, error, notice, clearNotice: () => setNotice(''), clearError: () => setError(''),
    save: (work: Work) => persist(works.some(item => item.id === work.id) ? works.map(item => item.id === work.id ? work : item) : [...works, work], 'Đã lưu tác phẩm nhóm.'),
    remove: (id: string) => persist(works.filter(item => item.id !== id), 'Đã xóa tác phẩm khỏi portfolio nhóm.'),
    toggleVisibility: (work: Work) => persist(works.map(item => item.id === work.id ? { ...item, visibility: work.visibility === 'public' ? 'private' : 'public', featured: false } : item), work.visibility === 'public' ? 'Đã ẩn tác phẩm với doanh nghiệp.' : 'Đã công khai tác phẩm.'),
    toggleFeatured: (work: Work) => persist(works.map(item => item.id === work.id ? { ...item, featured: !work.featured } : item), 'Đã cập nhật tác phẩm nổi bật.'),
  };
}
