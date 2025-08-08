import React from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CVData } from "@/types/cv";

export function CVTemplateProfessional({ data }: { data: CVData }) {
  return (
    <div className="cv-a4-page flex flex-row bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-2/4 px-4 py-4 border-r border-slate-200 flex flex-col gap-3 bg-white/70">
        {data.cvbuilderImageUrl && (
          <Avatar className="w-24 h-24 mx-auto mb-2">
            <AvatarImage src={data.cvbuilderImageUrl} />
            <AvatarFallback>
              {data.fullName
                ? data.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
        )}
        {data.fullName && (
          <h2 className="text-lg font-bold text-center text-slate-900">
            {data.fullName}
          </h2>
        )}
        {data.bio && (
          <p className="text-xs text-slate-600 text-center">{data.bio}</p>
        )}
        {(data.email || data.phone || data.nationality) && (
          <div className="text-xs text-slate-700 space-y-1">
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
          <div>
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
        {data.links &&
          (data.links.linkedIn ||
            data.links.github ||
            data.links.portfolio) && (
            <div>
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
      {/* Main Content */}
      <div className="w-2/4 px-4 py-4 flex flex-col gap-4">
        {data.experience &&
          data.experience.some(
            (e) => e.title || e.company || e.duration || e.description
          ) && (
            <div>
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
            <div>
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
                        <div className="text-sm text-slate-700">
                          {edu.school}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
