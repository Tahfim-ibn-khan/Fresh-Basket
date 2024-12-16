import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Gmail SMTP server
      port: 465, // SSL port
      secure: true, // Use SSL
      auth: {
        user: 'tahfimibnkhan123@gmail.com', // Your Gmail address
        pass: 'egozavsvsytxaoeg', // Your Gmail App Password
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates (optional)
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"FreshBasket" <tahfimibnkhan123@gmail.com>', // Sender address
      to, // Recipient email
      subject, // Email subject
      text, // Email body
    });
  }
}
