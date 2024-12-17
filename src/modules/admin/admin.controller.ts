import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes
export class AdminController {
  @Get('dashboard')
  @Roles('admin') // Only 'admin' role can access
  getDashboard(@GetUser() user: any) {
    return {
      message: 'Welcome to Admin Dashboard',
      user,
    };
  }
}
