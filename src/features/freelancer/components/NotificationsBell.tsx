import { useState } from "react";
import { Badge, IconButton, Popover } from "@mui/material";
import { Bell } from "lucide-react";

const notifications = [
  { title: "Doanh nghiệp đã xem hồ sơ ứng tuyển", body: "Mộc Coffee vừa xem hồ sơ của bạn", time: "15 phút trước" },
  { title: "Bạn nhận được lời mời trao đổi dự án", body: "L'Herbe Cosmetics mời ứng tuyển", time: "2 giờ trước" },
  { title: "Dự án đã lưu sắp hết hạn ứng tuyển", body: "Thiết kế app spa còn 2 ngày", time: "Hôm nay" },
];

export function NotificationsBell() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [read, setRead] = useState(false);
  return <>
    <IconButton aria-label={read ? "Thông báo" : "Thông báo, 3 tin mới"} aria-expanded={Boolean(anchor)} aria-controls={anchor ? "notifications-popover" : undefined} onClick={(event) => setAnchor(event.currentTarget)} sx={{ color: "#20201f", p: 1 }}>
      <Badge badgeContent={read ? 0 : 3} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: 10, minWidth: 16, height: 16 } }}><Bell size={21} strokeWidth={1.8} /></Badge>
    </IconButton>
    <Popover id="notifications-popover" open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { mt: 1, width: { xs: "calc(100vw - 24px)", sm: 360 }, maxWidth: 360, border: "1px solid #20201f", borderRadius: "16px", boxShadow: "0 12px 30px #20201f1f", overflow: "hidden" } } }}>
      <div className="notifications-head"><strong>Thông báo</strong><button type="button" onClick={() => setRead(true)}>Đánh dấu đã đọc</button></div>
      <div className="notifications-list">{notifications.map((item) => <div className="notification-item" key={item.title}><span className={`notification-dot ${read ? "is-read" : ""}`} /><div><strong>{item.title}</strong><p>{item.body}</p><small>{item.time}</small></div></div>)}</div>
    </Popover>
  </>;
}
