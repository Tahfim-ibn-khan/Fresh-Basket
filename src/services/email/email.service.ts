import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'tahfimibnkhan123@gmail.com',
        pass: 'egozavsvsytxaoeg',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"FreshBasket" <tahfimibnkhan123@gmail.com>`,
        to,
        subject,
        text,
      });
      console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      console.error(`Email sending failed:`, error);
    }
  }
}
