import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    return { balance: user?.tokenBalance ?? 0 };
  }

  async getHistory(userId: string) {
    return this.prisma.tokenTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async creditTokens(
    userId: string,
    amount: number,
    type: string,
    skillId?: string,
  ) {
    await this.prisma.$transaction([
      this.prisma.tokenTransaction.create({
        data: {
          userId,
          amount,
          type: type as any,
          skillId,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: { increment: amount } },
      }),
    ]);
  }

  async debitTokens(
    userId: string,
    amount: number,
    type: string,
    skillId?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    if (!user || user.tokenBalance < amount) {
      throw new BadRequestException('Insufficient token balance');
    }

    await this.prisma.$transaction([
      this.prisma.tokenTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: type as any,
          skillId,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: { decrement: amount } },
      }),
    ]);
  }
}
