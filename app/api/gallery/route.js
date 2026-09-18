import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import GalleryImage from '../../../models/GalleryImage';
import { isAdmin } from '../../../lib/auth';
import { cleanText, jsonError, safeServerError } from '../../../lib/api';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function serialize(image) {
  return {
    _id: image._id,
    name: image.name,
    alt: image.alt,
    contentType: image.contentType,
    createdAt: image.createdAt,
    url: `/api/gallery/${image._id}/image`,
  };
}

export async function GET(request) {
  const adminView = new URL(request.url).searchParams.get('admin') === '1';
  if (adminView && !(await isAdmin())) return jsonError('Unauthorized.', 401);

  try {
    await dbConnect();
    const filter = adminView ? {} : { isActive: true };
    const images = await GalleryImage.find(filter).select('-data').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, images: images.map(serialize) });
  } catch (error) { return safeServerError(error, 'gallery:get'); }
}

export async function POST(request) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const alt = cleanText(formData.get('alt'), 160);

    if (!file || typeof file.arrayBuffer !== 'function') return jsonError('Please choose an image.');
    if (!IMAGE_TYPES.has(file.type)) return jsonError('Use a JPG, PNG, or WebP image.');
    if (file.size > MAX_IMAGE_BYTES) return jsonError('Images must be smaller than 5 MB.');
    if (!alt) return jsonError('Please add a short description for the image.');

    await dbConnect();
    const image = await GalleryImage.create({
      name: cleanText(file.name, 120) || 'Gallery image',
      alt,
      contentType: file.type,
      data: Buffer.from(await file.arrayBuffer()),
    });
    return NextResponse.json({ success: true, image: serialize(image) }, { status: 201 });
  } catch (error) { return safeServerError(error, 'gallery:post'); }
}
