"use client";
import React from "react";

const Template3 = () => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-5xl mx-auto p-4">
        {/* PERSONAL DETAILS */}
        <div className="bg-[#693300] rounded-[10px] p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row justify-around items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 w-24 h-24 md:w-28 md:h-28 rounded-full mb-3" />
              <h3 className="text-2xl font-semibold text-center">
                Stefan Van Elsa
              </h3>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2 text-sm">
              <p>Chicago, IL 60007</p>
              <p>555-555-5555</p>
              <p>amandaspite@example.com</p>
            </div>
          </div>
        </div>

        {/* MAIN INFO CONTAINER */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SIDE */}
          <aside className="md:w-2/3 flex flex-col gap-6">
            {/* WORK HISTORY */}
            <section>
              <h5 className="text-xl font-semibold border-b border-gray-400 pb-2 mb-3">
                WORK HISTORY
              </h5>
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        Finance Controller
                      </p>
                      <div className="flex gap-2 text-sm text-gray-700">
                        <p>12/07/2015</p>
                        <span>--</span>
                        <p>16/09/2023</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm text-gray-700">
                      <p>Google</p>
                      <span>|</span>
                      <p>City, Country</p>
                    </div>
                    <p className="text-sm text-justify">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolorem sunt consectetur doloribus molestias, distinctio,
                      minima aliquid enim soluta obcaecati facilis reiciendis
                      voluptatibus veniam sint perferendis error in earum
                      architecto ipsam!
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* EDUCATION */}
            <section>
              <h5 className="text-xl font-semibold border-b border-gray-400 pb-2 mb-3">
                EDUCATION
              </h5>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1 text-sm">
                    <p className="font-semibold">Master of Art</p>
                    <p>
                      <em>Film Production</em>
                    </p>
                    <div className="flex gap-2">
                      <p>American University</p>
                      <span>|</span>
                      <p>Washington D.C.</p>
                    </div>
                    <div className="flex gap-2">
                      <p>12/09/2013</p>
                      <span>--</span>
                      <p>09/07/2018</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROJECTS */}
            <section>
              <h5 className="text-xl font-semibold border-b border-gray-400 pb-2 mb-3">
                PROJECTS
              </h5>
              <div className="flex flex-col gap-2 text-sm">
                <p className="font-semibold">Building the Future</p>
                <p>Applying AI to daily activities</p>
                <div className="flex gap-2">
                  <p>12/09/2013</p>
                  <span>--</span>
                  <p>09/07/2018</p>
                </div>
                <p className="text-justify">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorem sunt consectetur doloribus molestias, distinctio,
                  minima aliquid enim soluta obcaecati facilis reiciendis
                  voluptatibus veniam sint perferendis error in earum architecto
                  ipsam!
                </p>
              </div>
            </section>
          </aside>

          {/* RIGHT SIDE */}
          <aside className="md:w-1/3 flex flex-col gap-6">
            {/* SKILLS */}
            <section>
              <h5 className="text-xl font-semibold border-b border-gray-400 pb-2 mb-3">
                SKILLS
              </h5>
              <div className="flex flex-col gap-1 text-sm">
                <p>~ Agile</p>
                <p>~ Adobe</p>
                <p>~ Window & MacOS</p>
                <p>~ MS Office program</p>
                <p>~ Database</p>
                <p>~ CRM System</p>
              </div>
            </section>

            {/* CERTIFICATES */}
            <section>
              <h5 className="text-xl font-semibold border-b border-gray-400 pb-2 mb-3">
                CERTIFICATES
              </h5>
              {[1, 2].map((_, i) => (
                <div key={i} className="mb-3 text-sm">
                  <p className="font-semibold">Certified Public Accountant</p>
                  <div className="flex justify-between text-gray-700">
                    <p>Udemy</p>
                    <p>12/09/2013</p>
                  </div>
                  <p>Amet minus quia obcaecati maxime repellat.</p>
                </div>
              ))}
            </section>

            {/* LANGUAGES */}
            <section>
              <h5 className="text-xl font-semibold border-b border-gray-400 pb-2 mb-3">
                LANGUAGES
              </h5>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <p className="font-semibold">English</p>
                  <p>
                    <em>Skillful</em>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">German</p>
                  <p>
                    <em>Native Speaker</em>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">French</p>
                  <p>
                    <em>Highly proficient</em>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Yoruba</p>
                  <p>
                    <em>Novice</em>
                  </p>
                </div>
              </div>
            </section>

            {/* REFERENCES */}
            <section>
              <h5 className="text-xl font-semibold border-b border-gray-400 pb-2 mb-3">
                REFERENCES
              </h5>
              {[1, 2].map((_, i) => (
                <div key={i} className="mb-4 text-sm">
                  <p className="font-semibold">John Maxwell</p>
                  <div className="flex flex-col">
                    <p>maxwell@example.com</p>
                    <p>555-555-5555</p>
                  </div>
                  <p>Film Production Department, Omari Hub</p>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Template3;
