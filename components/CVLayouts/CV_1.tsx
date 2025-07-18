import React from "react";

export default function Resume1() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-[10px] shadow-lg">
        {/* Left Column */}
        <div className="space-y-6 col-span-1 bg-green-700 p-8 ">
          <div className="text-white">
            <h1 className="text-2xl font-bold text-gray-800">Brian T. Wayne</h1>
            <p className="text-green-700 italic">
              Business Development Consultant
            </p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>📧 Brian@wayne.com</li>
              <li>📞 +1-541-754-3010</li>
              <li>📍 22611 Pacific Coast Hwy, Malibu, California</li>
              <li>🔗 linkedin.com/wayne2345</li>
              <li>🌐 wayne.com</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1">
              Profile
            </h2>
            <p className="text-sm text-gray-700 mt-2">
              I'm Brian Thomas Wayne, a business development consultant with a
              passion for helping organizations grow. With my MBA degree and
              extensive experience in strategy and relationship building, I
              strive to provide innovative solutions that drive success for my
              clients.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1">
              Education
            </h2>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>
                Master of Business Administration, Harvard Business School, 2016
                – 2018 | Boston
              </li>
              <li>
                Master of Business Administration, Harvard Business School, 2015
                – 2018 | Boston
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1">
              Languages
            </h2>
            <p className="text-sm text-gray-700 mt-2">English, Spanish</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 col-span-2 p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1">
              Professional Experience
            </h2>
            <div className="text-sm text-gray-700 mt-2 space-y-4">
              <div>
                <h3 className="font-semibold text-[1rem]">
                  Business Development Consultant,{" "}
                  <span className="italic">Appspeed Inc.</span> (2022 – present
                  | New York)
                </h3>
                <ul className="list-disc list-inside">
                  <li>
                    Developed and implemented strategic plans resulting in a 30%
                    increase in business growth opportunities.
                  </li>
                  <li>
                    Collaborated with cross-functional teams to drive business
                    growth and expansion.
                  </li>
                  <li>
                    Established new business relationships with key partners and
                    contributed to a 25% increase in sales revenue.
                  </li>
                  <li>
                    Conducted market research and analysis to identify new
                    market opportunities.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[1rem]">
                  Business Development, <span className="italic">Aerus</span>{" "}
                  (2018 – 2022 | Los Angeles, USA)
                </h3>
                <ul className="list-disc list-inside">
                  <li>
                    Worked closely with tech and software companies to provide
                    expert sales consulting services.
                  </li>
                  <li>
                    Built and managed dedicated sales teams in Europe, the
                    Americas, and Asia Pacific.
                  </li>
                  <li>
                    Contributed to Sales Active Outsourcing’s proven track
                    record of 5000+ new and innovative product/services
                    introduced.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              <li>Strategic thinking and problem-solving</li>
              <li>Relationship building and networking</li>
              <li>Creative and innovative thinking</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1">
              Awards
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              <li>
                Outstanding Business Student Award, University of Southern
                California, 2014
              </li>
              <li>
                Dean’s List, University of California, Los Angeles, 2015-2016
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
