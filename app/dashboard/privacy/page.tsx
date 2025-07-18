"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PrivacyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Privacy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your data and privacy settings here.</p>
          {/* Placeholder for privacy settings */}
        </CardContent>
      </Card>
    </div>
  );
}

export default PrivacyPage;
