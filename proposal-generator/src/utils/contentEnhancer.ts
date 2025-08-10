import { ProposalData } from '../types';

export const generateExecutiveSummary = (data: ProposalData): string => {
  const clientName = data.client.company || data.client.name;
  const projectTitle = data.project.title;
  const timeline = data.project.timeline;
  const investment = formatCurrency(data.project.price, data.project.currency);

  return `This comprehensive proposal outlines the development of ${projectTitle} for ${clientName}. 

Our team brings extensive experience in delivering high-quality solutions that drive business growth and operational efficiency. This project represents a strategic investment in ${clientName}'s digital transformation, with an estimated timeline of ${timeline} and total investment of ${investment}.

Key project highlights include:
• Tailored solution designed specifically for ${clientName}'s unique requirements
• Implementation of industry best practices and cutting-edge technologies
• Comprehensive testing and quality assurance throughout the development process
• Ongoing support and maintenance to ensure long-term success

The proposed solution will deliver measurable value through improved efficiency, enhanced user experience, and scalable architecture that supports future growth. Our proven methodology ensures on-time delivery while maintaining the highest standards of quality and security.`;
};

export const generateValueProposition = (data: ProposalData): string[] => {
  const clientName = data.client.company || data.client.name;
  
  return [
    `🎯 **Tailored Solution**: Custom-designed specifically for ${clientName}'s unique business needs and objectives`,
    `⚡ **Proven Methodology**: Our battle-tested development process ensures efficient delivery with minimal risk`,
    `🔒 **Enterprise Security**: Bank-level security protocols and compliance with industry standards`,
    `📞 **Dedicated Support**: Direct access to senior developers and project managers throughout the engagement`,
    `🚀 **Future-Proof Technology**: Modern, scalable architecture that grows with your business`,
    `📊 **Transparent Reporting**: Real-time project dashboards and weekly progress reports`,
    `💡 **Innovation Focus**: Leveraging the latest technologies to give you competitive advantages`,
    `🎓 **Knowledge Transfer**: Comprehensive documentation and training for your team`
  ];
};

export const generateRiskMitigation = (): string[] => {
  return [
    `📋 **Comprehensive Planning**: Detailed project roadmap with clear milestones and deliverables`,
    `🔄 **Agile Methodology**: Iterative development with regular client feedback and course corrections`,
    `🧪 **Continuous Testing**: Automated testing at every stage to catch issues early`,
    `💾 **Data Protection**: Regular backups and version control for all project assets`,
    `👥 **Team Redundancy**: Multiple developers familiar with your project to prevent bottlenecks`,
    `📞 **Clear Communication**: Dedicated communication channels and regular status updates`,
    `🛡️ **Quality Assurance**: Multi-layer review process ensuring deliverable quality`,
    `📈 **Performance Monitoring**: Continuous monitoring and optimization throughout development`
  ];
};

export const generateCompetitiveAdvantages = (): Array<{
  title: string;
  description: string;
  icon: string;
}> => {
  return [
    {
      title: 'Industry Expertise',
      description: 'Deep understanding of your industry\'s unique challenges and regulatory requirements',
      icon: '🏭'
    },
    {
      title: 'Rapid Deployment',
      description: 'Streamlined development process that delivers results 40% faster than industry average',
      icon: '🚀'
    },
    {
      title: 'Post-Launch Support',
      description: '6 months of complimentary support and maintenance included in every project',
      icon: '🛠️'
    },
    {
      title: 'Scalable Architecture',
      description: 'Future-ready solutions that can handle 10x growth without major restructuring',
      icon: '📈'
    },
    {
      title: 'Security First',
      description: 'GDPR compliant, SOC 2 certified processes with enterprise-grade security',
      icon: '🔐'
    },
    {
      title: 'ROI Guarantee',
      description: 'Measurable results with performance metrics and ROI tracking included',
      icon: '💰'
    }
  ];
};

export const generateProjectPhases = (timeline: string): Array<{
  phase: string;
  duration: string;
  deliverables: string[];
  milestone: string;
}> => {
  // Parse timeline to determine project phases
  const isLongProject = timeline.includes('month') && parseInt(timeline) > 2;
  
  if (isLongProject) {
    return [
      {
        phase: 'Discovery & Planning',
        duration: '2-3 weeks',
        deliverables: ['Requirements documentation', 'Technical specifications', 'Project roadmap'],
        milestone: 'Project kickoff and scope finalization'
      },
      {
        phase: 'Design & Architecture',
        duration: '3-4 weeks',
        deliverables: ['UI/UX designs', 'System architecture', 'Database design'],
        milestone: 'Design approval and technical review'
      },
      {
        phase: 'Core Development',
        duration: '6-8 weeks',
        deliverables: ['Core functionality', 'API development', 'Database implementation'],
        milestone: 'Alpha version ready for testing'
      },
      {
        phase: 'Testing & Refinement',
        duration: '2-3 weeks',
        deliverables: ['Quality assurance testing', 'Performance optimization', 'Bug fixes'],
        milestone: 'Beta version with full functionality'
      },
      {
        phase: 'Deployment & Launch',
        duration: '1-2 weeks',
        deliverables: ['Production deployment', 'User training', 'Documentation'],
        milestone: 'Go-live and project completion'
      }
    ];
  } else {
    return [
      {
        phase: 'Planning & Design',
        duration: '1 week',
        deliverables: ['Requirements analysis', 'Design mockups', 'Technical plan'],
        milestone: 'Project scope and design approval'
      },
      {
        phase: 'Development',
        duration: '2-3 weeks',
        deliverables: ['Core features', 'User interface', 'Testing'],
        milestone: 'Functional prototype ready'
      },
      {
        phase: 'Launch & Delivery',
        duration: '1 week',
        deliverables: ['Final testing', 'Deployment', 'Handover'],
        milestone: 'Project completion and go-live'
      }
    ];
  }
};

export const generateInvestmentBreakdown = (totalAmount: number, currency: string): Array<{
  category: string;
  percentage: number;
  amount: number;
  description: string;
}> => {
  return [
    {
      category: 'Development & Engineering',
      percentage: 55,
      amount: totalAmount * 0.55,
      description: 'Core development, coding, and technical implementation'
    },
    {
      category: 'UI/UX Design',
      percentage: 20,
      amount: totalAmount * 0.20,
      description: 'User interface design, user experience optimization'
    },
    {
      category: 'Quality Assurance',
      percentage: 15,
      amount: totalAmount * 0.15,
      description: 'Testing, debugging, performance optimization'
    },
    {
      category: 'Project Management',
      percentage: 10,
      amount: totalAmount * 0.10,
      description: 'Coordination, communication, delivery management'
    }
  ];
};

const formatCurrency = (amount: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: '$'
  };
  
  return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};