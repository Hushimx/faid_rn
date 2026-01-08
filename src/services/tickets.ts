import { axiosInstance } from 'config';
import {
  ICreateTicketPayload,
  IGetTicketsPayload,
  ISendTicketMessagePayload,
  IUpdateTicketPayload,
} from 'types';

// Rate limiting: Maximum 10 ticket creations per hour per user
const MAX_TICKET_CREATIONS_PER_HOUR = 10;
const MAX_MESSAGES_PER_HOUR = 10; // 10 messages per hour

// Track ticket creation attempts (in-memory, resets on app restart)
// In production, this should be stored in AsyncStorage or a more persistent solution
let ticketCreationAttempts: Map<number, number[]> = new Map();
let messageAttempts: Map<number, number[]> = new Map();

const cleanOldAttempts = (attempts: number[], windowMs: number) => {
  const now = Date.now();
  return attempts.filter(timestamp => now - timestamp < windowMs);
};

const checkRateLimit = (
  userId: number,
  attemptsMap: Map<number, number[]>,
  maxAttempts: number,
  windowMs: number,
): boolean => {
  const now = Date.now();
  const attempts = attemptsMap.get(userId) || [];
  const recentAttempts = cleanOldAttempts(attempts, windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  recentAttempts.push(now);
  attemptsMap.set(userId, recentAttempts);
  return true; // Within rate limit
};

const TicketApis = {
  getTickets: ({
    currentPage = 1,
    per_page = 15,
    status,
    priority,
    search,
  }: IGetTicketsPayload) => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      per_page: per_page.toString(),
    });
    
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);
    
    return axiosInstance.get(`tickets?${params.toString()}`);
  },

  getTicket: (ticketId: number) => {
    return axiosInstance.get(`tickets/${ticketId}`);
  },

  createTicket: async (
    data: ICreateTicketPayload,
    userId: number,
  ): Promise<any> => {
    // Validate user ID
    if (!userId || userId === 0) {
      throw new Error('User ID is required to create a ticket');
    }
    
    // Rate limiting check (only if userId is valid)
    const canCreate = checkRateLimit(
      userId,
      ticketCreationAttempts,
      MAX_TICKET_CREATIONS_PER_HOUR,
      60 * 60 * 1000, // 1 hour window
    );
    
    if (!canCreate) {
      throw new Error(
        `Rate limit exceeded. Maximum ${MAX_TICKET_CREATIONS_PER_HOUR} tickets per hour.`,
      );
    }
    
    // Validate input (client-side validation should catch these, but double-check)
    if (!data.subject || data.subject.trim().length < 5) {
      throw new Error('Subject must be at least 5 characters long');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }
    
    if (data.subject.length > 255) {
      throw new Error('Subject must not exceed 255 characters');
    }
    
    return axiosInstance.post('tickets', {
      subject: data.subject.trim(),
      description: data.description.trim(),
      priority: data.priority || 'medium',
    });
  },

  updateTicket: (ticketId: number, data: IUpdateTicketPayload) => {
    return axiosInstance.put(`tickets/${ticketId}`, data);
  },

  deleteTicket: (ticketId: number) => {
    return axiosInstance.delete(`tickets/${ticketId}`);
  },

  getTicketMessages: (ticketId: number) => {
    return axiosInstance.get(`tickets/${ticketId}/messages`);
  },

  sendTicketMessage: async (
    ticketId: number,
    data: ISendTicketMessagePayload,
    userId: number,
  ): Promise<any> => {
    console.log('sendTicketMessage called:', {
      ticketId,
      userId,
      messageLength: data.message?.length,
      hasAttachment: !!data.attachment,
    });

    // Validate user ID
    if (!userId || userId === 0) {
      const error = new Error('User ID is required to send a message');
      console.error('sendTicketMessage error:', error.message);
      throw error;
    }

    // REMOVED: Client-side rate limiting - let server handle it
    // This was causing issues where rate limit was hit too early
    
    // Validate: require either message or attachment
    const hasMessage = data.message && data.message.trim().length > 0;
    const hasAttachment = !!data.attachment;
    
    if (!hasMessage && !hasAttachment) {
      const error = new Error('Either message or attachment is required');
      console.error('sendTicketMessage validation error:', error.message);
      throw error;
    }
    
    // If message exists, validate its length
    if (hasMessage && data.message.length > 5000) {
      const error = new Error('Message must not exceed 5000 characters');
      console.error('sendTicketMessage validation error:', error.message);
      throw error;
    }
    
    try {
      // If attachment exists, use FormData
      if (data.attachment) {
        console.log('Sending attachment', {
          hasMessage: !!data.message,
          messageLength: data.message?.length || 0,
        });
        const formData = new FormData();
        // Only append message if it exists and is not empty
        if (data.message && data.message.trim().length > 0) {
          formData.append('message', data.message.trim());
        }
        formData.append('attachment', {
          uri: data.attachment.uri,
          type: data.attachment.type || 'image/jpeg',
          name: data.attachment.name || 'attachment.jpg',
        } as any);
        
        const response = await axiosInstance.post(
          `tickets/${ticketId}/messages`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('Message with attachment sent successfully:', response.status);
        return response;
      }
      
      console.log('Sending message without attachment', {
        message: data.message.trim(),
        messageLength: data.message.trim().length,
      });
      const response = await axiosInstance.post(`tickets/${ticketId}/messages`, {
        message: data.message.trim() || '', // Ensure it's at least an empty string
      });
      console.log('Message sent successfully:', {
        status: response.status,
        data: response.data,
      });
      return response;
    } catch (error: any) {
      console.error('sendTicketMessage API error:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        ticketId,
        userId,
      });
      throw error;
    }
  },

  markTicketMessagesAsRead: (ticketId: number) => {
    return axiosInstance.post(`tickets/${ticketId}/messages/mark-read`);
  },
};

export default TicketApis;

