import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ResearchModule } from './modules/research/research.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { CommunityModule } from './modules/community/community.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { BadgesModule } from './modules/badges/badges.module';
import { UpvotesModule } from './modules/upvotes/upvotes.module';
import { ServicesModule } from './modules/services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    // Global rate limit: 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 600000,
        limit: 500,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    SkillsModule,
    ResearchModule,
    CollectionsModule,
    CommunityModule,
    TokensModule,
    BadgesModule,
    UpvotesModule,
    ServicesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
