import { getAuthHeaders } from '@/lib/auth';
import type {
  MessageFilters,
  MessagesResponse,
  UnreadCountResponse,
  MarkReadResponse
} from '@/types/judgeMessages';

const API_BASE = '/api/judge';

/**
 * Fetch messages for the authenticated judge
 */
export async function getMessages(filters?: MessageFilters): Promise<MessagesResponse> {
  try {
    const headers = await getAuthHeaders();
    
    // Build query string
    const params = new URLSearchParams();
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.read !== undefined) params.append('read', String(filters.read));
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    
    const queryString = params.toString();
    const url = `${API_BASE}/messages${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch messages' }));
      throw new Error(error.message || 'Failed to fetch messages');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching judge messages:', error);
    throw error;
  }
}

/**
 * Mark a message as read
 */
export async function markMessageRead(id: number): Promise<MarkReadResponse> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE}/messages/${id}/read`, {
      method: 'POST',
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to mark message as read' }));
      throw new Error(error.message || 'Failed to mark message as read');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

/**
 * Get unread message count for the authenticated judge
 */
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE}/messages/unread-count`, { headers });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get unread count' }));
      throw new Error(error.message || 'Failed to get unread count');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
}

/**
 * Delete a message (admin only)
 */
export async function deleteMessage(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`/api/admin/judge-messages/${id}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete message' }));
      throw new Error(error.message || 'Failed to delete message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}
