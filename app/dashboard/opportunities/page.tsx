"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function OpportunitiesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Opportunities</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job & Project Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Find your next career move or project here.</p>
          {/* Placeholder for opportunities board */}
        </CardContent>
      </Card>
    </div>
  );
}

export default OpportunitiesPage;
