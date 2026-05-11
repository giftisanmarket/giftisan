"use client";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { getUnreadMessageCount } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { MessageSquare, Mail, Bell } from "lucide-react";

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => { },
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const lastCountRef = useRef(0);
  const isFirstFetch = useRef(true);

  const refreshUnreadCount = useCallback(async () => {
    if (!session?.user?.id) return;
    const count = await getUnreadMessageCount(session.user.id as string);

    if (isFirstFetch.current && count > 0) {
      // Welcome toast for existing messages
      toast(`Welcome back! You have ${count} unread message${count > 1 ? 's' : ''}.`, {
        icon: <Bell className="w-5 h-5 text-accent" />,
      });
    } else if (!isFirstFetch.current && count > lastCountRef.current) {
      // New message detected during session
      toast("New Message: You have a new message in your inbox.", {
        icon: <Mail className="w-5 h-5 text-accent" />,
      });
    }

    setUnreadCount(count);
    lastCountRef.current = count;
    isFirstFetch.current = false;
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      refreshUnreadCount();

      // Real-time polling every 60 seconds (optimized for network transfer)
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          refreshUnreadCount();
        }
      }, 60000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
      lastCountRef.current = 0;
      isFirstFetch.current = true;
    }
  }, [session, refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

