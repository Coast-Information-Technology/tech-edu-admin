"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MentorshipPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mentorship Program</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Mentorships</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where you can find mentors or manage your mentees.</p>
          {/* Placeholder for mentorship content */}
        </CardContent>
      </Card>
    </div>
  );
}

export default MentorshipPage;
