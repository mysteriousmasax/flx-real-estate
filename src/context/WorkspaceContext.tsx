import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Property } from '../types';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string };
  end: { dateTime: string };
  htmlLink?: string;
  attendees?: { email: string }[];
}

export interface GoogleContact {
  resourceName?: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  organization?: string;
}

export interface ChatMessage {
  id: string;
  name?: string;
  text: string;
  sender: {
    displayName: string;
    avatarUrl?: string;
  };
  createTime: string;
  space?: string;
}

interface WorkspaceContextType {
  isWorkspaceConnected: boolean;
  isConnecting: boolean;
  accessToken: string | null;
  connectWorkspace: () => Promise<void>;
  disconnectWorkspace: () => void;
  calendarEvents: CalendarEvent[];
  schedulePropertyTour: (
    property: Property,
    clientName: string,
    clientEmail: string,
    dateTime: string,
    notes?: string
  ) => Promise<{ success: boolean; eventId?: string; htmlLink?: string }>;
  sentEmails: { id: string; to: string; subject: string; propertyTitle: string; timestamp: string }[];
  sendPropertyBrochure: (
    property: Property,
    recipientEmail: string,
    personalNote?: string
  ) => Promise<{ success: boolean; messageId?: string }>;
  contacts: GoogleContact[];
  saveContact: (contact: GoogleContact) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<boolean>;
  activeWorkspaceModal: 'calendar' | 'gmail' | 'contacts' | 'chat' | null;
  openWorkspaceModal: (tab: 'calendar' | 'gmail' | 'contacts' | 'chat') => void;
  closeWorkspaceModal: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const LOCAL_TOKEN = 'flx-local-workspace-token';

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-local-1',
    summary: 'FLX VIP Tour: Masaki Peninsular Oceanview Villa',
    description: 'Private inspection walkthrough scheduled in local memory.',
    location: '14 Toure Drive, Masaki, Dar es Salaam',
    start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
    end: { dateTime: new Date(Date.now() + 90000000).toISOString() },
    htmlLink: 'local-calendar://tour',
    attendees: [{ email: 'vip-client@example.com' }],
  },
];

const INITIAL_CONTACTS: GoogleContact[] = [
  {
    name: 'Masax (FLX Strategic Partner)',
    email: 'mysteriousmasax@gmail.com',
    phone: '+255 754 888 999',
    organization: 'FLX Global Assets',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Sarah K. (Field Agent)',
    email: 'sarah.k@flxassets.co.tz',
    phone: '+255 713 555 444',
    organization: 'Tanzania Land Registry Liaison',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-local-1',
    text: 'Local workspace mode is active. Your data is stored in browser storage and no external service is required.',
    sender: { displayName: 'FLX Local Bot' },
    createTime: '09:00 AM',
    space: 'local-room',
  },
];

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(LOCAL_TOKEN);
  const [isConnecting, setIsConnecting] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [contacts, setContacts] = useState<GoogleContact[]>(INITIAL_CONTACTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [sentEmails, setSentEmails] = useState<{ id: string; to: string; subject: string; propertyTitle: string; timestamp: string }[]>([]);
  const [activeWorkspaceModal, setActiveWorkspaceModal] = useState<'calendar' | 'gmail' | 'contacts' | 'chat' | null>(null);

  const connectWorkspace = useCallback(async () => {
    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setAccessToken(LOCAL_TOKEN);
    setContacts((prev) => (prev.length ? prev : INITIAL_CONTACTS));
    setCalendarEvents((prev) => (prev.length ? prev : INITIAL_EVENTS));
    setChatMessages((prev) => (prev.length ? prev : INITIAL_CHAT_MESSAGES));
    setIsConnecting(false);
  }, []);

  const disconnectWorkspace = useCallback(() => {
    setAccessToken(null);
  }, []);

  const schedulePropertyTour = useCallback(
    async (property: Property, clientName: string, clientEmail: string, dateTime: string, notes?: string) => {
      const startDate = new Date(dateTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const summary = `FLX Private Tour: ${property.title}`;
      const location = `${property.location.address}, ${property.location.city}, Tanzania`;
      const description = notes || `Private inspection arranged for ${clientName}.`;
      const eventId = `evt-local-${Date.now()}`;
      const newEvent: CalendarEvent = {
        id: eventId,
        summary,
        description,
        location,
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
        htmlLink: `local-calendar://event/${eventId}`,
        attendees: [{ email: clientEmail }, { email: user?.email || 'client@example.com' }],
      };
      setCalendarEvents((prev) => [newEvent, ...prev]);
      return { success: true, eventId, htmlLink: newEvent.htmlLink };
    },
    [user]
  );

  const sendPropertyBrochure = useCallback(async (property: Property, recipientEmail: string, personalNote?: string) => {
    const messageId = `local-msg-${Date.now()}`;
    const subject = `FLX Executive Dossier: ${property.title}`;
    setSentEmails((prev) => [{
      id: messageId,
      to: recipientEmail,
      subject,
      propertyTitle: property.title,
      timestamp: new Date().toISOString(),
    }, ...prev]);

    return {
      success: true,
      messageId,
    };
  }, []);

  const saveContact = useCallback((contact: GoogleContact) => {
    setContacts((prev) => {
      const exists = prev.some((item) => item.email === contact.email);
      if (exists) return prev;
      return [contact, ...prev];
    });
  }, []);

  const sendChatMessage = useCallback(async (text: string) => {
    if (!user) return false;
    const nextMessage: ChatMessage = {
      id: `msg-local-${Date.now()}`,
      text,
      sender: { displayName: user.name || 'FLX User' },
      createTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      space: 'local-room',
    };
    setChatMessages((prev) => [nextMessage, ...prev]);
    return true;
  }, [user]);

  const openWorkspaceModal = useCallback((tab: 'calendar' | 'gmail' | 'contacts' | 'chat') => {
    setActiveWorkspaceModal(tab);
  }, []);

  const closeWorkspaceModal = useCallback(() => {
    setActiveWorkspaceModal(null);
  }, []);

  const value = useMemo<WorkspaceContextType>(() => ({
    isWorkspaceConnected: Boolean(accessToken),
    isConnecting,
    accessToken,
    connectWorkspace,
    disconnectWorkspace,
    calendarEvents,
    schedulePropertyTour,
    sentEmails,
    sendPropertyBrochure,
    contacts,
    saveContact,
    chatMessages,
    sendChatMessage,
    activeWorkspaceModal,
    openWorkspaceModal,
    closeWorkspaceModal,
  }), [accessToken, isConnecting, calendarEvents, schedulePropertyTour, sentEmails, sendPropertyBrochure, contacts, saveContact, chatMessages, sendChatMessage, activeWorkspaceModal, connectWorkspace, disconnectWorkspace, openWorkspaceModal, closeWorkspaceModal]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
