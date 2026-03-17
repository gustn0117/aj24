import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberIdFromRequest } from "@/lib/member-auth";

// GET: Get or create chat room for current member + get messages
export async function GET(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  // Get member info
  const { data: member } = await supabaseAdmin
    .from("members")
    .select("id, name")
    .eq("id", memberId)
    .single();

  if (!member) {
    return NextResponse.json({ error: "회원 정보를 찾을 수 없습니다" }, { status: 401 });
  }

  // Find existing open room
  let { data: room } = await supabaseAdmin
    .from("chat_rooms")
    .select("*")
    .eq("member_id", memberId)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Create new room if none exists
  if (!room) {
    const { data: newRoom, error } = await supabaseAdmin
      .from("chat_rooms")
      .insert({ member_id: memberId })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "채팅방 생성 실패" }, { status: 500 });
    }
    room = newRoom;
  }

  // Get messages
  const { data: messages } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .eq("room_id", room.id)
    .order("created_at", { ascending: true });

  // Mark admin messages as read
  await supabaseAdmin
    .from("chat_messages")
    .update({ is_read: true })
    .eq("room_id", room.id)
    .eq("sender_type", "admin")
    .eq("is_read", false);

  return NextResponse.json({ room, messages: messages || [] });
}

// POST: Send a message
export async function POST(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  // Get member info
  const { data: member } = await supabaseAdmin
    .from("members")
    .select("id, name")
    .eq("id", memberId)
    .single();

  if (!member) {
    return NextResponse.json({ error: "회원 정보를 찾을 수 없습니다" }, { status: 401 });
  }

  const { roomId, content } = await request.json();
  if (!roomId || !content?.trim()) {
    return NextResponse.json({ error: "메시지를 입력해주세요" }, { status: 400 });
  }

  // Verify room belongs to member
  const { data: room } = await supabaseAdmin
    .from("chat_rooms")
    .select("*")
    .eq("id", roomId)
    .eq("member_id", memberId)
    .single();

  if (!room) {
    return NextResponse.json({ error: "채팅방을 찾을 수 없습니다" }, { status: 404 });
  }

  // Insert message
  const { data: message, error } = await supabaseAdmin
    .from("chat_messages")
    .insert({
      room_id: roomId,
      sender_type: "member",
      sender_name: member.name,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "메시지 전송 실패" }, { status: 500 });
  }

  // Update room last_message
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
