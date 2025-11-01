"use client";
import React from "react";

export const Template1 = () => {
  return (
    <div className="w-full h-full p-6">
      {/* USER DETAILS */}
      <section className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">ANNIE PARKER</h3>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          <p>annieparker@example.com</p>
          <span>|</span>
          <p>(555) 555 5555</p>
          <span>|</span>
          <p>No 16, Abraham Street, Lagos, Nigeria</p>
        </div>
      </section>

      {/* PROFESSIONAL SUMMARY */}
      <section className="mb-6">
        <h5 className="bg-gray-300 px-2 py-1 text-lg font-medium mb-3">
          PROFESSIONAL SUMMARY
        </h5>
        <p className="text-sm text-gray-800 text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem sunt
          consectetur doloribus molestias, distinctio, minima aliquid enim
          soluta obcaecati facilis reiciendis voluptatibus veniam sint
          perferendis error in earum architecto ipsam! Amet minus quia obcaecati
          maxime repellat, voluptatum dicta necessitatibus adipisci non ut autem
          quis modi voluptatibus, doloribus placeat nihil dolore cupiditate
          quasi sunt minima? Debitis totam perferendis vitae laboriosam ea!
        </p>
      </section>

      {/* WORK HISTORY */}
      <section className="mb-6">
        <h5 className="bg-gray-300 px-2 py-1 text-lg font-medium mb-3">
          WORK HISTORY
        </h5>

        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 mb-4 border-b border-gray-200 pb-3"
          >
            <div className="md:w-2/5">
              <p className="font-semibold text-sm">Finance Controller</p>
              <div className="flex gap-2 text-sm">
                <p>
                  <em>Google</em>
                </p>
                <span>|</span>
                <p>City, Country</p>
              </div>
              <div className="flex gap-2 text-sm">
                <p>12/07/2015</p>
                <span>-</span>
                <p>16/09/2023</p>
              </div>
            </div>
            <div className="md:w-3/5 text-sm text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              sunt consectetur doloribus molestias, distinctio, minima aliquid
              enim soluta obcaecati facilis reiciendis voluptatibus veniam sint
              perferendis error in earum architecto ipsa!
            </div>
          </div>
        ))}
      </section>

      {/* SKILLS */}
      <section className="mb-6">
        <h5 className="bg-gray-300 px-2 py-1 text-lg font-medium mb-3">
          SKILLS
        </h5>
        <div className="grid grid-cols-2 gap-2 text-sm ml-4">
          <p>~ Pricing and coding</p>
          <p>~ Corporate finance</p>
          <p>~ Analytical</p>
          <p>~ MS Office expertise</p>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="mb-6">
        <h5 className="bg-gray-300 px-2 py-1 text-lg font-medium mb-3">
          EDUCATION
        </h5>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded p-3">
              <div className="flex flex-wrap items-center gap-1 text-sm">
                <p className="font-semibold">Master of Science</p>
                <span>:</span>
                <p>Accounting and finance</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <p>University of Austin</p>
                <span>|</span>
                <p>London</p>
              </div>
              <div className="flex gap-2 text-sm">
                <p>12/09/2013</p>
                <span>-</span>
                <p>09/07/2018</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATES */}
      <section>
        <h5 className="bg-gray-300 px-2 py-1 text-lg font-medium mb-3">
          CERTIFICATES
        </h5>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded p-3">
              <p className="font-semibold text-sm">
                Certified Public Accountant (CPA)
              </p>
              <div className="flex justify-between text-sm text-gray-700">
                <p>Udemy</p>
                <p>12/09/2013</p>
              </div>
              <p className="text-sm text-gray-800 mt-1">
                Amet minus quia obcaecati maxime repellat.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Template1;
