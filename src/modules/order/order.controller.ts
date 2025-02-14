import { Controller, Post, Body, Get, Param, UseGuards, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { PlaceOrderDto } from '../DTOs/place-order.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  @Roles('customer')
  async placeOrder(@Body() dto: PlaceOrderDto) {
    return this.orderService.placeOrder(dto);
  }

  @Get('history/:userId')
  @Roles('customer')
  async getOrderHistory(@Param('userId') userId: number) {
    return this.orderService.getOrderHistory(userId);
  }
  
  @Get('all')
  @Roles('admin')
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Patch('/update-status/:id')
  @Roles('admin')
  async updateOrderStatus(@Param('id') id: number, @Body() body: { status: string }) {
    return this.orderService.updateOrderStatus(id, body.status);
  }
  
}
