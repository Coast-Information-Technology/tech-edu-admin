import React from "react";

export default function Resume3() {
  return (
    <div className="min-h-screen bg-purple-100 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white rounded-[10px] shadow-md p-8 text-gray-900">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Lara Miller</h1>
          <p className="text-purple-700 italic font-medium">UX/UI Designer</p>
          <ul className="mt-2 text-sm space-y-1">
            <li>📧 lara@miller.design</li>
            <li>📞 +49 30 616 714 610</li>
            <li>📍 Hohenzollerndamm 147, 14199 Berlin, Germany</li>
            <li>🔗 miller.design | millerdesign | lauramiller</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Profile
          </h2>
          <p className="text-sm mt-2 text-gray-700">
            I pour my heart and soul into crafting digital experiences that
            exceed user expectations. Seeing a user's face light up with joy and
            satisfaction is what drives me. I firmly believe that the most
            successful projects are the result of close-knit, cross-functional
            teams working in harmony towards a shared goal.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Professional Experience
          </h2>
          <div className="text-sm mt-2 space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-[1rem]">
                Brandung | Berlin, Germany,{" "}
                <span className="italic">Senior UX/UI Designer</span>
              </h3>
              <p>September 2012 – present</p>
              <p>
                Collaborate with cross-functional teams to design and develop
                user-centered digital products.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[1rem]">
                Divante eCommerce,{" "}
                <span className="italic">Lead UX/UI Designer</span>
              </h3>
              <p>August 2014 – September 2018 | Munich, Germany</p>
              <p>
                Redesigned the company’s e-commerce platform resulting in a 40%
                increase in conversion rates. Oversaw 4 design sprints to ensure
                consistency across the website.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Most Proud Of
          </h2>
          <p className="text-sm mt-2 text-gray-700">
            Designed and developed a mobile app for a non-profit organization
            that helped raise over €50,000 for a charitable cause.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Education
          </h2>
          <ul className="text-sm mt-2 space-y-1 text-gray-700">
            <li>
              Master of Science in Human-Computer Interaction, Technical
              University Berlin (2012 – 2014)
            </li>
            <li>
              Bachelor of Arts in Graphic Design, University of Applied Sciences
              Munich, Germany
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Skills
          </h2>
          <ul className="grid grid-cols-2 gap-2 text-sm mt-2 text-gray-700">
            <li>• User research and testing</li>
            <li>• Wireframing and prototyping</li>
            <li>• Design systems</li>
            <li>• Front-end development (HTML/CSS/JS)</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Languages
          </h2>
          <div className="flex gap-2 mt-2">
            <span className="bg-purple-200 text-purple-900 px-4 py-2 text-sm">
              German
            </span>
            <span className="bg-purple-200 text-purple-900 px-4 py-2 text-sm">
              English
            </span>
            <span className="bg-purple-200 text-purple-900 px-4 py-2 text-sm">
              French
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Tools
          </h2>
          <ul className="grid grid-cols-2 gap-2 text-sm mt-2 text-gray-700">
            <li>• Figma</li>
            <li>• Maze</li>
            <li>• Adobe Creative Suite</li>
            <li>• Axure</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Favorite Books
          </h2>
          <p className="text-sm mt-2 text-gray-700">
            “Don’t Make Me Think” by Steve Krug
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
            Awards
          </h2>
          <p className="text-sm mt-2 text-gray-700">
            Red Dot Design Award, Redesign of Divante’s commerce platform (2017)
          </p>
        </div>
      </div>
    </div>
  );
}
