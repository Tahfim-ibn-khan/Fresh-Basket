import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { SearchOrderDto } from '../DTOs/search-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async checkout(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      userId,
      paymentMethod,
      status,
      totalPrice,
      deliveryAddress,
      deliveryDate,
    } = createOrderDto;

    // Create a new order
    const order = this.orderRepository.create({
      userId,
      paymentMethod,
      status,
      totalPrice,
      deliveryAddress,
      deliveryDate,
      orderDate: new Date(), // Set current date
    });

    // Save to the database
    return this.orderRepository.save(order);
  }

  async searchOrders(searchOrderDto: SearchOrderDto): Promise<Order[]> {
    const {
      userId,
      paymentMethod,
      status,
      minTotalPrice,
      maxTotalPrice,
      startDate,
      endDate,
    } = searchOrderDto;

    // Create a query builder
    const query = this.orderRepository.createQueryBuilder('order');

    // Add filters based on provided parameters
    if (userId) {
      query.andWhere('order.userId = :userId', { userId });
    }

    if (paymentMethod) {
      query.andWhere('order.paymentMethod = :paymentMethod', { paymentMethod });
    }

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (minTotalPrice) {
      query.andWhere('order.totalPrice >= :minTotalPrice', { minTotalPrice });
    }

    if (maxTotalPrice) {
      query.andWhere('order.totalPrice <= :maxTotalPrice', { maxTotalPrice });
    }

    if (startDate) {
      query.andWhere('order.orderDate >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('order.orderDate <= :endDate', { endDate });
    }

    // Execute the query and return the result
    return query.getMany();
  }

}
