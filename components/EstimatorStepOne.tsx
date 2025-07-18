export function StepOne({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  const goals = [
    "Apply for Scholarships",
    "Land a New Job",
    "Upskill for Work or Promotion",
    "Get Mentorship / Coaching",
    "Recruit or Train Others (for orgs)",
  ];

  const toggle = (goal: string) => {
    if (selected.includes(goal)) {
      onChange(selected.filter((g) => g !== goal));
    } else {
      onChange([...selected, goal]);
    }
  };

  return (
    <div>
      <p className="mb-3 text-sm text-gray-600">
        Select one (or more) primary goals:
      </p>
      <ul className="grid gap-2">
        {goals.map((goal, idx) => (
          <li key={idx}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(goal)}
                onChange={() => toggle(goal)}
                className="accent-blue-500"
              />
              <span>{goal}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
