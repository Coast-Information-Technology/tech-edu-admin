"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface AccordionSectionProps<T> {
  title: string;
  items: T[];
  emptyStateIcon: React.ComponentType<{ className?: string }>;
  emptyStateTitle: string;
  emptyStateDescription: string;
  addButtonText: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  children: (item: T, index: number) => React.ReactNode;
  getItemTitle: (item: T) => string;
}

export default function AccordionSection<T extends { id: string }>({
  title,
  items,
  emptyStateIcon: EmptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  addButtonText,
  onAdd,
  onRemove,
  children,
  getItemTitle,
}: AccordionSectionProps<T>) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(items.map((item) => item.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2> */}
        <div className="flex items-center space-x-2">
          {items.length > 0 && (
            <>
              <button
                onClick={expandAll}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded transition-colors"
              >
                Collapse All
              </button>
            </>
          )}
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{addButtonText}</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <EmptyStateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{emptyStateTitle}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {emptyStateDescription}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);
            const itemTitle = getItemTitle(item);

            return (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-[10px]"
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {itemTitle || `${title} #${index + 1}`}
                      </h3>
                      {!isExpanded && itemTitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click to expand and edit
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="pt-4">{children(item, index)}</div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={onAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[10px] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Another {title.slice(0, -1)}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
