/**
 * Life Cycle State Definitions & State Machines
 * Source of Truth: Product Specification Sections 1.6, 4.1, 4.4
 */

/** Capsule Life Cycle States */
export type CapsuleState = 'draft' | 'active' | 'archived' | 'deleted';

/** Content Lifecycle States */
export type ContentStatus = 'visible' | 'hidden' | 'deleted';

/** State Transition Rules for Capsule */
export class CapsuleLifecycleManager {
  static canTransition(current: CapsuleState, next: CapsuleState): boolean {
    const validTransitions: Record<CapsuleState, CapsuleState[]> = {
      draft: ['active', 'deleted'],
      active: ['archived', 'deleted'],
      archived: ['active', 'deleted'], // Reopening requires explicit audit
      deleted: [], // Terminal state
    };

    return validTransitions[current].includes(next);
  }

  static isReadOnly(state: CapsuleState): boolean {
    return state === 'archived' || state === 'deleted';
  }
}

/** State Transition Rules for Content Items */
export class ContentLifecycleManager {
  static canTransition(current: ContentStatus, next: ContentStatus): boolean {
    const validTransitions: Record<ContentStatus, ContentStatus[]> = {
      visible: ['hidden', 'deleted'],
      hidden: ['visible', 'deleted'],
      deleted: [], // Terminal state; queued for background purge
    };

    return validTransitions[current].includes(next);
  }
}
