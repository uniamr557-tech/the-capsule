'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmationDialog } from '../../../../components/admin/ConfirmationDialog';
import { ContentCollectionService } from '../../../../lib/content-service';
import { AdminStudioService } from '../../../../lib/admin-service';
import { ContentItemDto } from '@capsule/api-contracts';

export default function ContentManagerPage() {
  const [statusFilter, setStatusFilter] = useState<'visible' | 'hidden' | 'deleted'>('visible');
  const [items, setItems] = useState<ContentItemDto[]>([]);
  const [activeDialog, setActiveDialog] = useState<{
    type: 'hide' | 'restore' | 'delete';
    targetItem: ContentItemDto;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadItems = () => {
    ContentCollectionService.getVisibleContent({}).then((res) => setItems(res.items));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleActionConfirm = async () => {
    if (!activeDialog) return;
    setIsLoading(true);

    const { type, targetItem } = activeDialog;

    if (type === 'hide') {
      await AdminStudioService.updateContentStatus(targetItem.id, 'hidden');
      targetItem.status = 'hidden';
      setToastMessage(`Item "${targetItem.title || targetItem.id}" hidden from senior view.`);
    } else if (type === 'restore') {
      await AdminStudioService.updateContentStatus(targetItem.id, 'visible');
      targetItem.status = 'visible';
      setToastMessage(`Item "${targetItem.title || targetItem.id}" restored to visible status.`);
    } else if (type === 'delete') {
      await AdminStudioService.updateContentStatus(targetItem.id, 'deleted');
      targetItem.status = 'deleted';
      setToastMessage(`Item "${targetItem.title || targetItem.id}" queued for permanent purge.`);
    }

    setIsLoading(false);
    setActiveDialog(null);
    loadItems();

    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[#DCD6CB] pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="font-serif text-3xl text-[#1D1C1A]">Content Manager</h1>
          <p className="text-xs text-[#5D5A54] mt-1">Review, hide, restore, or purge senior contributions.</p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#315A4A] text-[#F7F4EE] text-xs font-medium animate-fadeIn">
          ✓ {toastMessage}
        </div>
      )}

      {/* Lifecycle Status Tabs */}
      <div className="flex space-x-2 border-b border-[#DCD6CB] pb-2">
        {(['visible', 'hidden', 'deleted'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-semibold transition-all ${
              statusFilter === status
                ? 'bg-[#1D1C1A] text-[#F7F4EE]'
                : 'bg-[#EEE9E0] text-[#5D5A54] hover:bg-[#DCD6CB]'
            }`}
          >
            {status} ({items.filter((i) => i.status === status).length})
          </button>
        ))}
      </div>

      {/* Moderation Table */}
      <DataTable
        items={items}
        statusFilter={statusFilter}
        onHide={(item) => setActiveDialog({ type: 'hide', targetItem: item })}
        onRestore={(item) => setActiveDialog({ type: 'restore', targetItem: item })}
        onDelete={(item) => setActiveDialog({ type: 'delete', targetItem: item })}
      />

      {/* Reusable Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!activeDialog}
        title={
          activeDialog?.type === 'hide'
            ? 'Hide Content Item?'
            : activeDialog?.type === 'restore'
            ? 'Restore Content Item?'
            : 'Permanently Delete Content Item?'
        }
        description={
          activeDialog?.type === 'hide'
            ? 'Hiding this item instantly removes it from senior browsing while retaining it in the Admin queue for recovery.'
            : activeDialog?.type === 'restore'
            ? 'Restoring this item makes it visible again in the class gallery and timeline.'
            : 'Permanent deletion is irreversible. Binary files will be scheduled for permanent purge from storage within 30 days.'
        }
        confirmLabel={
          activeDialog?.type === 'hide'
            ? 'Hide Item'
            : activeDialog?.type === 'restore'
            ? 'Restore Item'
            : 'Permanently Delete'
        }
        isDestructive={activeDialog?.type === 'delete'}
        isLoading={isLoading}
        onConfirm={handleActionConfirm}
        onCancel={() => setActiveDialog(null)}
      />
    </div>
  );
}
