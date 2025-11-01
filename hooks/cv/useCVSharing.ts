import { useState, useCallback, useMemo } from "react";
import { CVBuilderState } from "@/types/cv/cv-builder";

interface ShareSettings {
  isPublic: boolean;
  allowDownload: boolean;
  allowViewing: boolean;
  password?: string;
  expiresAt?: Date;
  customSlug?: string;
  analytics: boolean;
}

interface CVShare {
  id: string;
  cvId: string;
  slug: string;
  url: string;
  settings: ShareSettings;
  createdAt: Date;
  lastAccessedAt?: Date;
  viewCount: number;
  downloadCount: number;
}

interface PublicProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  isActive: boolean;
  cvs: CVShare[];
  createdAt: Date;
  updatedAt: Date;
}

interface UseCVSharingProps {
  cvId: string;
  onShareCreated?: (share: CVShare) => void;
  onShareUpdated?: (share: CVShare) => void;
  onShareDeleted?: (shareId: string) => void;
}

interface UseCVSharingReturn {
  shares: CVShare[];
  publicProfile: PublicProfile | null;
  createShare: (settings: ShareSettings) => CVShare;
  updateShare: (shareId: string, settings: Partial<ShareSettings>) => void;
  deleteShare: (shareId: string) => void;
  getShareBySlug: (slug: string) => CVShare | null;
  generateShareUrl: (share: CVShare) => string;
  updatePublicProfile: (updates: Partial<PublicProfile>) => void;
  getPublicProfileUrl: () => string;
  trackView: (shareId: string) => void;
  trackDownload: (shareId: string) => void;
}

export function useCVSharing({
  cvId,
  onShareCreated,
  onShareUpdated,
  onShareDeleted,
}: UseCVSharingProps): UseCVSharingReturn {
  const [shares, setShares] = useState<CVShare[]>([]);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(
    null
  );

  // Generate unique slug
  const generateSlug = useCallback((customSlug?: string): string => {
    if (customSlug) {
      return customSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    }
    return `cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Create a new share
  const createShare = useCallback(
    (settings: ShareSettings): CVShare => {
      const slug = generateSlug(settings.customSlug);
      const share: CVShare = {
        id: `share-${Date.now()}`,
        cvId,
        slug,
        url: `${window.location.origin}/cv/${slug}`,
        settings,
        createdAt: new Date(),
        viewCount: 0,
        downloadCount: 0,
      };

      setShares((prev) => [...prev, share]);
      onShareCreated?.(share);
      return share;
    },
    [cvId, generateSlug, onShareCreated]
  );

  // Update share settings
  const updateShare = useCallback(
    (shareId: string, settings: Partial<ShareSettings>) => {
      setShares((prev) => {
        return prev.map((share) => {
          if (share.id === shareId) {
            const updatedShare = {
              ...share,
              settings: { ...share.settings, ...settings },
            };
            onShareUpdated?.(updatedShare);
            return updatedShare;
          }
          return share;
        });
      });
    },
    [onShareUpdated]
  );

  // Delete share
  const deleteShare = useCallback(
    (shareId: string) => {
      setShares((prev) => prev.filter((share) => share.id !== shareId));
      onShareDeleted?.(shareId);
    },
    [onShareDeleted]
  );

  // Get share by slug
  const getShareBySlug = useCallback(
    (slug: string): CVShare | null => {
      return shares.find((share) => share.slug === slug) || null;
    },
    [shares]
  );

  // Generate share URL
  const generateShareUrl = useCallback((share: CVShare): string => {
    return share.url;
  }, []);

  // Update public profile
  const updatePublicProfile = useCallback((updates: Partial<PublicProfile>) => {
    setPublicProfile((prev) => {
      if (!prev) {
        // Create new profile
        const newProfile: PublicProfile = {
          id: `profile-${Date.now()}`,
          userId: "current-user", // This would come from auth context
          displayName: updates.displayName || "Anonymous",
          bio: updates.bio,
          avatar: updates.avatar,
          location: updates.location,
          website: updates.website,
          linkedin: updates.linkedin,
          github: updates.github,
          twitter: updates.twitter,
          isActive: true,
          cvs: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { ...newProfile, ...updates };
      }
      return { ...prev, ...updates, updatedAt: new Date() };
    });
  }, []);

  // Get public profile URL
  const getPublicProfileUrl = useCallback((): string => {
    if (!publicProfile) return "";
    return `${window.location.origin}/profile/${publicProfile.id}`;
  }, [publicProfile]);

  // Track view
  const trackView = useCallback((shareId: string) => {
    setShares((prev) => {
      return prev.map((share) => {
        if (share.id === shareId) {
          return {
            ...share,
            viewCount: share.viewCount + 1,
            lastAccessedAt: new Date(),
          };
        }
        return share;
      });
    });
  }, []);

  // Track download
  const trackDownload = useCallback((shareId: string) => {
    setShares((prev) => {
      return prev.map((share) => {
        if (share.id === shareId) {
          return {
            ...share,
            downloadCount: share.downloadCount + 1,
            lastAccessedAt: new Date(),
          };
        }
        return share;
      });
    });
  }, []);

  return {
    shares,
    publicProfile,
    createShare,
    updateShare,
    deleteShare,
    getShareBySlug,
    generateShareUrl,
    updatePublicProfile,
    getPublicProfileUrl,
    trackView,
    trackDownload,
  };
}

// Utility functions for sharing
export const shareUtils = {
  // Generate QR code for sharing
  generateQRCode: (url: string): string => {
    // This would integrate with a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      url
    )}`;
  },

  // Copy to clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  },

  // Share via social media
  shareToSocial: (
    platform: "twitter" | "linkedin" | "facebook",
    url: string,
    title?: string
  ) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = title ? encodeURIComponent(title) : "";

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  },

  // Generate embed code
  generateEmbedCode: (
    share: CVShare,
    width: number = 800,
    height: number = 600
  ): string => {
    return `<iframe src="${share.url}" width="${width}" height="${height}" frameborder="0"></iframe>`;
  },

  // Validate share settings
  validateShareSettings: (settings: ShareSettings): string[] => {
    const errors: string[] = [];

    if (settings.customSlug && !/^[a-z0-9-]+$/.test(settings.customSlug)) {
      errors.push(
        "Custom slug can only contain lowercase letters, numbers, and hyphens"
      );
    }

    if (settings.password && settings.password.length < 4) {
      errors.push("Password must be at least 4 characters long");
    }

    if (settings.expiresAt && settings.expiresAt <= new Date()) {
      errors.push("Expiration date must be in the future");
    }

    return errors;
  },
};
