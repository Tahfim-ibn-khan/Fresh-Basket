import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Get Total Products and Available Quantity
  async getTotalProducts(): Promise<{ totalProducts: number; totalQuantity: number }> {
    const totalProducts = await this.productRepository.count();
    const totalQuantity = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.quantity)', 'totalQuantity')
      .getRawOne();

    return { totalProducts, totalQuantity: parseInt(totalQuantity.totalQuantity) || 0 };
  }

  // ✅ Get Total Sales by Time Period
  async getTotalSales(timePeriod: 'day' | 'week' | 'month' | 'year'): Promise<number> {
    let query = this.orderRepository.createQueryBuilder('order');

    if (timePeriod === 'day') query = query.where('order.orderDate >= CURRENT_DATE');
    if (timePeriod === 'week') query = query.where('order.orderDate >= CURRENT_DATE - INTERVAL \'7 days\'');
    if (timePeriod === 'month') query = query.where('order.orderDate >= DATE_TRUNC(\'month\', CURRENT_DATE)');
    if (timePeriod === 'year') query = query.where('order.orderDate >= DATE_TRUNC(\'year\', CURRENT_DATE)');

    const totalSales = await query.select('SUM(order.totalPrice)', 'totalSales').getRawOne();
    return parseFloat(totalSales.totalSales) || 0;
  }

  // ✅ Get Total Active Users by Role
  async getUserStatistics(): Promise<{ totalUsers: number; customers: number; deliveryAgents: number; storeManagers: number }> {
    const totalUsers = await this.userRepository.count();
    const customers = await this.userRepository.count({ where: { role: 'customer' } });
    const deliveryAgents = await this.userRepository.count({ where: { role: 'delivery-agent' } });
    const storeManagers = await this.userRepository.count({ where: { role: 'store-manager' } });

    return { totalUsers, customers, deliveryAgents, storeManagers };
  }
}
