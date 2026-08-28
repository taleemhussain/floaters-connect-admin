import { Controller, Get, Inject } from '@nestjs/common';
import { FIREBASE_CONFIGURED } from './firebase/firebase.tokens';

@Controller()
export class AppController {
  constructor(
    @Inject(FIREBASE_CONFIGURED) private readonly firebaseConfigured: boolean,
  ) {}

  @Get()
  getIndex() {
    return {
      message: 'Floaters CONNECT Admin API',
      docs: '/api/docs',
    };
  }

  @Get('healthz')
  getHealth() {
    return {
      status: 'ok',
      firebaseConfigured: this.firebaseConfigured,
      timestamp: new Date().toISOString(),
    };
  }
}
