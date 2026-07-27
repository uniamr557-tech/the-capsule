'use client';

import React, { useState } from 'react';
import { useContentCollection } from '@/hooks/useContentCollection';
import { ContentItemDto } from '@capsule/api-contracts';
import { MediaCard } from './MediaCard';
import { MemoryCard } from './MemoryCard';
import { MessageCard } from './MessageCard';
import { MediaViewer } from './MediaViewer';
import { ContentFilterBar } from './ContentFilterBar';
import { EmptyState } from './EmptyState';
import { UploadWizard } from './UploadWizard';

interface ContentCollectionProps {
  viewMode?: 'all' | 'gallery' | 'memories' | 'messages' | 'timeline' | 'search';
  initialType?: 'photo' | 'video' | 'memory' | 'message';
}

export const ContentCollection: React.FC<ContentCollectionProps> = ({
  viewMode = 'all',
  initialType,
}) => {
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | 'memory' | 'message' | undefined>(initialType);
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<ContentItemDto | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const { items, isLoading, error, refresh } = useContentCollection({
    type: selectedType,
    tagId: selectedTag,
    searchPhrase,
    sort: viewMode === 'timeline' ? 'moment_date' : 'newest',
  });

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search input for search view */}
        {viewMode === 'search' ? (
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value)}
              placeholder="Search by title, story text, author or tag..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A] text-sm focus:border-[#D89B3C]"
            />
            <svg className="w-5 h-5 text-[#5D5A54] absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        ) : (
          <div />
        )}

        {/* Add Memory Trigger */}
        <button
          onClick={() => setIsWizardOpen(true)}
          className="inline-flex items-center space-x-2 py-3 px-6 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-sm font-medium hover:bg-[#315A4A] transition-colors shadow-sm focus:ring-2 focus:ring-[#245CBA]"
        >
          <svg className="w-4 h-4 text-[#D89B3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Memory</span>
        </button>
      </div>

      {/* Shared Filter Bar */}
      {viewMode !== 'messages' && viewMode !== 'memories' && (
        <ContentFilterBar
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      )}

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB]" />
          ))}
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="p-6 rounded-2xl bg-[#B95B5B]/10 border border-[#B95B5B]/30 text-[#B95B5B] text-center space-y-3">
          <p className="text-sm font-medium">{error}</p>
          <button onClick={refresh} className="px-4 py-2 rounded-lg bg-[#B95B5B] text-[#F7F4EE] text-xs font-medium">
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title={searchPhrase ? `No results for "${searchPhrase}"` : 'No memories yet'}
          message={searchPhrase ? 'Try searching for another term or clearing your tag filters.' : 'Be the first from your class to share a photo, story, or message in this collection.'}
          onAction={() => setIsWizardOpen(true)}
        />
      )}

      {/* PRESENTATION MODES */}

      {/* 1. Masonry Gallery View */}
      {!isLoading && !error && items.length > 0 && viewMode === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            .filter((item) => item.type === 'photo' || item.type === 'video')
            .map((item) => (
              <MediaCard key={item.id} item={item} onSelect={setSelectedMedia} />
            ))}
        </div>
      )}

      {/* 2. Written Memories View */}
      {!isLoading && !error && items.length > 0 && viewMode === 'memories' && (
        <div className="space-y-8">
          {items
            .filter((item) => item.type === 'memory')
            .map((item) => (
              <MemoryCard key={item.id} item={item} />
            ))}
        </div>
      )}

      {/* 3. Class Messages Stream View */}
      {!isLoading && !error && items.length > 0 && viewMode === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items
            .filter((item) => item.type === 'message')
            .map((item) => (
              <MessageCard key={item.id} item={item} />
            ))}
        </div>
      )}

      {/* 4. Timeline View (Chronological Date Grouping) */}
      {!isLoading && !error && items.length > 0 && viewMode === 'timeline' && (
        <div className="space-y-12 max-w-3xl mx-auto relative before:absolute before:left-4 md:before:left-1/2 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#DCD6CB]">
          {items.map((item, idx) => (
            <div key={item.id} className="relative flex flex-col md:flex-row items-center group">
              {/* Date Marker Node */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#D89B3C] border-4 border-[#F7F4EE] shadow-sm z-10" />

              {/* Card Container */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                <div className="p-6 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] hover:border-[#D89B3C] transition-all space-y-2">
                  <span className="text-[11px] font-mono text-[#315A4A] bg-[#D8E8E0] px-2 py-0.5 rounded-full">
                    {new Date(item.momentAt || item.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h4 className="font-serif text-xl text-[#1D1C1A]">{item.title || item.type.toUpperCase()}</h4>
                  <p className="text-xs text-[#5D5A54] leading-relaxed line-clamp-3">{item.body || item.caption}</p>
                  <p className="text-[11px] text-[#1D1C1A] font-medium pt-2">— {item.authorDisplayName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Mixed Search / All View */}
      {!isLoading && !error && items.length > 0 && (viewMode === 'all' || viewMode === 'search') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            if (item.type === 'photo' || item.type === 'video') {
              return <MediaCard key={item.id} item={item} onSelect={setSelectedMedia} />;
            }
            if (item.type === 'memory') {
              return <MemoryCard key={item.id} item={item} />;
            }
            return <MessageCard key={item.id} item={item} />;
          })}
        </div>
      )}

      {/* Dark Media Viewer Modal */}
      <MediaViewer item={selectedMedia} onClose={() => setSelectedMedia(null)} />

      {/* 4-Step Contribution Wizard Modal */}
      <UploadWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
};
