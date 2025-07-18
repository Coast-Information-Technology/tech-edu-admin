"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function JobAlertsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Job Alerts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Job Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Create and manage your job alerts here.</p>
          {/* Placeholder for job alerts management */}
        </CardContent>
      </Card>
    </div>
  );
}

export default JobAlertsPage;
