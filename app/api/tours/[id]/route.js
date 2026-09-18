import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Tour from '../../../../models/Tour';
import { isAdmin } from '../../../../lib/auth';
import { cleanText, isObjectId, jsonError, safeServerError } from '../../../../lib/api';

function cleanList(value, maxItems = 10) {
  return Array.isArray(value) ? value.map(item => cleanText(item, 180)).filter(Boolean).slice(0, maxItems) : [];
}

function tourData(body) {
  const price = Number(body.price);
  const data = {
    name: cleanText(body.name, 100),
    description: cleanText(body.description, 1200),
    duration: cleanText(body.duration, 80),
    icon: cleanText(body.icon, 16) || 'Map',
    category: cleanText(body.category, 20) || 'custom',
    price,
    isActive: body.isActive !== false,
  };
  if (body.currency) data.currency = ['LKR', 'USD'].includes(body.currency) ? body.currency : 'USD';
  if (typeof body.priceOnRequest === 'boolean') data.priceOnRequest = body.priceOnRequest;
  if (body.capacity !== undefined) data.capacity = Math.min(50, Math.max(1, Number(body.capacity) || 3));
  if (body.image !== undefined) data.image = cleanText(body.image, 240);
  if (body.locations !== undefined) data.locations = cleanList(body.locations);
  if (body.highlights !== undefined) data.highlights = cleanList(body.highlights);
  if (body.inclusions !== undefined) data.inclusions = cleanList(body.inclusions);
  return data;
}

export async function PUT(request, { params }) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    const { id } = await params;
    if (!isObjectId(id)) return jsonError('Invalid package.', 400);
    const data = tourData(await request.json());
    if (!data.name || !data.description || !data.duration || !Number.isFinite(data.price) || data.price < 0) return jsonError('Please provide valid package details.');
    await dbConnect();
    const tour = await Tour.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    if (!tour) return jsonError('Package not found.', 404);
    return NextResponse.json({ success: true, tour });
  } catch (error) { return safeServerError(error, 'tour:put'); }
}

export async function DELETE(_request, { params }) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    const { id } = await params;
    if (!isObjectId(id)) return jsonError('Invalid package.', 400);
    await dbConnect();
    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) return jsonError('Package not found.', 404);
    return NextResponse.json({ success: true });
  } catch (error) { return safeServerError(error, 'tour:delete'); }
}
