import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SkillsModule } from './modules/skills/skills.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { CommunityModule } from './modules/community/community.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { BadgesModule } from './modules/badges/badges.module';
import { UpvotesModule } from './modules/upvotes/upvotes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SkillsModule,
    CollectionsModule,
    CommunityModule,
    TokensModule,
    BadgesModule,
    UpvotesModule,
  ],
})
export class AppModule {}
