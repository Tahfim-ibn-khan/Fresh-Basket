import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { SearchOrderDto } from '../DTOs/search-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  async checkout(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.checkout(createOrderDto);
  }

  @Get('search')
  async searchOrders(@Query() searchOrderDto: SearchOrderDto) {
    return this.orderService.searchOrders(searchOrderDto);
  }
}
