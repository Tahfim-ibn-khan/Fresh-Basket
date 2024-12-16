import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/entities/user.entity';
import { OTP } from 'src/entities/otp.entity';
import { EmailService } from 'src/services/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OTP]), // Link User and OTP entities
  ],
  controllers: [AuthController], // Link AuthController
  providers: [AuthService, EmailService], // Provide AuthService and EmailService
})
export class AuthModule {}
