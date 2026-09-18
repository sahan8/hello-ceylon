import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Tour from '../../../models/Tour';
import { isAdmin } from '../../../lib/auth';
import { cleanText, jsonError, safeServerError } from '../../../lib/api';

function cleanList(value, maxItems = 10) {
  return Array.isArray(value) ? value.map(item => cleanText(item, 180)).filter(Boolean).slice(0, maxItems) : [];
}

export async function GET(request) {
  const adminView = new URL(request.url).searchParams.get('admin') === '1';
  if (adminView && !(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    await dbConnect();
    const tours = await Tour.find(adminView ? {} : { isActive: true }).sort({ createdAt: 1 }).lean();
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
      currency: ['LKR', 'USD'].includes(body.currency) ? body.currency : 'USD',
      priceOnRequest: Boolean(body.priceOnRequest),
      capacity: Math.min(50, Math.max(1, Number(body.capacity) || 3)),
      image: cleanText(body.image, 240),
      locations: cleanList(body.locations),
      highlights: cleanList(body.highlights),
      inclusions: cleanList(body.inclusions),
    };
    if (!data.name || !data.description || !data.duration || !Number.isFinite(price) || price < 0) return jsonError('Please provide valid tour details.');
    const tour = await Tour.create(data);
    return NextResponse.json({ success: true, tour }, { status: 201 });
  } catch (error) { return safeServerError(error, 'tours:post'); }
}
