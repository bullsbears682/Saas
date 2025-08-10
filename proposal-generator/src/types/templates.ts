export type PDFTemplate = 'modern' | 'corporate' | 'creative' | 'minimal';

export interface TemplateConfig {
  id: PDFTemplate;
  name: string;
  description: string;
  preview: string;
  isPremium: boolean;
  features: string[];
}

export const PDF_TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Enhanced contemporary design with improved styling',
    preview: '/templates/modern-preview.png',
    isPremium: false,
    features: ['Enhanced typography', 'Color gradients', 'Professional sections', 'QR codes (paid)']
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Ultra-professional with cover page, charts, ROI analysis',
    preview: '/templates/corporate-preview.png',
    isPremium: true,
    features: ['Cover page & TOC', 'Executive summary', 'Charts & ROI analysis', 'Signature page', 'QR codes']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic design with charts, portfolios, testimonials',
    preview: '/templates/creative-preview.png',
    isPremium: true,
    features: ['Artistic layouts', 'Project charts', 'Portfolio showcase', 'Testimonials', 'Visual elements']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, elegant design focusing on content',
    preview: '/templates/minimal-preview.png',
    isPremium: true,
    features: ['Ultra-clean', 'Typography-focused', 'Lots of whitespace', 'Scandinavian style']
  }
];