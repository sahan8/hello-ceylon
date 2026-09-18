const twilio = require('twilio');

const createTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }
  
  return twilio(accountSid, authToken);
};

const sendWhatsAppToGuide = async (booking) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('WhatsApp: Twilio not configured, skipping message');
      return { success: false, error: 'Twilio not configured' };
    }

    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
    const guideNumber = process.env.GUIDE_WHATSAPP;

    if (!fromNumber || !guideNumber) {
      return { success: false, error: 'WhatsApp numbers not configured' };
    }

    const message = `🧭 *New Booking — Hello Ceylon!*

👤 Name: ${booking.name}
📧 Email: ${booking.email}
📞 Phone: ${booking.phone}
🗺️ Tour: ${booking.tourName}
📅 Date: ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
👥 People: ${booking.people}
📝 Notes: ${booking.specialRequests || 'None'}
💰 Total: $${booking.totalPrice}

Please confirm via your admin panel at
${process.env.NEXT_PUBLIC_SITE_URL}/admin

Reply YES to confirm or NO to reject.`;

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: guideNumber,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: error.message };
  }
};

const sendWhatsAppToTourist = async (booking) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('WhatsApp: Twilio not configured, skipping message');
      return { success: false, error: 'Twilio not configured' };
    }

    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (!fromNumber) {
      return { success: false, error: 'WhatsApp numbers not configured' };
    }

    const touristNumber = booking.phone.startsWith('+') ? booking.phone : `+${booking.phone}`;

    const message = `🌺 *Booking Received — Hello Ceylon*

Hi ${booking.name}! Your booking request has been received.

🗺️ Tour: ${booking.tourName}
📅 Date: ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
👥 People: ${booking.people}
💰 Estimated Total: $${booking.totalPrice}
🧭 Your Guide: Chanu

Chanu will personally confirm your booking 
within 24 hours.

Questions? Reply here or call:
📞 +94 76 250 5161

Sri Lanka, one story at a time. 🌺
— Hello Ceylon`;

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: touristNumber,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: error.message };
  }
};

const sendWhatsAppConfirmation = async (booking) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('WhatsApp: Twilio not configured, skipping message');
      return { success: false, error: 'Twilio not configured' };
    }

    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (!fromNumber) {
      return { success: false, error: 'WhatsApp numbers not configured' };
    }

    const touristNumber = booking.phone.startsWith('+') ? booking.phone : `+${booking.phone}`;

    const message = `✅ *Booking Confirmed — Hello Ceylon*

Great news, ${booking.name}! Your tour is confirmed.

🗺️ ${booking.tourName}
📅 ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
👥 ${booking.people} people
🧭 Guide: Chanu
💰 Total: $${booking.totalPrice}

📍 Chanu will pick you up at your location.
He will contact you the day before your tour.

See you in Ceylon! 🌺`;

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: touristNumber,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWhatsAppToGuide,
  sendWhatsAppToTourist,
  sendWhatsAppConfirmation,
};