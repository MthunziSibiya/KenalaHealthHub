import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "kenala_health_hub_default_secret_key_2026";
export const ADMIN_COOKIE_NAME = "khh_admin_session";

export interface AdminJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getAuthenticatedAdmin(): Promise<AdminJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
