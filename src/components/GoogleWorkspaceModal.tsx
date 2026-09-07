import React, { useState } from 'react';
import { 
  Calendar, 
  Mail, 
  Users, 
  MessageSquare, 
  X, 
  Send, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Phone,
  UserCheck
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Property } from '../types';

interface GoogleWorkspaceModalProps {
  properties: Property[];
  onOpenPropertyDetails: (property: Property) => void;
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({
  properties,
  onOpenPropertyDetails,
}) => {
  const {
    activeWorkspaceModal,
    closeWorkspaceModal,
    openWorkspaceModal,
    isWorkspaceConnected,
    isConnecting,
    connectWorkspace,
    calendarEvents,
    schedulePropertyTour,
    sentEmails,
    sendPropertyBrochure,
    contacts,
    saveContact,
    chatMessages,
    sendChatMessage,
  } = useWorkspace();

  // Calendar form state
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [clientName, setClientName] = useState('Masax Investor');
  const [clientEmail, setClientEmail] = useState('mysteriousmasax@gmail.com');
  const [tourDateTime, setTourDateTime] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    d.setHours(14, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [tourNotes, setTourNotes] = useState('VIP onsite inspection and cadastral boundary verification.');
  const [calendarNotice, setCalendarNotice] = useState<string | null>(null);

  // Gmail form state
  const [emailRecipient, setEmailRecipient] = useState('mysteriousmasax@gmail.com');
  const [emailPropertyId, setEmailPropertyId] = useState<string>(properties[0]?.id || '');
  const [emailNote, setEmailNote] = useState('Please review the investment prospectus and title deed guarantee.');
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  // Contacts state
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactOrg, setNewContactOrg] = useState('');
  const [contactNotice, setContactNotice] = useState<string | null>(null);

  // Chat state
  const [chatInput, setChatInput] = useState('');

  if (!activeWorkspaceModal) return null;

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === selectedPropertyId);
    if (!prop) return;

    const res = await schedulePropertyTour(prop, clientName, clientEmail, tourDateTime, tourNotes);
    if (res.success) {
      setCalendarNotice('Tour synchronized with Google Calendar!');
      setTimeout(() => setCalendarNotice(null), 4000);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === emailPropertyId);
    if (!prop) return;

    const res = await sendPropertyBrochure(prop, emailRecipient, emailNote);
    if (res.success) {
      setEmailNotice('Executive brochure dispatched via Gmail API!');
      setTimeout(() => setEmailNotice(null), 4000);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactEmail) return;

    saveContact({
      name: newContactName,
      email: newContactEmail,
      phone: newContactPhone,
      organization: newContactOrg || 'Tanzania Real Estate Investor',
    });

    setContactNotice('Contact registered with Google Contacts directory!');
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewContactOrg('');
    setTimeout(() => setContactNotice(null), 4000);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendChatMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0d0f12] text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-red-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-wide">Google Workspace Suite</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Connected: mysteriousmasax@gmail.com
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Enterprise real estate operations powered by Google Cloud & Workspace APIs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isWorkspaceConnected ? (
              <button
                onClick={connectWorkspace}
                disabled={isConnecting}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                {isConnecting ? 'Authorizing...' : 'Authorize OAuth'}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                OAuth Active
              </div>
            )}

            <button
              onClick={closeWorkspaceModal}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-white/10 bg-neutral-900/60 overflow-x-auto">
          <button
            onClick={() => openWorkspaceModal('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceModal === 'calendar'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Google Calendar ({calendarEvents.length})
          </button>

          <button
            onClick={() => openWorkspaceModal('gmail')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceModal === 'gmail'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            Gmail Dispatch ({sentEmails.length})
          </button>

          <button
            onClick={() => openWorkspaceModal('contacts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceModal === 'contacts'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Google Contacts ({contacts.length})
          </button>

          <button
            onClick={() => openWorkspaceModal('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceModal === 'chat'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Google Chat (Deal Room)
          </button>
        </div>

        {/* Workspace Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: GOOGLE CALENDAR */}
          {activeWorkspaceModal === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Schedule Form */}
              <div className="lg:col-span-6 bg-neutral-900/40 p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Schedule Property Tour in Google Calendar
                  </h4>
                  {calendarNotice && (
                    <span className="text-xs font-mono text-emerald-400 animate-pulse">
                      {calendarNotice}
                    </span>
                  )}
                </div>

                <form onSubmit={handleCreateTour} className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Target Estate</label>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (${(p.price / 1000000).toFixed(2)}M - {p.location.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Attendee Email</label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Tour Date & Time</label>
                    <input
                      type="datetime-local"
                      value={tourDateTime}
                      onChange={(e) => setTourDateTime(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Briefing Notes</label>
                    <textarea
                      rows={2}
                      value={tourNotes}
                      onChange={(e) => setTourNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Calendar className="w-4 h-4" />
                    Sync Event to Google Calendar
                  </button>
                </form>
              </div>

              {/* Right: Upcoming Scheduled Tours */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-neutral-300">Synchronized Google Calendar Events</h4>
                  <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Open Google Calendar <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {calendarEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-blue-500/50 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h5 className="font-bold text-xs text-white">{evt.summary}</h5>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-600">
                          {new Date(evt.start.dateTime).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {evt.location && (
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          <span>{evt.location}</span>
                        </div>
                      )}

                      {evt.description && (
                        <p className="text-[11px] text-neutral-300 line-clamp-2 bg-neutral-900/60 p-2 rounded-lg border border-white/5 font-mono">
                          {evt.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                        <span>Attendees: {evt.attendees?.map((a) => a.email).join(', ')}</span>
                        {evt.htmlLink && (
                          <a
                            href={evt.htmlLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-0.5 font-bold"
                          >
                            View in Calendar
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GMAIL DISPATCH */}
          {activeWorkspaceModal === 'gmail' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Compose & Dispatch */}
              <div className="lg:col-span-6 bg-neutral-900/40 p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-400" />
                    Dispatch Dossier via Gmail API
                  </h4>
                  {emailNotice && (
                    <span className="text-xs font-mono text-emerald-400 animate-pulse">
                      {emailNotice}
                    </span>
                  )}
                </div>

                <form onSubmit={handleSendEmail} className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Recipient Gmail</label>
                    <input
                      type="email"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Attach Luxury Listing</label>
                    <select
                      value={emailPropertyId}
                      onChange={(e) => setEmailPropertyId(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (${(p.price / 1000000).toFixed(2)}M)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Executive Cover Note</label>
                    <textarea
                      rows={3}
                      value={emailNote}
                      onChange={(e) => setEmailNote(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Send Real Estate Dossier via Gmail
                  </button>
                </form>
              </div>

              {/* Right: Sent Outbox & Activity */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-neutral-300">Dispatched Gmail Transmissions</h4>
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    Open Gmail Inbox <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {sentEmails.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 text-neutral-500 text-xs">
                      No emails sent in this session yet. Compose above to dispatch via Gmail.
                    </div>
                  ) : (
                    sentEmails.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{item.propertyTitle}</span>
                          <span className="text-[10px] font-mono text-neutral-400">{item.timestamp}</span>
                        </div>
                        <div className="text-xs text-neutral-300 font-mono">To: {item.to}</div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1">{item.subject}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Delivered via Gmail API
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE CONTACTS */}
          {activeWorkspaceModal === 'contacts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Add Contact Form */}
              <div className="lg:col-span-5 bg-neutral-900/40 p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    Save VIP to Google Contacts
                  </h4>
                  {contactNotice && (
                    <span className="text-xs font-mono text-emerald-400 animate-pulse">
                      {contactNotice}
                    </span>
                  )}
                </div>

                <form onSubmit={handleAddContact} className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="e.g. Salim Rashid"
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Google Email</label>
                    <input
                      type="email"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      placeholder="investor@gmail.com"
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Phone (Tanzania)</label>
                    <input
                      type="tel"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="+255 754 000 000"
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Organization / Role</label>
                    <input
                      type="text"
                      value={newContactOrg}
                      onChange={(e) => setNewContactOrg(e.target.value)}
                      placeholder="e.g. Masax Capital LP"
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <UserCheck className="w-4 h-4" />
                    Add to Google Contacts Directory
                  </button>
                </form>
              </div>

              {/* Right: Contact Roster */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-neutral-300">Synchronized People API Directory</h4>
                  <a
                    href="https://contacts.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    Open Google Contacts <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {contacts.map((c, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/40 transition-all flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 flex-shrink-0">
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-sm">
                            {c.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-white truncate">{c.name}</h5>
                        <p className="text-[10px] text-amber-400 font-mono truncate">{c.organization}</p>
                        <p className="text-[11px] text-neutral-400 truncate mt-1">{c.email}</p>
                        {c.phone && <p className="text-[10px] text-neutral-500 font-mono">{c.phone}</p>}

                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => {
                              setEmailRecipient(c.email);
                              openWorkspaceModal('gmail');
                            }}
                            className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" /> Email
                          </button>
                          <button
                            onClick={() => {
                              setClientName(c.name);
                              setClientEmail(c.email);
                              openWorkspaceModal('calendar');
                            }}
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Calendar className="w-3 h-3" /> Tour
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE CHAT */}
          {activeWorkspaceModal === 'chat' && (
            <div className="flex flex-col h-[480px] bg-neutral-900/40 rounded-2xl border border-white/10 overflow-hidden">
              {/* Space Header */}
              <div className="px-5 py-3 bg-black/60 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">FLX Sovereign Deal Room (Google Chat Space)</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">spaces/flx-deal-room &bull; Live Telemetry</span>
                  </div>
                </div>

                <a
                  href="https://chat.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  Open Google Chat <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {msg.sender.avatarUrl ? (
                        <img src={msg.sender.avatarUrl} alt={msg.sender.displayName} className="w-full h-full object-cover" />
                      ) : (
                        msg.sender.displayName.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 bg-black/50 p-3 rounded-2xl border border-white/10 max-w-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">{msg.sender.displayName}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{msg.createTime}</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 bg-black/70 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Post property telemetry or deal message to Google Chat space..."
                  className="flex-1 px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
