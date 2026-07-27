'use client';

import React from 'react';

interface ContentFilterBarProps {
  selectedType?: 'photo' | 'video' | 'memory' | 'message';
  onSelectType: (type?: 'photo' | 'video' | 'memory' | 'message') => void;
  selectedTag?: string;
  onSelectTag: (tagId?: string) => void;
  availableTags?: { id: string; labelDisplay: string }[];
}

export const ContentFilterBar: React.FC<ContentFilterBarProps> = ({
  selectedType,
  onSelectType,
  selectedTag,
  onSelectTag,
  availableTags = [
    { id: 'tag_1', labelDisplay: 'Senior Year' },
    { id: 'tag_2', labelDisplay: 'Sunset' },
    { id: 'tag_3', labelDisplay: 'Class Memory' },
    { id: 'tag_4', labelDisplay: 'Musical' },
    { id: 'tag_5', labelDisplay: 'Graduation' },
  ],
}) => {
  return (
    <div className="w-full space-y-4 mb-8">
      {/* Type Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onSelectType(undefined)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            !selectedType ? 'bg-[#1D1C1A] text-[#F7F4EE]' : 'bg-[#EEE9E0] text-[#5D5A54] hover:bg-[#DCD6CB]'
          }`}
        >
          All Types
        </button>
        <button
          onClick={() => onSelectType('photo')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedType === 'photo' ? 'bg-[#1D1C1A] text-[#F7F4EE]' : 'bg-[#EEE9E0] text-[#5D5A54] hover:bg-[#DCD6CB]'
          }`}
        >
          📷 Photos
        </button>
        <button
          onClick={() => onSelectType('video')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedType === 'video' ? 'bg-[#1D1C1A] text-[#F7F4EE]' : 'bg-[#EEE9E0] text-[#5D5A54] hover:bg-[#DCD6CB]'
          }`}
        >
          🎬 Videos
        </button>
        <button
          onClick={() => onSelectType('memory')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedType === 'memory' ? 'bg-[#1D1C1A] text-[#F7F4EE]' : 'bg-[#EEE9E0] text-[#5D5A54] hover:bg-[#DCD6CB]'
          }`}
        >
          📖 Memories
        </button>
        <button
          onClick={() => onSelectType('message')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedType === 'message' ? 'bg-[#1D1C1A] text-[#F7F4EE]' : 'bg-[#EEE9E0] text-[#5D5A54] hover:bg-[#DCD6CB]'
          }`}
        >
          💬 Messages
        </button>
      </div>

      {/* Tag Chips */}
      <div className="flex flex-wrap gap-2 items-center text-xs">
        <span className="text-[#5D5A54] font-medium mr-1">Tags:</span>
        {availableTags.map((tag) => {
          const isSelected = selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => onSelectTag(isSelected ? undefined : tag.id)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-[#D89B3C] text-[#1D1C1A] border-[#D89B3C] font-semibold'
                  : 'bg-[#F7F4EE] text-[#5D5A54] border-[#DCD6CB] hover:border-[#5D5A54]'
              }`}
            >
              #{tag.labelDisplay}
            </button>
          );
        })}
      </div>
    </div>
  );
};
