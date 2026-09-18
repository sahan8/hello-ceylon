'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogoMark } from '../../components/Navbar';

const statusStyles = {
  pending: 'bg-gold/10 text-gold',
  confirmed: 'bg-canopy/10 text-canopy',
  rejected: 'bg-cinnamon/10 text-cinnamon',
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [authChecking, setAuthChecking] = useState(true);
  const [authConfigured, setAuthConfigured] = useState(true);

  useEffect(() => {
    fetch('/api/admin/session')
      .then(response => response.json())
      .then(data => { setIsAuthenticated(Boolean(data.authenticated)); setAuthConfigured(Boolean(data.configured)); })
      .catch(() => toast.error('Unable to verify the admin session.'))
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, availabilityRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/availability'),
      ]);
      const bookingsData = await bookingsRes.json();
      const availabilityData = await availabilityRes.json();
      if (bookingsData.success) setBookings(bookingsData.bookings);
      if (availabilityData.success) setAvailability(availabilityData.availability);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
      setPassword('');
      setIsAuthenticated(true);
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setBookings([]);
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (result.success) { toast.success(`Booking ${status}`); fetchData(); }
    } catch { toast.error('Failed to update status'); }
  };

  const updateAvailability = async (date, status) => {
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, status }),
      });
      const result = await response.json();
      if (result.success) { toast.success('Availability updated'); fetchData(); }
    } catch { toast.error('Failed to update availability'); }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  };

  if (authChecking) {
    return (
      <main className="grid min-h-screen place-items-center bg-shell" aria-live="polite">
        <p className="text-moss">Checking secure session…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shell p-4 contour-pattern">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[1.75rem] border border-line bg-white p-8 paper-edge"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <LogoMark size={56} />
            </div>
            <h1 className="font-display text-2xl text-ink">Hello Ceylon</h1>
            <p className="text-sm text-moss">Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <input
                aria-label="Admin password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-line px-4 py-3 transition-all focus:border-canopy focus:outline-none focus:ring-2 focus:ring-canopy/15"
              />
              <button
                type="submit"
                disabled={loading || !authConfigured}
                className="w-full cursor-pointer rounded-xl bg-canopy py-3 font-bold text-white transition-colors hover:bg-canopy-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Access dashboard'}
              </button>
            </div>
          </form>

          {!authConfigured && (
            <p className="mt-6 text-center text-sm text-cinnamon">Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the server environment.</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shell">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-canopy-950 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <LogoMark size={34} />
          <span className="font-display text-lg">Hello Ceylon <span className="text-sm text-white/50">Admin</span></span>
        </div>
        <button onClick={handleLogout} className="cursor-pointer text-sm text-white/60 transition-colors hover:text-white">
          Logout
        </button>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'text-ink' },
            { label: 'Pending', value: stats.pending, color: 'text-gold' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-canopy' },
            { label: 'Revenue', value: `$${stats.revenue}`, color: 'text-cinnamon' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">{item.label}</p>
              <p className={`mt-1 font-display text-3xl ${item.color}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="flex border-b border-line" role="tablist">
            {['bookings', 'availability'].map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-6 py-4 text-sm font-bold capitalize transition-all ${
                  activeTab === tab ? 'border-b-2 border-canopy bg-canopy-50 text-canopy' : 'text-moss hover:text-ink'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-12 text-center" role="status">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-canopy/15 border-t-canopy" />
            </div>
          ) : activeTab === 'bookings' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-parchment/60">
                  <tr>
                    {['Name', 'Journey', 'Date', 'People', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-moss">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-moss">No bookings yet</td></tr>
                  ) : (
                    bookings.map((booking, i) => (
                      <tr key={booking._id} className={`border-t border-line transition-colors hover:bg-canopy-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-shell'}`}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-ink">{booking.name}</p>
                          <p className="text-xs text-moss">{booking.email}</p>
                        </td>
                        <td className="px-6 py-4 text-ink">{booking.tourName}</td>
                        <td className="px-6 py-4 text-sm text-ink">
                          {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-ink">{booking.people}</td>
                        <td className="px-6 py-4">
                          <span className={`status-pill ${statusStyles[booking.status]}`}>{booking.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                className="cursor-pointer rounded-lg bg-canopy/10 px-3 py-1.5 text-xs font-bold text-canopy transition-colors hover:bg-canopy/20">
                                ✓ Confirm
                              </button>
                              <button onClick={() => updateBookingStatus(booking._id, 'rejected')}
                                className="cursor-pointer rounded-lg bg-cinnamon/10 px-3 py-1.5 text-xs font-bold text-cinnamon transition-colors hover:bg-cinnamon/20">
                                ✗ Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {availability.slice(0, 35).map((day) => (
                  <button
                    key={day.date}
                    onClick={() => updateAvailability(day.date, day.status === 'available' ? 'blocked' : 'available')}
                    aria-label={`${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${day.status}. Activate to toggle.`}
                    className={`cursor-pointer rounded-lg p-2 text-center text-xs transition-all hover:scale-105 ${
                      day.status === 'available' ? 'border border-canopy/20 bg-canopy/10 text-canopy'
                        : day.status === 'booked' ? 'border border-cinnamon/20 bg-cinnamon/10 text-cinnamon'
                        : 'border border-moss/20 bg-moss/10 text-moss'
                    }`}
                  >
                    <div className="font-bold">{new Date(day.date).getDate()}</div>
                    <div className="mt-0.5 text-[10px] opacity-70">{day.status}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
