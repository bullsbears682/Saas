import { SubscriptionTier, UserSubscription, UsageData, SUBSCRIPTION_PLANS } from '../types/subscription';

const STORAGE_KEYS = {
  SUBSCRIPTION: 'proposalgen_subscription',
  USAGE: 'proposalgen_usage'
};

export class SubscriptionManager {
  static getCurrentSubscription(): UserSubscription {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default to free tier
    const defaultSubscription: UserSubscription = {
      tier: 'free',
      startDate: new Date().toISOString()
    };
    
    this.saveSubscription(defaultSubscription);
    return defaultSubscription;
  }

  static saveSubscription(subscription: UserSubscription): void {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
  }

  static getCurrentUsage(): UsageData {
    const stored = localStorage.getItem(STORAGE_KEYS.USAGE);
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    
    if (stored) {
      const usage: UsageData = JSON.parse(stored);
      
      // Reset usage if it's a new month
      if (usage.currentMonth !== currentMonth) {
        const resetUsage: UsageData = {
          proposalsGenerated: 0,
          lastResetDate: new Date().toISOString(),
          currentMonth
        };
        this.saveUsage(resetUsage);
        return resetUsage;
      }
      
      return usage;
    }
    
    // Default usage data
    const defaultUsage: UsageData = {
      proposalsGenerated: 0,
      lastResetDate: new Date().toISOString(),
      currentMonth
    };
    
    this.saveUsage(defaultUsage);
    return defaultUsage;
  }

  static saveUsage(usage: UsageData): void {
    localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
  }

  static incrementUsage(): boolean {
    const usage = this.getCurrentUsage();
    const subscription = this.getCurrentSubscription();
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.tier);
    
    if (!plan) return false;
    
    // Check if user has reached their limit
    if (usage.proposalsGenerated >= plan.limits.proposalsPerMonth) {
      return false; // Limit reached
    }
    
    // Increment usage
    usage.proposalsGenerated += 1;
    this.saveUsage(usage);
    return true;
  }

  static canGenerateProposal(): { allowed: boolean; remaining: number; limit: number } {
    const usage = this.getCurrentUsage();
    const subscription = this.getCurrentSubscription();
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.tier);
    
    if (!plan) {
      return { allowed: false, remaining: 0, limit: 0 };
    }
    
    const remaining = Math.max(0, plan.limits.proposalsPerMonth - usage.proposalsGenerated);
    const allowed = remaining > 0;
    
    return { allowed, remaining, limit: plan.limits.proposalsPerMonth };
  }

  static getCurrentPlan() {
    const subscription = this.getCurrentSubscription();
    return SUBSCRIPTION_PLANS.find(p => p.id === subscription.tier) || SUBSCRIPTION_PLANS[0];
  }

  static hasFeature(feature: keyof typeof SUBSCRIPTION_PLANS[0]['limits']): boolean {
    const plan = this.getCurrentPlan();
    return plan.limits[feature] as boolean;
  }

  static upgradeTo(tier: SubscriptionTier): void {
    const subscription: UserSubscription = {
      tier,
      startDate: new Date().toISOString()
    };
    this.saveSubscription(subscription);
  }
}