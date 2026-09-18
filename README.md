# Hello Ceylon

A production-ready Next.js Sri Lanka trips and day tours website with a mobile-first, editorial "living postcard" design system.

## Tech Stack

- Next.js 16 (App Router)
- React 18
- MongoDB + Mongoose
- Tailwind CSS v3
- Framer Motion
- react-day-picker
- react-hot-toast
- nodemailer
- Twilio WhatsApp Business API

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local` and fill in your values:

```env
MONGODB_URI=mongodb://localhost:27017/hello_ceylon
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
GUIDE_WHATSAPP=whatsapp:+94771234567
NEXT_PUBLIC_WHATSAPP_NUMBER=94771234567
NEXT_PUBLIC_SITE_NAME=Hello Ceylon
NEXT_PUBLIC_GUIDE_NAME=Chanu
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_SECRET=use-a-separate-random-secret-of-at-least-32-characters
```

### 3. Set Up Twilio WhatsApp Sandbox

1. Create a Twilio account at https://www.twilio.com
2. Navigate to WhatsApp > Try WhatsApp
3. Follow the setup instructions to join the sandbox
4. Copy your credentials to `.env.local`

### 4. Start MongoDB

Ensure MongoDB is running locally:
```bash
mongod
```

### 5. Run the Development Server

```bash
npm run dev
```

### Seed the researched packages

After MongoDB is running, add the 15 researched Ella and Sri Lanka packages to the database:

```bash
npm run seed:packages
```

This creates or updates the packages with local images, descriptions, locations, highlights, inclusions, capacity, and LKR pricing. Yala and Udawalawe remain "price on request" until confirmed.

### 6. Access the Website

- Main site: http://localhost:3000
- Admin panel: http://localhost:3000/admin
- Admin access uses a secure server-side session (HMAC-signed HTTP-only cookie) configured through environment variables.

## Features

- Live tour catalogue with per-person pricing (server-calculated)
- Simple admin package manager for adding, editing, and removing journeys
- Admin photo upload with JPG/PNG/WebP validation and a rotating public gallery
- Availability calendar with real-time booked/blocked dates
- Three-step booking form with validation and booking references
- Double-booking prevention enforced server-side
- Bank transfer payment instructions shared securely after booking confirmation
- WhatsApp + email notifications to guide and guest
- Rate-limited booking and login endpoints
- Secure admin dashboard (server-side sessions, authorized mutations)
- Mobile-first UI with sticky booking dock and WhatsApp conversion paths
- Security headers (CSP, HSTS, frame protection, permissions policy)
- SEO: canonical metadata, Open Graph, JSON-LD, sitemap, robots rules

## Project Structure

```
hello-ceylon/
├── app/
│   ├── layout.jsx          # Root layout: fonts, SEO, JSON-LD
│   ├── page.jsx            # Main landing page composition
│   ├── globals.css         # Design tokens & global styles
│   ├── admin/              # Simple admin dashboard (noindex)
│   └── api/
│       ├── bookings/       # Booking API (rate-limited, validated)
│       ├── tours/          # Tours API (public read, admin write)
│       ├── gallery/        # Gallery API (public read, admin upload/delete)
│       ├── availability/   # Availability API (public read, admin write)
│       ├── whatsapp/       # Notification API (admin only)
│       └── admin/          # Login / session / logout
├── components/             # React components (mobile-first)
├── design-system/          # Persisted Hello Ceylon design system
├── lib/                    # Utilities (auth, api, db, motion, notifications)
├── models/                 # Mongoose models
└── hooks/                  # Custom React hooks
```

## Design System

- **Brand**: Hello Ceylon — "Sri Lanka, one story at a time."
- **Concept**: A living postcard of the island — editorial, botanical, cinematic
- **Colors**: Canopy green (#0E4638), Ceylon gold (#966100 / #D9AA3C), Cinnamon (#A9462F), Shell ivory (#FCFAF5)
- **Fonts**: Space Grotesk (display), DM Sans (body)
- **Motion**: Ken Burns hero, parallax layers, draw-on route lines, staggered reveals — all `prefers-reduced-motion` safe
- **Source of truth**: `design-system/hello-ceylon/MASTER.md`

## Security Notes

- Admin password is never embedded in client code; sessions are HMAC-signed HTTP-only cookies (8h expiry, SameSite=strict)
- All admin API mutations require a valid session; public users can only read active tours/gallery/availability and create validated bookings
- Prices are calculated from the database by tour ID — never trusted from the client
- Booking and login endpoints are rate-limited per IP
- API errors return generic messages; details are logged server-side only
