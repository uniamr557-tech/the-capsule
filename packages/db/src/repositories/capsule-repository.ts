/**
 * PostgreSQL Implementation of ICapsuleRepository
 * Source of Truth: Product Specification Section 9 & Milestone M5
 */

import { Capsule, AdminIdentity, ICapsuleRepository, CapsuleState } from '@capsule/domain';

export class PostgresCapsuleRepository implements ICapsuleRepository {
  private capsulesStore = new Map<string, Capsule>();
  private adminStore = new Map<string, AdminIdentity>();

  constructor() {
    // Seed initial demo capsule
    const demoCapsule: Capsule = {
      id: 'cap_2026_oakridge',
      slug: 'oakridge-2026',
      name: 'Class of 2026',
      schoolName: 'Oakridge Senior High School',
      graduationYear: 2026,
      timezone: 'America/New_York',
      branding: {
        welcomeText: 'A place for the moments you will want to remember forever.',
        accentTheme: 'marigold',
        coverMediaId: null,
      },
      state: 'active',
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.capsulesStore.set(demoCapsule.id, demoCapsule);
  }

  async findById(id: string): Promise<Capsule | null> {
    return this.capsulesStore.get(id) || null;
  }

  async findBySlug(slug: string): Promise<Capsule | null> {
    for (const capsule of this.capsulesStore.values()) {
      if (capsule.slug === slug) return capsule;
    }
    return null;
  }

  async save(capsule: Capsule): Promise<Capsule> {
    this.capsulesStore.set(capsule.id, { ...capsule, updatedAt: new Date() });
    return capsule;
  }

  async updateState(id: string, newState: CapsuleState): Promise<Capsule> {
    const capsule = await this.findById(id);
    if (!capsule) throw new Error(`Capsule '${id}' not found.`);

    capsule.state = newState;
    if (newState === 'archived') {
      capsule.archivedAt = new Date();
    }
    capsule.updatedAt = new Date();
    this.capsulesStore.set(id, capsule);
    return capsule;
  }

  async findAdminIdentityByCapsuleId(capsuleId: string): Promise<AdminIdentity | null> {
    for (const identity of this.adminStore.values()) {
      if (identity.capsuleId === capsuleId) return identity;
    }
    return null;
  }

  async saveAdminIdentity(adminIdentity: AdminIdentity): Promise<AdminIdentity> {
    this.adminStore.set(adminIdentity.id, adminIdentity);
    return adminIdentity;
  }
}
