import { Controller, Param, Post, Req, Headers, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout/:orderId')
  @Roles('customer')
  async createCheckoutSession(@Param('orderId') orderId: number): Promise<{ paymentUrl: string }> {
    return this.paymentService.createPaymentSession(orderId);
  }


  @Post('success/:orderId')
  @Roles('customer')
  async handlePaymentSuccess(@Param('orderId') orderId: number): Promise<string> {
    return this.paymentService.updateOrderStatus(orderId, 'paid');
  }


  @Post('cancel/:orderId')
  @Roles('customer')
  async handlePaymentCancel(@Param('orderId') orderId: number): Promise<string> {
    return 'Payment failed. Please try again.';
  }


  @Post('webhook')
  async handleStripeWebhook(@Req() req: any, @Headers('stripe-signature') signature: string): Promise<void> {
    await this.paymentService.handleStripeWebhook(req, signature);
  }
}
