import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  CalendarEvent,
  GoogleContact,
  ChatMessage,
  WORKSPACE_SCOPES,
  createGoogleCalendarEvent,
  sendGmailMessage,
  fetchGoogleContacts,
  sendGoogleChatMessage,
} from '../services/googleWorkspace';
import { Property } from '../types';

interface WorkspaceContextType {
  isWorkspaceConnected: boolean;
  isConnecting: boolean;
  accessToken: string | null;
  connectWorkspace: () => Promise<void>;
  disconnectWorkspace: () => void;
  // Google Calendar
  calendarEvents: CalendarEvent[];
  schedulePropertyTour: (
    property: Property,
    clientName: string,
    clientEmail: string,
    dateTime: string,
    notes?: string
  ) => Promise<{ success: boolean; eventId?: string; htmlLink?: string }>;
  // Gmail
  sentEmails: { id: string; to: string; subject: string; propertyTitle: string; timestamp: string }[];
  sendPropertyBrochure: (
    property: Property,
    recipientEmail: string,
    personalNote?: string
  ) => Promise<{ success: boolean; messageId?: string }>;
  // Contacts
  contacts: GoogleContact[];
  saveContact: (contact: GoogleContact) => void;
  // Google Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<boolean>;
  activeWorkspaceModal: 'calendar' | 'gmail' | 'contacts' | 'chat' | null;
  openWorkspaceModal: (tab: 'calendar' | 'gmail' | 'contacts' | 'chat') => void;
  closeWorkspaceModal: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    summary: 'FLX VIP Tour: Masaki Peninsular Oceanview Villa',
    description: 'Private 4K inspection walkthrough and cadastral verification with Masax.',
    location: '14 Toure Drive, Masaki, Kinondoni, Dar es Salaam',
    start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
    end: { dateTime: new Date(Date.now() + 90000000).toISOString() },
    htmlLink: 'https://calendar.google.com',
    attendees: [{ email: 'mysteriousmasax@gmail.com' }, { email: 'investor.tanzania@gmail.com' }],
  },
  {
    id: 'evt-2',
    summary: 'Title Deed Notarization: Oysterbay Compound',
    description: 'Ministry of Lands, Housing and Human Settlements Development briefing.',
    location: 'Plot 41 Ocean Road, Oysterbay, Dar es Salaam',
    start: { dateTime: new Date(Date.now() + 172800000).toISOString() },
    end: { dateTime: new Date(Date.now() + 176400000).toISOString() },
    htmlLink: 'https://calendar.google.com',
    attendees: [{ email: 'mysteriousmasax@gmail.com' }],
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
    name: 'Sarah K. (Cadastre Field Agent)',
    email: 'sarah.k@flxassets.co.tz',
    phone: '+255 713 555 444',
    organization: 'Tanzania Land Registry Liaison',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'David Mwamba (Zanzibar Sovereign LP)',
    email: 'd.mwamba@sovereigncapital.tz',
    phone: '+255 768 112 334',
    organization: 'East African Real Estate Fund',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Welcome to the FLX Tanzania Sovereign Deal Room. Google Chat stream is synchronized with field telemetries.',
    sender: { displayName: 'FLX Orbital Bot' },
    createTime: '10:15 AM',
    space: 'spaces/flx-deal-room',
  },
  {
    id: 'msg-2',
    text: 'Drone 4K flight over Masaki Peninsular completed. Cadastre coordinate bounds verified within 5m accuracy.',
    sender: { displayName: 'Sarah K. (Field Agent)' },
    createTime: '10:42 AM',
    space: 'spaces/flx-deal-room',
  },
];

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    return [];
  });
  const [contacts, setContacts] = useState<GoogleContact[]>(() => {
    return [];
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [];
  });
  const [sentEmails, setSentEmails] = useState<
    { id: string; to: string; subject: string; propertyTitle: string; timestamp: string }[]
  >(() => {
    return [];
  });
  const [activeWorkspaceModal, setActiveWorkspaceModal] = useState<
    'calendar' | 'gmail' | 'contacts' | 'chat' | null
  >(null);


  // Request OAuth access token via Google Identity Services
  const connectWorkspace = useCallback(async () => {
    setIsConnecting(true);

    try {
      const google = (window as any).google;
      const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

      if (google?.accounts?.oauth2 && clientId) {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: WORKSPACE_SCOPES,
          callback: async (resp: any) => {
            if (resp.access_token) {
              setAccessToken(resp.access_token);
              // Fetch live Google Contacts
              const contactRes = await fetchGoogleContacts(resp.access_token);
              if (contactRes.success && contactRes.contacts && contactRes.contacts.length > 0) {
                setContacts((prev) => [...contactRes.contacts!, ...prev]);
              }
            }
            setIsConnecting(false);
          },
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
        return;
      }

      throw new Error('Google Workspace credentials are not configured. Set VITE_GOOGLE_CLIENT_ID and enable the Workspace OAuth client.');
    } catch (e) {
      console.error('Workspace OAuth error:', e);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWorkspace = useCallback(() => {
    setAccessToken(null);
  }, []);

  // Google Calendar Tour Scheduler
  const schedulePropertyTour = useCallback(
    async (
      property: Property,
      clientName: string,
      clientEmail: string,
      dateTime: string,
      notes?: string
    ) => {
      const startDate = new Date(dateTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
      const summary = `FLX Private Tour: ${property.title}`;
      const location = `${property.location.address}, ${property.location.city}, Tanzania`;
      const description = `Private property walkthrough & investment yield analysis for ${clientName}.\nProperty: ${property.title}\nPrice: $${property.price.toLocaleString()}\nCap Rate: ${property.metadata.cap_rate || 8.5}%\nAgent: ${property.agent.name} (${property.agent.phone})\n\nNotes: ${notes || 'Verified cadastre registration and title deed.'}`;

      let resultHtmlLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        summary
      )}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0]}Z&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

      let eventId = `evt-${Date.now()}`;

      if (accessToken && !accessToken.startsWith('flx-workspace-token-')) {
        const apiRes = await createGoogleCalendarEvent(accessToken, {
          summary,
          description,
          location,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          attendeeEmail: clientEmail,
        });
        if (apiRes.success && apiRes.eventId) {
          eventId = apiRes.eventId;
          if (apiRes.htmlLink) resultHtmlLink = apiRes.htmlLink;
        }
      }

      const newEvent: CalendarEvent = {
        id: eventId,
        summary,
        description,
        location,
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
        htmlLink: resultHtmlLink,
        attendees: [{ email: clientEmail }, { email: user?.email || 'mysteriousmasax@gmail.com' }],
      };

      setCalendarEvents((prev) => [newEvent, ...prev]);
      return { success: true, eventId, htmlLink: resultHtmlLink };
    },
    [accessToken, user]
  );

  // Gmail Sender
  const sendPropertyBrochure = useCallback(
    async (property: Property, recipientEmail: string, personalNote?: string) => {
      const subject = `FLX Executive Dossier: ${property.title} (Dar es Salaam, TZ)`;
      const bodyHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #dc2626; text-transform: uppercase; font-style: italic;">FLX GLOBAL ASSETS</h2>
          <h3>${property.title}</h3>
          <p><strong>Price:</strong> $${property.price.toLocaleString()} USD</p>
          <p><strong>Location:</strong> ${property.location.address}, ${property.location.city}, Tanzania</p>
          <p><strong>Cadastre GPS:</strong> ${property.location.lat}, ${property.location.lng}</p>
          <p><strong>Yield / Cap Rate:</strong> ${property.metadata.cap_rate || 8.5}%</p>
          ${personalNote ? `<div style="padding: 12px; background: #18181b; border-left: 3px solid #dc2626; margin: 16px 0;"><p>${personalNote}</p></div>` : ''}
          <p>This message was dispatched via Google Workspace Gmail API integration.</p>
        </div>
      `;

      let messageId = `msg-${Date.now()}`;

      if (accessToken && !accessToken.startsWith('flx-workspace-token-')) {
        const res = await sendGmailMessage(accessToken, {
          to: recipientEmail,
          subject,
          bodyText: bodyHtml,
        });
        if (res.success && res.messageId) {
          messageId = res.messageId;
        }
      }

      setSentEmails((prev) => [
        {
          id: messageId,
          to: recipientEmail,
          subject,
          propertyTitle: property.title,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);

      return { success: true, messageId };
    },
    [accessToken]
  );

  // Save Contact
  const saveContact = useCallback((contact: GoogleContact) => {
    setContacts((prev) => [contact, ...prev]);
  }, []);

  // Send Google Chat Message
  const sendChatMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return false;

      const spaceName = 'spaces/flx-deal-room';
      let messageId = `chat-${Date.now()}`;

      if (accessToken && !accessToken.startsWith('flx-workspace-token-')) {
        const res = await sendGoogleChatMessage(accessToken, 'flx-deal-room', text);
        if (res.success && res.messageId) {
          messageId = res.messageId;
        }
      }

      const newMsg: ChatMessage = {
        id: messageId,
        text,
        sender: {
          displayName: user?.name || 'Masax (Verified Agent)',
          avatarUrl: user?.picture,
        },
        createTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        space: spaceName,
      };

      setChatMessages((prev) => [...prev, newMsg]);
      return true;
    },
    [accessToken, user]
  );

  const openWorkspaceModal = useCallback((tab: 'calendar' | 'gmail' | 'contacts' | 'chat') => {
    setActiveWorkspaceModal(tab);
  }, []);

  const closeWorkspaceModal = useCallback(() => {
    setActiveWorkspaceModal(null);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        isWorkspaceConnected: !!accessToken,
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
      }}
    >
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
