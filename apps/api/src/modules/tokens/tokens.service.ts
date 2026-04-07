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

  getPricingInfo(balance: number | null) {
    return {
      currentBalance: balance,
      earnCredits: [
        {
          method: 'submit_skill',
          description:
            'Submit a skill to the SkillBrick AI platform and earn 10 download credits instantly.',
          creditsAwarded: 10,
        },
        {
          method: 'subscription',
          description:
            'Subscribe to a plan for monthly credits and premium features.',
          creditsAwarded: 'unlimited',
          actionUrl: '/pricing',
        },
      ],
      subscriptionPlans: [
        {
          id: 'starter',
          name: 'Starter',
          price: '$5',
          interval: 'month',
          creditsPerMonth: 50,
          features: [
            '50 skill downloads per month',
            'Basic search and browse',
            'Community access',
          ],
        },
        {
          id: 'pro',
          name: 'Pro',
          price: '$15',
          interval: 'month',
          creditsPerMonth: 200,
          features: [
            '200 skill downloads per month',
            'Priority search results',
            'Collections support',
            'Early access to new skills',
          ],
        },
        {
          id: 'unlimited',
          name: 'Unlimited',
          price: '$30',
          interval: 'month',
          creditsPerMonth: 'unlimited',
          features: [
            'Unlimited skill downloads',
            'Priority support',
            'API rate limit increase',
            'Custom collections',
            'Analytics dashboard',
          ],
        },
      ],
    };
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
