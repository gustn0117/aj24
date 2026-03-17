import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyAdmin } from "@/lib/admin-auth";

// GET: List all chat rooms (with latest message preview)
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status") || "open";
  const roomId = request.nextUrl.searchParams.get("roomId");

  // If roomId is provided, get messages for that room
  if (roomId) {
    const { data: messages } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("room_id", parseInt(roomId))
      .order("created_at", { ascending: true });

    // Mark member messages as read
    await supabaseAdmin
      .from("chat_messages")
      .update({ is_read: true })
      .eq("room_id", parseInt(roomId))
      .eq("sender_type", "member")
      .eq("is_read", false);

    return NextResponse.json({ messages: messages || [] });
  }

  // List rooms with member info and unread count
  const { data: rooms } = await supabaseAdmin
    .from("chat_rooms")
    .select("*, members!inner(name, email)")
    .eq("status", status)
    .order("updated_at", { ascending: false });

  // Get unread counts for each room
  const roomsWithUnread = await Promise.all(
    (rooms || []).map(async (room) => {
      const { count } = await supabaseAdmin
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("room_id", room.id)
        .eq("sender_type", "member")
        .eq("is_read", false);

      return {
        ...room,
        unread_count: count || 0,
        member_name: (room as Record<string, unknown>).members
          ? ((room as Record<string, unknown>).members as Record<string, string>).name
          : "알 수 없음",
        member_email: (room as Record<string, unknown>).members
          ? ((room as Record<string, unknown>).members as Record<string, string>).email
          : "",
      };
    })
  );

  return NextResponse.json({ rooms: roomsWithUnread });
}

// POST: Send message as admin or close room
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, roomId, content } = await request.json();

  if (action === "close") {
    await supabaseAdmin
      .from("chat_rooms")
      .update({ status: "closed", updated_at: new Date().toISOString() })
      .eq("id", roomId);

    return NextResponse.json({ ok: true });
  }

  if (action === "reopen") {
    await supabaseAdmin
      .from("chat_rooms")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", roomId);

    return NextResponse.json({ ok: true });
  }

  // Send message
  if (!roomId || !content?.trim()) {
    return NextResponse.json({ error: "메시지를 입력해주세요" }, { status: 400 });
  }

  const { data: message, error } = await supabaseAdmin
    .from("chat_messages")
    .insert({
      room_id: roomId,
      sender_type: "admin",
      sender_name: "관리자",
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "메시지 전송 실패" }, { status: 500 });
  }

  // Update room
  await supabaseAdmin
    .from("chat_rooms")
    .update({
      last_message: content.trim().slice(0, 100),
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", roomId);

  return NextResponse.json({ message });
}
