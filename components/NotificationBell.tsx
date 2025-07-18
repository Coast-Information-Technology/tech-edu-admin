"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { getApiRequest, patchApiRequest } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get token from cookie (client-side only)
  const token =
    typeof window !== "undefined"
      ? decodeURIComponent(getCookie("token") || "")
      : "";

  // Fetch unread count and first 5 notifications
  const fetchNotifications = async () => {
    setLoading(true);
    const [countRes, notifRes] = await Promise.all([
      getApiRequest("/api/notifications/unread-count", token),
      getApiRequest("/api/notifications?limit=5", token),
    ]);
    setUnreadCount(countRes.data.data.unreadCount);
    setNotifications(notifRes.data.data.notifications);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    await patchApiRequest("/api/notifications/mark-all-read", token, {});
    fetchNotifications();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 bg-red-600 text-white"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white rounded-[10px]" align="end">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-blue-600"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <Link
                key={notification._id}
                href={
                  notification.link ||
                  `/dashboard/notifications/${notification._id}`
                }
                className={`block p-2 rounded-[10px] transition-colors ${
                  !notification.isRead
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No new notifications
            </p>
          )}
        </div>
        <div className="mt-4 border-t pt-2">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" className="w-full justify-center">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
