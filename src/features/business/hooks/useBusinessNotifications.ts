import { useCallback, useEffect, useState } from "react";
import { mockStorage } from "@/lib/storage/mockStorage";
import type { NotificationItem } from "@/lib/types/marketplace.types";

export function useBusinessNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    mockStorage.getNotifications()
  );

  useEffect(() => {
    const unsubscribe = mockStorage.subscribe(() => {
      setNotifications(mockStorage.getNotifications());
    });
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const markRead = useCallback((id: string) => {
    mockStorage.markNotificationRead(id);
  }, []);
  const markAllRead = useCallback(() => {
    mockStorage.markAllNotificationsRead();
  }, []);

  return { notifications, unreadCount, markRead, markAllRead };
}
