import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Tour from '../../../models/Tour';
import { isAdmin } from '../../../lib/auth';
import { cleanText, jsonError, safeServerError } from '../../../lib/api';

export async function GET() {
  try {
    await dbConnect();
    const tours = await Tour.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ success: true, tours });
  } catch (error) { return safeServerError(error, 'tours:get'); }
}

export async function POST(request) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    await dbConnect();
    const body = await request.json();
    const price = Number(body.price);
    const data = {
      name: cleanText(body.name, 100), description: cleanText(body.description, 1200),
      duration: cleanText(body.duration, 80), icon: cleanText(body.icon, 16) || 'Map',
      category: cleanText(body.category, 20) || 'custom', price,
    };
    if (!data.name || !data.description || !data.duration || !Number.isFinite(price) || price <= 0) return jsonError('Please provide valid tour details.');
    const tour = await Tour.create(data);
    return NextResponse.json({ success: true, tour }, { status: 201 });
  } catch (error) { return safeServerError(error, 'tours:post'); }
}
