import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import type { DecodedIdToken } from '@workspace/firebase';
import { verifyIdToken } from '@workspace/firebase';
import { FIREBASE_CONFIGURED } from '../firebase/firebase.tokens';

export type AuthenticatedRequest = Request & {
  headers: { authorization?: string };
  user?: DecodedIdToken;
};

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    @Inject(FIREBASE_CONFIGURED) private readonly firebaseConfigured: boolean,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    // Check for mock-admin-token in development
    if (process.env.NODE_ENV === 'development') {
      const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : '';
      if (token.startsWith('mock-admin-token') || !this.firebaseConfigured) {
        request.user = {
          uid: 'mock-admin-uid',
          email: 'admin@floaters.com',
          email_verified: true,
        } as any;
        return true;
      }
    }

    if (!this.firebaseConfigured) {
      throw new ServiceUnavailableException({
        code: 'FIREBASE_UNAVAILABLE',
        message: 'Firebase Admin is not configured on this server.',
      });
    }

    if (!header?.startsWith('Bearer ')) {
      this.logger.warn('AUTH_UNAUTHORIZED — missing Bearer header');
      throw new UnauthorizedException({
        code: 'AUTH_UNAUTHORIZED',
        message: 'Missing or invalid Authorization Bearer token.',
      });
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      this.logger.warn('AUTH_UNAUTHORIZED — empty Bearer token');
      throw new UnauthorizedException({
        code: 'AUTH_UNAUTHORIZED',
        message: 'Missing or invalid Authorization Bearer token.',
      });
    }

    try {
      request.user = await verifyIdToken(token);
      return true;
    } catch (error: any) {
      this.logger.warn(
        `AUTH_UNAUTHORIZED — verifyIdToken failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new UnauthorizedException({
        code: 'AUTH_UNAUTHORIZED',
        message: 'Firebase ID token is invalid or expired.',
      });
    }
  }
}
