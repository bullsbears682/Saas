# Stripe Setup Guide

## 🔧 Setting Up Stripe Payments

To enable real payments for your Proposal Generator, follow these steps:

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete account verification
3. Navigate to the Dashboard

### 2. Get API Keys

1. In Stripe Dashboard, go to **Developers → API Keys**
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

### 3. Create Products & Prices

1. Go to **Products** in Stripe Dashboard
2. Create two products:

**Starter Plan:**
- Name: "Proposal Generator - Starter"
- Description: "25 proposals per month with custom branding"
- Price: $19.00 USD, recurring monthly
- Copy the **Price ID** (starts with `price_`)

**Professional Plan:**
- Name: "Proposal Generator - Professional" 
- Description: "Unlimited proposals with advanced features"
- Price: $39.00 USD, recurring monthly
- Copy the **Price ID** (starts with `price_`)

### 4. Configure Environment Variables

Create a `.env` file in your project root:

```env
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
REACT_APP_STRIPE_STARTER_PRICE_ID=price_your_starter_price_id
REACT_APP_STRIPE_PROFESSIONAL_PRICE_ID=price_your_professional_price_id
```

### 5. Backend Implementation (Required for Production)

The current implementation is a **demo only**. For real payments, you need a backend:

#### Option A: Netlify Functions

Create `netlify/functions/create-checkout-session.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { priceId, successUrl, cancelUrl } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

#### Option B: Vercel/Next.js API Routes

Create `pages/api/create-checkout-session.js`:

```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { priceId, successUrl, cancelUrl } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
```

### 6. Update Frontend Code

Replace the demo implementation in `src/utils/stripeConfig.ts`:

```typescript
export const createCheckoutSession = async (tier: SubscriptionTier): Promise<void> => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: STRIPE_PRICE_IDS[tier],
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/pricing`,
    }),
  });

  const session = await response.json();
  const stripeInstance = await stripe;
  
  if (stripeInstance) {
    const { error } = await stripeInstance.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (error) console.error('Stripe error:', error);
  }
};
```

### 7. Handle Webhooks (Important!)

Set up Stripe webhooks to handle subscription events:

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Add endpoint: `https://yoursite.netlify.app/.netlify/functions/stripe-webhook`
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the **Webhook secret**

### 8. Test Payments

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. Test the complete flow
3. Verify subscription creation in Stripe Dashboard

### 9. Go Live

1. Switch to **Live mode** in Stripe Dashboard
2. Update environment variables with live keys
3. Test with real payment methods
4. Monitor in Stripe Dashboard

## 🚨 Security Notes

- **Never expose secret keys** in frontend code
- **Always validate payments** on the server
- **Use webhooks** to handle subscription changes
- **Implement proper error handling**

## 💡 Current Demo Mode

The app currently runs in **demo mode** where:
- ✅ Usage tracking works
- ✅ Plan limits are enforced  
- ✅ Upgrade prompts appear
- ⚠️ No real payments processed
- ⚠️ "Upgrades" are simulated

This lets you test the user experience before implementing real payments!

## 📞 Need Help?

- [Stripe Documentation](https://stripe.com/docs)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Stripe Checkout Guide](https://stripe.com/docs/checkout/quickstart)