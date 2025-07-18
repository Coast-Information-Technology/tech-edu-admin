"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PerformancePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Performance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track and manage your team's performance.</p>
          {/* Placeholder for performance tracking */}
        </CardContent>
      </Card>
    </div>
  );
}

export default PerformancePage;
