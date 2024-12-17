import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { OTP } from 'src/entities/otp.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../DTOs/register.dto';
import { LoginDto } from '../DTOs/login.dto';
import { ForgotPasswordDto } from '../DTOs/forget-password.dto';
import { ResetPasswordDto } from '../DTOs/reset-password.dto';
import { EmailService } from 'src/services/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  // Register user and send OTP
  async register(registerDto: RegisterDto): Promise<string> {
    const { name, email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer',
      isVerified: false,
    });
    const savedUser = await this.userRepository.save(user);

    await this.otpRepository.save({
      user_id: savedUser.id,
      otp: hashedOtp,
      expiry_time: expiryTime,
    });

    await this.emailService.sendEmail(
      email,
      'Verify Your Email',
      `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`,
    );

    return 'Registration successful. Check your email for OTP to verify your account.';
  }

  // Verify OTP and update isVerified status
  async verifyOtp(email: string, otp: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found.');

    const otpEntry = await this.otpRepository.findOne({
      where: { user_id: user.id },
      order: { created_at: 'DESC' },
    });

    if (!otpEntry || otpEntry.expiry_time < new Date()) {
      throw new BadRequestException('OTP expired or invalid.');
    }

    const isOtpValid = await bcrypt.compare(otp, otpEntry.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP.');
    }

    user.isVerified = true;
    await this.userRepository.save(user);

    return 'Email verification successful. You can now log in.';
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Invalid email or password.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password.');

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
  

  // Forgot Password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<string> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found.');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    await this.otpRepository.save({
      user_id: user.id,
      otp: hashedOtp,
      expiry_time: expiryTime,
    });

    await this.emailService.sendEmail(
      email,
      'Reset Your Password',
      `Your OTP for resetting your password is: ${otp}. It will expire in 5 minutes.`,
    );

    return 'OTP sent to your email for password reset.';
  }

  // Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, otp, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found.');

    const otpEntry = await this.otpRepository.findOne({
      where: { user_id: user.id },
      order: { created_at: 'DESC' },
    });
    if (!otpEntry || otpEntry.expiry_time < new Date()) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    const isOtpValid = await bcrypt.compare(otp, otpEntry.otp);
    if (!isOtpValid) throw new BadRequestException('Invalid OTP.');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return 'Password reset successful.';
  }
}
