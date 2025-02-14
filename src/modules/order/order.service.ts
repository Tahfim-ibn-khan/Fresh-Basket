import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { Cart } from 'src/entities/cart.entity';
import { User } from 'src/entities/user.entity';
import { PlaceOrderDto } from '../DTOs/place-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Place Order
  async placeOrder(dto: PlaceOrderDto): Promise<{ orderId: number; message: string }> {
    const { userId, paymentMethod, deliveryAddress, phoneNumber, deliveryInstructions } = dto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    if (cartItems.length === 0) throw new NotFoundException('Cart is empty.');

    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const orderProducts = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.title,
      quantity: item.quantity,
      unitPrice: item.product.price,
      total: item.quantity * item.product.price,
    }));

    const order = this.orderRepository.create({
      user,
      totalPrice,
      paymentMethod,
      deliveryAddress,
      phoneNumber,
      deliveryInstructions,
      status: 'pending',
      products: orderProducts,
    });

    const savedOrder = await this.orderRepository.save(order);
    await this.cartRepository.delete({ user: { id: userId } });

    return { orderId: savedOrder.id, message: 'Order placed successfully!' };
  }

  // ✅ Get Order History for a User
  async getOrderHistory(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      order: { orderDate: 'DESC' },
    });
  }


  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user'], 
      order: { orderDate: 'DESC' },
    });
  }


  async updateOrderStatus(orderId: number, status: string): Promise<string> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found.`);
  
    order.status = status;
    await this.orderRepository.save(order);
    
    return `Order #${orderId} status updated to ${status}`;
  }  
}
