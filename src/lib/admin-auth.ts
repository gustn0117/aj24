import { createHmac } from "crypto";
import { NextRequest } from "next/server";

const SECRET = process.env.ADMIN_SESSION_SECRET || "default-secret-change-me-32chars!!";

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const hmac = createHmac("sha256", SECRET).update(timestamp).digest("hex");
  return `${timestamp}:${hmac}`;
}

export function verifySessionToken(token: string): boolean {
  const [timestamp, hmac] = token.split(":");
  if (!timestamp || !hmac) return false;

  const expected = createHmac("sha256", SECRET).update(timestamp).digest("hex");
  if (hmac !== expected) return false;

  const age = Date.now() - parseInt(timestamp);
  const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
  return age < MAX_AGE;
}

export function verifyAdmin(request: NextRequest): boolean {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
