// components/SimpleTemplateConfig.tsx
"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  memo,
  useMemo,
} from "react";
import {
  Palette,
  Type as TypeIcon,
  Columns,
  RotateCcw,
  Ruler,
} from "lucide-react";
import { TemplateLayout } from "@/types/cv/template";
import { getConsistentFontOptions } from "@/utils/cv/fontUtils";

type TabId = "typography" | "colors" | "layout";

interface SimpleTemplateConfigProps {
  template: TemplateLayout;
  onChange?: (template: TemplateLayout) => void; // live preferred
  onSave?: (template: TemplateLayout) => void; // back-compat
  onReset: () => void;
  debounceMs?: number; // default 200
}

/** Enforce safe defaults (e.g., body size = 16) without mutating the source */
function withDefaults(tmpl: TemplateLayout): TemplateLayout {
  const t = tmpl.styles?.typography ?? ({} as any);
  const spacing = tmpl.styles?.spacing ?? ({} as any);
  const layout = tmpl.styles?.layout ?? ({} as any);
  return {
    ...tmpl,
    styles: {
      ...tmpl.styles,
      typography: {
        fontFamily: t.fontFamily ?? "Helvetica, sans-serif",
        bodySize: t.bodySize ?? 16, // default body size = 16px
        headingSize: t.headingSize ?? 18,
        lineHeight: t.lineHeight ?? 1.5,
        headingStyle: t.headingStyle ?? "bold",
        headingCase: t.headingCase ?? "uppercase",
        sectionHeadingStyle: t.sectionHeadingStyle ?? "bold",
        sectionHeadingCase: t.sectionHeadingCase ?? "uppercase",
        nameSize: t.nameSize ?? 48,
        titleSize: t.titleSize ?? 24,
        smallSize: t.smallSize ?? 14,
        contactSize: t.contactSize ?? t.bodySize ?? 16,
      },
      spacing: {
        padding: spacing.padding ?? 32,
        margin: spacing.margin ?? 16,
        sectionGap: spacing.sectionGap ?? 24,
        horizontalMargin: spacing.horizontalMargin ?? 0,
        verticalMargin: spacing.verticalMargin ?? 0,
        entrySpacing: spacing.entrySpacing ?? 8,
        headerPadding: spacing.headerPadding ?? 32,
      },
      layout: {
        pageWidth: layout.pageWidth ?? "210mm",
        pageHeight: layout.pageHeight ?? "297mm",
        borderRadius: layout.borderRadius ?? 8,
        shadow: layout.shadow ?? "0 4px 6px -1px rgba(0,0,0,0.1)",
        headerBorder: layout.headerBorder ?? undefined,
        // NEW: page vertical padding + header behavior for PDF
        pagePaddingV:
          typeof layout.pagePaddingV === "number" ? layout.pagePaddingV : 24, // px
        firstPageHeaderFlush:
          typeof layout.firstPageHeaderFlush === "boolean"
            ? layout.firstPageHeaderFlush
            : true,
      },
      colors: {
        ...tmpl.styles.colors,
        primary: tmpl.styles.colors.primary ?? "#1e3a8a",
        secondary: tmpl.styles.colors.secondary ?? "#64748b",
        background: tmpl.styles.colors.background ?? "#ffffff",
        text: tmpl.styles.colors.text ?? "#111827",
        accent: tmpl.styles.colors.accent ?? "#f59e0b",
        headerBackground: tmpl.styles.colors.headerBackground ?? "#60a5fa",
      },
    },
  };
}

const SimpleTemplateConfig = memo(function SimpleTemplateConfig({
  template,
  onChange,
  onSave,
  onReset,
  debounceMs = 200,
}: SimpleTemplateConfigProps) {
  const initial = useMemo(() => withDefaults(template), [template]);
  const [localTemplate, setLocalTemplate] = useState<TemplateLayout>(initial);
  const [activeTab, setActiveTab] = useState<TabId>("typography");

  // track incoming template identity to avoid unnecessary state churn
  const templateRef = useRef(template);
  const isInitialMount = useRef(true);
  const debouncedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // sync when template prop actually changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const same =
      templateRef.current.id === template.id &&
      templateRef.current.metadata?.updatedAt === template.metadata?.updatedAt;
    if (!same) {
      templateRef.current = template;
      setLocalTemplate(withDefaults(template));
    }
  }, [template.id, template.metadata?.updatedAt, template]);

  // debounced propagate
  const propagate = useCallback(
    (next: TemplateLayout) => {
      if (debouncedTimer.current) clearTimeout(debouncedTimer.current);
      debouncedTimer.current = setTimeout(() => {
        if (onChange) onChange(next);
        else if (onSave) onSave(next);
      }, debounceMs);
    },
    [onChange, onSave, debounceMs]
  );

  const updateTemplate = useCallback(
    (updates: Partial<TemplateLayout>) => {
      setLocalTemplate((prev) => {
        const merged = { ...prev, ...updates };
        propagate(merged);
        return merged;
      });
    },
    [propagate]
  );

  const updateStyles = useCallback(
    (styleUpdates: Partial<TemplateLayout["styles"]>) => {
      setLocalTemplate((prev) => {
        const merged: TemplateLayout = {
          ...prev,
          styles: {
            ...prev.styles,
            ...styleUpdates,
            // deep merge for nested styles
            colors: { ...prev.styles.colors, ...(styleUpdates as any)?.colors },
            typography: {
              ...prev.styles.typography,
              ...(styleUpdates as any)?.typography,
            },
            spacing: {
              ...prev.styles.spacing,
              ...(styleUpdates as any)?.spacing,
            },
            layout: { ...prev.styles.layout, ...(styleUpdates as any)?.layout },
            sectionHeadings: {
              ...prev.styles.sectionHeadings,
              ...(styleUpdates as any)?.sectionHeadings,
            },
          },
        };
        propagate(merged);
        return merged;
      });
    },
    [propagate]
  );

  const handleReset = useCallback(() => {
    const next = withDefaults(template);
    setLocalTemplate(next);
    onReset();
    if (onChange) onChange(next);
    else if (onSave) onSave(next);
  }, [template, onReset, onChange, onSave]);

  const fontOptions = getConsistentFontOptions();

  // Helpers for 2-column width control
  const hasTwoColumns =
    Array.isArray(localTemplate.columns) && localTemplate.columns.length === 2;
  const leftIndex = hasTwoColumns
    ? localTemplate.columns.findIndex((c) => c.id === "left")
    : -1;
  const rightIndex = hasTwoColumns
    ? localTemplate.columns.findIndex((c) => c.id === "right")
    : -1;
  const canAdjustTwoCols = hasTwoColumns && leftIndex >= 0 && rightIndex >= 0;
  const leftWidth = canAdjustTwoCols
    ? localTemplate.columns[leftIndex].width
    : undefined;

  const setTwoColumnWidth = (left: number) => {
    if (!canAdjustTwoCols) return;
    const clampedLeft = Math.max(20, Math.min(80, Math.round(left)));
    const right = 100 - clampedLeft;
    const nextCols = [...localTemplate.columns];
    nextCols[leftIndex] = { ...nextCols[leftIndex], width: clampedLeft };
    nextCols[rightIndex] = { ...nextCols[rightIndex], width: right };
    updateTemplate({ columns: nextCols });
  };

  const bodySize = localTemplate.styles.typography.bodySize ?? 16;
  const pagePaddingV = localTemplate.styles.layout.pagePaddingV ?? 32;
  const firstPageHeaderFlush =
    localTemplate.styles.layout.firstPageHeaderFlush ?? true;

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Template Settings
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Changes apply instantly to both HTML & PDF previews.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            title="Reset all settings to defaults"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto">
          <TabButton
            id="typography"
            icon={TypeIcon}
            label="Typography"
            active={activeTab === "typography"}
            onClick={() => setActiveTab("typography")}
          />
          <TabButton
            id="colors"
            icon={Palette}
            label="Colors"
            active={activeTab === "colors"}
            onClick={() => setActiveTab("colors")}
          />
          <TabButton
            id="layout"
            icon={Ruler}
            label="Layout"
            active={activeTab === "layout"}
            onClick={() => setActiveTab("layout")}
          />
        </div>
      </div>

      {/* Panels */}
      <div className="p-6">
        {activeTab === "typography" && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Pick a readable font and base size. Section titles and meta scale
              automatically from your base size.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={localTemplate.styles.typography.fontFamily}
                  onChange={(e) =>
                    updateStyles({
                      typography: {
                        ...localTemplate.styles.typography,
                        fontFamily: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label} — {font.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Body Size chips + slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Font Size
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {[14, 16, 18, 20].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        updateStyles({
                          typography: {
                            ...localTemplate.styles.typography,
                            bodySize: n,
                          },
                        })
                      }
                      className={`px-3 py-1.5 rounded-md text-sm border transition ${
                        bodySize === n
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      aria-pressed={bodySize === n}
                    >
                      {n}px
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-gray-500">
                    Default: 16px
                  </span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={20}
                  step={1}
                  value={bodySize}
                  onChange={(e) =>
                    updateStyles({
                      typography: {
                        ...localTemplate.styles.typography,
                        bodySize: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full"
                  aria-label="Base font size slider"
                />
              </div>

              {/* Heading Size */}
              <SliderRow
                label={`Heading Size: ${localTemplate.styles.typography.headingSize}px`}
                min={16}
                max={28}
                value={localTemplate.styles.typography.headingSize}
                onChange={(n) =>
                  updateStyles({
                    typography: {
                      ...localTemplate.styles.typography,
                      headingSize: n,
                    },
                  })
                }
                ticks={["16px", "28px"]}
              />

              {/* Line Height */}
              <SliderRow
                label={`Line Height: ${localTemplate.styles.typography.lineHeight}`}
                min={1.2}
                max={2.0}
                step={0.1}
                value={localTemplate.styles.typography.lineHeight}
                onChange={(n) =>
                  updateStyles({
                    typography: {
                      ...localTemplate.styles.typography,
                      lineHeight: n,
                    },
                  })
                }
                ticks={["1.2", "2.0"]}
              />
            </div>
          </div>
        )}

        {activeTab === "colors" && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Choose your brand colors. Left column colors show if your template
              uses a 2-column layout.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorRow
                label="Primary"
                value={localTemplate.styles.colors.primary}
                onChange={(v) =>
                  updateStyles({
                    colors: { ...localTemplate.styles.colors, primary: v },
                  })
                }
                placeholder="#1e3a8a"
              />
              <ColorRow
                label="Secondary"
                value={localTemplate.styles.colors.secondary}
                onChange={(v) =>
                  updateStyles({
                    colors: { ...localTemplate.styles.colors, secondary: v },
                  })
                }
                placeholder="#64748b"
              />
              <ColorRow
                label="Background"
                value={localTemplate.styles.colors.background}
                onChange={(v) =>
                  updateStyles({
                    colors: { ...localTemplate.styles.colors, background: v },
                  })
                }
                placeholder="#ffffff"
              />
              <ColorRow
                label="Header Background"
                value={
                  localTemplate.styles.colors.headerBackground ?? "#60a5fa"
                }
                onChange={(v) =>
                  updateStyles({
                    colors: {
                      ...localTemplate.styles.colors,
                      headerBackground: v,
                    },
                  })
                }
                placeholder="#60a5fa"
              />
            </div>

            {/* Column-specific colors if two columns */}
            {canAdjustTwoCols && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorRow
                  label="Left Column Background"
                  value={
                    localTemplate.columns[leftIndex].styles?.backgroundColor ??
                    "#1e3a8a"
                  }
                  onChange={(v) => {
                    const nextCols = [...localTemplate.columns];
                    nextCols[leftIndex] = {
                      ...nextCols[leftIndex],
                      styles: {
                        ...nextCols[leftIndex].styles,
                        backgroundColor: v,
                      },
                    };
                    updateTemplate({ columns: nextCols });
                  }}
                />
                <ColorRow
                  label="Left Column Text"
                  value={
                    localTemplate.columns[leftIndex].styles?.textColor ??
                    "#f9fafb"
                  }
                  onChange={(v) => {
                    const nextCols = [...localTemplate.columns];
                    nextCols[leftIndex] = {
                      ...nextCols[leftIndex],
                      styles: {
                        ...nextCols[leftIndex].styles,
                        textColor: v,
                      },
                    };
                    updateTemplate({ columns: nextCols });
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "layout" && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Control page size, spacing, and the vertical padding that appears
              after page breaks in the PDF.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Page Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Width: {localTemplate.styles.layout.pageWidth}
                </label>
                <select
                  value={localTemplate.styles.layout.pageWidth}
                  onChange={(e) =>
                    updateStyles({
                      layout: {
                        ...localTemplate.styles.layout,
                        pageWidth: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="210mm">A4 (210mm)</option>
                  <option value="216mm">Letter (216mm)</option>
                  <option value="200mm">Custom (200mm)</option>
                  <option value="220mm">Custom (220mm)</option>
                </select>
              </div>

              {/* Border Radius */}
              <SliderRow
                label={`Border Radius: ${localTemplate.styles.layout.borderRadius}px`}
                min={0}
                max={20}
                value={localTemplate.styles.layout.borderRadius}
                onChange={(n) =>
                  updateStyles({
                    layout: {
                      ...localTemplate.styles.layout,
                      borderRadius: n,
                    },
                  })
                }
                ticks={["0px", "20px"]}
              />

              {/* Section Spacing */}
              <SliderRow
                label={`Section Spacing: ${localTemplate.styles.spacing.sectionGap}px`}
                min={16}
                max={48}
                value={localTemplate.styles.spacing.sectionGap}
                onChange={(n) =>
                  updateStyles({
                    spacing: {
                      ...localTemplate.styles.spacing,
                      sectionGap: n,
                    },
                  })
                }
                ticks={["16px", "48px"]}
              />

              {/* Page Padding (Top/Bottom) */}
              <SliderRow
                label={`Page Padding (Top/Bottom): ${pagePaddingV}px`}
                min={0}
                max={64}
                value={pagePaddingV}
                onChange={(n) =>
                  updateStyles({
                    layout: {
                      ...localTemplate.styles.layout,
                      pagePaddingV: Math.round(n),
                    },
                  })
                }
                ticks={["0px", "64px"]}
              />

              {/* Header flush toggle */}
              <div className="md:col-span-2 flex items-center justify-between border rounded-md px-3 py-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Header touches top on page 1
                  </label>
                </div>
                <input
                  type="checkbox"
                  checked={!!firstPageHeaderFlush}
                  onChange={(e) =>
                    updateStyles({
                      layout: {
                        ...localTemplate.styles.layout,
                        firstPageHeaderFlush: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                  aria-label="Header touches top on first page"
                />
              </div>

              {/* Two-column width control */}
              {canAdjustTwoCols && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Column Widths
                  </label>
                  <div className="flex items-center gap-3">
                    <Columns className="h-4 w-4 text-gray-500" />
                    <input
                      type="range"
                      min={20}
                      max={80}
                      value={leftWidth}
                      onChange={(e) =>
                        setTwoColumnWidth(parseInt(e.target.value, 10))
                      }
                      className="w-full"
                      aria-label="Left column width"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Left: {leftWidth}%</span>
                    <span>Right: {100 - (leftWidth ?? 0)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">Live updates (auto-save)</div>
      </div>
    </div>
  );
});

export default SimpleTemplateConfig;

/* ---------- Small subcomponents ---------- */

function TabButton({
  id,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  id: TabId;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-colors whitespace-nowrap ${
        active
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      }`}
      aria-selected={active}
      aria-controls={`panel-${id}`}
      role="tab"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ColorRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 rounded border border-gray-300 cursor-pointer w-10"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm w-8"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function SliderRow({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  ticks,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  ticks?: [string, string] | string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      {ticks && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{ticks[0]}</span>
          <span>{ticks[1]}</span>
        </div>
      )}
    </div>
  );
}
