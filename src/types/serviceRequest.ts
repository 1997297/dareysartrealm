import { ReferenceFile } from './commission';

export type ServiceProjectScope =
  | 'residential'
  | 'commercial'
  | 'hospitality'
  | 'cultural'
  | 'other';

export interface ServiceQuoteRequestData {
  serviceSlug: string;
  serviceTitle: string;
  projectScope: ServiceProjectScope;
  locationCity: string;
  locationCountry: string;
  spaceDimensions?: string;
  surfaceType?: string;
  projectDescription: string;
  targetCompletionDate?: string;
  estimatedBudgetRange?: string;
  referenceImages: ReferenceFile[];
  
  // Client Details
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  additionalNotes?: string;
}

export interface ServiceQuoteSubmissionResult {
  success: boolean;
  referenceId: string;
  timestamp: string;
  estimatedContactWindow: string;
}
