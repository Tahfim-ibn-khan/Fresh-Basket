import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('products')
  @Roles('admin')
  async getTotalProducts() {
    return this.adminService.getTotalProducts();
  }

  @Get('sales')
  @Roles('admin')
  async getTotalSales(@Query('timePeriod') timePeriod: 'day' | 'week' | 'month' | 'year') {
    return this.adminService.getTotalSales(timePeriod);
  }

  @Get('users')
  @Roles('admin')
  async getUserStatistics() {
    return this.adminService.getUserStatistics();
  }
}
