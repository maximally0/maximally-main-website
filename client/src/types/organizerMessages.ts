export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export interface Message {
  id: number;
  subject: string;
  content: string;
  priority: Priority;
  sent_by_name: string;
  sent_by_email: string;
  sent_at?: string;
  created_at: string;
}

export interface RecipientMeta {
  is_read: boolean;
  read_at?: string | null;
}

export interface MessageWithRead extends Message {
  recipient: RecipientMeta;
}

export interface MessageFilters {
  subject?: string;
  priority?: Priority;
  read?: boolean;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface MessagesResponse {
  items: MessageWithRead[];
  total?: number;
}

export interface UnreadCountResponse {
  unread: number;
}

export interface MarkReadResponse {
  success: boolean;
  result?: any;
}
