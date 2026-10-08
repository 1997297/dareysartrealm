export type CommissionArtworkType =
  | 'portrait'
  | 'abstract'
  | 'landscape'
  | 'inspired-by'
  | 'architectural'
  | 'other';

export type CommissionPreferredSize =
  | 'small' // up to 60cm
  | 'medium' // 60cm - 120cm
  | 'large' // 120cm - 160cm
  | 'monumental' // 160cm+
  | 'custom';

export type CommissionSpace =
  | 'living-room'
  | 'dining-room'
  | 'bedroom'
  | 'office'
  | 'hallway'
  | 'commercial'
  | 'other';

export type CommissionBudgetRange =
  | 'under-2k' // Under $2,000
  | '2k-5k' // $2,000 - $5,000
  | '5k-10k' // $5,000 - $10,000
  | '10k-plus' // $10,000+
  | 'guidance'; // Need guidance

export type CommissionTimeline =
  | 'flexible'
  | '1-2-months'
  | '3-6-months'
  | 'specific-date';

export interface ReferenceFile {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
  type: string;
}

export interface CommissionFormData {
  artworkType: CommissionArtworkType;
  customTypeDescription?: string;
  
  // Idea & Narrative
  narrative: string;
  palettePreferences?: string;
  emotionalTone?: string;
  
  // Size & Space
  preferredSize: CommissionPreferredSize;
  customWidth?: string;
  customHeight?: string;
  dimensionUnit?: 'cm' | 'inches';
  placementSpace: CommissionSpace;
  lightingConditions?: string;

  // Inspiration & References
  inspiredBySlug?: string;
  inspiredByTitle?: string;
  referenceImages: ReferenceFile[];

  // Investment & Timeline
  budgetRange: CommissionBudgetRange;
  targetTimeline: CommissionTimeline;
  targetDate?: string;

  // Collector Info
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  countryCode?: string;
  state?: string;
  stateCode?: string;
  city?: string;
  specialNotes?: string;
}

export interface CommissionSubmissionResult {
  success: boolean;
  referenceId: string;
  timestamp: string;
  estimatedContactWindow: string;
}
