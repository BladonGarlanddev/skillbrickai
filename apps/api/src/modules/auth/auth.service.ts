import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { BadgesService } from '../badges/badges.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
    private readonly badgesService: BadgesService,
  ) {}

  async register(email: string, username: string, password: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new ConflictException(
        existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken',
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        isEarlyAdopter: true,
      },
    });

    // Award Early Adopter badge
    await this.badgesService.awardBadge(user.id, 'EARLY_ADOPTER');

    // Credit 30 tokens for account creation
    await this.tokensService.creditTokens(
      user.id,
      30,
      'ACCOUNT_CREATED',
    );

    const token = this.generateToken(user.id, user.email);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isEarlyAdopter: user.isEarlyAdopter,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async validateOAuthUser(profile: {
    provider: 'github' | 'google';
    providerId: string;
    email: string;
    username: string;
    avatarUrl?: string;
  }) {
    const providerField =
      profile.provider === 'github' ? 'githubId' : 'googleId';

    // Try to find existing user by provider ID
    let user = await this.prisma.user.findFirst({
      where: { [providerField]: profile.providerId },
    });

    if (!user) {
      // Try to find by email
      user = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (user) {
        // Link OAuth to existing account
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { [providerField]: profile.providerId },
        });
      } else {
        // Create new user
        let username = profile.username;
        const existingUsername = await this.prisma.user.findUnique({
          where: { username },
        });
        if (existingUsername) {
          username = `${username}_${Date.now().toString(36)}`;
        }

        user = await this.prisma.user.create({
          data: {
            email: profile.email,
            username,
            avatarUrl: profile.avatarUrl,
            isEarlyAdopter: true,
            [providerField]: profile.providerId,
          },
        });

        await this.badgesService.awardBadge(user.id, 'EARLY_ADOPTER');
        await this.tokensService.creditTokens(user.id, 30, 'ACCOUNT_CREATED');
      }
    }

    const token = this.generateToken(user.id, user.email);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async handleGithubCallback(code: string) {
    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new InternalServerErrorException('Failed to get GitHub access token');
    }

    // Fetch user profile
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    // Fetch email if not public
    let email = profile.email;
    if (!email) {
      const emailsResponse = await fetch(
        'https://api.github.com/user/emails',
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        },
      );
      const emails = await emailsResponse.json();
      const primary = emails.find((e: any) => e.primary);
      email = primary?.email || emails[0]?.email;
    }

    if (!email) {
      throw new InternalServerErrorException(
        'Could not retrieve email from GitHub',
      );
    }

    return this.validateOAuthUser({
      provider: 'github',
      providerId: String(profile.id),
      email,
      username: profile.login,
      avatarUrl: profile.avatar_url,
    });
  }

  async handleGoogleCallback(code: string) {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new InternalServerErrorException(
        'Failed to get Google access token',
      );
    }

    // Fetch user profile
    const profileResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );
    const profile = await profileResponse.json();

    if (!profile.email) {
      throw new InternalServerErrorException(
        'Could not retrieve email from Google',
      );
    }

    return this.validateOAuthUser({
      provider: 'google',
      providerId: String(profile.id),
      email: profile.email,
      username: profile.email.split('@')[0],
      avatarUrl: profile.picture,
    });
  }

  generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
