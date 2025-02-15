import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PassThrough } from 'stream';

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
      secure: true,
    });
  }

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

    try {
      const pdfBuffer = await this.createInvoicePDF(order, user);
      const uploadedInvoice: UploadApiResponse | null = await this.uploadToCloudinary(pdfBuffer, `invoice-${orderId}.pdf`);

      if (!uploadedInvoice?.secure_url) {
        throw new InternalServerErrorException("Failed to upload invoice to Cloudinary.");
      }

      return {
        message: `Invoice for Order #${orderId} has been generated successfully.`,
        invoiceUrl: uploadedInvoice.secure_url,
      };
    } catch (error) {
      console.error("❌ Error generating invoice:", error);
      throw new InternalServerErrorException("Invoice generation failed. Please try again.");
    }
  }

  private async createInvoicePDF(order: Order, user: User): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      doc.fontSize(20).text(`Invoice - Order #${order.id}`, { align: 'center' }).moveDown();
      doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' }).moveDown();
      doc.fontSize(14).text('Customer Details:', { underline: true }).moveDown(0.5);
      doc.fontSize(12).text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Phone: ${order.phoneNumber || 'N/A'}`);
      doc.text(`Address: ${order.deliveryAddress || 'N/A'}`).moveDown();
      doc.fontSize(14).text('Order Summary:', { underline: true }).moveDown(0.5);
      doc.fontSize(12)
        .text('Item', 50, doc.y)
        .text('Quantity', 200, doc.y)
        .text('Unit Price (Tk)', 350, doc.y)
        .text('Total (Tk)', 450, doc.y);

      order.products.forEach((product, index) => {
        const rowY = doc.y + 20 + index * 20;
        doc.text(product.productName, 50, rowY)
          .text(product.quantity.toString(), 200, rowY)
          .text(`${product.unitPrice}`, 350, rowY)
          .text(`${product.total}`, 450, rowY);
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: ${order.totalPrice}`, { align: 'right' }).moveDown();

      doc.end();
    });
  }

  private async uploadToCloudinary(pdfBuffer: Buffer, filename: string): Promise<UploadApiResponse | null> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', public_id: filename, folder: 'invoices' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );
  
      const bufferStream = new PassThrough();
      bufferStream.end(pdfBuffer);
      bufferStream.pipe(uploadStream);
    });
  }
  
}
