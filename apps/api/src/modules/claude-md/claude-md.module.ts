import { Module } from '@nestjs/common';
import { ClaudeMdController } from './claude-md.controller';
import { ClaudeMdService } from './claude-md.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClaudeMdController],
  providers: [ClaudeMdService],
  exports: [ClaudeMdService],
})
export class ClaudeMdModule {}
