import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
} from "@mui/material";
import {
  Bell,
  Mail,
  MessageCircle,
  FileText,
  CheckCheck,
  Briefcase,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { mockStorage } from "@/lib/storage/mockStorage";
import type { NotificationItem, NotificationType } from "@/lib/types/marketplace.types";

const iconMap: Record<NotificationType, React.ReactNode> = {
  invitation: <Mail size={18} color="#f4490b" />,
  application: <Briefcase size={18} color="#0284c7" />,
  chat: <MessageCircle size={18} color="#16a34a" />,
  agreement: <FileText size={18} color="#d97706" />,
  milestone: <CheckCheck size={18} color="#059669" />,
  review: <AlertCircle size={18} color="#8b5cf6" />,
  system: <Bell size={18} color="#64748b" />,
};

export const NotificationsBell: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    mockStorage.getNotifications()
  );

  React.useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      setNotifications(mockStorage.getNotifications());
    });
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (notif: NotificationItem) => {
    mockStorage.markNotificationRead(notif.id);
    handleClose();
    if (notif.href) {
      navigate(notif.href);
    }
  };

  const handleMarkAllRead = () => {
    mockStorage.markAllNotificationsRead();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label="Thông báo"
        sx={{
          color: "#475569",
          "&:hover": { color: "#f4490b", bgcolor: "#fff0e9" },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#f4490b",
              fontWeight: 700,
              fontSize: "11px",
            },
          }}
        >
          <Bell size={20} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxHeight: 520,
              borderRadius: "14px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            px: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Thông báo
            </Typography>
            {unreadCount > 0 && (
              <Box
                sx={{
                  bgcolor: "#ffedd5",
                  color: "#c2410c",
                  px: 1,
                  py: 0.25,
                  borderRadius: "99px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {unreadCount} mới
              </Box>
            )}
          </Box>

          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              sx={{
                fontSize: "12px",
                textTransform: "none",
                color: "#64748b",
                p: 0,
                "&:hover": { color: "#f4490b" },
              }}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </Box>

        <List disablePadding sx={{ maxHeight: 380, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center", color: "#94a3b8" }}>
              <Bell size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
              <Typography variant="body2">Chưa có thông báo nào.</Typography>
            </Box>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <ListItem
                key={n.id}
                onClick={() => handleItemClick(n)}
                sx={{
                  p: 2,
                  px: 2.5,
                  cursor: "pointer",
                  bgcolor: n.read ? "transparent" : "#fffaf7",
                  borderBottom: "1px solid #f1f5f9",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{iconMap[n.type] || <Bell size={18} />}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: n.read ? 500 : 700,
                        color: "#1e293b",
                        fontSize: "13px",
                      }}
                    >
                      {n.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block", fontSize: "12px" }}
                      >
                        {n.detail}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "11px" }}>
                        {n.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>

        <Divider />

        <Box sx={{ p: 1.5, textAlign: "center", bgcolor: "#f8fafc" }}>
          <Button
            size="small"
            fullWidth
            onClick={() => {
              handleClose();
              navigate("/notifications");
            }}
            endIcon={<ArrowRight size={14} />}
            sx={{
              textTransform: "none",
              color: "#f4490b",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Xem toàn bộ trung tâm thông báo
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsBell;
