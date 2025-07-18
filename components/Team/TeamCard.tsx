import React from "react";
import { Team } from "@/lib/types";

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div className="border rounded-[10px] p-4 shadow bg-white mb-4">
      <h3 className="text-lg font-bold mb-1">{team.name}</h3>
      {team.description && (
        <p className="text-gray-600 mb-2">{team.description}</p>
      )}
      <div className="text-sm text-gray-500 mb-2">
        Members: {team.members.length}
      </div>
      <ul className="pl-4 list-disc text-sm">
        {team.members.map((member) => (
          <li key={member.id}>
            {member.name} ({member.role})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamCard;
