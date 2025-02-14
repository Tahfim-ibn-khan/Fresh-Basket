import { Controller, Get, Param } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('/generate/:orderId')
  async generateInvoice(@Param('orderId') orderId: number) {
    return this.invoiceService.generateInvoice(orderId);
  }
}
