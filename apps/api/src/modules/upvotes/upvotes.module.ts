import { Module } from '@nestjs/common';
import { UpvotesService } from './upvotes.service';

@Module({
  providers: [UpvotesService],
  exports: [UpvotesService],
})
export class UpvotesModule {}
