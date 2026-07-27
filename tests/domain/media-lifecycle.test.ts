/**
 * Unit Tests for Media Lifecycle State Machine
 * Milestone M3 Requirement Verification
 */

import { describe, it, expect } from 'vitest';
import { MediaLifecycleManager, MediaLifecycleStatus } from '@capsule/domain';

describe('MediaLifecycleManager State Machine', () => {
  it('allows valid progressive lifecycle transitions', () => {
    expect(MediaLifecycleManager.canTransition('Requested', 'Uploading')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Uploading', 'Uploaded')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Uploaded', 'Quarantined')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Quarantined', 'Processing')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Processing', 'Ready')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Ready', 'Deleted')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Deleted', 'Purged')).toBe(true);
  });

  it('allows failure state transitions', () => {
    expect(MediaLifecycleManager.canTransition('Uploading', 'Failed')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Quarantined', 'Failed')).toBe(true);
    expect(MediaLifecycleManager.canTransition('Processing', 'Failed')).toBe(true);
  });

  it('rejects invalid or backward state transitions', () => {
    expect(MediaLifecycleManager.canTransition('Requested', 'Ready')).toBe(false);
    expect(MediaLifecycleManager.canTransition('Ready', 'Processing')).toBe(false);
    expect(MediaLifecycleManager.canTransition('Purged', 'Ready')).toBe(false);
    expect(MediaLifecycleManager.canTransition('Purged', 'Deleted')).toBe(false);
  });

  it('throws an explicit error when assertTransition fails', () => {
    expect(() => MediaLifecycleManager.assertTransition('Requested', 'Ready')).toThrow(
      "Invalid Media Lifecycle transition from 'Requested' to 'Ready'.",
    );
  });
});
