import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const paths = [
  {
    title: "Students",
    role: "student",
    description: "I'm currently in school or applying for funding.",
    img: "/icons/undraw_teacher_s628.svg",
    alt: "Student using a laptop",
    actions: [
      { label: "Browse Live Training", urlpath: "/training" },
      { label: "Earn a Certificate", urlpath: "/training/certifications" },
      { label: "Register", urlpath: "/register" },
    ],
  },
  {
    title: "Professionals",
    role: "individualTechProfessional",
    description: "I'm employed and want to improve or transition.",
    img: "/icons/undraw_online-learning_tgmv.svg",
    alt: "Professional in an online training",
    actions: [
      { label: "Register to start a CV", urlpath: "/register" },
      { label: "Use Scholarship Coach", urlpath: "/tools/scholarship-coach" },
      { label: "Book a Mentorship Call", urlpath: "/contact#discovery-call" },
    ],
  },
  {
    title: "Institution",
    role: "institution",
    description:
      "We're a university, college, or training provider looking to empower our students, alumni, or staff with career services, CV tools, or hiring solutions.",
    img: "/icons/undraw_interview_yz52.svg",
    alt: "Job interview illustration",
    actions: [
      { label: "Request a Demo", urlpath: "/register" },
      {
        label: "Book a Discovery Call",
        urlpath: "/contact#discovery-call",
      },
      { label: "Register to Partner with Us", urlpath: "/register" },
    ],
  },
  {
    title: "Employers / Recruiters",
    role: "employer",
    description: "I'm hiring talent or upskilling my team.",
    img: "/icons/undraw_hiring_8szx.svg",
    alt: "Employer reviewing job applications",
    actions: [
      { label: "Register to Post a Job", urlpath: "/register" },
      { label: "Browse Graduate Talent", urlpath: "/career-connect/talents" },
      {
        label: "Use the Package Estimator Tool",
        urlpath:
          "/career-connect/package-estimator/start#estimator-wizard-steps",
      },
    ],
  },
];

const page = () => {
  return (
    <div>
      <header className="relative w-full px-4 pt-20 md:pt-20 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[82vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#011F72]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-4 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <span className="bg-black text-white text-md rounded-full mb-2 px-8 py-2">
              Get Started with Tech Edu Solution
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold  xl:w-[48vw] text-white">
              Start Learning, Building, or Hiring with Tech Edu Solution
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8 text-white  md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-8">
              Whether you're a student applying for scholarships, a jobseeker
              building your CV, or an employer hiring talent — we'll guide your
              next step
            </p>

            <div className="pt-4">
              <p className="font-bold">
                Don't have an account yet?{" "}
                <Link href="/register" className="font-normal underline">
                  Create a Free Account →
                </Link>
              </p>
              <p className="italic pt-6">
                One login. Full access. No card required.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[5rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/online-instructor-led-course.avif"
                alt="corporate consultacy team performance analytics"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white">
        <div className="p-6 md:p-10 mt-20 max-w-6xl mx-auto text-gray-800">
          <h2
            id="choose-path-title"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-5"
          >
            Choose Your Path
          </h2>
          <p className="text-lg text-gray-600 text-center pb-12">
            What best describes you today?
          </p>

          <div
            aria-labelledby="choose-path-title"
            className="py-12 px-4 md:px-8 text-gray-900 max-w-5xl"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {paths.map((path) => (
                <article
                  key={path.title}
                  className="bg-gray-50 rounded-[15px] p-6 shadow hover:shadow-md transition flex flex-col justify-between"
                  aria-labelledby={`${path.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-title`}
                >
                  <h3
                    id={`${path.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}-title`}
                    className="text-xl font-bold text-[#011F72] mb-2 text-center"
                  >
                    {path.title}
                  </h3>
                  <p className="text-gray-700 mb-4 text-center">
                    {path.description}
                  </p>
                  <div className="flex justify-center mb-4">
                    <Image
                      src={path.img}
                      alt={path.alt}
                      width={150}
                      height={150}
                      className="h-auto"
                    />
                  </div>
                  <div className="flex flex-col gap-2 justify-end items-center w-full">
                    <div className="flex w-full gap-2">
                      {path.actions.slice(0, 2).map((action, idx) => (
                        <Link
                          key={action.label}
                          href={
                            action.label.toLowerCase().includes("register")
                              ? `${action.urlpath}?role=${path.role}`
                              : action.urlpath
                          }
                          className="w-1/2 p-2 text-center bg-white border border-gray-500 rounded-[10px] text-[14px] text-[#011F72] font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label={`${action.label} for ${path.title}`}
                        >
                          {action.label}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={
                        path.actions[2].label.toLowerCase().includes("register")
                          ? `${path.actions[2].urlpath}?role=${path.role}`
                          : path.actions[2].urlpath
                      }
                      className="w-full py-2 px-4 text-center bg-white border border-gray-500 rounded-[10px] text-[14px] text-[#011F72] font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`${path.actions[2].label} for ${path.title}`}
                    >
                      {path.actions[2].label}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 flex text-left md:text-center items-center justify-center gap-2 md:gap-6">
            <p className="text-md md:text-[1.2rem] text-gray-600">
              Not sure yet?
            </p>
            <Link
              href="/register"
              className="inline-block px-3 md:px-6 py-2 rounded-[10px] text-white text-md md:text-[1.2rem] font-medium bg-[#011F72] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-fit"
            >
              Explore all services →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4 md:px-16 mx-auto">
        <div className="bg-gray-200 flex flex-col md:flex-row gap-8 md:gap-0 justify-between px-6 py-10 sm:p-12 md:p-24 rounded-[15px]">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white pb-5">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg italic">
              We'll walk you through it in minutes.
            </p>
            <div className="mt-6 md:mt-12 space-y-4 flex flex-col w-fit">
              <Link
                href="/contact#discovery-call"
                className="inline-flex items-center bg-gray-300 shadow-md text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                aria-label="Enter Certificate ID to verify"
              >
                Book a Free Discovery Call
              </Link>

              <Link
                href="#"
                className="inline-flex items-center bg-gray-300 shadow-md text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                aria-label="Request verification help"
              >
                Chat with Support
              </Link>
            </div>
          </div>
          <Image
            src="/icons/undraw_active-support_v6g0.svg"
            alt="Active Support Icons"
            width={350}
            height={350}
          />
        </div>
      </section>

      <section aria-labelledby="what-we-offer-heading" className="bg-white">
        <div className="py-16 px-4 md:px-16 mx-auto">
          <h2
            id="what-we-offer-heading"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center"
          >
            What We Offer
          </h2>

          {/* Core Services */}
          <div className="my-12">
            <h3 className="text-xl font-semibold text-[#011F72] text-center mb-8">
              Benefits
            </h3>

            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6">
              {/* Illustration Placeholder or Static Image */}
              <div
                aria-hidden="true"
                className="w-full md:w-[400px] aspect-video bg-blue-100 rounded-[8px] flex items-center justify-center"
              >
                <Image
                  src="/assets/virtual-training-.webp"
                  alt="Illustration showing core services"
                  height={200}
                  width={400}
                  className="object-contain rounded-[8px]"
                />
              </div>

              {/* Service List */}
              <ul className="list-none space-y-4 text-gray-900 text-base max-w-md">
                {[
                  "Build and save CVs across multiple roles",
                  "Track scholarship strategies and drafts",
                  "Join and resume training programs",
                  "Save your estimate, cart, and certificates",
                  "Join or manage talent via CareerConnect",
                  "Receive personalized recommendations and resources",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span
                      aria-hidden="true"
                      className="text-gray-600 mr-2 mt-[2px]"
                    >
                      <IoIosCheckmarkCircleOutline size={30} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
