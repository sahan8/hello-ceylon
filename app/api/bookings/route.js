import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Booking from '../../../models/Booking';
import Tour from '../../../models/Tour';
import Availability from '../../../models/Availability';
import { sendBookingConfirmationToTourist, sendNewBookingAlertToGuide } from '../../../lib/sendEmail';
import { sendWhatsAppToGuide, sendWhatsAppToTourist } from '../../../lib/whatsapp';
import { isAdmin } from '../../../lib/auth';
import { cleanText, clientIp, isEmail, isObjectId, jsonError, rateLimited, safeServerError } from '../../../lib/api';

function bookingDay(value) {
  const match = typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    await dbConnect();
    const bookings = await Booking.find().populate('tourId', 'name icon').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, bookings });
  } catch (error) { return safeServerError(error, 'bookings:get'); }
}

export async function POST(request) {
  if (rateLimited(`booking:${clientIp(request)}`, 5, 15 * 60 * 1000)) return jsonError('Too many booking attempts. Please try again later.', 429);
  try {
    await dbConnect();
    const body = await request.json();
    const name = cleanText(body.name, 100), email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 40), specialRequests = cleanText(body.specialRequests, 1000);
    const people = Number(body.people), date = bookingDay(body.date);
    if (!name || !isEmail(email) || !phone || !isObjectId(body.tourId) || !date || !Number.isInteger(people) || people < 1 || people > 15) return jsonError('Please review the booking details and try again.');
    const today = new Date(); today.setUTCHours(0, 0, 0, 0);
    if (date < today) return jsonError('Please select a future date.');
    const tour = await Tour.findOne({ _id: body.tourId, isActive: true });
    if (!tour) return jsonError('The selected tour is no longer available.', 404);
    const [override, conflict] = await Promise.all([
      Availability.findOne({ date }),
      Booking.exists({ date, status: { $in: ['pending', 'confirmed'] } }),
    ]);
    if (override?.status === 'blocked' || conflict) return jsonError('That date is no longer available. Please choose another.', 409);
    const booking = await Booking.create({ name, email, phone, tourId: tour._id, tourName: tour.name, date, people, specialRequests, totalPrice: tour.price * people, status: 'pending', paymentStatus: 'unpaid' });
    const populated = await Booking.findById(booking._id).populate('tourId', 'name icon');
    Promise.allSettled([sendBookingConfirmationToTourist(populated), sendNewBookingAlertToGuide(populated), sendWhatsAppToGuide(populated), sendWhatsAppToTourist(populated)]).catch(error => console.error('[booking:notifications]', error));
    return NextResponse.json({ success: true, booking: populated, reference: booking._id.toString().slice(-8).toUpperCase() }, { status: 201 });
  } catch (error) { return safeServerError(error, 'bookings:post'); }
}
