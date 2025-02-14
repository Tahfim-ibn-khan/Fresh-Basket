import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]), 
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
