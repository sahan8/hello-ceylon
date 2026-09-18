import { NextResponse } from 'next/server';
import { clientIp, jsonError, rateLimited } from '../../../../lib/api';
import { createAdminSession, isAuthConfigured, passwordMatches } from '../../../../lib/auth';

export async function POST(request) {
  if (!isAuthConfigured()) return jsonError('Admin access is not configured.', 503);
  if (rateLimited(`login:${clientIp(request)}`, 8, 15 * 60 * 1000)) return jsonError('Too many attempts. Try again later.', 429);
  const { password } = await request.json().catch(() => ({}));
  if (!passwordMatches(password)) return jsonError('Invalid password.', 401);
  await createAdminSession();
  return NextResponse.json({ success: true });
}
