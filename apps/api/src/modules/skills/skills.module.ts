import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { TokensModule } from '../tokens/tokens.module';
import { BadgesModule } from '../badges/badges.module';
import { UpvotesModule } from '../upvotes/upvotes.module';

@Module({
  imports: [TokensModule, BadgesModule, UpvotesModule],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
