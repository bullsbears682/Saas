export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

export interface ProjectDetails {
  title: string;
  description: string;
  scope: string;
  timeline: string;
  deliverables: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
}

export interface BrandingInfo {
  logo?: File;
  logoUrl?: string;
  primaryColor: string;
  companyName: string;
  yourName: string;
  yourEmail: string;
  yourPhone: string;
  yourAddress: string;
}

export interface ProposalData {
  client: ClientInfo;
  project: ProjectDetails;
  branding: BrandingInfo;
  terms: string;
  validUntil: string;
}