import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Bell,
  ClipboardCheck,
  FileSignature,
  FileUser,
  MessageCircle,
  SendHorizontal,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { useBusinessNotifications } from "../hooks/useBusinessNotifications";
import type { NotificationItem, NotificationType } from "@/lib/types/marketplace.types";

const typeMeta: Record<NotificationType, { icon: ReactNode; bg: string; color: string; border: string }> = {
  application: {
    icon: <FileUser size={16} strokeWidth={2} />,
    bg: "#fff0e9",
    color: "#bd3d14",
    border: "#ffd5c4",
  },
  chat: {
    icon: <MessageCircle size={16} strokeWidth={2} />,
    bg: "#ecfdf5",
    color: "#059669",
    border: "#d1fae5",
  },
  agreement: {
    icon: <FileSignature size={16} strokeWidth={2} />,
    bg: "#fffbeb",
    color: "#d97706",
    border: "#fef3c7",
  },
  milestone: {
    icon: <ClipboardCheck size={16} strokeWidth={2} />,
    bg: "#f0fdfa",
    color: "#0f766e",
    border: "#ccfbf1",
  },
  invitation: {
    icon: <SendHorizontal size={16} strokeWidth={2} />,
    bg: "#eff6ff",
    color: "#1d4ed8",
    border: "#dbeafe",
  },
  review: {
    icon: <Star size={16} strokeWidth={2} />,
    bg: "#faf5ff",
    color: "#7c3aed",
    border: "#f3e8ff",
  },
  system: {
    icon: <ShieldCheck size={16} strokeWidth={2} />,
    bg: "#f8fafc",
    color: "#475569",
    border: "#e2e8f0",
  },
};

export function BusinessNotificationPopover() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead } = useBusinessNotifications();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleItemClick = (notification: NotificationItem) => {
    markRead(notification.id);
    setAnchor(null);
    if (notification.href) {
      navigate(notification.href);
    }
  };

  const handleMarkAll = () => {
    markAllRead();
  };

  return (
    <>
      <IconButton
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={unreadCount > 0 ? `Thông báo, ${unreadCount} chưa đọc` : "Thông báo"}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        aria-controls={anchor ? "business-notification-popover" : undefined}
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          color: "#464742",
          transition: "background-color 0.15s ease, color 0.15s ease",
          "&:hover": { bgcolor: "#f2f3f0", color: "#20201f" },
          "&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: 2 },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#f4490b",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "11px",
              minWidth: 18,
              height: 18,
              borderRadius: "999px",
              px: 0.5,
              border: "2px solid #ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            },
          }}
        >
          <Bell size={21} strokeWidth={1.8} aria-hidden="true" />
        </Badge>
      </IconButton>

      <Popover
        id="business-notification-popover"
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            role: "dialog",
            "aria-label": "Trung tâm thông báo",
            sx: {
              mt: 1.25,
              width: { xs: "calc(100vw - 24px)", sm: 380 },
              maxWidth: 380,
              maxHeight: "min(540px, calc(100dvh - 90px))",
              border: "1px solid #e4e6e2",
              borderRadius: "16px",
              boxShadow: "0 16px 40px rgba(32,32,31,0.14)",
              overflow: "hidden",
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 2.25,
            py: 1.75,
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e4e6e2",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: "h2.fontFamily",
                fontSize: 16.5,
                fontWeight: 800,
                color: "#20201f",
              }}
            >
              Thông báo
            </Typography>
            {unreadCount > 0 && (
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  bgcolor: "#fff0e9",
                  color: "#bd3d14",
                  fontSize: 11,
                  fontWeight: 700,
                  border: "1px solid #ffd5c4",
                }}
              >
                {unreadCount} mới
              </Box>
            )}
          </Box>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAll}
              sx={{
                p: 0,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "none",
                color: "#747773",
                "&:hover": { color: "#bd3d14", bgcolor: "transparent" },
              }}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </Box>

        {/* List of Notifications */}
        <List disablePadding sx={{ maxHeight: 370, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Box sx={{ px: 3, py: 5, textAlign: "center", color: "#747773" }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  bgcolor: "#f2f3f0",
                  display: "grid",
                  placeItems: "center",
                  mx: "auto",
                  mb: 1.5,
                  color: "#8c9188",
                }}
              >
                <Bell size={22} aria-hidden="true" />
              </Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#20201f" }}>
                Chưa có thông báo nào
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12, color: "#747773" }}>
                Cập nhật về hồ sơ ứng tuyển, tin nhắn và mốc bàn giao sẽ hiển thị tại đây.
              </Typography>
            </Box>
          ) : (
            notifications.slice(0, 8).map((notification) => {
              const meta = typeMeta[notification.type] || typeMeta.system;
              return (
                <ListItemButton
                  key={notification.id}
                  onClick={() => handleItemClick(notification)}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid #f0f1ed",
                    bgcolor: notification.read ? "#ffffff" : "#fff9f6",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "#f7f8f6" },
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        bgcolor: meta.bg,
                        color: meta.color,
                        border: "1px solid",
                        borderColor: meta.border,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {meta.icon}
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: notification.read ? 600 : 750,
                          color: "#20201f",
                          lineHeight: 1.35,
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.35 }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#62665f",
                            lineHeight: 1.45,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {notification.detail}
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontSize: 11, color: "#8c9188" }}>
                          {notification.time}
                        </Typography>
                      </Box>
                    }
                  />

                  {!notification.read && (
                    <Box
                      component="span"
                      sx={{
                        mt: 1,
                        width: 7,
                        height: 7,
                        flexShrink: 0,
                        borderRadius: "50%",
                        bgcolor: "#f4490b",
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })
          )}
        </List>

        <Divider />

        {/* Footer */}
        <Box sx={{ p: 1.25, bgcolor: "#ffffff", textAlign: "center" }}>
          <Button
            size="small"
            fullWidth
            onClick={() => {
              setAnchor(null);
              navigate("/business/notifications");
            }}
            endIcon={<ArrowRight size={14} />}
            sx={{
              py: 0.75,
              fontSize: 12.5,
              fontWeight: 700,
              textTransform: "none",
              color: "primary.dark",
              borderRadius: "8px",
              "&:hover": { bgcolor: "#fff0e9", color: "primary.main" },
            }}
          >
            Xem toàn bộ trung tâm thông báo
          </Button>
        </Box>
      </Popover>
    </>
  );
}
