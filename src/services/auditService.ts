import { AuditEvent } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_AUDIT_EVENTS } from '@/data/mockStudioData';

function getStoredAudit(): AuditEvent[] {
  return safeLocalStorage.getItem<AuditEvent[]>(
    STORAGE_KEYS.STUDIO_AUDIT,
    INITIAL_AUDIT_EVENTS
  );
}

function setStoredAudit(events: AuditEvent[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_AUDIT, events);
}

export const auditService = {
  /**
   * Retrieves all recent audit activity events
   */
  async getAll(): Promise<AuditEvent[]> {
    return Promise.resolve(getStoredAudit());
  },

  /**
   * Records a new audit event
   */
  async recordEvent(
    event: Omit<AuditEvent, 'id' | 'timestamp'>
  ): Promise<AuditEvent> {
    const list = getStoredAudit();
    const newEvent: AuditEvent = {
      ...event,
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
    };
    const updated = [newEvent, ...list].slice(0, 50); // keep last 50
    setStoredAudit(updated);
    return Promise.resolve(newEvent);
  },
};
