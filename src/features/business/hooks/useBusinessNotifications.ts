import { useCallback, useEffect, useMemo, useState } from "react";
import { mockStorage } from "@/lib/storage/mockStorage";

export function useBusinessNotifications() {
  const [state, setState] = useState(() => mockStorage.getState());

  useEffect(() => mockStorage.subscribe(() => setState(mockStorage.getState())), []);

  const notifications = useMemo(() => state.notifications
    .filter((notification) => !notification.userId || notification.userId === state.activeUser.id)
    .sort((a, b) => b.timestamp - a.timestamp), [state]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const markRead = useCallback((id: string) => mockStorage.markNotificationRead(id), []);
  const markAllRead = useCallback(() => {
    notifications.filter((notification) => !notification.read)
      .forEach((notification) => mockStorage.markNotificationRead(notification.id));
  }, [notifications]);

  return { notifications, unreadCount, markRead, markAllRead };
}
