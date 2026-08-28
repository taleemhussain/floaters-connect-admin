import { Inject, Injectable, Logger } from '@nestjs/common';
import { FIRESTORE, FIREBASE_CONFIGURED } from '../firebase/firebase.tokens';
import { FirestoreCollections } from '@workspace/firebase';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  // In-memory mock database for fallback testing when Firebase is unconfigured
  private mockUsers = [
    { uid: 'u1', email: 'driver1@floaters.com', displayName: 'Marcus Vance', role: 'driver', onboardingStatus: 'registered', isBanned: false, createdAt: new Date().toISOString() },
    { uid: 'u2', email: 'runner1@floaters.com', displayName: 'Elena Rostova', role: 'runner', onboardingStatus: 'registered', isBanned: false, createdAt: new Date().toISOString() },
    { uid: 'u3', email: 'driver2@floaters.com', displayName: 'Sarah Chen', role: 'driver', onboardingStatus: 'documents_uploaded', isBanned: false, createdAt: new Date().toISOString() },
    { uid: 'u4', email: 'runner2@floaters.com', displayName: 'John Doe', role: 'runner', onboardingStatus: 'registered', isBanned: true, createdAt: new Date().toISOString() }
  ];

  private mockDisputes = [
    { id: 'disp1', gigId: 'gig101', reporterName: 'Marcus Vance', reporterRole: 'driver', accusedName: 'Elena Rostova', reason: 'Runner failed to deliver the final parcel to the doorstep.', status: 'open', createdAt: new Date().toISOString(), evidenceUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc' },
    { id: 'disp2', gigId: 'gig102', reporterName: 'Elena Rostova', reporterRole: 'runner', accusedName: 'Marcus Vance', reason: 'Driver cancelled the ride post-OTP confirmation without explaining.', status: 'resolved', resolution: 'Runner compensated $10 penalty charge', createdAt: new Date().toISOString(), evidenceUrl: '' }
  ];

  private mockTags = [
    { id: 'tag1', name: 'Heavy Lifting', description: 'Assisting with large furniture, appliances or deliveries exceeding 20kg', active: true },
    { id: 'tag2', name: 'Grocery Sorting', description: 'Navigating aisles and selecting item replacements with extreme accuracy', active: true },
    { id: 'tag3', name: 'Express Sprint', description: 'On-foot runners optimized for immediate quick delivery tasks under 15 mins', active: true },
    { id: 'tag4', name: 'Fragile Handling', description: 'Handling delicate items (e.g. cakes, glassware, catering packages)', active: false }
  ];

  constructor(
    @Inject(FIREBASE_CONFIGURED) private readonly firebaseConfigured: boolean,
    @Inject(FIRESTORE) private readonly firestore: any,
  ) {}

  async getUsers() {
    if (!this.firebaseConfigured) {
      this.logger.log('Firebase unconfigured - returning mock users');
      return this.mockUsers;
    }

    try {
      const snap = await this.firestore.collection(FirestoreCollections.users).get();
      const users: any[] = [];
      snap.forEach((doc: any) => {
        users.push({ uid: doc.id, ...doc.data() });
      });
      return users.length > 0 ? users : this.mockUsers;
    } catch (error: any) {
      this.logger.error(`Error fetching Firestore users: ${error.message}`);
      return this.mockUsers;
    }
  }

  async toggleUserBan(uid: string) {
    if (!this.firebaseConfigured) {
      const user = this.mockUsers.find(u => u.uid === uid);
      if (user) {
        user.isBanned = !user.isBanned;
        return { success: true, user };
      }
      return { success: false, message: 'User not found' };
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
      const user = this.mockUsers.find(u => u.uid === uid);
      if (user) {
        user.onboardingStatus = 'registered';
        return { success: true, user };
      }
      return { success: false, message: 'User not found' };
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

  async getDisputes() {
    if (!this.firebaseConfigured) {
      return this.mockDisputes;
    }

    try {
      const snap = await this.firestore.collection('disputes').get();
      const disputes: any[] = [];
      snap.forEach((doc: any) => {
        disputes.push({ id: doc.id, ...doc.data() });
      });
      return disputes.length > 0 ? disputes : this.mockDisputes;
    } catch (error: any) {
      this.logger.error(`Error fetching Firestore disputes: ${error.message}`);
      return this.mockDisputes;
    }
  }

  async resolveDispute(id: string, resolution: string) {
    if (!this.firebaseConfigured) {
      const dispute = this.mockDisputes.find(d => d.id === id);
      if (dispute) {
        dispute.status = 'resolved';
        dispute.resolution = resolution;
        return { success: true, dispute };
      }
      return { success: false, message: 'Dispute not found' };
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
      return this.mockTags;
    }

    try {
      const snap = await this.firestore.collection('skill_tags').get();
      const tags: any[] = [];
      snap.forEach((doc: any) => {
        tags.push({ id: doc.id, ...doc.data() });
      });
      return tags.length > 0 ? tags : this.mockTags;
    } catch (error: any) {
      this.logger.error(`Error fetching Firestore tags: ${error.message}`);
      return this.mockTags;
    }
  }

  async addOrUpdateTag(tagData: { id?: string; name: string; description: string; active: boolean }) {
    if (!this.firebaseConfigured) {
      if (tagData.id) {
        const tag = this.mockTags.find(t => t.id === tagData.id);
        if (tag) {
          tag.name = tagData.name;
          tag.description = tagData.description;
          tag.active = tagData.active;
          return { success: true, tag };
        }
      } else {
        const newTag = { id: `tag${this.mockTags.length + 1}`, ...tagData };
        this.mockTags.push(newTag);
        return { success: true, tag: newTag };
      }
      return { success: false, message: 'Tag not found' };
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
