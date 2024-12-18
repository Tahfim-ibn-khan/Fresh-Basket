import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Order } from 'src/entities/order.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService, JwtAuthGuard, RolesGuard],
})
export class PaymentModule {}
