import { canManageApplication } from "@/lib/storage/applicationAccess";
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
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
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router";
import { mockStorage } from "@/lib/storage/mockStorage";
import type { NotificationItem, NotificationType } from "@/lib/types/marketplace.types";

const iconMap: Record<NotificationType, React.ReactNode> = {
  invitation: <Mail size={20} color="#f4490b" />,
  application: <Briefcase size={20} color="#0284c7" />,
  chat: <MessageCircle size={20} color="#16a34a" />,
  agreement: <FileText size={20} color="#d97706" />,
  milestone: <CheckCheck size={20} color="#059669" />,
  review: <AlertCircle size={20} color="#8b5cf6" />,
  system: <Bell size={20} color="#64748b" />,
};

function visibleNotifications() {
  const state = mockStorage.getState();
  const user = state.activeUser;
  return state.notifications.filter(item => {
    if (item.recipientCompany) return user.role === "client" && item.recipientCompany === user.companyName;
    return !item.userId || item.userId === user.id || (user.role === "freelancer" && state.candidates.some(candidate => candidate.talentId === item.userId && canManageApplication(candidate, user)));
  });
}

export const NotificationCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    visibleNotifications()
  );

  React.useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      setNotifications(visibleNotifications());
    });
    return unsub;
  }, []);

  const handleItemClick = (notif: NotificationItem) => {
    mockStorage.markNotificationRead(notif.id);
    if (notif.href) {
      navigate(notif.href);
    }
  };

  const handleMarkAllRead = () => {
    visibleNotifications().filter(item => !item.read).forEach(item => mockStorage.markNotificationRead(item.id));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate(-1)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#64748b",
              textDecoration: "none",
              "&:hover": { color: "#f4490b" },
            }}
          >
            <ArrowLeft size={16} /> Quay lại
          </MuiLink>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            Trung tâm thông báo
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: "Space Grotesk, sans-serif",
              color: "#1e293b",
            }}
          >
            Thông báo của bạn
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Cập nhật về lời mời, ứng tuyển, tiến độ thỏa thuận và tin nhắn dự án (FR-064)
          </Typography>
        </Box>

        {unreadCount > 0 && (
          <Button
            variant="outlined"
            onClick={handleMarkAllRead}
            startIcon={<CheckCheck size={16} />}
            sx={{
              color: "#475569",
              borderColor: "#cbd5e1",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          bgcolor: "#ffffff",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            borderBottom: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
              fontSize: "13px",
              "&.Mui-selected": { color: "#f4490b" },
            },
            "& .MuiTabs-indicator": { bgcolor: "#f4490b" },
          }}
        >
          <Tab label="Tất cả" value="all" />
          <Tab label="Lời mời" value="invitation" />
          <Tab label="Ứng tuyển" value="application" />
          <Tab label="Tin nhắn" value="chat" />
          <Tab label="Thỏa thuận" value="agreement" />
          <Tab label="Tiến độ" value="milestone" />
        </Tabs>

        <List disablePadding>
          {filtered.length === 0 ? (
            <Box sx={{ p: 6, textAlign: "center", color: "#94a3b8" }}>
              <Bell size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Không có thông báo nào trong mục này.
              </Typography>
            </Box>
          ) : (
            filtered.map((n, index) => (
              <React.Fragment key={n.id}>
                {index > 0 && <Divider />}
                <ListItem
                  onClick={() => handleItemClick(n)}
                  sx={{
                    p: 2.5,
                    cursor: "pointer",
                    bgcolor: n.read ? "transparent" : "#fffaf7",
                    transition: "all 0.15s ease",
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {iconMap[n.type] || <Bell size={20} />}
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: n.read ? 600 : 800,
                            color: "#1e293b",
                            fontSize: "14px",
                          }}
                        >
                          {n.title}
                        </Typography>
                        {!n.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#f4490b",
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontSize: "13px", mb: 0.5 }}
                        >
                          {n.detail}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "11px" }}>
                          {n.time}
                        </Typography>
                      </Box>
                    }
                  />

                  <ArrowRight size={18} color="#cbd5e1" />
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default NotificationCenterPage;
