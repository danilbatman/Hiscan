import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export type JwtPayload = {
  userId: string;
  email: string;
};

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (e) {
    return null;
  }
}

export function getAuthToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get("token")?.value ?? null;
}

export function getUserFromRequest(): JwtPayload | null {
  const token = getAuthToken() || headers().get("authorization")?.replace("Bearer ", "") || null;
  if (!token) return null;
  return verifyJwt(token);
}