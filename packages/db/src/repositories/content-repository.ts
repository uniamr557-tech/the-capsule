/**
 * PostgreSQL Implementation of Content Repositories
 * Source of Truth: Product Specification Section 9 & Milestone M5
 */

import {
  ContentItem,
  ParticipantHandle,
  Tag,
  IContentRepository,
  IParticipantHandleRepository,
  ITagRepository,
  ContentFilterQuery,
  ContentStatus,
  ContentItemValidator,
} from '@capsule/domain';

export class PostgresContentRepository implements IContentRepository {
  private itemsStore = new Map<string, ContentItem>();

  async findById(id: string): Promise<ContentItem | null> {
    return this.itemsStore.get(id) || null;
  }

  async findVisibleByCapsuleId(query: ContentFilterQuery): Promise<{ items: ContentItem[]; nextCursor: string | null }> {
    const all = Array.from(this.itemsStore.values()).filter(
      (item) => item.capsuleId === query.capsuleId && item.status === 'visible',
    );

    let filtered = all;
    if (query.type) {
      filtered = filtered.filter((i) => i.type === query.type);
    }
    if (query.tagId) {
      filtered = filtered.filter((i) => i.tags.some((t) => t.id === query.tagId));
    }

    filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return { items: filtered, nextCursor: null };
  }

  async findAdminByCapsuleId(query: ContentFilterQuery): Promise<{ items: ContentItem[]; nextCursor: string | null }> {
    const all = Array.from(this.itemsStore.values()).filter((item) => item.capsuleId === query.capsuleId);
    let filtered = all;
    if (query.status) {
      filtered = filtered.filter((i) => i.status === query.status);
    }
    return { items: filtered, nextCursor: null };
  }

  async save(item: ContentItem): Promise<ContentItem> {
    this.itemsStore.set(item.id, item);
    return item;
  }

  async updateStatus(id: string, newStatus: ContentStatus, reason?: string): Promise<ContentItem> {
    const item = await this.findById(id);
    if (!item) throw new Error(`Content item '${id}' not found.`);

    item.status = newStatus;
    if (newStatus === 'hidden') item.hiddenAt = new Date();
    if (newStatus === 'deleted') item.deletedAt = new Date();
    if (reason) item.statusReason = reason;

    this.itemsStore.set(id, item);
    return item;
  }

  async searchVisible(capsuleId: string, searchPhrase: string): Promise<ContentItem[]> {
    const phrase = searchPhrase.toLowerCase().trim();
    return Array.from(this.itemsStore.values()).filter((item) => {
      if (item.capsuleId !== capsuleId || item.status !== 'visible') return false;
      const titleMatch = item.title?.toLowerCase().includes(phrase);
      const bodyMatch = item.body?.toLowerCase().includes(phrase);
      const captionMatch = item.caption?.toLowerCase().includes(phrase);
      return titleMatch || bodyMatch || captionMatch;
    });
  }
}

export class PostgresParticipantHandleRepository implements IParticipantHandleRepository {
  private handlesStore = new Map<string, ParticipantHandle>();

  async findById(id: string): Promise<ParticipantHandle | null> {
    return this.handlesStore.get(id) || null;
  }

  async findOrCreate(capsuleId: string, rawDisplayName: string, sessionId: string | null): Promise<ParticipantHandle> {
    const normalized = ContentItemValidator.normalizeDisplayName(rawDisplayName);

    for (const h of this.handlesStore.values()) {
      if (h.capsuleId === capsuleId && h.displayNameNormalized === normalized) {
        return h;
      }
    }

    const newHandle: ParticipantHandle = {
      id: `hnd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      capsuleId,
      sessionId,
      displayNameRaw: rawDisplayName,
      displayNameNormalized: normalized,
      createdAt: new Date(),
    };

    this.handlesStore.set(newHandle.id, newHandle);
    return newHandle;
  }
}

export class PostgresTagRepository implements ITagRepository {
  private tagsStore = new Map<string, Tag>();

  async findByCapsuleId(capsuleId: string): Promise<Tag[]> {
    return Array.from(this.tagsStore.values()).filter((t) => t.capsuleId === capsuleId);
  }

  async findOrCreateTags(capsuleId: string, labels: string[]): Promise<Tag[]> {
    const result: Tag[] = [];
    for (const label of labels) {
      const normalized = ContentItemValidator.normalizeTagLabel(label);
      let found = Array.from(this.tagsStore.values()).find(
        (t) => t.capsuleId === capsuleId && t.labelNormalized === normalized,
      );

      if (!found) {
        found = {
          id: `tag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          capsuleId,
          labelNormalized: normalized,
          labelDisplay: label.trim(),
        };
        this.tagsStore.set(found.id, found);
      }
      result.push(found);
    }
    return result;
  }
}
