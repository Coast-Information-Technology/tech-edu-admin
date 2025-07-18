"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PreferencesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Preferences</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your notification and content preferences here.</p>
          {/* Placeholder for preferences form */}
        </CardContent>
      </Card>
    </div>
  );
}

export default PreferencesPage;
