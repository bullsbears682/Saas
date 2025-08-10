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
    description: 'Clean, contemporary design with bold headers',
    preview: '/templates/modern-preview.png',
    isPremium: false,
    features: ['Clean typography', 'Color accents', 'Professional layout']
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Traditional business style with formal layout',
    preview: '/templates/corporate-preview.png',
    isPremium: true,
    features: ['Formal design', 'Executive summary', 'Charts & graphs', 'Professional headers']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant design perfect for creative agencies',
    preview: '/templates/creative-preview.png',
    isPremium: true,
    features: ['Bold colors', 'Creative layouts', 'Visual elements', 'Brand-focused']
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