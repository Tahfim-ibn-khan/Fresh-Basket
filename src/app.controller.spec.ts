import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';



import { User } from 'src/entities/user.entity';
import { OTP } from 'src/entities/otp.entity';
import { EmailService } from 'src/services/email/email.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OTP]), // User and OTP entities
    PassportModule.register({ defaultStrategy: 'jwt' }), // Use JWT strategy
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' }, // JWT expiry time
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    JwtStrategy,       // Register JWT strategy for token validation
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard, // Apply JWT Guard globally for protected routes
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard, // Apply Roles Guard globally for RBAC
    },
  ],
  exports: [AuthService, JwtStrategy], // Export for other modules to use
})
export class AuthModule {}
