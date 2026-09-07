// Google Workspace Client-Side API Integration
// Scopes configured: Calendar, Gmail, Contacts (People API), and Google Chat

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

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
].join(' ');

// Google Calendar API
export async function createGoogleCalendarEvent(
  accessToken: string,
  event: {
    summary: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    attendeeEmail?: string;
  }
): Promise<{ success: boolean; eventId?: string; htmlLink?: string; error?: string }> {
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: { dateTime: event.startTime },
        end: { dateTime: event.endTime },
        attendees: event.attendeeEmail ? [{ email: event.attendeeEmail }] : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error?.message || 'Failed to create Google Calendar event' };
    }

    const data = await res.json();
    return { success: true, eventId: data.id, htmlLink: data.htmlLink };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Gmail API: Send RFC 2822 base64url encoded message
export async function sendGmailMessage(
  accessToken: string,
  email: {
    to: string;
    subject: string;
    bodyText: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(email.subject)))}?=`;
    const messageParts = [
      `To: ${email.to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      email.bodyText,
    ];
    const message = messageParts.join('\r\n');
    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error?.message || 'Failed to send Gmail message' };
    }

    const data = await res.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Google People (Contacts) API
export async function fetchGoogleContacts(
  accessToken: string
): Promise<{ success: boolean; contacts?: GoogleContact[]; error?: string }> {
  try {
    const res = await fetch(
      'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos,organizations&pageSize=20',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error?.message || 'Failed to fetch Google Contacts' };
    }

    const data = await res.json();
    const connections: GoogleContact[] = (data.connections || []).map((conn: any) => ({
      resourceName: conn.resourceName,
      name: conn.names?.[0]?.displayName || 'Unnamed Contact',
      email: conn.emailAddresses?.[0]?.value || '',
      phone: conn.phoneNumbers?.[0]?.value || '',
      photoUrl: conn.photos?.[0]?.url,
      organization: conn.organizations?.[0]?.name,
    }));

    return { success: true, contacts: connections };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Google Chat API: Post message to a Space
export async function sendGoogleChatMessage(
  accessToken: string,
  spaceId: string,
  text: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const res = await fetch(`https://chat.googleapis.com/v1/spaces/${spaceId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error?.message || 'Failed to post Google Chat message' };
    }

    const data = await res.json();
    return { success: true, messageId: data.name };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
