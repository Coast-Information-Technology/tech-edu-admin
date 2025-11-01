"use client";

import { Plus, Trash2 } from "lucide-react";

interface GenericSectionProps<T> {
  title: string;
  items: T[];
  emptyStateIcon: React.ComponentType<{ className?: string }>;
  emptyStateTitle: string;
  emptyStateDescription: string;
  addButtonText: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  children: (item: T, index: number) => React.ReactNode;
}

export default function GenericSection<T extends { id: string }>({
  title,
  items,
  emptyStateIcon: EmptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  addButtonText,
  onAdd,
  onRemove,
  children,
}: GenericSectionProps<T>) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </span>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>{addButtonText}</span>
        </button>
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
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-[10px] p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title} #{index + 1}
                </h3>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              {children(item, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
