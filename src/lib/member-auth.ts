import { NextRequest } from "next/server";

const SECRET = process.env.MEMBER_SESSION_SECRET || "default-member-secret-32chars!!";

function hexEncode(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = hexEncode(salt.buffer);

  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `${saltHex}:${hexEncode(derived)}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return hexEncode(derived) === hashHex;
}

export async function createMemberToken(memberId: number): Promise<string> {
  const encoder = new TextEncoder();
  const payload = `${memberId}:${Date.now()}`;
  const key = await crypto.subtle.importKey("raw", encoder.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}:${hexEncode(sig)}`;
}

export async function verifyMemberToken(token: string): Promise<number | null> {
  const parts = token.split(":");
  if (parts.length !== 3) return null;

  const [memberIdStr, timestamp, hmac] = parts;
  const payload = `${memberIdStr}:${timestamp}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expected = hexEncode(sig);

  if (hmac !== expected) return null;
  const age = Date.now() - parseInt(timestamp);
  if (age > 7 * 24 * 60 * 60 * 1000) return null; // 7 days
  return parseInt(memberIdStr);
}

export async function getMemberIdFromRequest(request: NextRequest): Promise<number | null> {
  const token = request.cookies.get("member_session")?.value;
  if (!token) return null;
  return verifyMemberToken(token);
}
