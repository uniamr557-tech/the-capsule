/**
 * Virus Scanner & Malware Protection Contract Interface
 * Source of Truth: Milestone M3 Requirement Specifications
 */

import { StorageObject } from '@capsule/domain';

export interface VirusScanResult {
  isInfected: boolean;
  threatName?: string;
  scannedBytes: number;
}

export interface IVirusScannerService {
  /** Scans quarantine storage object for viruses or malware signatures */
  scanObject(storageObject: StorageObject): Promise<VirusScanResult>;
}
