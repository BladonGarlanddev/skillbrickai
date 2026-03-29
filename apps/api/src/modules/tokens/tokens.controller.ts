import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('tokens')
@Controller('tokens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get current token balance' })
  async getBalance(@CurrentUser('id') userId: string) {
    return this.tokensService.getBalance(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get token transaction history' })
  async getHistory(@CurrentUser('id') userId: string) {
    return this.tokensService.getHistory(userId);
  }
}
