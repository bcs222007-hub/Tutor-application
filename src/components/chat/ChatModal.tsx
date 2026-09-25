import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  MessageSquare,
  User,
  ShieldCheck,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { ChatMessage } from '../../types';

export const ChatModal: React.FC = () => {
  const {
    isChatModalOpen,
    setIsChatModalOpen,
    chatTargetUser,
    messages,
    sendMessage,
    currentUser,
    activeRole,
    tutors,
  } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [activePartnerId, setActivePartnerId] = useState<string>('tutor_1');
  const [activePartnerName, setActivePartnerName] = useState<string>('Dr. Farhan Malik');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatTargetUser) {
      setActivePartnerId(chatTargetUser.id);
      setActivePartnerName(chatTargetUser.name);
    }
  }, [chatTargetUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  if (!isChatModalOpen) return null;

  // Contacts list
  const contacts = [
    { id: 'tutor_1', name: 'Dr. Farhan Malik', role: 'Faculty (Math & Physics)', avatar: '/src/assets/images/tutor_farhan_portrait_1790320675895.jpg' },
    { id: 'tutor_2', name: 'Ms. Ayesha Siddiqui', role: 'Faculty (Chemistry)', avatar: '/src/assets/images/tutor_ayesha_portrait_1790320687711.jpg' },
    { id: 'user_admin_1', name: 'Cambridge Academic Coordinator', role: 'Academy Help Desk', avatar: '' },
    { id: 'std_1', name: 'Hamza Khan (Student)', role: 'Cambridge A-Level', avatar: '' },
  ];

  // Filter messages between current user and active partner
  const currentUserId = currentUser ? currentUser.id : 'guest_user';
  const filteredMessages = messages.filter(
    (m) =>
      (m.senderId === currentUserId && m.recipientId === activePartnerId) ||
      (m.senderId === activePartnerId && (m.recipientId === currentUserId || m.recipientId === 'std_1'))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    sendMessage(activePartnerId, activePartnerName, inputContent.trim());
    setInputContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[600px] max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col md:flex-row">
        {/* Left Sidebar: Contact Threads */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Conversations</h3>
            </div>
            <button
              onClick={() => setIsChatModalOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {contacts.map((contact) => {
              const isSelected = activePartnerId === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => {
                    setActivePartnerId(contact.id);
                    setActivePartnerName(contact.name);
                  }}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                    isSelected ? 'bg-amber-50/80 border-r-4 border-amber-400' : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      contact.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{contact.name}</h4>
                    <span className="text-[11px] text-slate-500 truncate block">{contact.role}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-white border-t border-slate-200 text-[11px] text-slate-500 font-mono text-center">
            Helpline: 0340-5427365
          </div>
        </div>

        {/* Right Area: Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Active Partner Top Bar */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                {activePartnerName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {activePartnerName}
                </h4>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online & Available
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsChatModalOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                <MessageSquare className="w-10 h-10 text-slate-300" />
                <p className="text-xs">No previous messages with {activePartnerName}.</p>
                <p className="text-[11px] text-slate-500">
                  Send a query regarding past paper doubts, class schedules, or demo arrangements.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isMine =
                  msg.senderId === currentUserId ||
                  (currentUser && msg.senderId === currentUser.id);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                      <span className="font-semibold text-slate-700">{msg.senderName}</span>
                      <span>·</span>
                      <span className="font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMine
                          ? 'bg-[#0f2b5c] text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${activePartnerName}...`}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              className="flex-1 text-xs py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c] bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
