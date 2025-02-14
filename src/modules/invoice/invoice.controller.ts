import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('/generate/:orderId')
  async generateInvoice(@Param('orderId') orderId: number) {
    return this.invoiceService.generateInvoice(orderId);
  }

  @Get('/download/:orderId')
  async downloadInvoice(@Param('orderId') orderId: number, @Res() res: Response) {
    const invoicePath = `./invoices/invoice-${orderId}.pdf`;

    if (!fs.existsSync(invoicePath)) {
      throw new NotFoundException(`Invoice for Order #${orderId} not found.`);
    }

    setTimeout(() => {
      res.download(invoicePath);
    }, 3000);
  }
}
