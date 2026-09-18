import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Booking from '../../../../models/Booking';
import Availability from '../../../../models/Availability';
import { sendWhatsAppConfirmation } from '../../../../lib/whatsapp';
import { isAdmin } from '../../../../lib/auth';
import { isObjectId, jsonError, safeServerError } from '../../../../lib/api';

export async function GET(_request, { params }) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try { await dbConnect(); const { id } = await params; if (!isObjectId(id)) return jsonError('Invalid booking.', 400); const booking = await Booking.findById(id); return booking ? NextResponse.json({ success: true, booking }) : jsonError('Booking not found.', 404); }
  catch (error) { return safeServerError(error, 'booking:get'); }
}

export async function PUT(request, { params }) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    await dbConnect(); const { id } = await params; if (!isObjectId(id)) return jsonError('Invalid booking.', 400);
    const body = await request.json(); const update = {};
    if (body.status && ['pending', 'confirmed', 'rejected'].includes(body.status)) update.status = body.status;
    if (body.paymentStatus && ['unpaid', 'paid'].includes(body.paymentStatus)) update.paymentStatus = body.paymentStatus;
    if (!Object.keys(update).length) return jsonError('No valid update supplied.');
    const booking = await Booking.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!booking) return jsonError('Booking not found.', 404);
    if (update.status === 'confirmed') { await Availability.findOneAndUpdate({ date: booking.date }, { date: booking.date, status: 'booked' }, { upsert: true }); sendWhatsAppConfirmation(booking).catch(error => console.error('[booking:confirmation]', error)); }
    return NextResponse.json({ success: true, booking });
  } catch (error) { return safeServerError(error, 'booking:put'); }
}

export async function DELETE(_request, { params }) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try { await dbConnect(); const { id } = await params; if (!isObjectId(id)) return jsonError('Invalid booking.', 400); await Booking.findByIdAndDelete(id); return NextResponse.json({ success: true }); }
  catch (error) { return safeServerError(error, 'booking:delete'); }
}
