"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AssignmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where your course assignments will be displayed.</p>
          {/* Placeholder for assignments list */}
        </CardContent>
      </Card>
    </div>
  );
}

export default AssignmentsPage;
