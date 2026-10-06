import { Artwork, ArtworkStatus, ArtworkImage } from './artwork';
import { Order, OrderStatus } from './commerce';
import { CollectorCommission, CommissionTrackingStage } from './collector';

// Admin / Studio User
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'studio_manager' | 'content_manager';
  roleTitle: string;
  avatarUrl?: string;
  location: string;
}

// Operational Notification
export type NotificationCategory =
  | 'order'
  | 'commission'
  | 'service'
  | 'enquiry'
  | 'payment'
  | 'system';

export interface StudioNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkHref?: string;
  linkLabel?: string;
}

// Media Library Asset
export type MediaCategory =
  | 'artwork'
  | 'studio'
  | 'portrait'
  | 'service'
  | 'commission'
  | 'website';

export interface StudioMediaAsset {
  id: string;
  title: string;
  filename: string;
  url: string;
  category: MediaCategory;
  fileSize: number; // in bytes
  width?: number;
  height?: number;
  mimeType: string;
  altText: string;
  caption?: string;
  uploadedAt: string;
  usageCount: number;
  usageReferences?: string[]; // e.g. ["Echoes of Home", "Hero Section"]
}

// Enquiry Inbox
export type EnquiryCategory = 'all' | 'artwork' | 'commission' | 'service' | 'general';

export type EnquiryStatus =
  | 'new'
  | 'unread'
  | 'responded'
  | 'follow-up'
  | 'negotiating'
  | 'converted'
  | 'closed'
  | 'spam';

export interface EnquiryMessage {
  id: string;
  sender: 'client' | 'darey';
  senderName: string;
  senderEmail: string;
  message: string;
  timestamp: string;
}

export interface InternalNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface EnquiryThread {
  id: string; // e.g. ENQ-2026-081
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientLocation?: string;
  category: 'artwork' | 'commission' | 'service' | 'general';
  subject: string;
  status: EnquiryStatus;
  unread: boolean;
  artworkContext?: {
    id: string;
    slug: string;
    title: string;
    artworkId: string;
    price?: number;
    currency: string;
    status: ArtworkStatus;
    imageUrl: string;
  };
  commissionContext?: {
    preferredType?: string;
    budget?: string;
    timeline?: string;
  };
  serviceContext?: {
    serviceName: string;
    location?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
  messages: EnquiryMessage[];
  internalNotes: InternalNote[];
}

// Collector CRM Extended Record
export interface CollectorCRMRecord {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  address?: string;
  collectorSince: string;
  totalSpend: number;
  currency: string;
  totalArtworksAcquired: number;
  totalCommissions: number;
  totalServiceRequests: number;
  lastInteraction: string;
  status: 'active' | 'vip' | 'prospective' | 'dormant';
  tags: string[];
  collectedArtworkIds: string[];
  orderIds: string[];
  commissionIds: string[];
  enquiryIds: string[];
  internalNotes: InternalNote[];
}

// Customer Review
export type ReviewStatus = 'pending' | 'approved' | 'hidden';

export interface CollectorReview {
  id: string;
  collectorName: string;
  collectorTitle?: string; // e.g. "Private Collector"
  artworkTitle?: string;
  serviceTitle?: string;
  rating: number; // 5 out of 5
  reviewText: string;
  submittedDate: string;
  status: ReviewStatus;
  featured: boolean;
  avatarUrl?: string;
}

// Audit Event
export interface AuditEvent {
  id: string;
  eventType:
    | 'artwork_published'
    | 'artwork_status_changed'
    | 'artwork_archived'
    | 'order_status_changed'
    | 'payment_confirmed'
    | 'commission_stage_changed'
    | 'review_approved'
    | 'enquiry_replied'
    | 'settings_updated';
  actor: string;
  description: string;
  targetId?: string;
  targetTitle?: string;
  timestamp: string;
  linkHref?: string;
}

// CMS Content Model
export interface CMSHomepageContent {
  heroHeading: string;
  heroSupportingText: string;
  manifestoQuote: string;
  manifestoAuthor: string;
  manifestoBody: string;
  artistIntroTitle: string;
  artistIntroBody: string;
  commissionCtaHeading: string;
  commissionCtaBody: string;
  closingStatementHeading: string;
  closingStatementBody: string;
  updatedAt: string;
  publishedAt: string;
  status: 'draft' | 'published';
}

export interface CMSAboutContent {
  artistBiography: string;
  curatorialStatement: string;
  studioPhilosophy: string;
  processNarrative: string;
  portraitImageUrl: string;
  updatedAt: string;
  publishedAt: string;
  status: 'draft' | 'published';
}

export interface CMSContactContent {
  studioEmail: string;
  pressEmail: string;
  telephone: string;
  whatsapp: string;
  locationNote: string;
  hoursNote: string;
  updatedAt: string;
  status: 'draft' | 'published';
}

// Studio Settings
export interface StudioSettingsData {
  general: {
    studioName: string;
    tagline: string;
    defaultCurrency: string;
    timezone: string;
    dateFormat: string;
  };
  artwork: {
    idPrefix: string;
    defaultAvailability: ArtworkStatus;
    defaultUnits: 'cm' | 'inches';
    priceOnRequestDefault: boolean;
  };
  commerce: {
    orderPrefix: string;
    insuranceEnabled: boolean;
    curatorialInstallationAvailable: boolean;
    whiteGloveCourierOption: boolean;
    directBankTransferInstructions: string;
  };
  commissions: {
    commissionsOpen: boolean;
    minimumDepositPercentage: number;
    standardLeadTimeWeeks: number;
    acceptanceNoticeText: string;
  };
  services: {
    architecturalConsultingActive: boolean;
    siteVisitsActive: boolean;
    customMuralsActive: boolean;
  };
  contact: {
    publicEmail: string;
    studioLocation: string;
    instagramHandle: string;
    xHandle: string;
    linkedInHandle: string;
  };
  notifications: {
    notifyNewOrder: boolean;
    notifyNewEnquiry: boolean;
    notifyCommissionRequest: boolean;
    notifyServiceRequest: boolean;
    soundEnabled: boolean;
  };
}
