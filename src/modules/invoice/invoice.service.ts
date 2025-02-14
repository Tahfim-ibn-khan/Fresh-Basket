import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import * as path from 'path';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateInvoice(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found.`);
    }

    const user = await this.userRepository.findOne({ where: { id: order.user.id } });

    if (!user) {
      throw new NotFoundException(`Customer for Order #${orderId} not found.`);
    }

    const invoicePath = `./invoices/invoice-${orderId}.pdf`;

    if (fs.existsSync(invoicePath)) {
      fs.unlinkSync(invoicePath);
    }

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(invoicePath));

    // ✅ Add Company Logo
    const logoPath = path.join(__dirname, '../../logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 100 }).moveDown(2);
    }

    // ✅ Invoice Header
    doc.fontSize(20).text(`Invoice - Order #${orderId}`, { align: 'center' }).moveDown();
    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' }).moveDown();

    // ✅ Customer Details
    doc.fontSize(14).text('Customer Details:', { underline: true }).moveDown(0.5);
    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${order.phoneNumber || 'N/A'}`);
    doc.text(`Address: ${order.deliveryAddress || 'N/A'}`).moveDown();

    // ✅ Order Summary Table
    doc.fontSize(14).text('Order Summary:', { underline: true }).moveDown(0.5);

    // Table Headers
    const tableTop = doc.y;
    doc.fontSize(12)
      .text('Item', 50, tableTop)
      .text('Quantity', 200, tableTop)
      .text('Unit Price (Tk)', 350, tableTop)
      .text('Total (Tk)', 450, tableTop);

    // Table Data
    order.products.forEach((product, index) => {
      const rowY = tableTop + 20 + index * 20;
      doc.text(product.productName, 50, rowY)
        .text(product.quantity.toString(), 200, rowY)
        .text(`${product.unitPrice}`, 350, rowY)
        .text(`${product.total}`, 450, rowY);
    });

    doc.moveDown();

    // ✅ Total Amount (with Space Before Value)
    doc.fontSize(14).text(`Total Amount: ${order.totalPrice}`, { align: 'right' }).moveDown();

    doc.end();
    return `Invoice for Order #${orderId} has been generated.`;
  }
}
