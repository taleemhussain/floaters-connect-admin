import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { AdminRoleGuard } from '../auth/admin-role.guard';
import { AdminService } from './admin.service';

@Controller('v1/admin')
@UseGuards(FirebaseAuthGuard, AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Post('users/:uid/toggle-ban')
  async toggleUserBan(@Param('uid') uid: string) {
    return this.adminService.toggleUserBan(uid);
  }

  @Post('users/:uid/verify')
  async verifyUser(@Param('uid') uid: string) {
    return this.adminService.verifyUser(uid);
  }

  @Get('users/:uid/profile')
  async getUserProfile(@Param('uid') uid: string) {
    return this.adminService.getUserProfile(uid);
  }

  @Get('disputes')
  async getDisputes() {
    return this.adminService.getDisputes();
  }

  @Post('disputes/:id/resolve')
  async resolveDispute(
    @Param('id') id: string,
    @Body('resolution') resolution: string,
  ) {
    return this.adminService.resolveDispute(id, resolution);
  }

  @Get('tags')
  async getTags() {
    return this.adminService.getTags();
  }

  @Post('tags')
  async addOrUpdateTag(
    @Body() tagData: { id?: string; name: string; description: string; active: boolean },
  ) {
    return this.adminService.addOrUpdateTag(tagData);
  }
}
