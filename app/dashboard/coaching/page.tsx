"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CoachingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Career Coaching</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Coaching Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Book and manage your career coaching sessions here.</p>
          {/* Placeholder for coaching sessions */}
        </CardContent>
      </Card>
    </div>
  );
}

export default CoachingPage;
