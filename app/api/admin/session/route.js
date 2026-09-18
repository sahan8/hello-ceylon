import { NextResponse } from 'next/server';
import { isAdmin, isAuthConfigured } from '../../../../lib/auth';

export async function GET() {
  return NextResponse.json({ success: true, authenticated: await isAdmin(), configured: isAuthConfigured() });
}
