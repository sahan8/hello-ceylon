import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'hello_ceylon_admin';
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function isAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

export async function createAdminSession() {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ role: 'admin', expires })).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  (await cookies()).set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
}

export async function isAdmin() {
  if (!isAuthConfigured()) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return session.role === 'admin' && session.expires > Date.now();
  } catch { return false; }
}

export function passwordMatches(candidate) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || typeof candidate !== 'string') return false;
  const left = crypto.createHash('sha256').update(candidate).digest();
  const right = crypto.createHash('sha256').update(configured).digest();
  return crypto.timingSafeEqual(left, right);
}
