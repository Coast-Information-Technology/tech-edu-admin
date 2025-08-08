import React from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { CVData } from "@/types/cv";

export function CVTemplateClassic({ data }: { data: CVData }) {
  return (
    <div className="cv-a4-page">
      {(data.fullName ||
        data.bio ||
        data.email ||
        data.phone ||
        data.nationality) && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 mb-6">
          {data.fullName && (
            <h1 className="text-3xl font-bold tracking-tight">
              {data.fullName}
            </h1>
          )}
          {data.bio && <p className="mt-1 text-white/80">{data.bio}</p>}
          {(data.email || data.phone || data.nationality) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/90">
              {data.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{data.email}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{data.phone}</span>
                </div>
              )}
              {data.nationality && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{data.nationality}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {data.skills && data.skills.some((s) => s) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.filter(Boolean).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {data.experience &&
        data.experience.some(
          (e) => e.title || e.company || e.duration || e.description
        ) && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
              Experience
            </h3>
            <div className="space-y-2">
              {data.experience
                .filter(
                  (e) => e.title || e.company || e.duration || e.description
                )
                .map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium text-slate-900">
                      {exp.title && <span>{exp.title}</span>}
                      {exp.duration && (
                        <span className="text-slate-500">{exp.duration}</span>
                      )}
                    </div>
                    {exp.company && (
                      <div className="text-sm text-slate-700">
                        {exp.company}
                      </div>
                    )}
                    {exp.description && (
                      <div className="text-xs text-slate-600">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      {data.education &&
        data.education.some(
          (e) => e.degree || e.field || e.school || e.year
        ) && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
              Education
            </h3>
            <div className="space-y-2">
              {data.education
                .filter((e) => e.degree || e.field || e.school || e.year)
                .map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium text-slate-900">
                      {(edu.degree || edu.field) && (
                        <span>
                          {edu.degree}
                          {edu.degree && edu.field ? " in " : ""}
                          {edu.field}
                        </span>
                      )}
                      {edu.year && (
                        <span className="text-slate-500">{edu.year}</span>
                      )}
                    </div>
                    {edu.school && (
                      <div className="text-sm text-slate-700">{edu.school}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      {data.links &&
        (data.links.linkedIn || data.links.github || data.links.portfolio) && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
              Links
            </h3>
            <div className="flex gap-3">
              {data.links.linkedIn && (
                <a
                  href={data.links.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {data.links.github && (
                <a
                  href={data.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {data.links.portfolio && (
                <a
                  href={data.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
