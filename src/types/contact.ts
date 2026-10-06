export type ContactIntent = 'artwork' | 'commission' | 'service' | 'general';

export interface GeneralContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  intent: ContactIntent;
  preferredChannel?: 'email' | 'whatsapp' | 'phone';
}

export interface ContactSubmissionResult {
  success: boolean;
  referenceId: string;
  timestamp: string;
}
