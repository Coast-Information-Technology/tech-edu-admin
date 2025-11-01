"use client";

import React, { useState } from "react";
import {
  Share2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Download,
  Lock,
  Calendar,
  BarChart3,
  QrCode,
  Twitter,
  Linkedin,
  Facebook,
  Link,
  Settings,
  Check,
  X,
} from "lucide-react";

interface ShareSettings {
  isPublic: boolean;
  allowDownload: boolean;
  allowViewing: boolean;
  password?: string;
  expiresAt?: Date;
  customSlug?: string;
  analytics: boolean;
}

interface Share {
  id: string;
  slug: string;
  url: string;
  settings: ShareSettings;
  createdAt: Date;
  viewCount: number;
  downloadCount: number;
}

interface SharingPanelProps {
  shares: Share[];
  onCreateShare: (settings: ShareSettings) => void;
  onUpdateShare: (shareId: string, settings: Partial<ShareSettings>) => void;
  onDeleteShare: (shareId: string) => void;
  onCopyUrl: (url: string) => void;
  onShareToSocial: (platform: string, url: string) => void;
}

export default function SharingPanel({
  shares,
  onCreateShare,
  onUpdateShare,
  onDeleteShare,
  onCopyUrl,
  onShareToSocial,
}: SharingPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingShare, setEditingShare] = useState<string | null>(null);
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    isPublic: true,
    allowDownload: true,
    allowViewing: true,
    analytics: true,
  });

  const handleCreateShare = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateShare(shareSettings);
    setIsCreating(false);
    setShareSettings({
      isPublic: true,
      allowDownload: true,
      allowViewing: true,
      analytics: true,
    });
  };

  const handleUpdateShare = (
    shareId: string,
    updates: Partial<ShareSettings>
  ) => {
    onUpdateShare(shareId, updates);
    setEditingShare(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getShareIcon = (share: Share) => {
    if (share.settings.password) return Lock;
    if (!share.settings.isPublic) return EyeOff;
    return Eye;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-[10px] flex items-center justify-center">
              <Share2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Share Your Resume
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create shareable links and manage access
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-[10px] hover:bg-green-700 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Create Share</span>
          </button>
        </div>
      </div>

      {/* Create Share Form */}
      {isCreating && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <form onSubmit={handleCreateShare} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom URL Slug
                </label>
                <input
                  type="text"
                  value={shareSettings.customSlug || ""}
                  onChange={(e) =>
                    setShareSettings((prev) => ({
                      ...prev,
                      customSlug: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="my-resume"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password (optional)
                </label>
                <input
                  type="password"
                  value={shareSettings.password || ""}
                  onChange={(e) =>
                    setShareSettings((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expires At (optional)
                </label>
                <input
                  type="date"
                  value={
                    shareSettings.expiresAt
                      ? shareSettings.expiresAt.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setShareSettings((prev) => ({
                      ...prev,
                      expiresAt: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={shareSettings.allowDownload}
                    onChange={(e) =>
                      setShareSettings((prev) => ({
                        ...prev,
                        allowDownload: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Allow Download
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={shareSettings.analytics}
                    onChange={(e) =>
                      setShareSettings((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Analytics
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-[10px] hover:bg-green-700 transition-colors"
              >
                Create Share
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

      {/* Shares List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {shares.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <Share2 className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No shares created yet</p>
            <p className="text-sm">
              Create your first share to start sharing your resume
            </p>
          </div>
        ) : (
          shares.map((share) => {
            const ShareIcon = getShareIcon(share);
            return (
              <div key={share.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <ShareIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {share.slug}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created {formatDate(share.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{share.viewCount} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{share.downloadCount} downloads</span>
                      </div>
                      {share.settings.password && (
                        <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                          <Lock className="h-4 w-4" />
                          <span>Password protected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onCopyUrl(share.url)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => window.open(share.url, "_blank")}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onShareToSocial("twitter", share.url)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Share on Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onShareToSocial("linkedin", share.url)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onShareToSocial("facebook", share.url)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Share on Facebook"
                      >
                        <Facebook className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        setEditingShare(
                          editingShare === share.id ? null : share.id
                        )
                      }
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this share?")
                        ) {
                          onDeleteShare(share.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Share URL */}
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-[10px]">
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-gray-400" />
                    <code className="flex-1 text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {share.url}
                    </code>
                    <button
                      onClick={() => onCopyUrl(share.url)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-3 flex items-center space-x-2">
                  <button
                    onClick={() => onCopyUrl(share.url)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-[10px] transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => window.open(share.url, "_blank")}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-[10px] transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Preview</span>
                  </button>
                  {share.settings.analytics && (
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-[10px] transition-colors">
                      <BarChart3 className="h-3 w-3" />
                      <span>Analytics</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
