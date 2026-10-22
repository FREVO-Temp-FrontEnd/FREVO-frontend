export function talentProfilePath(talentId: string): string {
  return `/business/talent/${encodeURIComponent(talentId)}`;
}
export function talentWorkPath(talentId: string, workId: string): string {
  return `${talentProfilePath(talentId)}/portfolio/${encodeURIComponent(workId)}`;
}
