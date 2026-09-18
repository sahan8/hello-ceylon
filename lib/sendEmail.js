const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendBookingConfirmationToTourist = async (booking) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Hello Ceylon" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: '🌺 Booking Received — Hello Ceylon',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #FFFFFF; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #0C3B2E; padding: 40px; text-align: center; }
            .header h1 { color: #FFFFFF; font-family: Georgia, serif; margin: 0; font-size: 32px; }
            .content { padding: 40px; background: #F3EEE1; }
            .booking-card { background: #FFFFFF; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .booking-row { margin: 15px 0; padding-bottom: 15px; border-bottom: 1px solid #F3EEE1; }
            .booking-label { color: #55645B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .booking-value { color: #14211B; font-size: 16px; margin-top: 5px; }
            .footer { padding: 30px; text-align: center; color: #55645B; font-size: 14px; }
            .tagline { color: #0C3B2E; font-style: italic; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Hello Ceylon</h1>
            </div>
            <div class="content">
              <h2 style="color: #14211B; font-family: Georgia, serif; margin-top: 0;">
                🌺 Booking Received
              </h2>
              <p style="color: #14211B; font-size: 16px;">
                Hi ${booking.name}! Your booking request has been received.
              </p>
              <div class="booking-card">
                <div class="booking-row">
                  <div class="booking-label">Tour</div>
                  <div class="booking-value">${booking.tourName}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Date</div>
                  <div class="booking-value">${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Guests</div>
                  <div class="booking-value">${booking.people} ${booking.people === 1 ? 'person' : 'people'}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Estimated Total</div>
                  <div class="booking-value" style="color: #0C3B2E; font-size: 20px; font-weight: 600;">$${booking.totalPrice}</div>
                </div>
              </div>
              <p style="color: #55645B; font-size: 14px;">
                <strong>Chanu will personally confirm your booking within 24 hours.</strong>
              </p>
              <p style="color: #55645B; font-size: 14px;">
                Questions? Reply to this email or call: +94 76 250 5161
              </p>
            </div>
            <div class="footer">
              <p class="tagline">Sri Lanka, one story at a time.</p>
              <p>© Hello Ceylon</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendNewBookingAlertToGuide = async (booking) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Hello Ceylon" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🧭 New Booking — Hello Ceylon',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #0C3B2E; padding: 40px; text-align: center; }
            .header h1 { color: #FFFFFF; font-family: Georgia, serif; margin: 0; }
            .content { padding: 40px; background: #F3EEE1; }
            .booking-card { background: #FFFFFF; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .booking-row { margin: 15px 0; padding-bottom: 15px; border-bottom: 1px solid #F3EEE1; }
            .booking-label { color: #55645B; font-size: 12px; text-transform: uppercase; }
            .booking-value { color: #14211B; font-size: 16px; margin-top: 5px; }
            .admin-link { display: inline-block; background: #146149; color: #FFFFFF; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧭 NEW BOOKING</h1>
            </div>
            <div class="content">
              <h2 style="color: #0C3B2E;">New booking received!</h2>
              <div class="booking-card">
                <div class="booking-row">
                  <div class="booking-label">Guest Name</div>
                  <div class="booking-value">${booking.name}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Email</div>
                  <div class="booking-value">${booking.email}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Phone</div>
                  <div class="booking-value">${booking.phone}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Tour</div>
                  <div class="booking-value">${booking.tourName}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Date</div>
                  <div class="booking-value">${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="booking-row">
                  <div class="booking-label">Guests</div>
                  <div class="booking-value">${booking.people}</div>
                </div>
                ${booking.specialRequests ? `
                <div class="booking-row">
                  <div class="booking-label">Special Requests</div>
                  <div class="booking-value">${booking.specialRequests}</div>
                </div>
                ` : ''}
                <div class="booking-row">
                  <div class="booking-label">Estimated Total</div>
                  <div class="booking-value" style="color: #0C3B2E; font-size: 20px; font-weight: 600;">$${booking.totalPrice}</div>
                </div>
              </div>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" class="admin-link">
                View in Admin Panel →
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationToTourist,
  sendNewBookingAlertToGuide,
};