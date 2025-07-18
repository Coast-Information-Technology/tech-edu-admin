import React from "react";
import { Team } from "@/lib/types";
import TeamCard from "./TeamCard";

interface TeamListProps {
  teams: Team[];
}

const TeamList: React.FC<TeamListProps> = ({ teams }) => {
  if (!teams.length) return <div className="text-gray-500">No teams yet.</div>;
  return (
    <div>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamList;
