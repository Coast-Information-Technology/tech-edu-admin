import React from "react";

export default function Resume2() {
  return (
    <div className="min-h-screen bg-pink-50 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white rounded-[10px] shadow-md p-8 text-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Catherine Bale</h1>
          <p className="text-pink-600 font-medium italic">
            Marketing Assistant
          </p>
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            <li>📧 c.bale@bale.com</li>
            <li>📞 +1-541-754-3010</li>
            <li>📍 22611 Pacific Coast Hwy, Malibu California 9022 USA</li>
            <li>📸 @bale2345</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
            Profile
          </h2>
          <p className="text-sm text-gray-700 mt-2">
            To obtain a challenging marketing position with a reputable company
            where I can utilize my marketing skills and experience to drive
            business growth.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="text-sm text-gray-700 mt-2 space-y-4">
            <div>
              <h3 className="font-semibold text-[1rem]">
                Acme Corporation,{" "}
                <span className="italic">Marketing Manager</span> (2019 –
                present | Milwaukee)
              </h3>
              <p>
                Developed and executed marketing strategies to increase brand
                awareness and drive sales.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[1rem]">
                Global Industries,{" "}
                <span className="italic">Marketing Coordinator</span> (2017 –
                2019 | Grand Island)
              </h3>
              <p>
                Assisted in the development and execution of marketing campaigns
                to promote products and services.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
            Education
          </h2>
          <p className="text-sm text-gray-700 mt-2">
            Business Marketing, University of Wisconsin (2014 – 2017 |
            Milwaukee)
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
            Certificates
          </h2>
          <div className="flex gap-2 mt-2">
            <span className="bg-pink-200 text-pink-800 px-4 py-2 text-sm">
              Google Analytics Certified
            </span>
            <span className="bg-pink-200 text-pink-800 px-4 py-2 text-sm">
              HubSpot Inbound Marketing Certified
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
            Languages
          </h2>
          <div className="flex gap-2 mt-2">
            <span className="bg-pink-100 text-pink-800 px-4 py-2 text-sm">
              English (C2)
            </span>
            <span className="bg-pink-100 text-pink-800 px-4 py-2 text-sm">
              Spanish (C2)
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="flex gap-2 mt-2">
            <span className="bg-pink-100 text-pink-800 px-4 py-2 text-sm">
              Market research
            </span>
            <span className="bg-pink-100 text-pink-800 px-4 py-2 text-sm">
              Analytical thinking
            </span>
            <span className="bg-pink-100 text-pink-800 px-4 py-2 text-sm">
              Project management
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
