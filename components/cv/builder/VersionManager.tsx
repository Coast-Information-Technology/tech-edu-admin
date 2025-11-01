"use client";

import React, { useState } from "react";
import {
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Tag,
  Calendar,
  MoreVertical,
  Check,
  X,
  Edit3,
  Save,
} from "lucide-react";

interface Version {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  isCurrent: boolean;
  tags: string[];
}

interface VersionManagerProps {
  versions: Version[];
  currentVersion: Version | null;
  onCreateVersion: (
    name: string,
    description?: string,
    tags?: string[]
  ) => void;
  onSwitchVersion: (versionId: string) => void;
  onUpdateVersion: (versionId: string, updates: Partial<Version>) => void;
  onDeleteVersion: (versionId: string) => void;
  onDuplicateVersion: (versionId: string, newName: string) => void;
  onPublishVersion: (versionId: string) => void;
  onUnpublishVersion: (versionId: string) => void;
}

export default function VersionManager({
  versions,
  currentVersion,
  onCreateVersion,
  onSwitchVersion,
  onUpdateVersion,
  onDeleteVersion,
  onDuplicateVersion,
  onPublishVersion,
  onUnpublishVersion,
}: VersionManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingVersion, setEditingVersion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Filter versions based on search and tag
  const filteredVersions = versions.filter((version) => {
    const matchesSearch =
      !searchQuery ||
      version.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || version.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(versions.flatMap((v) => v.tags)));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleCreateVersion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const tags =
      (formData.get("tags") as string)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

    if (name) {
      onCreateVersion(name, description, tags);
      setIsCreating(false);
    }
  };

  const handleEditVersion = (versionId: string, updates: Partial<Version>) => {
    onUpdateVersion(versionId, updates);
    setEditingVersion(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Version Manager
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage different versions of your resume
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Version</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search versions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedTag || ""}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Create Version Form */}
      {isCreating && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <form onSubmit={handleCreateVersion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Version Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Software Engineer Resume"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of this version..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., software, engineering, senior"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors"
              >
                Create Version
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Versions List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredVersions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {searchQuery || selectedTag
              ? "No versions match your search"
              : "No versions yet"}
          </div>
        ) : (
          filteredVersions.map((version) => (
            <div
              key={version.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                version.isCurrent
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {version.name}
                    </h3>
                    {version.isCurrent && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                        Current
                      </span>
                    )}
                    {version.isPublished && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                        Published
                      </span>
                    )}
                  </div>

                  {version.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {version.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {formatDate(version.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <span>{version.tags.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!version.isCurrent && (
                    <button
                      onClick={() => onSwitchVersion(version.id)}
                      className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-[10px] transition-colors"
                    >
                      Switch
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowMenu(showMenu === version.id ? null : version.id)
                      }
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {showMenu === version.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-[10px] shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onDuplicateVersion(
                                version.id,
                                `${version.name} (Copy)`
                              );
                              setShowMenu(null);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Duplicate</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingVersion(version.id);
                              setShowMenu(null);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Edit3 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>

                          {version.isPublished ? (
                            <button
                              onClick={() => {
                                onUnpublishVersion(version.id);
                                setShowMenu(null);
                              }}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <EyeOff className="h-4 w-4" />
                              <span>Unpublish</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onPublishVersion(version.id);
                                setShowMenu(null);
                              }}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Publish</span>
                            </button>
                          )}

                          <div className="border-t border-gray-200 dark:border-gray-600 my-1" />

                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this version?"
                                )
                              ) {
                                onDeleteVersion(version.id);
                              }
                              setShowMenu(null);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
