export type SubscriptionTier = 'free' | 'starter' | 'professional';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  interval: 'month';
  features: string[];
  limits: {
    proposalsPerMonth: number;
    templates: number;
    customBranding: boolean;
    logoUpload: boolean;
    watermark: boolean;
    analytics: boolean;
    clientPortal: boolean;
  };
}

export interface UserSubscription {
  tier: SubscriptionTier;
  startDate: string;
  endDate?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface UsageData {
  proposalsGenerated: number;
  lastResetDate: string;
  currentMonth: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '3 proposals per month',
      'Basic template',
      'Watermarked PDFs',
      'Email support'
    ],
    limits: {
      proposalsPerMonth: 3,
      templates: 1,
      customBranding: false,
      logoUpload: false,
      watermark: true,
      analytics: false,
      clientPortal: false
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    interval: 'month',
    features: [
      '25 proposals per month',
      'All templates',
      'Custom branding & logo',
      'No watermark',
      'Priority email support'
    ],
    limits: {
      proposalsPerMonth: 25,
      templates: 999,
      customBranding: true,
      logoUpload: true,
      watermark: false,
      analytics: false,
      clientPortal: false
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 39,
    interval: 'month',
    features: [
      'Unlimited proposals',
      'All templates & themes',
      'Advanced branding',
      'Proposal analytics',
      'Client portal access',
      'Phone & email support'
    ],
    limits: {
      proposalsPerMonth: 999999,
      templates: 999,
      customBranding: true,
      logoUpload: true,
      watermark: false,
      analytics: true,
      clientPortal: true
    }
  }
];