import { Order, OrderStatus, PaymentStatus, OrderTimelineEvent } from '@/types/commerce';
import { Certificate } from '@/types/collector';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import {
  INITIAL_MOCK_ORDERS,
  INITIAL_MOCK_CERTIFICATES,
} from '@/data/mockCollectorData';

function getStoredOrders(): Order[] {
  return safeLocalStorage.getItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_MOCK_ORDERS);
}

function setStoredOrders(orders: Order[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, orders);
}

export const orderService = {
  /**
   * Retrieves all orders (admin / studio view)
   */
  async getAll(): Promise<Order[]> {
    return Promise.resolve(getStoredOrders());
  },

  /**
   * Creates a simulated order, issues certificate, and marks artwork locally collected
   */
  async createOrder(
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'certificateId'>
  ): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const randomSuffix = String(Math.floor(1000 + Math.random() * 9000));
    const orderId = `DAR-ORD-DEV-${randomSuffix}`;
    const certId = `DAR-COA-DEV-${randomSuffix}`;
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const primaryArtwork = data.items[0]?.artwork;

    // Create Certificate of Authenticity
    const newCertificate: Certificate = {
      id: certId,
      artworkId: primaryArtwork?.id || `art-${Date.now()}`,
      artworkSlug: primaryArtwork?.slug || 'original-artwork',
      artworkTitle: primaryArtwork?.title || 'Original Studio Artwork',
      artworkYear: primaryArtwork?.year || new Date().getFullYear(),
      artworkMedium: primaryArtwork?.medium || 'Acrylic and earth pigments on linen',
      dimensions: primaryArtwork
        ? `${primaryArtwork.width} Ã— ${primaryArtwork.height} cm`
        : 'Monumental scale',
      artworkImageUrl: primaryArtwork?.coverImage?.url || '',
      collectorName: `${data.collector.firstName} ${data.collector.lastName}`,
      issuedDate: formattedDate,
      authenticityStatement:
        'This document certifies that the artwork referenced herein is an original, unique, and authentic one-of-one creation entirely conceived and hand-painted by Darey. All copyright and reproduction rights remain reserved by the artist.',
      verificationCode: `DAR-VER-${randomSuffix}-X`,
    };

    // Construct full Order
    const newOrder: Order = {
      ...data,
      id: orderId,
      createdAt: timestamp,
      updatedAt: timestamp,
      certificateId: certId,
      timeline: [
        {
          status: 'confirmed',
          label: 'Acquisition Confirmed',
          date: formattedDate,
          description:
            'Collector payment simulation verified. Canvas reserved for acquisition.',
          completed: true,
        },
        {
          status: 'preparing',
          label: 'Archival Conditioning & Crating',
          date: 'Pending Studio Schedule',
          description:
            'Surface inspected, certificate wax-sealed, and secured in museum timber crate.',
          completed: false,
        },
        {
          status: 'dispatched',
          label: 'Fine Art Courier Dispatch',
          date: 'Scheduled within 5-7 days',
          description:
            'Climate-controlled insured transport departing artist studio hub.',
          completed: false,
        },
        {
          status: 'delivered',
          label: 'White-Glove Delivery Handover',
          date: 'TBD',
          description: 'Personal handover to collector.',
          completed: false,
        },
      ],
    };

    const existingOrders = getStoredOrders();
    setStoredOrders([newOrder, ...existingOrders]);

    // Store Certificate
    const existingCerts = safeLocalStorage.getItem<Certificate[]>(
      'darey_certificates',
      INITIAL_MOCK_CERTIFICATES
    );
    safeLocalStorage.setItem('darey_certificates', [newCertificate, ...existingCerts]);

    // Mark artwork(s) as locally collected
    const existingCollected = safeLocalStorage.getItem<string[]>(
      STORAGE_KEYS.LOCALLY_COLLECTED,
      []
    );
    const newCollected = [
      ...existingCollected,
      ...data.items.map((i) => i.artwork.slug),
    ];
    safeLocalStorage.setItem(STORAGE_KEYS.LOCALLY_COLLECTED, Array.from(new Set(newCollected)));

    return newOrder;
  },

  /**
   * Retrieves an order by ID
   */
  async getById(id: string): Promise<Order | null> {
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id === id);
    return Promise.resolve(order || null);
  },

  /**
   * Retrieves all orders for current collector
   */
  async getForCollector(collectorEmail?: string): Promise<Order[]> {
    const orders = getStoredOrders();
    if (collectorEmail) {
      const filtered = orders.filter(
        (o) => o.collector.email.toLowerCase() === collectorEmail.toLowerCase()
      );
      return Promise.resolve(filtered.length > 0 ? filtered : orders);
    }
    return Promise.resolve(orders);
  },

  /**
   * Updates order fulfillment status and updates timeline accordingly
   */
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return Promise.resolve(null);

    const order = orders[index];
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const updatedTimeline = order.timeline.map((event) => {
      if (event.status === status) {
        return { ...event, completed: true, date: formattedDate };
      }
      return event;
    });

    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: now.toISOString(),
      timeline: updatedTimeline,
    };

    orders[index] = updatedOrder;
    setStoredOrders(orders);
    return Promise.resolve(updatedOrder);
  },

  /**
   * Updates tracking details
   */
  async updateTracking(
    orderId: string,
    trackingNumber: string,
    courier: string
  ): Promise<Order | null> {
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return Promise.resolve(null);

    const updatedOrder: Order = {
      ...orders[index],
      trackingNumber,
      courier,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updatedOrder;
    setStoredOrders(orders);
    return Promise.resolve(updatedOrder);
  },

  /**
   * Adds an internal note to the order
   */
  async addInternalNote(
    orderId: string,
    noteText: string,
    author: string = 'Darey'
  ): Promise<Order | null> {
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return Promise.resolve(null);

    const currentNotes = orders[index].internalNotes || [];
    const updatedNotes = [
      ...currentNotes,
      {
        id: `note-${Date.now()}`,
        text: noteText,
        author,
        createdAt: new Date().toISOString(),
      },
    ];

    const updatedOrder: Order = {
      ...orders[index],
      internalNotes: updatedNotes,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updatedOrder;
    setStoredOrders(orders);
    return Promise.resolve(updatedOrder);
  },
};
