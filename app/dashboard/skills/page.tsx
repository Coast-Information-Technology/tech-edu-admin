"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SkillsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Skills</h1>
      <Card>
        <CardHeader>
          <CardTitle>Skills & Endorsements</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Showcase your skills and get endorsed.</p>
          {/* Placeholder for skills section */}
        </CardContent>
      </Card>
    </div>
  );
}

export default SkillsPage;
