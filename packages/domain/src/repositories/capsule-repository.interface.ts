/**
 * Capsule Repository Interface
 */

import { Capsule, AdminIdentity } from '../entities/capsule';
import { CapsuleState } from '../entities/lifecycle';

export interface ICapsuleRepository {
  findById(id: string): Promise<Capsule | null>;
  findBySlug(slug: string): Promise<Capsule | null>;
  save(capsule: Capsule): Promise<Capsule>;
  updateState(id: string, newState: CapsuleState): Promise<Capsule>;
  findAdminIdentityByCapsuleId(capsuleId: string): Promise<AdminIdentity | null>;
  saveAdminIdentity(adminIdentity: AdminIdentity): Promise<AdminIdentity>;
}
