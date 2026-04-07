import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new account' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.username, dto.password);
  }

  @Public()
  @Post('login')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout (placeholder)' })
  async logout() {
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Get('github')
  @ApiOperation({ summary: 'Redirect to GitHub OAuth' })
  async githubAuth(@Res() res: any) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    res.redirect(url);
  }

  @Public()
  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubCallback(@Req() req: any, @Res() res: any) {
    const { code } = req.query;
    if (!code) {
      res.redirect(`${process.env.WEB_URL || 'http://localhost:5176'}/auth/error`);
      return;
    }

    try {
      const result = await this.authService.handleGithubCallback(code);
      const webUrl = process.env.WEB_URL || 'http://localhost:5176';
      res.redirect(`${webUrl}/auth/callback?token=${result.accessToken}`);
    } catch {
      const webUrl = process.env.WEB_URL || 'http://localhost:5176';
      res.redirect(`${webUrl}/auth/error`);
    }
  }

  @Public()
  @Get('google')
  @ApiOperation({ summary: 'Redirect to Google OAuth' })
  async googleAuth(@Res() res: any) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
    res.redirect(url);
  }

  @Public()
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: any, @Res() res: any) {
    const { code } = req.query;
    if (!code) {
      res.redirect(`${process.env.WEB_URL || 'http://localhost:5176'}/auth/error`);
      return;
    }

    try {
      const result = await this.authService.handleGoogleCallback(code);
      const webUrl = process.env.WEB_URL || 'http://localhost:5176';
      res.redirect(`${webUrl}/auth/callback?token=${result.accessToken}`);
    } catch {
      const webUrl = process.env.WEB_URL || 'http://localhost:5176';
      res.redirect(`${webUrl}/auth/error`);
    }
  }
}
