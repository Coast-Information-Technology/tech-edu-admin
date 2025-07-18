import Image from "next/image";

export default function Resume5() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="flex flex-col items-center py-10">
          <Image
            src="/profile.jpg" // Replace with actual profile image URL
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border-4 border-sky-300"
          />
          <h1 className="text-2xl font-bold text-sky-800 mt-4">
            Catherine Bale
          </h1>
          <p className="text-sky-500 italic">Marketing Assistant</p>
          <div className="mt-2 text-gray-700 text-center text-sm">
            <p>
              📧 cbale@cbale.com | 📍 Malibu, California | 📞 +1-554-754-3910
            </p>
          </div>
        </div>

        <div className="px-8 pb-10">
          <Section title="Profile">
            <p>
              To obtain a challenging marketing position with a reputable
              company where I can utilize my marketing skills and experience to
              drive business growth.
            </p>
          </Section>

          <Section title="Professional Experience">
            <ExperienceItem
              position="Marketing Manager"
              company="Acme Corporation"
              location="Milwaukee"
              duration="2019 – present"
              description="Developed and executed marketing strategies to increase brand awareness and drive sales"
            />
            <ExperienceItem
              position="Marketing Coordinator"
              company="Global Industries"
              location="Grand Island"
              duration="2017 – 2019"
              description="Assisted in the development and execution of marketing campaigns to promote products and services"
            />
          </Section>

          <Section title="Education">
            <p>
              <strong>Business Marketing</strong> <br /> University of
              Wisconsin, Milwaukee <br /> 2014 – 2017
            </p>
          </Section>

          <Section title="Languages">
            <ul className="list-disc list-inside">
              <li>English – C2</li>
              <li>Spanish – C2</li>
            </ul>
          </Section>

          <Section title="Skills">
            <ul className="list-disc list-inside">
              <li>Market Research</li>
              <li>Analytical Thinking</li>
              <li>Project Management</li>
            </ul>
          </Section>

          <Section title="Certificates">
            <ul className="list-disc list-inside">
              <li>Google Analytics Certified</li>
              <li>HubSpot Inbound Marketing Certified</li>
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
      <h2 className="text-lg font-semibold text-sky-700 mb-2 flex items-center gap-2">
        <span className="text-sky-600">📌</span> {title}
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
