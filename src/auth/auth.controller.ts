import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isValid = await bcrypt.compare(
      body.refreshToken,
      user.hashedRefreshToken,
    );

    if (!isValid) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.authService.getTokens(user.id, user.email);
    await this.authService.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { userId: number }) {
    await this.prisma.user.update({
      where: { id: body.userId },
      data: { hashedRefreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }
}
