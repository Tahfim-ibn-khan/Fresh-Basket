import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('JwtAuthGuard: No token provided');
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your_secret_key',
      });

      console.log('JwtAuthGuard: Decoded Payload:', payload);

      request.user = payload;
      console.log('JwtAuthGuard: User attached to request:', request.user);

      return true;
    } catch (error) {
      console.error('JwtAuthGuard: Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
