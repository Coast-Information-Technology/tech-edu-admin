import { useState, useCallback, useMemo } from "react";
import { CVBuilderState } from "@/types/cv/cv-builder";

interface CVVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  state: CVBuilderState;
  isPublished: boolean;
  isCurrent: boolean;
  tags: string[];
  thumbnail?: string;
}

interface UseCVVersionsProps {
  initialState: CVBuilderState;
  onVersionChange?: (version: CVVersion) => void;
  onVersionCreate?: (version: CVVersion) => void;
  onVersionDelete?: (versionId: string) => void;
}

interface UseCVVersionsReturn {
  versions: CVVersion[];
  currentVersion: CVVersion | null;
  createVersion: (name: string, description?: string, tags?: string[]) => void;
  switchToVersion: (versionId: string) => void;
  updateVersion: (versionId: string, updates: Partial<CVVersion>) => void;
  deleteVersion: (versionId: string) => void;
  duplicateVersion: (versionId: string, newName: string) => void;
  publishVersion: (versionId: string) => void;
  unpublishVersion: (versionId: string) => void;
  getVersionById: (versionId: string) => CVVersion | null;
  getVersionsByTag: (tag: string) => CVVersion[];
  searchVersions: (query: string) => CVVersion[];
}

export function useCVVersions({
  initialState,
  onVersionChange,
  onVersionCreate,
  onVersionDelete,
}: UseCVVersionsProps): UseCVVersionsReturn {
  const [versions, setVersions] = useState<CVVersion[]>(() => {
    // Create initial version
    const initialVersion: CVVersion = {
      id: "initial",
      name: "Initial Version",
      description: "Your first resume version",
      createdAt: new Date(),
      updatedAt: new Date(),
      state: initialState,
      isPublished: false,
      isCurrent: true,
      tags: ["initial"],
    };
    return [initialVersion];
  });

  const currentVersion = useMemo(() => {
    return versions.find((v) => v.isCurrent) || null;
  }, [versions]);

  const createVersion = useCallback(
    (name: string, description?: string, tags: string[] = []) => {
      const newVersion: CVVersion = {
        id: `version-${Date.now()}`,
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: currentVersion?.state || initialState,
        isPublished: false,
        isCurrent: false,
        tags: [...tags, "draft"],
      };

      setVersions((prev) => {
        // Mark all other versions as not current
        const updatedVersions = prev.map((v) => ({ ...v, isCurrent: false }));
        return [...updatedVersions, newVersion];
      });

      onVersionCreate?.(newVersion);
    },
    [currentVersion, initialState, onVersionCreate]
  );

  const switchToVersion = useCallback(
    (versionId: string) => {
      setVersions((prev) => {
        const updatedVersions = prev.map((version) => ({
          ...version,
          isCurrent: version.id === versionId,
        }));
        return updatedVersions;
      });

      const version = versions.find((v) => v.id === versionId);
      if (version) {
        onVersionChange?.(version);
      }
    },
    [versions, onVersionChange]
  );

  const updateVersion = useCallback(
    (versionId: string, updates: Partial<CVVersion>) => {
      setVersions((prev) => {
        return prev.map((version) => {
          if (version.id === versionId) {
            return {
              ...version,
              ...updates,
              updatedAt: new Date(),
            };
          }
          return version;
        });
      });
    },
    []
  );

  const deleteVersion = useCallback(
    (versionId: string) => {
      setVersions((prev) => {
        const filteredVersions = prev.filter((v) => v.id !== versionId);

        // If we deleted the current version, make the first remaining version current
        if (
          filteredVersions.length > 0 &&
          !filteredVersions.some((v) => v.isCurrent)
        ) {
          filteredVersions[0].isCurrent = true;
        }

        return filteredVersions;
      });

      onVersionDelete?.(versionId);
    },
    [onVersionDelete]
  );

  const duplicateVersion = useCallback(
    (versionId: string, newName: string) => {
      const originalVersion = versions.find((v) => v.id === versionId);
      if (!originalVersion) return;

      const duplicatedVersion: CVVersion = {
        ...originalVersion,
        id: `version-${Date.now()}`,
        name: newName,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false,
        isCurrent: false,
        tags: [...originalVersion.tags, "duplicate"],
      };

      setVersions((prev) => [...prev, duplicatedVersion]);
    },
    [versions]
  );

  const publishVersion = useCallback((versionId: string) => {
    setVersions((prev) => {
      return prev.map((version) => {
        if (version.id === versionId) {
          return {
            ...version,
            isPublished: true,
            updatedAt: new Date(),
          };
        }
        return version;
      });
    });
  }, []);

  const unpublishVersion = useCallback((versionId: string) => {
    setVersions((prev) => {
      return prev.map((version) => {
        if (version.id === versionId) {
          return {
            ...version,
            isPublished: false,
            updatedAt: new Date(),
          };
        }
        return version;
      });
    });
  }, []);

  const getVersionById = useCallback(
    (versionId: string) => {
      return versions.find((v) => v.id === versionId) || null;
    },
    [versions]
  );

  const getVersionsByTag = useCallback(
    (tag: string) => {
      return versions.filter((v) => v.tags.includes(tag));
    },
    [versions]
  );

  const searchVersions = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return versions.filter(
        (v) =>
          v.name.toLowerCase().includes(lowercaseQuery) ||
          v.description?.toLowerCase().includes(lowercaseQuery) ||
          v.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    },
    [versions]
  );

  return {
    versions,
    currentVersion,
    createVersion,
    switchToVersion,
    updateVersion,
    deleteVersion,
    duplicateVersion,
    publishVersion,
    unpublishVersion,
    getVersionById,
    getVersionsByTag,
    searchVersions,
  };
}
