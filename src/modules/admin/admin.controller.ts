import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  @Get('dashboard')
  @UseGuards(RolesGuard) // RolesGuard expects req.user to be set by JwtMiddleware
  @Roles('admin') // Only allow 'admin' role
  getAdminDashboard(@Req() req: Request) {
    console.log('AdminController: Request User:', req.user);
    return {
      message: 'Welcome Admin Dashboard!',
      user: req.user,
    };
  }
}
