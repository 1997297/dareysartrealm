import { CollectorUser } from '@/types/auth';
import { Order } from '@/types/commerce';
import { CollectorCommission, Certificate, CollectorMessageThread } from '@/types/collector';
import { MOCK_ARTWORKS } from './mockArtworks';

export const DEMO_COLLECTOR: CollectorUser = {
  id: 'usr-collector-001',
  firstName: 'Elena',
  lastName: 'Rostova',
  email: 'elena.rostova@gallerymail.com',
  role: 'collector',
  phone: '+44 7700 900142',
  country: 'United Kingdom',
  city: 'London',
  preferredContactMethod: 'email',
  defaultAddress: {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@gallerymail.com',
    phone: '+44 7700 900142',
    addressLine1: '14 Cadogan Square, Flat 3B',
    city: 'London',
    stateRegion: 'Greater London',
    postalCode: 'SW1X 0JW',
    country: 'United Kingdom',
    deliveryNotes: 'Building has porter service 8am–6pm',
  },
  createdAt: '2025-11-14T10:00:00Z',
};

export const DEMO_ADMIN: CollectorUser = {
  id: 'usr-admin-001',
  firstName: 'Darey',
  lastName: 'Studio',
  email: 'studio@dareysartrealm.com',
  role: 'admin',
  phone: '+234 800 000 0000',
  country: 'Nigeria',
  city: 'Lagos',
  preferredContactMethod: 'email',
  createdAt: '2024-01-01T00:00:00Z',
};


// Initial simulated acquired artwork: "Silent Dialogue"
const silentDialogueArt = MOCK_ARTWORKS.find((a) => a.slug === 'silent-dialogue') || MOCK_ARTWORKS[1];

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'DAR-ORD-DEV-0001',
    items: [
      {
        artwork: silentDialogueArt,
        addedAt: '2026-01-18T14:22:00Z',
      },
    ],
    collector: {
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.rostova@gallerymail.com',
      phone: '+44 7700 900142',
      userId: 'usr-collector-001',
    },
    shippingAddress: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@gallerymail.com',
      phone: '+44 7700 900142',
      addressLine1: '14 Cadogan Square, Flat 3B',
      city: 'London',
      stateRegion: 'Greater London',
      postalCode: 'SW1X 0JW',
      country: 'United Kingdom',
      deliveryNotes: 'Private freight delivery',
    },
    deliveryMethod: 'insured_courier',
    shippingCost: 0,
    totalAmount: silentDialogueArt.price || 3800,
    currency: 'USD',
    status: 'delivered',
    paymentStatus: 'simulated_paid',
    paymentMethod: 'bank_transfer',
    createdAt: '2026-01-18T14:30:00Z',
    updatedAt: '2026-02-04T16:00:00Z',
    certificateId: 'DAR-COA-DEV-0001',
    timeline: [
      {
        status: 'payment_pending',
        label: 'Acquisition Initiated',
        date: '18 Jan 2026',
        description: 'Collector confirmed selection and transfer arrangement.',
        completed: true,
      },
      {
        status: 'confirmed',
        label: 'Payment Verified',
        date: '19 Jan 2026',
        description: 'Studio administration verified funds; canvas reserved.',
        completed: true,
      },
      {
        status: 'preparing',
        label: 'Archival Conditioning & Crating',
        date: '24 Jan 2026',
        description: 'Varnish inspected, wax seal applied, and secured in custom timber crate.',
        completed: true,
      },
      {
        status: 'dispatched',
        label: 'Dispatched via Fine Art Courier',
        date: '29 Jan 2026',
        description: 'Insured climate-controlled transport departed artist studio hub.',
        completed: true,
      },
      {
        status: 'delivered',
        label: 'Delivered to Collector',
        date: '04 Feb 2026',
        description: 'White-glove handover completed at Cadogan Square residence.',
        completed: true,
      },
    ],
  },
];

export const INITIAL_MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'DAR-COA-DEV-0001',
    artworkId: silentDialogueArt.id,
    artworkSlug: silentDialogueArt.slug,
    artworkTitle: silentDialogueArt.title,
    artworkYear: silentDialogueArt.year,
    artworkMedium: silentDialogueArt.medium,
    dimensions: `${silentDialogueArt.width} × ${silentDialogueArt.height} cm`,
    artworkImageUrl: silentDialogueArt.coverImage.url,
    collectorName: 'Elena Rostova',
    issuedDate: '24 January 2026',
    authenticityStatement:
      'This document certifies that the artwork referenced herein is an original, unique, and authentic one-of-one creation entirely conceived and hand-painted by Darey. All copyright and reproduction rights remain reserved by the artist.',
    verificationCode: 'DAR-VER-88219-X',
  },
];

export const INITIAL_MOCK_COMMISSIONS: CollectorCommission[] = [
  {
    id: 'COM-DEV-4921',
    title: 'Tonal Diptych for Salon Sanctuary',
    artworkType: 'Abstract Expression',
    currentStage: 'IN CREATION',
    stageIndex: 3,
    createdAt: '2026-02-10T11:00:00Z',
    estimatedCompletion: 'April 2026',
    brief:
      'A monumental diptych spanning 3.4 meters total width across two textured panels. Deep bone-black impasto, burnt terracotta ochre, and subtle raw umber glazes designed to catch morning light in the drawing room.',
    dimensions: 'Two panels, 170 × 140 cm each',
    budget: '$8,500 USD',
    timeline: '8 weeks',
    paymentSummary: {
      quotedAmount: 8500,
      depositPaid: true,
      balanceRemaining: 4250,
      currency: 'USD',
    },
    nextStep: 'Darey will present the textured impasto foundation and tonal underwash preview next week.',
    progressImages: [
      {
        id: 'wip-1',
        url: '/artworks/pic7.jpeg',
        caption: 'Structural studies and color ratio testing on canvas',
        stage: 'Concept Studies',
        date: '14 Feb 2026',
      },
      {
        id: 'wip-2',
        url: '/artworks/hero.jpeg',
        caption: 'Studio preparation and monumental canvas layout with Darey',
        stage: 'Substrate Priming',
        date: '22 Feb 2026',
      },
      {
        id: 'wip-3',
        url: '/artworks/pic8.jpeg',
        caption: 'First heavy impasto texture work in progress',
        stage: 'In Creation',
        date: '02 Mar 2026',
      },
    ],
  },
];

export const INITIAL_MOCK_MESSAGES: CollectorMessageThread[] = [
  {
    id: 'msg-thread-01',
    conversationId: 'CONV-COM-4921',
    subject: 'Commission Dialogue: Tonal Diptych',
    contextType: 'commission',
    contextTitle: 'Tonal Diptych for Salon Sanctuary',
    contextImageUrl: '/artworks/pic7.jpeg',
    lastMessage: 'The pumice under-layer is setting beautifully in the studio air today.',
    updatedAt: '2026-03-02T16:30:00Z',
    unread: false,
    messages: [
      {
        id: 'm1',
        sender: 'collector',
        senderName: 'Elena Rostova',
        text: 'Dear Darey, the preliminary charcoal sketch looks breathtaking. The proportion between the two panels captures the exact stillness we hoped for.',
        timestamp: '2026-02-15T09:12:00Z',
      },
      {
        id: 'm2',
        sender: 'darey',
        senderName: 'Darey',
        text: 'Thank you, Elena. Hearing that confirms the rhythm. Today we stretched the heavy Belgian linen on custom cedar bars. The tactile sculpting begins tomorrow.',
        timestamp: '2026-02-22T14:40:00Z',
      },
      {
        id: 'm3',
        sender: 'darey',
        senderName: 'Darey',
        text: 'The pumice under-layer is setting beautifully in the studio air today. I have uploaded new work-in-progress photographs to your commission tracker.',
        timestamp: '2026-03-02T16:30:00Z',
      },
    ],
  },
  {
    id: 'msg-thread-02',
    conversationId: 'CONV-ORD-0001',
    subject: 'Acquisition Provenance: Silent Dialogue',
    contextType: 'order',
    contextTitle: 'Order DAR-ORD-DEV-0001',
    contextImageUrl: silentDialogueArt.coverImage.url,
    lastMessage: 'Delighted that Silent Dialogue arrived safely at Cadogan Square.',
    updatedAt: '2026-02-05T11:15:00Z',
    unread: false,
    messages: [
      {
        id: 'm20',
        sender: 'darey',
        senderName: 'Darey',
        text: 'Delighted that Silent Dialogue arrived safely at Cadogan Square. Your Certificate of Authenticity is archived in your collector account, and the wax-sealed physical copy is inside the crate pocket.',
        timestamp: '2026-02-05T11:15:00Z',
      },
    ],
  },
];
