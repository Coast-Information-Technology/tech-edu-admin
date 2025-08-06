import React from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { CVData } from "@/types/cv";

export function CVTemplateClassic({ data }: { data: CVData }) {
  return (
    <div className="cv-a4-page">
      {data.fullName && (
        <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
      )}
      {data.bio && <p className="mb-4 text-gray-600">{data.bio}</p>}
      {(data.email || data.phone || data.nationality) && (
        <div className="mb-4 text-sm text-gray-700">
          {data.email && (
            <div>
              <Mail className="inline w-4 h-4 mr-1" />
              {data.email}
            </div>
          )}
          {data.phone && (
            <div>
              <Phone className="inline w-4 h-4 mr-1" />
              {data.phone}
            </div>
          )}
          {data.nationality && (
            <div>
              <MapPin className="inline w-4 h-4 mr-1" />
              {data.nationality}
            </div>
          )}
        </div>
      )}
      {data.skills && data.skills.some((s) => s) && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.filter(Boolean).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
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
            <h3 className="font-semibold mb-1">Experience</h3>
            <div className="space-y-2">
              {data.experience
                .filter(
                  (e) => e.title || e.company || e.duration || e.description
                )
                .map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium">
                      {exp.title && <span>{exp.title}</span>}
                      {exp.duration && (
                        <span className="text-gray-500">{exp.duration}</span>
                      )}
                    </div>
                    {exp.company && (
                      <div className="text-sm text-gray-700">{exp.company}</div>
                    )}
                    {exp.description && (
                      <div className="text-xs text-gray-600">
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
            <h3 className="font-semibold mb-1">Education</h3>
            <div className="space-y-2">
              {data.education
                .filter((e) => e.degree || e.field || e.school || e.year)
                .map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium">
                      {(edu.degree || edu.field) && (
                        <span>
                          {edu.degree}
                          {edu.degree && edu.field ? " in " : ""}
                          {edu.field}
                        </span>
                      )}
                      {edu.year && (
                        <span className="text-gray-500">{edu.year}</span>
                      )}
                    </div>
                    {edu.school && (
                      <div className="text-sm text-gray-700">{edu.school}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      {data.links &&
        (data.links.linkedIn || data.links.github || data.links.portfolio) && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Links</h3>
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
                  className="text-gray-800"
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
