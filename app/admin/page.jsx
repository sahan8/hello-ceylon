'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogoMark } from '../../components/Navbar';

const emptyPackage = { name: '', description: '', duration: '', price: '', category: 'nature', isActive: true };
const statusStyles = { pending: 'bg-gold/10 text-gold', confirmed: 'bg-canopy/10 text-canopy', rejected: 'bg-cinnamon/10 text-cinnamon' };
const tabs = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'packages', label: 'Packages' },
  { id: 'gallery', label: 'Photo gallery' },
  { id: 'calendar', label: 'Calendar' },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  const [authConfigured, setAuthConfigured] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [packages, setPackages] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [packageForm, setPackageForm] = useState(emptyPackage);
  const [editingPackage, setEditingPackage] = useState(null);
  const [galleryAlt, setGalleryAlt] = useState('');
  const [galleryFile, setGalleryFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session')
      .then(response => response.json())
      .then(data => { setIsAuthenticated(Boolean(data.authenticated)); setAuthConfigured(Boolean(data.configured)); })
      .catch(() => toast.error('Unable to verify the admin session.'))
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  async function fetchData() {
    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/availability'),
        fetch('/api/tours?admin=1'),
        fetch('/api/gallery?admin=1'),
      ]);
      const [bookingsData, availabilityData, packagesData, galleryData] = await Promise.all(responses.map(response => response.json()));
      if (bookingsData.success) setBookings(bookingsData.bookings);
      if (availabilityData.success) setAvailability(availabilityData.availability);
      if (packagesData.success) setPackages(packagesData.tours);
      if (galleryData.success) setGallery(galleryData.images);
    } catch { toast.error('Some dashboard data could not be loaded.'); }
    finally { setLoading(false); }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
      setPassword(''); setIsAuthenticated(true);
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  }

  async function updateBookingStatus(id, status) {
    const response = await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const result = await response.json();
    if (result.success) { toast.success(`Booking ${status}`); fetchData(); }
    else toast.error(result.error || 'Could not update booking.');
  }

  async function updateAvailability(date, status) {
    const response = await fetch('/api/availability', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, status }) });
    const result = await response.json();
    if (result.success) { toast.success('Calendar updated'); fetchData(); }
    else toast.error(result.error || 'Could not update calendar.');
  }

  function editPackage(item) {
    setEditingPackage(item._id);
    setPackageForm({ name: item.name, description: item.description, duration: item.duration, price: item.price, category: item.category, isActive: item.isActive });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function savePackage(event) {
    event.preventDefault();
    const endpoint = editingPackage ? `/api/tours/${editingPackage}` : '/api/tours';
    const response = await fetch(endpoint, { method: editingPackage ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(packageForm) });
    const result = await response.json();
    if (!response.ok || !result.success) { toast.error(result.error || 'Could not save package.'); return; }
    toast.success(editingPackage ? 'Package updated' : 'Package added');
    setPackageForm(emptyPackage); setEditingPackage(null); fetchData();
  }

  async function deletePackage(id) {
    if (!window.confirm('Delete this package? It will disappear from the website.')) return;
    const response = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) { toast.success('Package deleted'); fetchData(); }
    else toast.error(result.error || 'Could not delete package.');
  }

  async function uploadImage(event) {
    event.preventDefault();
    if (!galleryFile || !galleryAlt.trim()) { toast.error('Choose a photo and add a short description.'); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', galleryFile);
    formData.append('alt', galleryAlt);
    const response = await fetch('/api/gallery', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok || !result.success) toast.error(result.error || 'Could not upload photo.');
    else { toast.success('Photo added to gallery'); setGalleryFile(null); setGalleryAlt(''); event.target.reset(); fetchData(); }
    setUploading(false);
  }

  async function deleteImage(id) {
    if (!window.confirm('Remove this photo from the website?')) return;
    const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) { toast.success('Photo removed'); fetchData(); }
    else toast.error(result.error || 'Could not remove photo.');
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(item => item.status === 'pending').length,
    confirmed: bookings.filter(item => item.status === 'confirmed').length,
    photos: gallery.length,
  };

  if (authChecking) return <main className="grid min-h-screen place-items-center bg-shell"><p className="text-moss">Checking secure session…</p></main>;

  if (!isAuthenticated) return (
    <div className="flex min-h-screen items-center justify-center bg-shell p-4 contour-pattern">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[1.75rem] border border-line bg-white p-8 paper-edge">
        <div className="mb-8 text-center"><div className="mx-auto mb-4 flex justify-center"><LogoMark size={56} /></div><h1 className="font-display text-2xl text-ink">Hello Ceylon</h1><p className="text-sm text-moss">Simple admin dashboard</p></div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input aria-label="Admin password" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter admin password" className="w-full rounded-xl border border-line px-4 py-3 focus:border-canopy focus:outline-none focus:ring-2 focus:ring-canopy/15" />
          <button type="submit" disabled={loading || !authConfigured} className="w-full cursor-pointer rounded-xl bg-canopy py-3 font-bold text-white hover:bg-canopy-950 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Signing in…' : 'Open dashboard'}</button>
        </form>
        {!authConfigured && <p className="mt-6 text-center text-sm text-cinnamon">Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET first.</p>}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-shell">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-canopy-950 px-4 py-4 text-white sm:px-6">
        <div className="flex items-center gap-3"><LogoMark size={34} /><span className="font-display text-lg">Hello Ceylon <span className="text-sm text-white/50">Admin</span></span></div>
        <button onClick={handleLogout} className="cursor-pointer text-sm text-white/60 hover:text-white">Logout</button>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Bookings" value={stats.total} />
          <Stat label="Need reply" value={stats.pending} color="text-gold" />
          <Stat label="Confirmed" value={stats.confirmed} color="text-canopy" />
          <Stat label="Gallery photos" value={stats.photos} color="text-cinnamon" />
        </div>

        <nav className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-line bg-white p-2 sm:flex" aria-label="Admin sections">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`min-h-11 cursor-pointer rounded-xl px-4 text-sm font-bold transition-colors sm:flex-1 ${activeTab === tab.id ? 'bg-canopy text-white' : 'text-moss hover:bg-parchment hover:text-ink'}`}>{tab.label}</button>)}
        </nav>

        {loading ? <div className="rounded-2xl border border-line bg-white p-16 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-canopy/15 border-t-canopy" /></div> : (
          <>
            {activeTab === 'bookings' && <Bookings bookings={bookings} updateBookingStatus={updateBookingStatus} />}
            {activeTab === 'calendar' && <Calendar availability={availability} updateAvailability={updateAvailability} />}
            {activeTab === 'packages' && <Packages packages={packages} form={packageForm} setForm={setPackageForm} editing={editingPackage} setEditing={setEditingPackage} save={savePackage} remove={deletePackage} />}
            {activeTab === 'gallery' && <GalleryAdmin images={gallery} alt={galleryAlt} setAlt={setGalleryAlt} file={galleryFile} setFile={setGalleryFile} upload={uploadImage} uploading={uploading} remove={deleteImage} />}
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, color = 'text-ink' }) { return <div className="rounded-2xl border border-line bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-moss">{label}</p><p className={`mt-1 font-display text-3xl ${color}`}>{value}</p></div>; }

function Bookings({ bookings, updateBookingStatus }) {
  return <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"><div className="border-b border-line p-5"><h1 className="font-display text-2xl text-ink">Bookings</h1><p className="mt-1 text-sm text-moss">Reply to guests and confirm their journeys.</p></div><div className="overflow-x-auto"><table className="w-full"><thead className="bg-parchment/60"><tr>{['Guest', 'Package', 'Date', 'People', 'Status', 'Action'].map(item => <th key={item} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-moss">{item}</th>)}</tr></thead><tbody>{bookings.length === 0 ? <tr><td colSpan={6} className="p-10 text-center text-moss">No bookings yet.</td></tr> : bookings.map((booking, index) => <tr key={booking._id} className={`border-t border-line ${index % 2 ? 'bg-shell' : 'bg-white'}`}><td className="px-5 py-4"><p className="font-semibold text-ink">{booking.name}</p><p className="text-xs text-moss">{booking.email}</p></td><td className="px-5 py-4 text-sm text-ink">{booking.tourName}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-ink">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td><td className="px-5 py-4 text-ink">{booking.people}</td><td className="px-5 py-4"><span className={`status-pill ${statusStyles[booking.status]}`}>{booking.status}</span></td><td className="px-5 py-4">{booking.status === 'pending' && <div className="flex gap-2"><button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="cursor-pointer rounded-lg bg-canopy/10 px-3 py-2 text-xs font-bold text-canopy hover:bg-canopy/20">Confirm</button><button onClick={() => updateBookingStatus(booking._id, 'rejected')} className="cursor-pointer rounded-lg bg-cinnamon/10 px-3 py-2 text-xs font-bold text-cinnamon hover:bg-cinnamon/20">Reject</button></div>}</td></tr>)}</tbody></table></div></div>;
}

function Calendar({ availability, updateAvailability }) {
  return <div className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h1 className="font-display text-2xl text-ink">Availability calendar</h1><p className="mt-1 text-sm text-moss">Tap a date to block or open it.</p><div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-7">{availability.slice(0, 35).map(day => <button key={day.date} onClick={() => updateAvailability(day.date, day.status === 'available' ? 'blocked' : 'available')} className={`cursor-pointer rounded-xl border p-3 text-center transition-transform hover:scale-105 ${day.status === 'available' ? 'border-canopy/20 bg-canopy/10 text-canopy' : day.status === 'booked' ? 'border-cinnamon/20 bg-cinnamon/10 text-cinnamon' : 'border-moss/20 bg-moss/10 text-moss'}`}><strong className="block text-lg">{new Date(day.date).getDate()}</strong><span className="text-[10px] uppercase">{day.status}</span></button>)}</div></div>;
}

function Packages({ packages, form, setForm, editing, setEditing, save, remove }) {
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  return <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><form onSubmit={save} className="h-fit rounded-2xl border border-line bg-white p-5 shadow-sm"><h1 className="font-display text-2xl text-ink">{editing ? 'Edit package' : 'Add a package'}</h1><p className="mt-1 text-sm text-moss">Only fill in the simple details your guests need.</p><div className="mt-5 space-y-4"><Field label="Package name" value={form.name} onChange={value => update('name', value)} required /><Field label="Short description" value={form.description} onChange={value => update('description', value)} textarea required /><div className="grid gap-4 sm:grid-cols-2"><Field label="Duration" placeholder="1 day" value={form.duration} onChange={value => update('duration', value)} required /><Field label="Price per person (USD)" type="number" min="1" value={form.price} onChange={value => update('price', value)} required /></div><label className="block text-sm font-semibold text-ink">Type<select value={form.category} onChange={event => update('category', event.target.value)} className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-3 font-normal"><option value="nature">Nature</option><option value="city">City</option><option value="culture">Culture</option><option value="transfer">Transfer</option><option value="custom">Custom</option></select></label><div className="flex gap-2"><button className="min-h-12 flex-1 cursor-pointer rounded-xl bg-canopy px-4 font-bold text-white hover:bg-canopy-950">{editing ? 'Save changes' : 'Add package'}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyPackage); }} className="cursor-pointer rounded-xl border border-line px-4 font-bold text-moss">Cancel</button>}</div></div></form><div className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-display text-2xl text-ink">Your packages</h2><div className="mt-5 space-y-3">{packages.length === 0 ? <p className="rounded-xl bg-parchment p-5 text-sm text-moss">No packages yet. Add your first one on the left.</p> : packages.map(item => <div key={item._id} className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h3 className="font-bold text-ink">{item.name}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.isActive ? 'bg-canopy/10 text-canopy' : 'bg-moss/10 text-moss'}`}>{item.isActive ? 'Live' : 'Hidden'}</span></div><p className="mt-1 text-sm text-moss">{item.duration} · ${item.price} per person</p></div><div className="flex gap-2"><button onClick={() => { setEditing(item._id); setForm({ name: item.name, description: item.description, duration: item.duration, price: item.price, category: item.category, isActive: item.isActive }); }} className="cursor-pointer rounded-lg bg-canopy/10 px-3 py-2 text-xs font-bold text-canopy">Edit</button><button onClick={() => remove(item._id)} className="cursor-pointer rounded-lg bg-cinnamon/10 px-3 py-2 text-xs font-bold text-cinnamon">Delete</button></div></div>)}</div></div></div>;
}

function GalleryAdmin({ images, alt, setAlt, setFile, upload, uploading, remove }) {
  return <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]"><form onSubmit={upload} className="h-fit rounded-2xl border border-line bg-white p-5 shadow-sm"><h1 className="font-display text-2xl text-ink">Add a photo</h1><p className="mt-1 text-sm leading-6 text-moss">Choose a JPG, PNG, or WebP image. Maximum 5 MB.</p><label className="mt-5 block text-sm font-semibold text-ink">Photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setFile(event.target.files?.[0] || null)} className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-canopy/30 bg-canopy-50 p-3 text-sm text-moss" /></label><Field label="What is in this photo?" placeholder="Tea fields near Ella" value={alt} onChange={setAlt} /><button disabled={uploading} className="mt-4 min-h-12 w-full cursor-pointer rounded-xl bg-canopy font-bold text-white hover:bg-canopy-950 disabled:opacity-50">{uploading ? 'Uploading…' : 'Add to gallery'}</button></form><div className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-display text-2xl text-ink">Your gallery</h2>{images.length === 0 ? <p className="mt-5 rounded-xl bg-parchment p-5 text-sm text-moss">No photos yet. Add your first photo on the left.</p> : <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map(image => <figure key={image._id} className="group relative overflow-hidden rounded-xl bg-parchment"><Image src={image.url} alt={image.alt} width={600} height={600} unoptimized className="aspect-square w-full object-cover" /><button type="button" onClick={() => remove(image._id)} className="absolute right-2 top-2 cursor-pointer rounded-lg bg-ink/80 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100">Remove</button><figcaption className="p-2 text-xs text-moss">{image.alt}</figcaption></figure>)}</div>}</div></div>;
}

function Field({ label, value, onChange, placeholder, type = 'text', textarea = false, ...props }) {
  const className = 'mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-3 text-ink focus:border-canopy focus:outline-none focus:ring-2 focus:ring-canopy/15';
  return <label className="block text-sm font-semibold text-ink">{label}{textarea ? <textarea rows={4} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className={`${className} resize-none`} {...props} /> : <input type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className={className} {...props} />}</label>;
}
