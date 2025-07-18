import React from "react";

interface TeamDashboardProps {
  team?: { id: string; name: string };
}

const mockTeamDetails = {
  description: "A collaborative team for building awesome products.",
  members: [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" },
  ],
};

const TeamDashboard: React.FC<TeamDashboardProps> = ({ team }) => {
  if (!team) {
    return <div className="p-8 text-center text-gray-500">Team not found.</div>;
  }
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-[10px] shadow">
      <h1 className="text-2xl font-bold text-[#011F72] mb-2">{team.name}</h1>
      <p className="text-gray-600 mb-4">{mockTeamDetails.description}</p>
      <h2 className="text-lg font-semibold mb-2">Team Members</h2>
      <ul className="mb-4">
        {mockTeamDetails.members.map((member) => (
          <li key={member.email} className="flex items-center gap-2 py-1">
            <span className="font-medium">{member.name}</span>
            <span className="text-xs text-gray-400">{member.email}</span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-gray-400">
        (This is a mock team dashboard. You can expand this with real data and
        features.)
      </div>
    </div>
  );
};

export default TeamDashboard;
