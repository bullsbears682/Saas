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
    description: 'Professional styled design with enhanced typography and modern elements',
    preview: '/templates/modern-preview.png',
    isPremium: false,
    features: ['Professional typography', 'Modern styling', 'Clean layouts', 'Enhanced gradients (paid)']
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Enterprise-grade styling with gradients, professional cards, and advanced layouts',
    preview: '/templates/corporate-preview.png',
    isPremium: true,
    features: ['Gradient headers', 'Professional cards', 'Executive summary', 'ROI analysis', 'Styled timelines']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Creative styling with artistic gradients, colorful cards, and dynamic layouts',
    preview: '/templates/creative-preview.png',
    isPremium: true,
    features: ['Artistic gradients', 'Colorful metrics', 'Creative layouts', 'Visual storytelling', 'Dynamic elements']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Elegant minimalist styling with perfect typography and sophisticated spacing',
    preview: '/templates/minimal-preview.png',
    isPremium: true,
    features: ['Perfect typography', 'Elegant spacing', 'Clean dividers', 'Sophisticated simplicity']
  }
];