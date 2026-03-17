"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessage {
  id: number;
  room_id: number;
  sender_type: "member" | "admin";
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface ChatRoom {
  id: number;
  member_id: number;
  status: "open" | "closed";
}

export default function ChatWidget() {
  const { member } = useAuth();
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval>>();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load chat room & messages
  const loadChat = useCallback(async () => {
    try {
      const res = await fetch("/api/chat");
      if (!res.ok) return;
      const data = await res.json();
      setRoom(data.room);
      setMessages(data.messages || []);

      // Count unread admin messages
      if (!open) {
        const unreadCount = (data.messages || []).filter(
          (m: ChatMessage) => m.sender_type === "admin" && !m.is_read
        ).length;
        setUnread(unreadCount);
      }
    } catch {
      // ignore
    }
  }, [open]);

  // Initial load when opened
  useEffect(() => {
    if (open && member) {
      setLoading(true);
      loadChat().finally(() => setLoading(false));
    }
  }, [open, member, loadChat]);

  // Poll for new messages when chat is open
  useEffect(() => {
    if (open && member) {
      pollingRef.current = setInterval(loadChat, 3000);
      return () => clearInterval(pollingRef.current);
    } else if (member) {
      // Poll less frequently when closed (for unread badge)
      pollingRef.current = setInterval(loadChat, 15000);
      return () => clearInterval(pollingRef.current);
    }
  }, [open, member, loadChat]);

  // Scroll to bottom when new messages
  useEffect(() => {
    if (open) {
      scrollToBottom();
      setUnread(0);
    }
  }, [messages.length, open, scrollToBottom]);

  async function handleSend() {
    if (!input.trim() || !room || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room.id, content }),
      });

      if (res.ok) {
        const { message } = await res.json();
        setMessages((prev) => [...prev, message]);
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => {
          if (!member) {
            window.location.href = "/login";
            return;
          }
          setOpen(!open);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center group"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {/* Unread badge */}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && member && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="px-5 py-4 bg-gray-900 text-white flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold text-sm">고객센터</h3>
              <p className="text-[11px] text-gray-400">보통 몇 분 내에 답변드립니다</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                로딩 중...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-3 text-gray-300">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-sm font-medium mb-1">문의사항이 있으신가요?</p>
                <p className="text-xs">메시지를 보내주시면 답변 드리겠습니다</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_type === "member" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${msg.sender_type === "member" ? "order-2" : ""}`}>
                      {msg.sender_type === "admin" && (
                        <p className="text-[10px] text-gray-400 font-medium mb-1 px-1">관리자</p>
                      )}
                      <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        msg.sender_type === "member"
                          ? "bg-gray-900 text-white rounded-tr-sm"
                          : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                      }`}>
                        {msg.content}
                      </div>
                      <p className={`text-[10px] text-gray-400 mt-1 px-1 ${msg.sender_type === "member" ? "text-right" : ""}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-[13px] outline-none focus:bg-gray-50 focus:ring-1 focus:ring-gray-300 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors disabled:opacity-30 shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
