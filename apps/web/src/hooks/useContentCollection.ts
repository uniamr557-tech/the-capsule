import { useState, useEffect, useCallback } from 'react';
import { ContentItemDto } from '@capsule/api-contracts';
import { ContentCollectionService } from '@/lib/content-service';

export interface ContentCollectionOptions {
  type?: 'photo' | 'video' | 'memory' | 'message';
  tagId?: string;
  searchPhrase?: string;
  sort?: 'newest' | 'oldest' | 'moment_date';
}

export function useContentCollection(options: ContentCollectionOptions = {}) {
  const [items, setItems] = useState<ContentItemDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ContentCollectionService.getVisibleContent(options);
      setItems(data.items);
      setNextCursor(data.nextCursor);
    } catch (err: any) {
      setError(err?.message || 'Failed to load capsule content.');
    } finally {
      setIsLoading(false);
    }
  }, [options.type, options.tagId, options.searchPhrase, options.sort]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    nextCursor,
    isLoading,
    error,
    refresh: fetchItems,
  };
}
