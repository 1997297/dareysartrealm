import { Order } from './commerce';
import { Artwork } from './artwork';

export interface Certificate {
  id: string; // e.g. DAR-COA-DEV-0001
  artworkId: string;
  artworkSlug: string;
  artworkTitle: string;
  artworkYear: number;
  artworkMedium: string;
  dimensions: string;
  artworkImageUrl: string;
  collectorName: string;
  issuedDate: string;
  authenticityStatement: string;
  verificationCode: string;
  verificationUrl?: string;
}

export type CommissionTrackingStage =
  | 'REQUEST RECEIVED'
  | 'REVIEWING'
  | 'CONSULTATION'
  | 'STUDY SKETCHES'
  | 'IN CREATION'
  | 'PREVIEW'
  | 'FINAL APPROVAL'
  | 'BALANCE DUE'
  | 'PACKAGING & PROVENANCE'
  | 'DELIVERED';

export interface CommissionProgressImage {
  id: string;
  url: string;
  caption: string;
  stage: string;
  date: string;
}

export interface CollectorCommission {
  id: string; // e.g. COM-DEV-8492
  title: string;
  artworkType: string;
  currentStage: CommissionTrackingStage;
  stageIndex: number; // 1 to 5
  createdAt: string;
  estimatedCompletion: string;
  brief: string;
  dimensions: string;
  budget: string;
  timeline: string;
  progressImages: CommissionProgressImage[];
  paymentSummary?: {
    quotedAmount: number;
    depositPaid: boolean;
    balanceRemaining: number;
    currency: string;
  };
  nextStep: string;
}

export interface MessageEntry {
  id: string;
  sender: 'collector' | 'darey';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface CollectorMessageThread {
  id: string;
  conversationId: string;
  subject: string;
  contextType: 'artwork' | 'order' | 'commission' | 'general';
  contextTitle: string;
  contextImageUrl?: string;
  lastMessage: string;
  updatedAt: string;
  unread: boolean;
  messages: MessageEntry[];
}

export interface CollectorOverviewData {
  recentOrders: Order[];
  activeCommissions: CollectorCommission[];
  savedCount: number;
  certificates: Certificate[];
  unreadMessagesCount: number;
}
