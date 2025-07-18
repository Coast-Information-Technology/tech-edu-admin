import Image from "next/image";

export default function Resume8() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300">
        {/* Left Column */}
        <div className="md:col-span-2 p-8">
          <Section title="Professional Experience">
            <ExperienceItem
              position="Senior UX/UI Designer"
              company="Brandung J"
              location="Berlin, Germany"
              duration="September 2012 – present"
              description="Collaborate with cross-functional teams to design and develop user-centered digital products"
            />
            <ExperienceItem
              position="Lead UX/UI Designer"
              company="Divante eCommerce"
              location="Munich, Germany"
              duration="August 2014 – September 2018"
              description="Redesigned the company’s e-commerce platform resulting in a 40% increase in conversion rates and developed a design system to ensure consistency across the website"
            />
          </Section>

          <Section title="Education">
            <p>
              <strong>Master of Science in Human-Computer Interaction</strong>
              <br />
              Technical University Berlin
              <br />
              September 2012 – July 2014
            </p>
            <p className="mt-2">
              <strong>Bachelor of Arts in Graphic Design</strong>
              <br />
              University of Applied Sciences Munich
              <br />
              Munich, Germany
            </p>
          </Section>

          <Section title="Skills">
            <SkillBar label="User research and testing" level={4} />
            <SkillBar label="Wireframing and prototyping" level={5} />
            <SkillBar label="Design systems" level={5} />
            <SkillBar label="Front-end development (HTML/CSS/JS)" level={3} />
          </Section>

          <Section title="Awards">
            <ul className="list-disc list-inside">
              <li>Red Dot Design Award</li>
              <li>Redesign of Divante’s eCommerce platform 2017</li>
            </ul>
          </Section>

          <Section title="Favorite Books">
            <ul className="list-disc list-inside">
              <li>"The Design of Everyday Things" by Don Norman</li>
              <li>"Don’t Make Me Think" by Steve Krug</li>
              <li>"Seductive Interaction Design" by Stephen Anderson</li>
            </ul>
          </Section>

          <Section title="Tools">
            <ul className="list-disc list-inside">
              <li>Figma – UI Design, Prototyping</li>
              <li>Maze – Product Research</li>
              <li>Adobe Creative Suite – Photo, Video, Illustration</li>
              <li>Marvel – UI Design, Prototyping</li>
            </ul>
          </Section>
        </div>

        {/* Right Column */}
        <div className="bg-gray-100 p-8 flex flex-col items-center md:items-start text-center md:text-left">
          <Image
            src="/profile.jpg" // Replace with actual image
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Kim Miller</h1>
          <p className="text-gray-500 mb-4">UX/UI Designer</p>

          <div className="text-sm text-gray-600 mb-4 space-y-1">
            <p>kim@miller.design</p>
            <p>+49 30 616 714 610</p>
            <p>Hohenzollerndamm 147, 14199 Berlin, Germany</p>
            <p>miller.design</p>
            <p>millerdesign</p>
            <p>lauramiller</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Profile
            </h2>
            <p className="text-sm text-gray-700">
              I pour my heart and soul into crafting digital experiences that
              meet user expectations. Seeing a user’s face light up with joy and
              satisfaction is what drives me.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Most Proud Of
            </h2>
            <p className="text-sm text-gray-700">
              Designed and developed a mobile app for a non-profit organization
              which raised over €50,000
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Languages
            </h2>
            <SkillBar label="German" level={5} />
            <SkillBar label="English" level={4} />
            <SkillBar label="French" level={3} />
          </div>
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
      <h2 className="text-lg font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">
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

function SkillBar({ label, level }: { label: string; level: number }) {
  const dots = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`w-2 h-2 rounded-full inline-block mx-0.5 ${
        i < level ? "bg-gray-800" : "bg-gray-300"
      }`}
    />
  ));
  return (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
      <span>{label}</span>
      <span>{dots}</span>
    </div>
  );
}
