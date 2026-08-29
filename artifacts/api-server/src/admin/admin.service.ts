import { Inject, Injectable, Logger } from '@nestjs/common';
import { FIRESTORE, FIREBASE_CONFIGURED } from '../firebase/firebase.tokens';
import { FirestoreCollections } from '@workspace/firebase';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @Inject(FIREBASE_CONFIGURED) private readonly firebaseConfigured: boolean,
    @Inject(FIRESTORE) private readonly firestore: any,
  ) {}

  async getUsers() {
    if (!this.firebaseConfigured) {
      this.logger.log('Firebase is not configured - returning empty users');
      return [];
    }

    try {
      const snap = await this.firestore.collection(FirestoreCollections.users).get();
      const users: any[] = [];
      snap.forEach((doc: any) => {
        users.push({ uid: doc.id, ...doc.data() });
      });
      return users;
    } catch (error: any) {
      this.logger.error(`Error fetching Firestore users: ${error.message}`);
      return [];
    }
  }

  async toggleUserBan(uid: string) {
    if (!this.firebaseConfigured) {
      return { success: false, message: 'Firebase not configured' };
    }

    try {
      const ref = this.firestore.collection(FirestoreCollections.users).doc(uid);
      const snap = await ref.get();
      if (!snap.exists) {
        return { success: false, message: 'User not found' };
      }
      const data = snap.data();
      const nextBanState = !data?.isBanned;
      await ref.update({ isBanned: nextBanState });
      return { success: true, isBanned: nextBanState };
    } catch (error: any) {
      this.logger.error(`Error toggling ban state for user ${uid}: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  async verifyUser(uid: string) {
    if (!this.firebaseConfigured) {
      return { success: false, message: 'Firebase not configured' };
    }

    try {
      const ref = this.firestore.collection(FirestoreCollections.users).doc(uid);
      await ref.update({ onboardingStatus: 'registered' });
      return { success: true, onboardingStatus: 'registered' };
    } catch (error: any) {
      this.logger.error(`Error verifying user ${uid}: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  async getUserProfile(uid: string) {
    if (!this.firebaseConfigured) {
      return { success: false, message: 'Firebase not configured' };
    }

    try {
      const userSnap = await this.firestore.collection(FirestoreCollections.users).doc(uid).get();
      if (!userSnap.exists) {
        return { success: false, message: 'User not found in users collection' };
      }
      const userData = { uid: userSnap.id, ...userSnap.data() };

      let profileData = null;
      if (userData.role === 'driver') {
        const profileSnap = await this.firestore.collection(FirestoreCollections.driverProfiles).doc(uid).get();
        if (profileSnap.exists) {
          profileData = { uid: profileSnap.id, ...profileSnap.data() };
        }
      } else if (userData.role === 'runner') {
        const profileSnap = await this.firestore.collection(FirestoreCollections.runnerProfiles).doc(uid).get();
        if (profileSnap.exists) {
          profileData = { uid: profileSnap.id, ...profileSnap.data() };
        }
      }

      return { success: true, user: userData, profile: profileData };
    } catch (error: any) {
      this.logger.error(`Error fetching user profile for ${uid}: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  async getDisputes() {
    if (!this.firebaseConfigured) {
      return [];
    }

    try {
      const snap = await this.firestore.collection('disputes').get();
      const disputes: any[] = [];
      snap.forEach((doc: any) => {
        disputes.push({ id: doc.id, ...doc.data() });
      });
      return disputes;
    } catch (error: any) {
      this.logger.error(`Error fetching Firestore disputes: ${error.message}`);
      return [];
    }
  }

  async resolveDispute(id: string, resolution: string) {
    if (!this.firebaseConfigured) {
      return { success: false, message: 'Firebase not configured' };
    }

    try {
      const ref = this.firestore.collection('disputes').doc(id);
      await ref.update({ status: 'resolved', resolution });
      return { success: true, id, status: 'resolved', resolution };
    } catch (error: any) {
      this.logger.error(`Error resolving dispute ${id}: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  async getTags() {
    if (!this.firebaseConfigured) {
      return [];
    }

    try {
      const snap = await this.firestore.collection('skill_tags').get();
      const tags: any[] = [];
      snap.forEach((doc: any) => {
        tags.push({ id: doc.id, ...doc.data() });
      });
      return tags;
    } catch (error: any) {
      this.logger.error(`Error fetching Firestore tags: ${error.message}`);
      return [];
    }
  }

  async addOrUpdateTag(tagData: { id?: string; name: string; description: string; active: boolean }) {
    if (!this.firebaseConfigured) {
      return { success: false, message: 'Firebase not configured' };
    }

    try {
      const id = tagData.id || this.firestore.collection('skill_tags').doc().id;
      const ref = this.firestore.collection('skill_tags').doc(id);
      await ref.set({ name: tagData.name, description: tagData.description, active: tagData.active }, { merge: true });
      return { success: true, tag: { id, ...tagData } };
    } catch (error: any) {
      this.logger.error(`Error upserting skill tag: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}
