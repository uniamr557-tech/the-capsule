/**
 * Content Collection Service & Mock Repository Adapter
 * Source of Truth: Product Specification Sections 4.3 & 10
 */

import { ContentItemDto, ContentListQueryDto, ContentListResponseDto, CreateContentItemRequest } from '@capsule/api-contracts';
import { ContentItemValidator } from '@capsule/domain';

// Sample senior class memory data
const INITIAL_DEMO_ITEMS: ContentItemDto[] = [
  {
    id: 'cnt_101',
    type: 'photo',
    authorDisplayName: 'Maya Lin',
    title: 'Sunset at the Senior Parking Lot',
    body: null,
    caption: 'Last Friday night after the final home game. We stayed until the stadium lights turned off.',
    mediaAssetId: 'med_201',
    momentAt: '2026-05-15T20:30:00.000Z',
    status: 'visible',
    submittedAt: '2026-05-16T10:00:00.000Z',
    tags: [
      { id: 'tag_1', labelDisplay: 'Senior Year' },
      { id: 'tag_2', labelDisplay: 'Sunset' },
    ],
  },
  {
    id: 'cnt_102',
    type: 'memory',
    authorDisplayName: 'Jordan Miller',
    title: 'The Great Chemistry Lab Spill of 2025',
    body: 'Nobody will ever forget when Mr. Henderson accidentally knocked over the indicator solution during AP Chemistry. The floor turned bright magenta for three days! Even after scrubbing, there was still a faint pink spot under lab bench 4.',
    caption: null,
    mediaAssetId: null,
    momentAt: '2025-11-10T14:15:00.000Z',
    status: 'visible',
    submittedAt: '2026-05-18T12:00:00.000Z',
    tags: [{ id: 'tag_3', labelDisplay: 'Class Memory' }],
  },
  {
    id: 'cnt_103',
    type: 'video',
    authorDisplayName: 'Avery Chen',
    title: 'Spring Musical Backstage Chaos',
    body: null,
    caption: '30 seconds before curtain call! Everyone screaming their lines one last time.',
    mediaAssetId: 'med_202',
    momentAt: '2026-04-02T19:00:00.000Z',
    status: 'visible',
    submittedAt: '2026-05-20T09:30:00.000Z',
    tags: [{ id: 'tag_4', labelDisplay: 'Musical' }],
  },
  {
    id: 'cnt_104',
    type: 'message',
    authorDisplayName: 'Samira Patel',
    title: null,
    body: 'So proud of all of us! Can’t wait to see where everyone goes in college and beyond. Class of 2026 forever ❤️',
    caption: null,
    mediaAssetId: null,
    momentAt: '2026-05-22T16:00:00.000Z',
    status: 'visible',
    submittedAt: '2026-05-22T16:00:00.000Z',
    tags: [{ id: 'tag_5', labelDisplay: 'Graduation' }],
  },
  {
    id: 'cnt_105',
    type: 'photo',
    authorDisplayName: 'Lucas Vance',
    title: 'Graduation Practice High Fives',
    body: null,
    caption: 'Walking across the field for the dummy diploma run.',
    mediaAssetId: 'med_203',
    momentAt: '2026-05-24T11:00:00.000Z',
    status: 'visible',
    submittedAt: '2026-05-24T14:20:00.000Z',
    tags: [{ id: 'tag_5', labelDisplay: 'Graduation' }],
  },
];

let contentItemsStore = [...INITIAL_DEMO_ITEMS];

export class ContentCollectionService {
  /** Queries visible content items with filtering, sorting, and pagination */
  static async getVisibleContent(query: ContentListQueryDto): Promise<ContentListResponseDto> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = contentItemsStore.filter((item) => item.status === 'visible');

    if (query.type) {
      filtered = filtered.filter((item) => item.type === query.type);
    }

    if (query.tagId) {
      filtered = filtered.filter((item) => item.tags.some((t) => t.id === query.tagId));
    }

    // Sort items
    if (query.sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    } else if (query.sort === 'moment_date') {
      filtered.sort((a, b) => new Date(b.momentAt || b.submittedAt).getTime() - new Date(a.momentAt || a.submittedAt).getTime());
    } else {
      // Default newest
      filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }

    return {
      items: filtered,
      nextCursor: null,
      totalVisibleCount: filtered.length,
    };
  }

  /** Searches content items by phrase */
  static async searchContent(searchPhrase: string): Promise<ContentItemDto[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const phrase = searchPhrase.trim().toLowerCase();
    if (!phrase) return [];

    return contentItemsStore.filter((item) => {
      if (item.status !== 'visible') return false;
      const titleMatch = item.title?.toLowerCase().includes(phrase);
      const bodyMatch = item.body?.toLowerCase().includes(phrase);
      const captionMatch = item.caption?.toLowerCase().includes(phrase);
      const authorMatch = item.authorDisplayName.toLowerCase().includes(phrase);
      const tagMatch = item.tags.some((t) => t.labelDisplay.toLowerCase().includes(phrase));
      return titleMatch || bodyMatch || captionMatch || authorMatch || tagMatch;
    });
  }

  /** Submits a new content item */
  static async submitContent(request: CreateContentItemRequest): Promise<ContentItemDto> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const normalizedAuthor = ContentItemValidator.normalizeDisplayName(request.authorDisplayName);

    const newItem: ContentItemDto = {
      id: `cnt_${Date.now()}`,
      type: request.type,
      authorDisplayName: normalizedAuthor,
      title: request.title || null,
      body: request.body || null,
      caption: request.caption || null,
      mediaAssetId: request.mediaAssetId || null,
      momentAt: request.momentAt || new Date().toISOString(),
      status: 'visible',
      submittedAt: new Date().toISOString(),
      tags: (request.tagLabels || ['Class Memory']).map((label, idx) => ({
        id: `tag_new_${idx}`,
        labelDisplay: label,
      })),
    };

    contentItemsStore = [newItem, ...contentItemsStore];
    return newItem;
  }
}
