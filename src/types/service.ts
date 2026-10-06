export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServicePreview {
  id: string;
  number: string;
  slug: string;
  title: string;
  shortDescription: string;
  description?: string;
  coverImage: {
    url: string;
    alt: string;
  };
  ctaLabel?: string;
  pricingStructure?: string;
  typicalTimeline?: string;
  process?: ServiceProcessStep[];
  features?: string[];
  faq?: ServiceFAQ[];
}

export type Service = ServicePreview;
export type ServiceOffering = ServicePreview;
