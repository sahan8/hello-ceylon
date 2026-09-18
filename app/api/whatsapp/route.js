import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Booking from '../../../models/Booking';
import { sendWhatsAppToGuide, sendWhatsAppToTourist, sendWhatsAppConfirmation } from '../../../lib/whatsapp';
import { isAdmin } from '../../../lib/auth';
import { isObjectId, jsonError, safeServerError } from '../../../lib/api';

export async function POST(request) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    await dbConnect(); const { bookingId, type } = await request.json();
    if (!isObjectId(bookingId) || !['new-booking', 'confirmation'].includes(type)) return jsonError('Invalid notification request.');
    const booking = await Booking.findById(bookingId); if (!booking) return jsonError('Booking not found.', 404);
    const results = type === 'new-booking' ? await Promise.all([sendWhatsAppToGuide(booking), sendWhatsAppToTourist(booking)]) : [await sendWhatsAppConfirmation(booking)];
    return NextResponse.json({ success: true, results });
  } catch (error) { return safeServerError(error, 'whatsapp:post'); }
}
