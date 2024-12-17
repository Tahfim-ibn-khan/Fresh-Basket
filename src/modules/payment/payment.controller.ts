import { Controller, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout/:orderId')
  async createCheckoutSession(@Param('orderId') orderId: number): Promise<{ paymentUrl: string }> {
    return this.paymentService.createPaymentSession(orderId);
  }

  @Post('success/:orderId')
  async handlePaymentSuccess(@Param('orderId') orderId: number): Promise<string> {
    return this.paymentService.updateOrderStatus(orderId, 'paid');
  }

  @Post('cancel/:orderId')
  async handlePaymentCancel(@Param('orderId') orderId: number): Promise<string> {
    return 'Payment failed. Please try again.';
  }
}
