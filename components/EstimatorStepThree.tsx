export function StepThree({
  selectedServices,
}: {
  selectedServices: string[];
}) {
  const servicePrices: Record<string, number> = {
    "CV Builder Pro": 5,
    "Scholarship Coach": 10,
    "Career Coaching Call": 10,
    "Zoom Training Access": 15,
    "Certificate Issuance": 8,
    "Bundle Suggestion": 18,
  };

  const items = selectedServices.map((service) => ({
    name: service,
    price: servicePrices[service] || 0,
  }));

  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Item</th>
              <th className="text-left p-2 border">Unit Price</th>
              <th className="text-left p-2 border">Selected?</th>
              <th className="text-left p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">£{item.price}</td>
                <td className="p-2 border">✅</td>
                <td className="p-2 border">£{item.price}</td>
              </tr>
            ))}
            <tr>
              <td className="p-2 border text-[#011F72]">Bundle Discount</td>
              <td className="p-2 border">—</td>
              <td className="p-2 border">—</td>
              <td className="p-2 border">—</td>
            </tr>
            <tr className="font-semibold">
              <td className="p-2 border" colSpan={3}>
                Estimated Total
              </td>
              <td className="p-2 border">£{total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
