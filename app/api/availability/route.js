import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Availability from '../../../models/Availability';
import Booking from '../../../models/Booking';
import { isAdmin } from '../../../lib/auth';
import { jsonError, safeServerError } from '../../../lib/api';

function utcDay(value) {
  const match = typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(today); end.setUTCDate(end.getUTCDate() + 60);
    const [overrides, bookings] = await Promise.all([
      Availability.find({ date: { $gte: today, $lte: end } }).lean(),
      Booking.find({ date: { $gte: today, $lte: end }, status: { $in: ['confirmed', 'pending'] } }).select('date status').lean(),
    ]);
    const overrideMap = new Map(overrides.map(item => [item.date.toISOString().slice(0, 10), item.status]));
    const bookingMap = new Map(bookings.map(item => [item.date.toISOString().slice(0, 10), item.status === 'confirmed' ? 'booked' : 'pending']));
    const availability = [];
    for (let cursor = new Date(today); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      const date = cursor.toISOString().slice(0, 10);
      availability.push({ date, status: bookingMap.get(date) || overrideMap.get(date) || 'available' });
    }
    return NextResponse.json({ success: true, availability });
  } catch (error) { return safeServerError(error, 'availability:get'); }
}

export async function POST(request) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    await dbConnect();
    const body = await request.json();
    const date = utcDay(body.date);
    if (!date || !['available', 'blocked'].includes(body.status)) return jsonError('Provide a valid date and status.');
    const availability = await Availability.findOneAndUpdate({ date }, { date, status: body.status }, { upsert: true, new: true, runValidators: true });
    return NextResponse.json({ success: true, availability });
  } catch (error) { return safeServerError(error, 'availability:post'); }
}
