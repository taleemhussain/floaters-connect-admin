import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FIRESTORE } from '../firebase/firebase.tokens';
import { FirestoreCollections } from '@workspace/firebase';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  private readonly logger = new Logger(AdminRoleGuard.name);

  constructor(
    @Inject(FIRESTORE) private readonly firestore: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.uid) {
      throw new ForbiddenException({
        code: 'ACCESS_DENIED',
        message: 'No authenticated user found.',
      });
    }

    // Bypass check for mock-admin-token in development
    if (process.env.NODE_ENV === 'development' && user.uid === 'mock-admin-uid') {
      return true;
    }

    if (!this.firestore) {
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      throw new ForbiddenException({
        code: 'ACCESS_DENIED',
        message: 'Firestore connection is unavailable.',
      });
    }

    try {
      const userRef = this.firestore.collection(FirestoreCollections.users).doc(user.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        this.logger.warn(`Admin role check failed: user record ${user.uid} not found in Firestore`);
        throw new ForbiddenException({
          code: 'USER_NOT_FOUND',
          message: 'User profile does not exist in our database.',
        });
      }

      const userData = userSnap.data();
      if (userData?.role !== 'admin') {
        this.logger.warn(`Admin role check failed: user ${user.uid} role is ${userData?.role || 'unset'}`);
        throw new ForbiddenException({
          code: 'ADMIN_REQUIRED',
          message: 'This resource requires administrator privileges.',
        });
      }

      return true;
    } catch (error: any) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Error verifying admin role for user ${user.uid}: ${error.message}`);
      throw new ForbiddenException({
        code: 'ACCESS_DENIED',
        message: 'Unable to verify administrative authorization.',
      });
    }
  }
}
