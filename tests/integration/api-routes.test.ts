/**
 * API Route Integration Tests
 * Milestone M5 Requirement Verification
 */

import { describe, it, expect } from 'vitest';
import { SessionGuardService } from '../../apps/web/src/lib/session';
import { ContentCollectionService } from '../../apps/web/src/lib/content-service';

describe('Production API Route Integration Tests', () => {
  it('validates senior class code and generates scoped session', () => {
    const result = SessionGuardService.validateCodeAndCreateSession('SENIOR26');
    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
    expect(result.session?.capsuleId).toBe('cap_2026_oakridge');
  });

  it('rejects invalid access code with neutral error', () => {
    const result = SessionGuardService.validateCodeAndCreateSession('INVALID99');
    expect(result.success).toBe(false);
    expect(result.error).toContain("That code isn't active.");
  });

  it('queries visible content items and supports content creation', async () => {
    const list = await ContentCollectionService.getVisibleContent({});
    expect(list.items).toBeDefined();
    expect(Array.isArray(list.items)).toBe(true);

    const newMemory = await ContentCollectionService.submitContent({
      type: 'memory',
      authorDisplayName: 'Test Author',
      title: 'Integration Test Memory',
      body: 'Testing production API endpoint execution.',
    });

    expect(newMemory.id).toBeDefined();
    expect(newMemory.authorDisplayName).toBe('Test Author');
  });
});
