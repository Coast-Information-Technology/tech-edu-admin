"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function EmployeesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employees</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Onboard and manage your employees here.</p>
          {/* Placeholder for employee management */}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeesPage;
