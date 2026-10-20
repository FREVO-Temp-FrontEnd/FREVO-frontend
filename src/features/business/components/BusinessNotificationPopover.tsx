import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Bell } from "lucide-react";
import { Box, Popover, Typography } from "@mui/material";
import { useBusinessNotifications } from "../hooks/useBusinessNotifications";

const bodyFont = '"Space Grotesk", Arial, sans-serif';

export function BusinessNotificationPopover() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead } = useBusinessNotifications();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={`Thông báo, ${unreadCount} chưa đọc`}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        aria-controls={anchor ? "business-notification-preview" : undefined}
        sx={{
          position: "relative",
          display: "grid",
          placeItems: "center",
          width: 38,
          height: 38,
          p: 0,
          border: 0,
          borderRadius: "50%",
          bgcolor: "transparent",
          color: "#464742",
          cursor: "pointer",
          "&:hover": { bgcolor: "#f2f3f0" },
          "&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: 2 },
        }}
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <Box component="span" sx={{ position: "absolute", top: 4, right: 3, width: 8, height: 8, borderRadius: "50%", bgcolor: "#ff5e22" }} />
        )}
      </Box>

      <Popover
        id="business-notification-preview"
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { role: "dialog", "aria-label": "Thông báo", sx: { mt: 1, width: 380, maxWidth: "calc(100vw - 24px)", maxHeight: "min(540px, calc(100dvh - 90px))", border: "1px solid #e4e6e2", borderRadius: 2, boxShadow: "0 16px 40px rgba(32,32,31,.14)", overflow: "hidden" } } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, px: 2.25, py: 1.75, borderBottom: "1px solid #e4e6e2" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography component="h2" sx={{ fontFamily: '"Archivo", Arial, sans-serif', fontSize: 17, fontWeight: 800, color: "#20201f" }}>Thông báo</Typography>
            {unreadCount > 0 && <Box component="span" sx={{ px: 0.8, py: 0.2, borderRadius: 999, bgcolor: "#fff0e9", color: "#bd3d14", fontSize: 11, fontWeight: 700 }}>{unreadCount} mới</Box>}
          </Box>
          {unreadCount > 0 && (
            <Box component="button" type="button" onClick={markAllRead} sx={{ p: 0, border: 0, bgcolor: "transparent", color: "#747773", fontFamily: bodyFont, fontSize: 11, fontWeight: 700, cursor: "pointer", "&:hover": { color: "#bd3d14" }, "&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: 2 } }}>
              Đánh dấu đã đọc
            </Box>
          )}
        </Box>

        <Box sx={{ maxHeight: 340, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Box sx={{ px: 3, py: 5, textAlign: "center", color: "#747773" }}>
              <Bell size={25} aria-hidden="true" />
              <Typography sx={{ mt: 1, fontFamily: bodyFont, fontSize: 13 }}>Chưa có thông báo nào.</Typography>
            </Box>
          ) : notifications.slice(0, 5).map((notification) => (
            <Box
              component="button"
              type="button"
              key={notification.id}
              onClick={() => {
                markRead(notification.id);
                setAnchor(null);
                navigate(notification.href);
              }}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
                width: "100%",
                px: 2.25,
                py: 1.5,
                border: 0,
                borderBottom: "1px solid #f0f1ed",
                bgcolor: notification.read ? "#fff" : "#fff8f4",
                textAlign: "left",
                cursor: "pointer",
                "&:hover": { bgcolor: "#f7f8f6" },
                "&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: -2 },
              }}
            >
              <Box component="span" sx={{ display: "grid", placeItems: "center", flexShrink: 0, width: 32, height: 32, borderRadius: 1.25, bgcolor: "#fff0e9", color: "#bd3d14" }}><Bell size={16} aria-hidden="true" /></Box>
              <Box component="span" sx={{ minWidth: 0, flex: 1 }}>
                <Typography component="span" sx={{ display: "block", fontFamily: bodyFont, fontSize: 12.5, fontWeight: notification.read ? 600 : 700, color: "#20201f" }}>{notification.title}</Typography>
                <Typography component="span" sx={{ display: "block", mt: 0.25, fontFamily: bodyFont, fontSize: 11.5, lineHeight: 1.45, color: "#747773" }}>{notification.detail}</Typography>
                <Typography component="span" sx={{ display: "block", mt: 0.5, fontFamily: bodyFont, fontSize: 10.5, color: "#999c97" }}>{notification.time}</Typography>
              </Box>
              {!notification.read && <Box component="span" sx={{ mt: 0.5, width: 7, height: 7, flexShrink: 0, borderRadius: "50%", bgcolor: "#f4490b" }} />}
            </Box>
          ))}
        </Box>

        <Box component="button" type="button" onClick={() => { setAnchor(null); navigate("/business/notifications"); }} sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, width: "100%", py: 1.5, border: 0, bgcolor: "#fff", color: "#bd3d14", fontFamily: bodyFont, fontSize: 12.5, fontWeight: 700, cursor: "pointer", "&:hover": { bgcolor: "#fff0e9" }, "&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: -2 } }}>
          Xem tất cả <ArrowRight size={15} aria-hidden="true" />
        </Box>
      </Popover>
    </>
  );
}
