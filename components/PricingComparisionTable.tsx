import React from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegCircleXmark } from "react-icons/fa6";

export default function PricingComparisonTable() {
  const plans = ["Free", "Growth", "Enterprise"];
  const features = [
    {
      name: "Post Jobs",
      availability: [true, true, true],
    },
    {
      name: "Access CV Insights",
      availability: [false, true, true],
    },
    {
      name: "Run Assessments",
      availability: [false, false, true],
    },
    {
      name: "Dedicated Support",
      availability: [false, false, true],
    },
    {
      name: "Price",
      availability: ["Free", "£X/month", "Custom"],
    },
  ];

  return (
    <section
      aria-labelledby="compare-plans-heading"
      className="max-w-5xl mx-auto px-4 py-12"
    >
      <h2
        id="compare-plans-heading"
        className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
      >
        Compare Plans
      </h2>

      <div className="overflow-x-auto">
        <table
          className="min-w-full text-sm text-left"
          aria-describedby="pricing-comparison"
        >
          <caption className="sr-only">Pricing plan comparison</caption>
          <thead className="text-black">
            <tr>
              <th scope="col" className="py-2 pr-4 text-[1.2rem] font-semibold">
                Feature
              </th>
              {plans.map((plan) => (
                <th
                  key={plan}
                  scope="col"
                  className="py-2 px-4 text-[1.2rem] font-semibold text-center"
                >
                  {plan}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {features.map((feature, index) => (
              <tr key={feature.name} className="border-t-2 border-gray-200">
                <th
                  scope="row"
                  className="py-3 pr-4 font-medium text-md text-gray-800 whitespace-nowrap"
                >
                  {feature.name}
                </th>
                {feature.availability.map((value, idx) => (
                  <td
                    key={idx}
                    className="py-3 px-4 text-center"
                    aria-label={`${plans[idx]} ${feature.name}`}
                  >
                    {typeof value === "boolean" ? (
                      value ? (
                        <IoMdCheckmarkCircleOutline
                          size={35}
                          className="mx-auto text-green-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <FaRegCircleXmark
                          size={30}
                          className="mx-auto text-red-600"
                          aria-hidden="true"
                        />
                      )
                    ) : (
                      <span className="text-sm font-medium">{value}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/pricing"
          className="inline-block text-[#011F72] bg-gray-200 font-medium hover:bg-gray-300 px-6 py-3 rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#011F72]"
        >
          See Full Pricing →
        </Link>
      </div>
    </section>
  );
}
