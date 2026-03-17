"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ChatRoom {
  id: number;
  member_id: number;
  status: "open" | "closed";
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  member_name: string;
  member_email: string;
  unread_count: number;
}

interface ChatMessage {
  id: number;
  room_id: number;
  sender_type: "member" | "admin";
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"open" | "closed">("open");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval>>();

  // Load rooms
  const loadRooms = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/chat?status=${statusFilter}`);
      if (res.ok) {
        const { rooms: data } = await res.json();
        setRooms(data || []);
      }
    } catch {
      // ignore
    }
  }, [statusFilter]);

  // Load messages for selected room
  const loadMessages = useCallback(async () => {
    if (!selectedRoom) return;
    try {
      const res = await fetch(`/api/admin/chat?roomId=${selectedRoom.id}`);
      if (res.ok) {
        const { messages: data } = await res.json();
        setMessages(data || []);
      }
    } catch {
      // ignore
    }
  }, [selectedRoom]);

  useEffect(() => {
    setLoading(true);
    loadRooms().finally(() => setLoading(false));
  }, [loadRooms]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Polling
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      loadRooms();
      if (selectedRoom) loadMessages();
    }, 3000);
    return () => clearInterval(pollingRef.current);
  }, [loadRooms, loadMessages, selectedRoom]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    if (!input.trim() || !selectedRoom || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: selectedRoom.id, content }),
      });

      if (res.ok) {
        const { message } = await res.json();
        setMessages((prev) => [...prev, message]);
        loadRooms();
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  async function handleAction(action: "close" | "reopen", roomId: number) {
    await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, roomId }),
    });
    loadRooms();
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
      setMessages([]);
    }
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }

  const totalUnread = rooms.reduce((sum, r) => sum + r.unread_count, 0);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Room list */}
      <div className="w-[340px] border-r border-gray-200 flex flex-col bg-white shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">고객 채팅</h1>
            {totalUnread > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => { setStatusFilter("open"); setSelectedRoom(null); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === "open" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              진행 중
            </button>
            <button
              onClick={() => { setStatusFilter("closed"); setSelectedRoom(null); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === "closed" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              종료됨
            </button>
          </div>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">로딩 중...</div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {statusFilter === "open" ? "진행 중인 채팅이 없습니다" : "종료된 채팅이 없습니다"}
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full px-4 py-3.5 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  selectedRoom?.id === room.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{room.member_name}</span>
                  <div className="flex items-center gap-2">
                    {room.unread_count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {room.unread_count}
                      </span>
                    )}
                    {room.last_message_at && (
                      <span className="text-[10px] text-gray-400">{formatTime(room.last_message_at)}</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 truncate">{room.member_email}</p>
                {room.last_message && (
                  <p className="text-xs text-gray-500 truncate mt-1">{room.last_message}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedRoom ? (
          <>
            {/* Chat header */}
            <div className="px-5 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-bold text-sm text-gray-900">{selectedRoom.member_name}</h2>
                <p className="text-xs text-gray-400">{selectedRoom.member_email}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedRoom.status === "open" ? (
                  <button
                    onClick={() => handleAction("close", selectedRoom.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    채팅 종료
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction("reopen", selectedRoom.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    채팅 재개
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[60%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-medium ${msg.sender_type === "admin" ? "text-blue-500" : "text-gray-500"}`}>
                        {msg.sender_type === "admin" ? "관리자" : msg.sender_name}
                      </span>
                      <span className="text-[10px] text-gray-400">{formatTime(msg.created_at)}</span>
                      {msg.sender_type === "member" && (
                        <span className={`text-[9px] ${msg.is_read ? "text-blue-400" : "text-gray-300"}`}>
                          {msg.is_read ? "읽음" : "안읽음"}
                        </span>
                      )}
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.sender_type === "admin"
                        ? "bg-blue-500 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {selectedRoom.status === "open" && (
              <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="답변을 입력하세요..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="px-5 py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-30"
                  >
                    전송
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 text-gray-300">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-sm font-medium">채팅방을 선택하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
