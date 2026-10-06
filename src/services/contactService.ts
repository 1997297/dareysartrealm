import {
  GeneralContactFormData,
  ContactSubmissionResult,
} from '@/types/contact';

export const contactService = {
  /**
   * Submits a general contact form inquiry
   */
  async submitContact(
    formData: GeneralContactFormData
  ): Promise<ContactSubmissionResult> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `INQ-DEV-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('darey_contact_inquiries');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({ referenceId, timestamp, formData });
        sessionStorage.setItem('darey_contact_inquiries', JSON.stringify(list));
      } catch (e) {
        console.warn('Could not cache inquiry', e);
      }
    }

    return {
      success: true,
      referenceId,
      timestamp,
    };
  },
};
