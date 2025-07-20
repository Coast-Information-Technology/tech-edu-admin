"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCheck, Trash2, RefreshCw } from "lucide-react";
import {
  getApiRequest,
  patchApiRequest,
  deleteApiRequest,
} from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";

const NOTIFICATION_TYPES = [
  { label: "All Types", value: "" },
  { label: "Team Invitation", value: "team_invitation" },
  // Add more types as your backend supports
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [type, setType] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Get token from cookie (client-side only)
  const token =
    typeof window !== "undefined"
      ? decodeURIComponent(getCookie("token") || "")
      : undefined;

  // Fetch notifications
  const fetchNotifications = async (
    page = 1,
    limit = 20,
    unread = false,
    typeFilter = ""
  ) => {
    setLoading(true);
    try {
      let res;
      if (typeFilter && typeFilter !== "") {
        res = await getApiRequest(
          `/api/notifications/type/${typeFilter}?page=${page}&limit=${limit}`,
          token
        );
      } else {
        res = await getApiRequest(
          `/api/notifications?page=${page}&limit=${limit}&unreadOnly=${unread}`,
          token
        );
      }
      setNotifications(res.data.data.notifications);
      setPagination(res.data.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    const res = await getApiRequest("/api/notifications/unread-count", token);
    setUnreadCount(res.data.data.unreadCount);
  };

  useEffect(() => {
    fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit, unreadOnly, type]);

  useEffect(() => {
    fetchUnreadCount();
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    await patchApiRequest("/api/notifications/mark-all-read", token || "", {});
    fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    fetchUnreadCount();
  };

  const handleClearAll = async () => {
    await deleteApiRequest("/api/notifications", token || "");
    fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    fetchUnreadCount();
  };

  const handleMarkAsRead = async (id: string) => {
    await patchApiRequest(`/api/notifications/${id}/read`, token || "", {});
    fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    fetchUnreadCount();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(
      pagination.page,
      pagination.limit,
      unreadOnly,
      type
    );
    await fetchUnreadCount();
    setRefreshing(false);
  };

  const unreadNotifications = useMemo(
    () => notifications.filter((n: any) => !n.isRead),
    [notifications]
  );

  // Pagination controls
  const handlePrevPage = () => {
    if (pagination.page > 1) setPagination((p) => ({ ...p, page: p.page - 1 }));
  };
  const handleNextPage = () => {
    if (pagination.page < pagination.pages)
      setPagination((p) => ({ ...p, page: p.page + 1 }));
  };

  // Type filter
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setPagination((p) => ({ ...p, page: 1 })); // Reset to first page on type change
  };

  const NotificationItem = ({ notification }: { notification: any }) => (
    <div
      onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
      style={{ cursor: "pointer" }}
    >
      <Link
        href={
          notification.link || `/dashboard/notifications/${notification._id}`
        }
      >
        <div className="flex flex-wrap items-start gap-4 p-4 rounded-[10px] hover:bg-gray-50 transition-colors border-b">
          {!notification.isRead && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
          )}
          <div className={`flex-1 ${notification.isRead ? "ml-[26px]" : ""}`}>
            <h4 className="font-semibold text-base sm:text-lg break-words">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 break-words">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
            {notification.type && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {notification.type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <select
            className="border rounded-[10px] px-3 py-2 text-sm"
            value={type}
            onChange={handleTypeChange}
            style={{ minWidth: 160 }}
          >
            {NOTIFICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      <Card className="px-2 sm:px-6">
        <CardHeader>
          <Tabs
            defaultValue={unreadOnly ? "unread" : "all"}
            onValueChange={(val) => setUnreadOnly(val === "unread")}
          >
            <TabsList>
              <TabsTrigger className="rounded-[10px]" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="rounded-[10px]" value="unread">
                Unread{" "}
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="mt-4">
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <NotificationItem key={n._id} notification={n} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No notifications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="unread">
              <div className="mt-4">
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    Loading notifications...
                  </div>
                ) : unreadNotifications.length > 0 ? (
                  unreadNotifications.map((n: any) => (
                    <NotificationItem key={n._id} notification={n} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No unread notifications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={pagination.page === 1}
          className={`rounded-[10px] ${
            pagination.page === 1
              ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
              : "hover:bg-gray-50"
          }`}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.pages}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={pagination.page === pagination.pages}
          className={`rounded-[10px] ${
            pagination.page === pagination.pages
              ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
              : "hover:bg-gray-50"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default NotificationsPage;
