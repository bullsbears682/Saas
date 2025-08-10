import { ProposalData } from '../types';

export const sampleProposalData: Partial<ProposalData> = {
  client: {
    name: 'John Smith',
    company: 'Tech Innovations Inc.',
    email: 'john.smith@techinnovations.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, San Francisco, CA 94105'
  },
  project: {
    title: 'E-commerce Website Development',
    description: 'Development of a modern, responsive e-commerce website with integrated payment processing, inventory management, and customer portal. The website will feature a clean, professional design optimized for conversion and user experience.',
    scope: 'This project includes:\n• Custom website design and development\n• Product catalog with search and filtering\n• Shopping cart and checkout functionality\n• Payment gateway integration (Stripe/PayPal)\n• Admin dashboard for inventory management\n• Customer account creation and management\n• Mobile-responsive design\n• SEO optimization\n• Basic analytics setup\n\nNot included:\n• Content creation or product photography\n• Third-party integrations beyond payment processing\n• Ongoing maintenance after launch',
    timeline: '8-10 weeks',
    deliverables: '• Fully functional e-commerce website\n• Admin dashboard\n• User documentation\n• 30 days of post-launch support\n• Source code and deployment guide\n• Basic SEO setup\n• Google Analytics integration',
    price: 15000,
    currency: 'USD'
  },
  branding: {
    companyName: 'Digital Solutions Pro',
    yourName: 'Sarah Johnson',
    yourEmail: 'sarah@digitalsolutionspro.com',
    yourPhone: '+1 (555) 987-6543',
    yourAddress: '456 Business Avenue, Suite 200, New York, NY 10001',
    primaryColor: '#2563eb'
  },
  terms: `Payment Terms:
• 50% deposit ($7,500) required to begin work
• 25% payment ($3,750) due at project midpoint
• Remaining 25% ($3,750) due upon project completion
• Payment due within 15 days of invoice

Project Terms:
• All work will be completed according to the agreed timeline
• Client feedback and approvals required at key milestones
• Additional work outside the defined scope will be quoted separately
• Minor revisions (up to 3 rounds) included in the quoted price
• This proposal is valid for 30 days from the date issued

Intellectual Property:
• All work products will be transferred to the client upon full payment
• Client owns all rights to the final deliverables
• Any third-party assets used will be properly licensed
• Source code will be provided upon final payment

Support & Maintenance:
• 30 days of free bug fixes and minor adjustments post-launch
• Optional maintenance packages available separately
• Training session included for admin dashboard usage`,
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
};