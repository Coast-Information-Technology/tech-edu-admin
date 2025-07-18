"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SavedJobsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where your saved jobs are stored.</p>
          {/* Placeholder for saved jobs list */}
        </CardContent>
      </Card>
    </div>
  );
}

export default SavedJobsPage;
