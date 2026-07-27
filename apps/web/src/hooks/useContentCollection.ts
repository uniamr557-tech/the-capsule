'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentItemDto, ContentListQueryDto } from '@capsule/api-contracts';
import { ContentCollectionService } from '../lib/content-service';

interface UseContentCollectionOptions {
  type?: ContentListQueryDto['type'];
  tagId?: string;
  searchPhrase?: string;
  sort?: ContentListQueryDto['sort'];
}

export function useContentCollection(options: UseContentCollectionOptions = {}) {
  const [items, setItems] = useState<ContentItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (options.searchPhrase && options.searchPhrase.trim().length > 0) {
        const searchResults = await ContentCollectionService.searchContent(options.searchPhrase);
        setItems(searchResults);
      } else {
        const response = await ContentCollectionService.getVisibleContent({
          type: options.type,
          tagId: options.tagId,
          sort: options.sort || 'newest',
        });
        setItems(response.items);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content collection.');
    } finally {
      setIsLoading(false);
    }
  }, [options.type, options.tagId, options.searchPhrase, options.sort]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return {
    items,
    isLoading,
    error,
    refresh: fetchCollection,
  };
}
