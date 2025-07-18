"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CandidatesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Candidates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Browse Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Find and manage candidates for your job postings.</p>
          {/* Placeholder for candidate browsing and management */}
        </CardContent>
      </Card>
    </div>
  );
}

export default CandidatesPage;
