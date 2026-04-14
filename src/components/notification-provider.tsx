"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUnreadMessageCount } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { MessageSquare } from "lucide-react";

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = async () => {
    if (!session?.user?.id) return;
    const count = await getUnreadMessageCount(session.user.id as string);
    
    if (count > unreadCount) {
      // New message detected
      toast("New Message: You have a new message in your inbox.", {
        icon: '💬',
      });
    }
    
    setUnreadCount(count);
  };

  useEffect(() => {
    if (session?.user?.id) {
      refreshUnreadCount();
      
      // Near real-time polling every 30 seconds
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [session]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
