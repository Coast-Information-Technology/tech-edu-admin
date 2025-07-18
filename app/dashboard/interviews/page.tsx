"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function InterviewsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Interviews</h1>
      <Card>
        <CardHeader>
          <CardTitle>Schedule & Manage Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your interview pipeline here.</p>
          {/* Placeholder for interview scheduling */}
        </CardContent>
      </Card>
    </div>
  );
}

export default InterviewsPage;
