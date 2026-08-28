import type { Timestamp } from 'firebase-admin/firestore';

/** Firestore document shapes — single source of truth for Admin writes/reads. */

export type UserRole = 'driver' | 'runner' | 'unset';

export type OnboardingStatus = 'draft' | 'registered' | 'verified';

export type AuthProviderId = 'password' | 'phone' | 'google.com' | 'apple.com' | string;

/**
 * Document at `users/{uid}`.
 * Timestamps are Firestore Timestamp at rest; API layer maps to ISO-8601.
 */
export type UserDoc = {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  authProviders: AuthProviderId[];
  role: UserRole;
  onboardingStatus: OnboardingStatus;
  firstName?: string | null;
  lastName?: string | null;
  identifier?: string | null;
  identifierType?: 'email' | 'phone' | null;
  countryId?: string | null;
  countryName?: string | null;
  countryDialCode?: string | null;
  legalConsentAcknowledged?: boolean;
  legalConsentAcknowledgedAt?: string | null;
  dataReviewConfirmed?: boolean;
  dataReviewConfirmedAt?: string | null;
  termsAccepted?: boolean;
  termsAcceptedAt?: string | null;
  privacyAccepted?: boolean;
  privacyAcceptedAt?: string | null;
  formalAgreement?: FormalAgreementDoc;
  formalAgreementAt?: string | null;
  onboardingDocuments?: UserOnboardingDocuments | null;
  documentsComplete?: boolean;
  roleSetupComplete?: boolean;
  appPasscodeConfiguredAt?: string | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

export type DriverDocumentType =
  | 'profile_photo'
  | 'national_id'
  | 'vehicle_photo'
  | 'drivers_license_front'
  | 'drivers_license_back'
  | 'vehicle_registration'
  | 'vehicle_insurance'
  | 'operator_credentials'
  | 'fleet_coverage'
  | 'runner_identity';

export type DriverDocumentStatus = 'missing' | 'uploaded' | 'verified';

export type DriverDocumentMeta = {
  storagePath: string;
  contentType: string;
  uploadedAt: string;
  status: DriverDocumentStatus;
};

export type UserOnboardingDocuments = {
  profilePhoto?: DriverDocumentMeta | null;
  nationalId?: DriverDocumentMeta | null;
  vehiclePhoto?: DriverDocumentMeta | null;
  driversLicenseFront?: DriverDocumentMeta | null;
  driversLicenseBack?: DriverDocumentMeta | null;
  vehicleRegistration?: DriverDocumentMeta | null;
  vehicleInsurance?: DriverDocumentMeta | null;
};

/** Runner Profile Hub docs (SCR-PROF-01) — stored on `runner_profiles/{uid}`. */
export type RunnerProfileDocuments = {
  operatorCredentials?: DriverDocumentMeta | null;
  fleetCoverage?: DriverDocumentMeta | null;
  runnerIdentity?: DriverDocumentMeta | null;
};

export type FormalAgreementDoc = {
  terms: boolean;
  privacy: boolean;
  ageConfirmed: boolean;
};

export type DriverSector = 'food' | 'grocery' | 'logistics' | 'convenience';

/**
 * Document at `driver_profiles/{uid}`.
 * Populated on successful driver registration (Phase 2+).
 */
export type DriverProfileDoc = {
  uid: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneVerified: boolean;
  countryId: string;
  countryName: string;
  countryDialCode: string;
  identifier: string | null;
  identifierType: 'email' | 'phone' | null;
  authMethod: 'manual' | 'google' | 'apple' | null;
  legalConsentAcknowledged: boolean;
  legalConsentAcknowledgedAt: string | null;
  dataReviewConfirmed: boolean;
  dataReviewConfirmedAt: string | null;
  termsAccepted: boolean;
  termsAcceptedAt: string | null;
  privacyAccepted: boolean;
  privacyAcceptedAt: string | null;
  formalAgreement: FormalAgreementDoc;
  formalAgreementAt: string | null;
  vehicleType?: string | null;
  licensePlate?: string | null;
  vehicleColor?: string | null;
  vehicleYear?: string | null;
  vehicleMakeModel?: string | null;
  sectors?: DriverSector[] | null;
  vehiclePhoto?: DriverDocumentMeta | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

export type PayoutProfileStatus = 'missing' | 'submitted';

/** Document at `payout_profiles/{uid}`. Full account/routing stored; API returns last4 only. */
export type PayoutProfileDoc = {
  uid: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  status: PayoutProfileStatus;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

/**
 * Document at `runner_profiles/{uid}`.
 * Populated when the user confirms Runner role (SCR-ONB-26).
 */
export type RunnerProfileDoc = {
  uid: string;
  firstName: string;
  lastName: string;
  skills: string[];
  identifier: string | null;
  identifierType: 'email' | 'phone' | null;
  countryId: string | null;
  countryName: string | null;
  countryDialCode: string | null;
  operatorCredentials?: DriverDocumentMeta | null;
  fleetCoverage?: DriverDocumentMeta | null;
  runnerIdentity?: DriverDocumentMeta | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

export function runnerProfileDocPath(uid: string): string {
  return `runner_profiles/${uid}`;
}

export function userDocPath(uid: string): string {
  return `users/${uid}`;
}

export function driverProfileDocPath(uid: string): string {
  return `driver_profiles/${uid}`;
}

export function payoutProfileDocPath(uid: string): string {
  return `payout_profiles/${uid}`;
}
