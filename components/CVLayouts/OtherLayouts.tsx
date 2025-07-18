// CVLayoutExperienced.tsx
export const CVLayoutExperienced = ({ data }: { data: any }) => {
  return (
    <div className="p-8 bg-white text-gray-900 font-sans max-w-[800px] mx-auto">
      <h1 className="text-3xl font-bold border-b pb-2 mb-4 text-[#011F72]">
        {data.fullName}
      </h1>
      <p className="text-sm mb-1">{data.email}</p>
      <p className="text-sm mb-1">{data.phone}</p>
      <p className="text-sm mb-4">{data.location}</p>

      {data.experience && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-[#011F72] mb-2">
            Professional Experience
          </h2>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-bold">
                {exp.title}, {exp.company}
              </p>
              <p className="text-xs italic text-gray-500">{exp.dates}</p>
              <p>{exp.responsibilities}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-[#011F72] mb-2">Skills</h2>
          <ul className="list-disc list-inside text-sm">
            {data.skills.map((skill: string, i: number) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {data.education && (
        <section>
          <h2 className="text-lg font-semibold text-[#011F72] mb-2">
            Education
          </h2>
          {data.education.map((edu: any, i: number) => (
            <div key={i}>
              <p className="font-medium">
                {edu.degree} — {edu.institution}
              </p>
              <p className="text-xs text-gray-600">{edu.year}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

// CVLayoutNGO.tsx
export const CVLayoutNGO = ({ data }: { data: any }) => {
  return (
    <div className="p-8 bg-gray-50 text-gray-900 font-serif max-w-[800px] mx-auto border border-gray-300 rounded-md">
      <h1 className="text-3xl font-bold text-[#0f4c5c]">{data.fullName}</h1>
      <p className="text-sm italic">
        {data.email} | {data.phone} | {data.location}
      </p>

      {data.projects && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-[#0f4c5c] mb-2">
            Projects & Initiatives
          </h2>
          {data.projects.map((proj: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">{proj.title}</p>
              <p className="text-xs text-gray-600">{proj.tech}</p>
              <p>{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.experience && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-[#0f4c5c] mb-2">
            Experience in Development
          </h2>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-bold">
                {exp.title}, {exp.company}
              </p>
              <p className="text-xs italic text-gray-500">{exp.dates}</p>
              <p>{exp.responsibilities}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

// CVLayoutAcademic.tsx
export const CVLayoutAcademic = ({ data }: { data: any }) => {
  return (
    <div className="p-10 bg-white font-serif text-gray-900 max-w-[850px] mx-auto">
      <h1 className="text-3xl font-bold text-center text-[#011F72] mb-1">
        {data.fullName}
      </h1>
      <p className="text-sm text-center italic mb-6">
        {data.email} | {data.phone} | {data.location}
      </p>

      {data.education && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">
            Education
          </h2>
          {data.education.map((edu: any, i: number) => (
            <div key={i}>
              <p className="font-medium">
                {edu.degree}, {edu.institution}
              </p>
              <p className="text-xs text-gray-600">{edu.year}</p>
              {edu.achievements && <p>{edu.achievements}</p>}
            </div>
          ))}
        </section>
      )}

      {data.projects && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">
            Publications & Research
          </h2>
          {data.projects.map((proj: any, i: number) => (
            <div key={i}>
              <p className="font-medium">{proj.title}</p>
              <p className="text-sm italic text-gray-500">{proj.tech}</p>
              <p>{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills && (
        <section>
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Skills</h2>
          <ul className="list-disc list-inside">
            {data.skills.map((skill: string, i: number) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
