export interface TokenTransactionDto {
  id: string;
  amount: number;
  type: TokenTransactionType;
  skillId: string | null;
  createdAt: string;
  description: string;
}

export enum TokenTransactionType {
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  SKILL_POSTED = 'SKILL_POSTED',
  SKILL_INSTALLED = 'SKILL_INSTALLED',
  ADMIN_GRANT = 'ADMIN_GRANT',
}

export interface TokenBalanceDto {
  balance: number;
  history: TokenTransactionDto[];
}

export const TOKEN_REWARDS = {
  ACCOUNT_CREATED: 30,
  SKILL_POSTED: 10,
  SKILL_INSTALLED: -1,
  GUEST_INITIAL: 10,
} as const;

export interface CreditOption {
  method: 'submit_skill' | 'subscription';
  description: string;
  creditsAwarded: number | 'unlimited';
  actionUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  interval: 'month' | 'year';
  creditsPerMonth: number | 'unlimited';
  features: string[];
}

export interface PricingInfo {
  currentBalance: number | null;
  earnCredits: CreditOption[];
  subscriptionPlans: SubscriptionPlan[];
}

export interface InsufficientCreditsError {
  error: 'INSUFFICIENT_CREDITS';
  message: string;
  currentBalance: number;
  requiredCredits: number;
  options: CreditOption[];
}
