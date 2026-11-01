/** Calendar days from publication to the completion deadline, independent of DST. */
export function briefDuration(deadline: string, start: Date): string {
  if (!deadline) return "";
  const [year, month, day] = deadline.split("-").map(Number);
  const days = Math.max(0, Math.round((Date.UTC(year, month - 1, day) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86400000));
  return days % 7 === 0 && days > 0 ? `${days / 7} tuần` : `${days} ngày`;
}
