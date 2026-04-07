import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { TokensModule } from '../tokens/tokens.module';
import { BadgesModule } from '../badges/badges.module';
import { UpvotesModule } from '../upvotes/upvotes.module';

@Module({
  imports: [TokensModule, BadgesModule, UpvotesModule],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [ResearchService],
})
export class ResearchModule {}
