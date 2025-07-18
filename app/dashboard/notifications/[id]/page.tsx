"use client";

import { mockNotifications } from "@/data/notifications";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);
  const notification = mockNotifications.find((n) => n.id === id);

  if (!notification) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold">Notification Not Found</h1>
        <p className="text-gray-500 mb-4">
          The notification you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/dashboard/notifications")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notifications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/notifications")}
        className="flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Notifications
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>{notification.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {!notification.read && (
              <Badge className="text-green-500 bg-transparent rounded-[10px] border border-black">
                New
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{notification.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
