import Image from "next/image";

export default function Resume6() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300">
        <div className="flex flex-col items-center py-10 bg-gray-100">
          <Image
            src="/profile.jpg" // Replace with actual profile image URL
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border-4 border-white"
          />
          <h1 className="text-2xl font-bold text-blue-800 mt-4">
            Andrew O'Sullivan
          </h1>
          <p className="text-blue-600 italic">Product Manager</p>
          <div className="mt-2 text-gray-700 text-center text-sm">
            <p>
              📍 4 Noel Street, London | 📧 andrew@sulli.com | 📞 +01 11111155
            </p>
          </div>
        </div>

        <div className="px-8 pb-10">
          <Section title="Professional Experience">
            <ExperienceItem
              position="Product Manager"
              company="Techtime GmbH"
              location="Berlin, Germany"
              duration="08/2018 – 07/2023"
              description="Led a cross-functional team of 10 people in the development of a new product line, resulting in a 120% increase in revenue. Conducted market analysis and competitive studies to identify new product opportunities and expanded the product portfolio."
            />
            <ExperienceItem
              position="Product Specialist"
              company="Solutions Inc"
              location="Munich, Germany"
              duration="04/2015 – 07/2018"
              description="Developed and implemented a product strategy for the European market, resulting in a 25% revenue growth. Conducted training sessions and presentations for customers and sales teams to enhance product knowledge."
            />
          </Section>

          <Section title="Education">
            <p>
              <strong>Master of Business Administration (MBA)</strong>
              <br />
              University, Munich, Germany (08/2013 – 07/2015)
            </p>
            <p className="mt-2">
              <strong>Bachelor of Engineering in Information Technology</strong>
              <br />
              Technical University, Vienna, Austria (09/2009 – 07/2013)
            </p>
          </Section>

          <Section title="Skills">
            <ul className="list-disc list-inside">
              <li>Product development and strategy</li>
              <li>Project management and team leadership</li>
              <li>Customer needs analysis and market research</li>
              <li>Agile methods and Scrum</li>
              <li>Data analysis</li>
            </ul>
          </Section>

          <Section title="Languages">
            <ul className="list-disc list-inside">
              <li>German</li>
              <li>English</li>
              <li>Spanish</li>
            </ul>
          </Section>

          <Section title="Awards">
            <ul className="list-disc list-inside">
              <li>
                <strong>Innovation Award</strong>, The Tech GmbH
              </li>
              <li>
                <strong>Product Manager of the Year</strong>, Delta Solutions
              </li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-blue-700 mb-2 border-b border-blue-300 pb-1">
        {title}
      </h2>
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ExperienceItem({
  position,
  company,
  location,
  duration,
  description,
}: {
  position: string;
  company: string;
  location: string;
  duration: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <strong>
          {position}, {company}
        </strong>
        <span className="text-gray-500 text-sm">{location}</span>
      </div>
      <div className="text-gray-500 text-sm mb-1">{duration}</div>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
}
