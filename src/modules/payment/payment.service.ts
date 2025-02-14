import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Order } from 'src/entities/order.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' });
  }

  async createPaymentSession(orderId: number): Promise<{ paymentUrl: string }> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
  
    if (order.status === 'paid') {
      throw new Error('This order has already been paid for.');
    }
  
    // ✅ Create Stripe Checkout Session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order #${order.id}`,
            },
            unit_amount: Math.round(Number(order.totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3001/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
      cancel_url: `http://localhost:3001/payment/cancel/${order.id}`,
    });
  
    if (!session.url) {
      throw new Error("Failed to create Stripe checkout session.");
    }
  
    return { paymentUrl: session.url };
  }  
  

  async updateOrderStatus(orderId: number, status: 'paid' | 'pending'): Promise<string> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
  
    if (status === "paid" && order.status === "paid") {
      return `Order #${orderId} is already marked as paid.`;
    }
  
    order.status = status;
    await this.orderRepository.save(order);
  
    return `Order #${orderId} status updated to ${status}.`;
  }
  async handleStripeWebhook(req: any, signature: string): Promise<void> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;
  
    try {
      event = this.stripe.webhooks.constructEvent(req.rawBody, signature, secret);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      throw new Error('Invalid webhook signature.');
    }
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
  
      if (orderId) {
        await this.updateOrderStatus(Number(orderId), 'paid');
      }
    }
  }
  

}
