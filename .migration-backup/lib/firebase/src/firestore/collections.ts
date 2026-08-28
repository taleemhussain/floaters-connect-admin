/** Firestore top-level collection names — single source of truth. */
export const FirestoreCollections = {
  users: 'users',
  driverProfiles: 'driver_profiles',
  runnerProfiles: 'runner_profiles',
  payoutProfiles: 'payout_profiles',
  devices: 'devices',
  jobs: 'jobs',
  notifications: 'notifications',
  adminAuditLog: 'admin_audit_log',
} as const;

export type FirestoreCollectionName =
  (typeof FirestoreCollections)[keyof typeof FirestoreCollections];
