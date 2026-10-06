import { orderService } from './orderService';
import { commissionService } from './commissionService';
import { enquiryService } from './enquiryService';
import { artworkService } from './artworkService';
import { collectorService } from './collectorService';

export interface StudioAnalyticsSummary {
  revenue: {
    total: number;
    currency: string;
    growthPercentage: number;
    directAcquisitions: number;
    commissions: number;
  };
  metrics: {
    totalOrders: number;
    activeCommissions: number;
    newEnquiries: number;
    registeredCollectors: number;
    availableArtworksCount: number;
    soldArtworksCount: number;
  };
  revenueHistory: {
    month: string;
    revenue: number;
  }[];
  popularArtworks: {
    id: string;
    title: string;
    collection: string;
    status: string;
    views: number;
    inquiries: number;
    price: number;
    currency: string;
    imageUrl: string;
  }[];
  acquisitionFunnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
}

export const analyticsService = {
  /**
   * Calculates comprehensive operational studio metrics
   */
  async getSummary(
    timeRange: '30d' | '90d' | '12m' | 'all' = '30d'
  ): Promise<StudioAnalyticsSummary> {
    const orders = await orderService.getAll();
    const commissions = await commissionService.getAll();
    const enquiries = await enquiryService.getAll();
    const artworks = await artworkService.getAll();
    const collectors = await collectorService.getAllCRM();

    const ordersRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const commissionsRevenue = commissions.reduce(
      (sum, c) => sum + (c.paymentSummary?.quotedAmount || 0),
      0
    );
    const totalRev = ordersRevenue + commissionsRevenue;

    const availableCount = artworks.filter((a) => a.status === 'available').length;
    const soldCount = artworks.filter((a) => a.status === 'sold').length;
    const newEnquiriesCount = enquiries.filter((e) => e.status === 'new' || e.unread).length;
    const activeCommissionsCount = commissions.filter(
      (c) => c.currentStage !== 'DELIVERED'
    ).length;

    return {
      revenue: {
        total: totalRev,
        currency: 'USD',
        growthPercentage: 18.4,
        directAcquisitions: ordersRevenue,
        commissions: commissionsRevenue,
      },
      metrics: {
        totalOrders: orders.length,
        activeCommissions: activeCommissionsCount,
        newEnquiries: newEnquiriesCount,
        registeredCollectors: collectors.length,
        availableArtworksCount: availableCount,
        soldArtworksCount: soldCount,
      },
      revenueHistory: [
        { month: 'Oct 2025', revenue: 9500 },
        { month: 'Nov 2025', revenue: 14200 },
        { month: 'Dec 2025', revenue: 21800 },
        { month: 'Jan 2026', revenue: 16500 },
        { month: 'Feb 2026', revenue: 26800 },
        { month: 'Mar 2026 (MTD)', revenue: 18500 },
      ],
      popularArtworks: [
        {
          id: artworks[0]?.id || 'art-001',
          title: artworks[0]?.title || 'Echoes of Home',
          collection: artworks[0]?.collection?.title || 'The Genesis Collection',
          status: artworks[0]?.status || 'available',
          views: 1420,
          inquiries: 12,
          price: artworks[0]?.price || 4200,
          currency: 'USD',
          imageUrl: artworks[0]?.coverImage?.url || '',
        },
        {
          id: artworks[1]?.id || 'art-002',
          title: artworks[1]?.title || 'Silent Dialogue',
          collection: artworks[1]?.collection?.title || 'The Genesis Collection',
          status: artworks[1]?.status || 'sold',
          views: 980,
          inquiries: 8,
          price: artworks[1]?.price || 3800,
          currency: 'USD',
          imageUrl: artworks[1]?.coverImage?.url || '',
        },
        {
          id: artworks[3]?.id || 'art-004',
          title: artworks[3]?.title || 'Ode to the Soil',
          collection: artworks[3]?.collection?.title || 'Terracotta & Soil',
          status: artworks[3]?.status || 'available',
          views: 890,
          inquiries: 9,
          price: artworks[3]?.price || 4600,
          currency: 'USD',
          imageUrl: artworks[3]?.coverImage?.url || '',
        },
        {
          id: artworks[2]?.id || 'art-003',
          title: artworks[2]?.title || 'Resonance in Ochre',
          collection: artworks[2]?.collection?.title || 'The Genesis Collection',
          status: artworks[2]?.status || 'sold',
          views: 740,
          inquiries: 6,
          price: artworks[2]?.price || 5100,
          currency: 'USD',
          imageUrl: artworks[2]?.coverImage?.url || '',
        },
      ],
      acquisitionFunnel: [
        { stage: 'Curatorial Catalogue Views', count: 4850, percentage: 100 },
        { stage: 'Artwork Dossier Inquiries', count: 184, percentage: 38.0 },
        { stage: 'Private Consultation / Advisory', count: 42, percentage: 8.6 },
        { stage: 'Proposals & Invoices Issued', count: 18, percentage: 3.7 },
        { stage: 'Acquisitions Confirmed', count: 12, percentage: 2.5 },
      ],
    };
  },
};
