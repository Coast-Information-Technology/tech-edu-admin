export function StepTwo({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  const services = [
    { tool: "CV Builder Pro", desc: "Create a recruiter-friendly CV" },
    { tool: "Scholarship Coach", desc: "Templates + SOP/Proposal Review" },
    { tool: "Career Coaching Call", desc: "One-on-one Zoom strategy session" },
    {
      tool: "Zoom Training Access",
      desc: "Choose from multiple live training programs",
    },
    { tool: "Certificate Issuance", desc: "Branded, verifiable certificates" },
    {
      tool: "Bundle Suggestion",
      desc: "Smart Combo: CV + Coach + Cert (10% off)",
    },
  ];

  const toggle = (tool: string) => {
    if (selected.includes(tool)) {
      onChange(selected.filter((s) => s !== tool));
    } else {
      onChange([...selected, tool]);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Based on your goals, we recommend tools. You can also select manually.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Tool/Service</th>
              <th className="text-left p-2 border">Description</th>
              <th className="text-left p-2 border">Add to Package?</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => (
              <tr key={idx} className="bg-white even:bg-gray-50">
                <td className="p-2 border">{service.tool}</td>
                <td className="p-2 border">{service.desc}</td>
                <td className="p-2 border">
                  <input
                    type="checkbox"
                    checked={selected.includes(service.tool)}
                    onChange={() => toggle(service.tool)}
                    className="accent-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
