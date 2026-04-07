import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current token balance' })
  async getBalance(@CurrentUser('id') userId: string) {
    return this.tokensService.getBalance(userId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get token transaction history' })
  async getHistory(@CurrentUser('id') userId: string) {
    return this.tokensService.getHistory(userId);
  }

  @Public()
  @Get('pricing')
  @ApiOperation({
    summary:
      'Get pricing info, subscription plans, and ways to earn credits. Optionally includes current balance if authenticated.',
  })
  async getPricing(@CurrentUser('id') userId?: string) {
    let balance: number | null = null;
    if (userId) {
      const result = await this.tokensService.getBalance(userId);
      balance = result.balance;
    }
    return this.tokensService.getPricingInfo(balance);
  }
}
