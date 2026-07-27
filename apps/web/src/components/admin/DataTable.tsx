'use client';

import React, { useState } from 'react';
import { ContentItemDto } from '@capsule/api-contracts';

interface DataTableProps {
  items: ContentItemDto[];
  statusFilter: 'visible' | 'hidden' | 'deleted';
  onHide: (item: ContentItemDto) => void;
  onRestore: (item: ContentItemDto) => void;
  onDelete: (item: ContentItemDto) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  items,
  statusFilter,
  onHide,
  onRestore,
  onDelete,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredItems = items.filter((item) => item.status === statusFilter);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Table Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] flex items-center justify-between text-xs animate-fadeIn">
          <span>{selectedIds.length} item(s) selected</span>
          <div className="flex items-center space-x-2">
            {statusFilter === 'visible' && (
              <button
                onClick={() => {
                  const target = filteredItems.find((i) => selectedIds.includes(i.id));
                  if (target) onHide(target);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#EEE9E0] text-[#1D1C1A] font-medium hover:bg-white"
              >
                Hide Selected
              </button>
            )}
            {statusFilter === 'hidden' && (
              <button
                onClick={() => {
                  const target = filteredItems.find((i) => selectedIds.includes(i.id));
                  if (target) onRestore(target);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#315A4A] text-[#F7F4EE] font-medium hover:bg-[#254538]"
              >
                Restore Selected
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table List */}
      <div className="w-full overflow-x-auto rounded-2xl border border-[#DCD6CB] bg-[#F7F4EE]">
        <table className="w-full text-left text-xs text-[#1D1C1A]">
          <thead className="bg-[#EEE9E0] uppercase text-[11px] font-mono text-[#5D5A54] border-b border-[#DCD6CB]">
            <tr>
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#DCD6CB]"
                />
              </th>
              <th className="p-4">Content Type</th>
              <th className="p-4">Author</th>
              <th className="p-4">Title / Summary</th>
              <th className="p-4">Submitted At</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCD6CB]/60">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#5D5A54] font-mono">
                  No content items found in &ldquo;{statusFilter}&rdquo; state.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#EEE9E0]/50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectOne(item.id)}
                      className="rounded border-[#DCD6CB]"
                    />
                  </td>
                  <td className="p-4 font-mono font-medium capitalize">{item.type}</td>
                  <td className="p-4 font-semibold">{item.authorDisplayName}</td>
                  <td className="p-4 max-w-xs truncate">{item.title || item.body || item.caption}</td>
                  <td className="p-4 text-[#5D5A54] font-mono">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {statusFilter === 'visible' && (
                      <button
                        onClick={() => onHide(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#EEE9E0] text-[#5D5A54] hover:text-[#1D1C1A] hover:bg-[#DCD6CB] font-medium"
                      >
                        Hide
                      </button>
                    )}
                    {statusFilter === 'hidden' && (
                      <button
                        onClick={() => onRestore(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#315A4A] text-[#F7F4EE] hover:bg-[#1D1C1A] font-medium"
                      >
                        Restore
                      </button>
                    )}
                    {statusFilter !== 'deleted' && (
                      <button
                        onClick={() => onDelete(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#B95B5B]/10 text-[#B95B5B] hover:bg-[#B95B5B] hover:text-[#F7F4EE] font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
