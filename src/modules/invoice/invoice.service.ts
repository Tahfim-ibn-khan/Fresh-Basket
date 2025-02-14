import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';
import { promisify } from 'util';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    cloudinary.config({
      cloud_name: 'dquhmyg3y',
      api_key: '339583574244771',
      api_secret: 'UoUKPOUzhxoWFs_yiTKHzoNLRc4',
    });
  }

  async generateInvoice(orderId: number): Promise<{ message: string; invoiceUrl: string }> {
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

    // ✅ Generate Invoice in Memory
    const pdfBuffer = await this.createInvoicePdf(order, user);

    // ✅ Upload to Cloudinary
    const uploadedInvoice = await this.uploadToCloudinary(pdfBuffer, orderId);

    if (!uploadedInvoice?.secure_url) {
      throw new InternalServerErrorException('Failed to upload invoice to Cloudinary.');
    }

    return { message: `Invoice for Order #${orderId} has been generated.`, invoiceUrl: uploadedInvoice.secure_url };
  }

  private async createInvoicePdf(order: Order, user: User): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // ✅ Invoice Header
      doc.fontSize(20).text(`Invoice - Order #${order.id}`, { align: 'center' }).moveDown();
      doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' }).moveDown();

      // ✅ Customer Details
      doc.fontSize(14).text('Customer Details:', { underline: true }).moveDown(0.5);
      doc.fontSize(12).text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Phone: ${order.phoneNumber || 'N/A'}`);
      doc.text(`Address: ${order.deliveryAddress || 'N/A'}`).moveDown();

      // ✅ Order Summary
      doc.fontSize(14).text('Order Summary:', { underline: true }).moveDown(0.5);
      doc.fontSize(12)
        .text('Item', 50)
        .text('Quantity', 200)
        .text('Unit Price (Tk)', 350)
        .text('Total (Tk)', 450);

      order.products.forEach((product, index) => {
        const rowY = doc.y + 10 + index * 20;
        doc.text(product.productName, 50, rowY)
          .text(product.quantity.toString(), 200, rowY)
          .text(`${product.unitPrice}`, 350, rowY)
          .text(`${product.total}`, 450, rowY);
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: ${order.totalPrice} Tk`, { align: 'right' }).moveDown();
      doc.end();
    });
  }

  private async uploadToCloudinary(buffer: Buffer, orderId: number) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'invoices', public_id: `invoice-${orderId}`, format: 'pdf' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          throw new InternalServerErrorException('Failed to upload invoice.');
        }
        return result;
      }
    );

    const pipeline = promisify(stream.pipeline);
    await pipeline(stream.Readable.from(buffer), uploadStream);
  }
}
